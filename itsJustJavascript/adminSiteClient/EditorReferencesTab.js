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
exports.EditorReferencesTab = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const clientSettings_1 = require("../settings/clientSettings");
const AdminAppContext_1 = require("./AdminAppContext");
const BASE_URL = clientSettings_1.BAKED_GRAPHER_URL.replace(/^https?:\/\//, "");
let EditorReferencesTab = class EditorReferencesTab extends React.Component {
    get isPersisted() {
        return this.props.editor.grapher.id;
    }
    get references() {
        return this.props.editor.references || [];
    }
    get redirects() {
        return this.props.editor.redirects || [];
    }
    appendRedirect(redirect) {
        this.props.editor.manager.redirects.push(redirect);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("section", null,
                React.createElement("h5", null, "References"),
                this.references.length ? (React.createElement(React.Fragment, null,
                    React.createElement("p", null, "Public pages that embed or reference this chart:"),
                    React.createElement("ul", { className: "list-group" }, this.references.map((post) => (React.createElement("li", { key: post.id, className: "list-group-item" },
                        React.createElement("a", { href: post.url, target: "_blank", rel: "noopener" },
                            React.createElement("strong", null, post.title)),
                        " ",
                        "(",
                        React.createElement("a", { href: `https://owid.cloud/wp/wp-admin/post.php?post=${post.id}&action=edit`, target: "_blank", rel: "noopener" }, "Edit"),
                        ")")))))) : (React.createElement("p", null, "No public posts reference this chart"))),
            React.createElement("section", null,
                React.createElement("h5", null, "Alternative URLs for this chart"),
                this.redirects.length ? (React.createElement(React.Fragment, null,
                    React.createElement("p", null, "The following URLs redirect to this chart:"),
                    React.createElement("ul", { className: "list-group" }, this.redirects.map((redirect) => (React.createElement("li", { key: redirect.id, className: "list-group-item" },
                        React.createElement("span", { className: "redirect-prefix" },
                            BASE_URL,
                            "/"),
                        React.createElement("a", { href: `${clientSettings_1.BAKED_GRAPHER_URL}/${redirect.slug}`, target: "_blank", rel: "noopener" },
                            React.createElement("strong", null, redirect.slug)))))),
                    React.createElement("hr", null))) : null,
                this.isPersisted && (React.createElement(AddRedirectForm, { editor: this.props.editor, onSuccess: this.appendRedirect })))));
    }
};
__decorate([
    mobx_1.computed
], EditorReferencesTab.prototype, "isPersisted", null);
__decorate([
    mobx_1.computed
], EditorReferencesTab.prototype, "references", null);
__decorate([
    mobx_1.computed
], EditorReferencesTab.prototype, "redirects", null);
__decorate([
    mobx_1.action.bound
], EditorReferencesTab.prototype, "appendRedirect", null);
EditorReferencesTab = __decorate([
    mobx_react_1.observer
], EditorReferencesTab);
exports.EditorReferencesTab = EditorReferencesTab;
let AddRedirectForm = class AddRedirectForm extends React.Component {
    constructor() {
        super(...arguments);
        this.slug = "";
        this.isLoading = false;
    }
    onChange(slug) {
        this.slug = slug;
    }
    onSubmit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isLoading) {
                this.isLoading = true;
                try {
                    const chartId = this.props.editor.grapher.id;
                    const result = yield this.context.admin.requestJSON(`/api/charts/${chartId}/redirects/new`, { slug: this.slug }, "POST", { onFailure: "continue" });
                    const redirect = result.redirect;
                    mobx_1.runInAction(() => {
                        this.isLoading = false;
                        this.slug = "";
                        this.errorMessage = undefined;
                    });
                    this.props.onSuccess(redirect);
                }
                catch (error) {
                    mobx_1.runInAction(() => {
                        this.isLoading = false;
                        this.errorMessage = error && error.message;
                    });
                }
            }
        });
    }
    render() {
        return (React.createElement("form", { onSubmit: this.onSubmit },
            React.createElement("div", { className: "input-group mb-3" },
                React.createElement("div", { className: "input-group-prepend" },
                    React.createElement("span", { className: "input-group-text", id: "basic-addon3" },
                        BASE_URL,
                        "/")),
                React.createElement("input", { type: "text", className: "form-control", placeholder: "URL", value: this.slug, onChange: (event) => this.onChange(event.target.value) }),
                React.createElement("div", { className: "input-group-append" },
                    React.createElement("button", { className: "btn btn-primary", type: "submit", disabled: !this.slug || this.isLoading }, "Add"))),
            this.errorMessage && (React.createElement("div", { className: "alert alert-danger" }, this.errorMessage))));
    }
};
AddRedirectForm.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], AddRedirectForm.prototype, "slug", void 0);
__decorate([
    mobx_1.observable
], AddRedirectForm.prototype, "isLoading", void 0);
__decorate([
    mobx_1.observable
], AddRedirectForm.prototype, "errorMessage", void 0);
__decorate([
    mobx_1.action.bound
], AddRedirectForm.prototype, "onChange", null);
__decorate([
    mobx_1.action.bound
], AddRedirectForm.prototype, "onSubmit", null);
AddRedirectForm = __decorate([
    mobx_react_1.observer
], AddRedirectForm);
//# sourceMappingURL=EditorReferencesTab.js.map