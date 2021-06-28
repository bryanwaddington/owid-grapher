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
exports.RedirectsIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const AdminLayout_1 = require("./AdminLayout");
const Forms_1 = require("./Forms");
const Link_1 = require("./Link");
const AdminAppContext_1 = require("./AdminAppContext");
let RedirectRow = class RedirectRow extends React.Component {
    render() {
        const { redirect } = this.props;
        return (React.createElement("tr", null,
            React.createElement("td", null, redirect.slug),
            React.createElement("td", null,
                React.createElement(Link_1.Link, { to: `/charts/${redirect.chartId}/edit` }, redirect.chartSlug)),
            React.createElement("td", null,
                React.createElement("button", { className: "btn btn-danger", onClick: () => this.props.onDelete(redirect) }, "Delete"))));
    }
};
RedirectRow.contextType = AdminAppContext_1.AdminAppContext;
RedirectRow = __decorate([
    mobx_react_1.observer
], RedirectRow);
let RedirectsIndexPage = class RedirectsIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.redirects = [];
    }
    onDelete(redirect) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.confirm(`Delete the redirect from ${redirect.slug}? This action may break existing embeds!`))
                return;
            const json = yield this.context.admin.requestJSON(`/api/redirects/${redirect.id}`, {}, "DELETE");
            if (json.success) {
                mobx_1.runInAction(() => this.redirects.splice(this.redirects.indexOf(redirect), 1));
            }
        });
    }
    render() {
        const { redirects } = this;
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Redirects" },
            React.createElement("main", { className: "RedirectsIndexPage" },
                React.createElement(Forms_1.FieldsRow, null,
                    React.createElement("span", null,
                        "Showing ",
                        redirects.length,
                        " redirects")),
                React.createElement("p", null, "Redirects are automatically created when the slug of a published chart is changed."),
                React.createElement("table", { className: "table table-bordered" },
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Slug"),
                            React.createElement("th", null, "Redirects To"),
                            React.createElement("th", null)),
                        redirects.map((redirect) => (React.createElement(RedirectRow, { key: redirect.id, redirect: redirect, onDelete: this.onDelete }))))))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON("/api/redirects.json");
            mobx_1.runInAction(() => {
                this.redirects = json.redirects;
            });
        });
    }
    componentDidMount() {
        this.getData();
    }
};
RedirectsIndexPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], RedirectsIndexPage.prototype, "redirects", void 0);
__decorate([
    mobx_1.action.bound
], RedirectsIndexPage.prototype, "onDelete", null);
RedirectsIndexPage = __decorate([
    mobx_react_1.observer
], RedirectsIndexPage);
exports.RedirectsIndexPage = RedirectsIndexPage;
//# sourceMappingURL=RedirectsIndexPage.js.map