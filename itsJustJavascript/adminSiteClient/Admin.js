"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const lodash = __importStar(require("lodash"));
const mobx_1 = require("mobx");
const url_join_1 = __importDefault(require("url-join"));
const AdminApp_1 = require("./AdminApp");
const UrlUtils_1 = require("../clientUtils/urls/UrlUtils");
// Entry point for the grapher admin
// Currently just the editor, but eventually should expand to cover everything
class Admin {
    constructor(props) {
        this.currentRequests = [];
        this.loadingIndicatorSetting = "default";
        this.basePath = "/admin";
        this.username = props.username;
        this.isSuperuser = props.isSuperuser;
        this.settings = props.settings;
    }
    get showLoadingIndicator() {
        return this.loadingIndicatorSetting === "default"
            ? this.currentRequests.length > 0
            : this.loadingIndicatorSetting === "loading";
    }
    start(containerNode, gitCmsBranchName) {
        ReactDOM.render(React.createElement(AdminApp_1.AdminApp, { admin: this, gitCmsBranchName: gitCmsBranchName }), containerNode);
    }
    url(path) {
        return url_join_1.default(this.basePath, path);
    }
    goto(path) {
        this.url(path);
    }
    // Make a request with no error or response handling
    rawRequest(path, data, method) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {};
            const isFile = data instanceof File;
            if (!isFile) {
                headers["Content-Type"] = "application/json";
            }
            headers["Accept"] = "application/json";
            return fetch(this.url(path), {
                method: method,
                credentials: "same-origin",
                headers: headers,
                body: method !== "GET" ? data : undefined,
            });
        });
    }
    // Make a request and expect JSON
    // If we can't retrieve and parse JSON, it is treated as a fatal/unexpected error
    requestJSON(path, data, method, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const onFailure = opts.onFailure || "show";
            let targetPath = path;
            // Tack params on the end if it's a GET request
            if (method === "GET" && !lodash.isEmpty(data)) {
                targetPath += UrlUtils_1.queryParamsToStr(data);
            }
            let response;
            let text;
            let json;
            let request;
            try {
                request = this.rawRequest(targetPath, data instanceof File ? data : JSON.stringify(data), method);
                this.addRequest(request);
                response = yield request;
                text = yield response.text();
                json = JSON.parse(text);
                if (json.error)
                    throw json.error;
            }
            catch (err) {
                if (onFailure === "show")
                    this.setErrorMessage({
                        title: `Failed to ${method} ${targetPath}` +
                            (response ? ` (${response.status})` : ""),
                        content: (err === null || err === void 0 ? void 0 : err.message) || text || err,
                        isFatal: (response === null || response === void 0 ? void 0 : response.status) !== 404,
                    });
                throw err;
            }
            finally {
                if (request)
                    this.removeRequest(request);
            }
            return json;
        });
    }
    setErrorMessage(message) {
        this.errorMessage = message;
    }
    addRequest(request) {
        this.currentRequests.push(request);
    }
    removeRequest(request) {
        this.currentRequests = this.currentRequests.filter((req) => req !== request);
    }
    getJSON(path, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestJSON(path, params, "GET");
        });
    }
}
__decorate([
    mobx_1.observable
], Admin.prototype, "errorMessage", void 0);
__decorate([
    mobx_1.observable
], Admin.prototype, "currentRequests", void 0);
__decorate([
    mobx_1.computed
], Admin.prototype, "showLoadingIndicator", null);
__decorate([
    mobx_1.observable
], Admin.prototype, "loadingIndicatorSetting", void 0);
__decorate([
    mobx_1.action.bound
], Admin.prototype, "setErrorMessage", null);
__decorate([
    mobx_1.action.bound
], Admin.prototype, "addRequest", null);
__decorate([
    mobx_1.action.bound
], Admin.prototype, "removeRequest", null);
exports.Admin = Admin;
//# sourceMappingURL=Admin.js.map