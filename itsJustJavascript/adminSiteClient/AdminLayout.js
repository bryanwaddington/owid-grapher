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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLayout = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Link_1 = require("./Link");
const EditorFAQ_1 = require("./EditorFAQ");
const AdminSidebar_1 = require("./AdminSidebar");
const AdminAppContext_1 = require("./AdminAppContext");
const faPlus_1 = require("@fortawesome/free-solid-svg-icons/faPlus");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
let AdminLayout = class AdminLayout extends React.Component {
    constructor() {
        super(...arguments);
        this.showFAQ = false;
        this.showSidebar = false;
    }
    onToggleFAQ() {
        this.showFAQ = !this.showFAQ;
    }
    onToggleSidebar() {
        this.showSidebar = !this.showSidebar;
    }
    setInitialSidebarState(value) {
        this.showSidebar = value;
    }
    componentDidMount() {
        this.setInitialSidebarState(!this.props.noSidebar);
        this.componentDidUpdate();
    }
    componentDidUpdate() {
        if (this.props.title)
            document.title = this.props.title + " - owid-admin";
    }
    get environmentSpan() {
        const { admin } = this.context;
        if (admin.settings.ENV === "development") {
            return React.createElement("span", { className: "dev" }, "dev");
        }
        else if (window.location.origin === "https://owid.cloud") {
            return React.createElement("span", { className: "live" }, "live");
        }
        else {
            return React.createElement("span", { className: "test" }, "test");
        }
    }
    render() {
        const { admin } = this.context;
        const { showFAQ: isFAQ, showSidebar, environmentSpan } = this;
        return (React.createElement("div", { className: "AdminLayout" + (showSidebar ? " withSidebar" : "") },
            isFAQ && React.createElement(EditorFAQ_1.EditorFAQ, { onClose: this.onToggleFAQ }),
            React.createElement("nav", { className: "navbar navbar-dark bg-dark flex-row navbar-expand-lg" },
                React.createElement("button", { className: "navbar-toggler", type: "button", onClick: this.onToggleSidebar },
                    React.createElement("span", { className: "navbar-toggler-icon" })),
                React.createElement(Link_1.Link, { className: "navbar-brand", to: "/" },
                    "owid-admin ",
                    environmentSpan),
                React.createElement("ul", { className: "navbar-nav" },
                    React.createElement("li", { className: "nav-item" },
                        React.createElement(Link_1.Link, { className: "nav-link", to: "/charts/create" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlus_1.faPlus }),
                            " New chart")),
                    React.createElement("li", { className: "nav-item" },
                        React.createElement("a", { className: "nav-link", href: `/admin/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/${ExplorerConstants_1.DefaultNewExplorerSlug}` },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlus_1.faPlus }),
                            " New Explorer")),
                    React.createElement("li", { className: "nav-item" },
                        React.createElement("a", { className: "nav-link", onClick: this.onToggleFAQ }, "FAQ")),
                    React.createElement("li", { className: "nav-item" },
                        React.createElement("a", { className: "nav-link", href: "/wp/wp-admin", target: "_blank" }, "Wordpress"))),
                React.createElement("ul", { className: "navbar-nav ml-auto" },
                    React.createElement("li", { className: "nav-item" },
                        React.createElement("a", { className: "nav-link logout", href: "/admin/logout" }, admin.username)))),
            showSidebar && React.createElement(AdminSidebar_1.AdminSidebar, null),
            this.props.children));
    }
};
AdminLayout.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], AdminLayout.prototype, "showFAQ", void 0);
__decorate([
    mobx_1.observable
], AdminLayout.prototype, "showSidebar", void 0);
__decorate([
    mobx_1.action.bound
], AdminLayout.prototype, "onToggleFAQ", null);
__decorate([
    mobx_1.action.bound
], AdminLayout.prototype, "onToggleSidebar", null);
__decorate([
    mobx_1.action.bound
], AdminLayout.prototype, "setInitialSidebarState", null);
__decorate([
    mobx_1.computed
], AdminLayout.prototype, "environmentSpan", null);
AdminLayout = __decorate([
    mobx_react_1.observer
], AdminLayout);
exports.AdminLayout = AdminLayout;
//# sourceMappingURL=AdminLayout.js.map