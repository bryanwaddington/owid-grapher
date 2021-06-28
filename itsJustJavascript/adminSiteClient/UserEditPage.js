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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEditPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Forms_1 = require("./Forms");
const react_router_dom_1 = require("react-router-dom");
const AdminLayout_1 = require("./AdminLayout");
const AdminAppContext_1 = require("./AdminAppContext");
let UserEditPage = class UserEditPage extends React.Component {
    constructor() {
        super(...arguments);
        this.isSaved = false;
    }
    render() {
        const { user, isSaved } = this;
        if (!user)
            return null;
        else if (isSaved)
            return React.createElement(react_router_dom_1.Redirect, { to: "/users" });
        return (React.createElement(AdminLayout_1.AdminLayout, null,
            React.createElement("main", { className: "UserEditPage" },
                React.createElement(Forms_1.BindString, { label: "Full Name", field: "fullName", store: user }),
                React.createElement(Forms_1.Toggle, { label: "User has access", value: user.isActive, onValue: (v) => (user.isActive = v) }),
                React.createElement("button", { className: "btn btn-success", onClick: () => this.save() }, "Update user"))));
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user) {
                yield this.context.admin.requestJSON(`/api/users/${this.props.userId}`, this.user, "PUT");
                this.isSaved = true;
            }
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin } = this.context;
            const json = yield admin.getJSON(`/api/users/${this.props.userId}.json`);
            mobx_1.runInAction(() => {
                this.user = json.user;
            });
        });
    }
    componentDidMount() {
        this.getData();
    }
};
UserEditPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], UserEditPage.prototype, "user", void 0);
__decorate([
    mobx_1.observable
], UserEditPage.prototype, "isSaved", void 0);
UserEditPage = __decorate([
    mobx_react_1.observer
], UserEditPage);
exports.UserEditPage = UserEditPage;
//# sourceMappingURL=UserEditPage.js.map