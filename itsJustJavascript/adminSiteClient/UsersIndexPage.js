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
exports.UsersIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Forms_1 = require("./Forms");
const Link_1 = require("./Link");
const AdminLayout_1 = require("./AdminLayout");
const AdminAppContext_1 = require("./AdminAppContext");
let InviteModal = class InviteModal extends React.Component {
    constructor() {
        super(...arguments);
        this.emailInput = React.createRef();
        this.email = "";
        this.inviteSuccess = false;
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            mobx_1.runInAction(() => (this.inviteSuccess = false));
            if (this.email) {
                const resp = yield this.context.admin.requestJSON("/api/users/invite", { email: this.email }, "POST");
                console.log(resp);
                if (resp.success) {
                    mobx_1.runInAction(() => (this.inviteSuccess = true));
                }
            }
        });
    }
    componentDidMount() {
        this.emailInput.current.focus();
    }
    onSubmit(event) {
        event.preventDefault();
        this.submit();
    }
    render() {
        return (React.createElement(Forms_1.Modal, { onClose: this.props.onClose },
            React.createElement("form", { onSubmit: this.onSubmit },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("h5", { className: "modal-title" }, "Invite a user")),
                React.createElement("div", { className: "modal-body" },
                    React.createElement("div", { className: "form-group" },
                        React.createElement("label", null, "Email address to invite"),
                        React.createElement("input", { type: "email", className: "form-control", onChange: (e) => (this.email = e.currentTarget.value), required: true, ref: this.emailInput }))),
                React.createElement("div", { className: "modal-footer" },
                    React.createElement("input", { type: "submit", className: "btn btn-primary", value: "Send invite" })),
                this.inviteSuccess && (React.createElement("div", { className: "alert alert-success", role: "alert" }, "Invite sent!")))));
    }
};
InviteModal.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], InviteModal.prototype, "email", void 0);
__decorate([
    mobx_1.observable
], InviteModal.prototype, "inviteSuccess", void 0);
__decorate([
    mobx_1.action.bound
], InviteModal.prototype, "onSubmit", null);
InviteModal = __decorate([
    mobx_react_1.observer
], InviteModal);
let UsersIndexPage = class UsersIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.users = [];
        this.isInviteModal = false;
    }
    onDelete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.confirm(`Delete the user ${user.fullName}? This action cannot be undone!`))
                return;
            const json = yield this.context.admin.requestJSON(`/api/users/${user.id}`, {}, "DELETE");
            if (json.success) {
                mobx_1.runInAction(() => this.users.splice(this.users.indexOf(user), 1));
            }
        });
    }
    render() {
        const { users } = this;
        const { isSuperuser } = this.context.admin;
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Users" },
            React.createElement("main", { className: "UsersIndexPage" },
                this.isInviteModal && (React.createElement(InviteModal, { onClose: mobx_1.action(() => (this.isInviteModal = false)) })),
                React.createElement("div", { className: "topbar" },
                    React.createElement("h2", null, "Users"),
                    isSuperuser && (React.createElement("button", { onClick: mobx_1.action(() => (this.isInviteModal = true)), className: "btn btn-primary" }, "Invite a user"))),
                React.createElement("table", { className: "table table-bordered" },
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Last Seen"),
                            React.createElement("th", null, "Joined"),
                            isSuperuser && React.createElement("th", null, "Status"),
                            isSuperuser && React.createElement("th", null),
                            isSuperuser && React.createElement("th", null)),
                        users.map((user) => (React.createElement("tr", { key: user.id },
                            React.createElement("td", null, user.fullName),
                            React.createElement("td", null,
                                React.createElement(Forms_1.Timeago, { time: user.lastSeen })),
                            React.createElement("td", null,
                                React.createElement(Forms_1.Timeago, { time: user.createdAt })),
                            isSuperuser && (React.createElement("td", null, user.isActive
                                ? "active"
                                : "disabled")),
                            isSuperuser && (React.createElement("td", null,
                                React.createElement(Link_1.Link, { to: `/users/${user.id}`, className: "btn btn-primary" }, "Edit"))),
                            isSuperuser && (React.createElement("td", null,
                                React.createElement("button", { className: "btn btn-danger", onClick: () => this.onDelete(user) }, "Delete")))))))))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin } = this.context;
            const json = (yield admin.getJSON("/api/users.json"));
            mobx_1.runInAction(() => {
                this.users = json.users;
            });
        });
    }
    componentDidMount() {
        this.getData();
    }
};
UsersIndexPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], UsersIndexPage.prototype, "users", void 0);
__decorate([
    mobx_1.observable
], UsersIndexPage.prototype, "isInviteModal", void 0);
__decorate([
    mobx_1.action.bound
], UsersIndexPage.prototype, "onDelete", null);
UsersIndexPage = __decorate([
    mobx_react_1.observer
], UsersIndexPage);
exports.UsersIndexPage = UsersIndexPage;
//# sourceMappingURL=UsersIndexPage.js.map