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
exports.AdminApp = void 0;
const React = __importStar(require("react"));
const ChartEditorPage_1 = require("./ChartEditorPage");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const ChartIndexPage_1 = require("./ChartIndexPage");
const UsersIndexPage_1 = require("./UsersIndexPage");
const DatasetsIndexPage_1 = require("./DatasetsIndexPage");
const CountryStandardizerPage_1 = require("./CountryStandardizerPage");
const UserEditPage_1 = require("./UserEditPage");
const VariableEditPage_1 = require("./VariableEditPage");
const VariablesIndexPage_1 = require("./VariablesIndexPage");
const DatasetEditPage_1 = require("./DatasetEditPage");
const SourceEditPage_1 = require("./SourceEditPage");
const RedirectsIndexPage_1 = require("./RedirectsIndexPage");
const TagEditPage_1 = require("./TagEditPage");
const TagsIndexPage_1 = require("./TagsIndexPage");
const PostsIndexPage_1 = require("./PostsIndexPage");
const TestIndexPage_1 = require("./TestIndexPage");
const ImportPage_1 = require("./ImportPage");
const NotFoundPage_1 = require("./NotFoundPage");
const PostEditorPage_1 = require("./PostEditorPage");
const NewsletterPage_1 = require("./NewsletterPage");
const DeployStatusPage_1 = require("./DeployStatusPage");
const react_router_dom_1 = require("react-router-dom");
const Forms_1 = require("./Forms");
const AdminAppContext_1 = require("./AdminAppContext");
const js_base64_1 = require("js-base64");
const ExplorerCreatePage_1 = require("../explorerAdmin/ExplorerCreatePage");
const ExplorersListPage_1 = require("../explorerAdmin/ExplorersListPage");
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
const AdminLayout_1 = require("./AdminLayout");
let AdminErrorMessage = class AdminErrorMessage extends React.Component {
    render() {
        const { admin } = this.props;
        const error = admin.errorMessage;
        return error ? (React.createElement(Forms_1.Modal, { className: "errorMessage", onClose: mobx_1.action(() => {
                error.isFatal
                    ? window.location.reload()
                    : (admin.errorMessage = undefined);
            }) },
            React.createElement("div", { className: "modal-header" },
                React.createElement("div", null,
                    React.createElement("h5", { className: "modal-title", style: error.isFatal ? { color: "red" } : undefined }, error.title),
                    error.isFatal && (React.createElement("p", null,
                        "Please screenshot this error message and report it in",
                        " ",
                        React.createElement("a", { href: "https://owid.slack.com/messages/tech-issues/" }, "#tech-issues"))))),
            React.createElement("div", { className: "modal-body" },
                React.createElement("pre", { dangerouslySetInnerHTML: { __html: error.content } })))) : null;
    }
};
AdminErrorMessage = __decorate([
    mobx_react_1.observer
], AdminErrorMessage);
let AdminLoader = class AdminLoader extends React.Component {
    render() {
        const { admin } = this.props;
        return admin.showLoadingIndicator ? React.createElement(Forms_1.LoadingBlocker, null) : null;
    }
};
AdminLoader = __decorate([
    mobx_react_1.observer
], AdminLoader);
let AdminApp = class AdminApp extends React.Component {
    get childContext() {
        return { admin: this.props.admin };
    }
    render() {
        const { admin, gitCmsBranchName } = this.props;
        return (React.createElement(AdminAppContext_1.AdminAppContext.Provider, { value: this.childContext },
            React.createElement(react_router_dom_1.BrowserRouter, { basename: admin.basePath },
                React.createElement("div", { className: "AdminApp" },
                    React.createElement(AdminErrorMessage, { admin: admin }),
                    React.createElement(AdminLoader, { admin: admin }),
                    React.createElement(react_router_dom_1.Switch, null,
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/charts/create/:config", render: ({ match }) => (React.createElement(ChartEditorPage_1.ChartEditorPage, { grapherConfig: JSON.parse(js_base64_1.Base64.decode(match.params.config)) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/charts/create", component: ChartEditorPage_1.ChartEditorPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/charts/:chartId/edit", render: ({ match }) => (React.createElement(ChartEditorPage_1.ChartEditorPage, { grapherId: parseInt(match.params.chartId) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/charts", component: ChartIndexPage_1.ChartIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: `/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/:slug`, render: ({ match }) => (React.createElement(AdminLayout_1.AdminLayout, { title: "Create Explorer" },
                                React.createElement(ExplorerCreatePage_1.ExplorerCreatePage, { slug: match.params.slug, gitCmsBranchName: gitCmsBranchName, manager: admin }))) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: `/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}`, render: ({ match }) => (React.createElement(AdminLayout_1.AdminLayout, { title: "Explorers" },
                                React.createElement(ExplorersListPage_1.ExplorersIndexPage, null))) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/users/:userId", render: ({ match }) => (React.createElement(UserEditPage_1.UserEditPage, { userId: parseInt(match.params.userId) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/users", component: UsersIndexPage_1.UsersIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/import", component: ImportPage_1.ImportPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/variables/:variableId", render: ({ match }) => (React.createElement(VariableEditPage_1.VariableEditPage, { variableId: parseInt(match.params.variableId) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/variables", component: VariablesIndexPage_1.VariablesIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/datasets/:datasetId", render: ({ match }) => (React.createElement(DatasetEditPage_1.DatasetEditPage, { datasetId: parseInt(match.params.datasetId) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/datasets", component: DatasetsIndexPage_1.DatasetsIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/sources/:sourceId", render: ({ match }) => (React.createElement(SourceEditPage_1.SourceEditPage, { sourceId: parseInt(match.params.sourceId) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/standardize", component: CountryStandardizerPage_1.CountryStandardizerPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/redirects", component: RedirectsIndexPage_1.RedirectsIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/tags/:tagId", render: ({ match }) => (React.createElement(TagEditPage_1.TagEditPage, { tagId: parseInt(match.params.tagId) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/tags", component: TagsIndexPage_1.TagsIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/posts", component: PostsIndexPage_1.PostsIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/posts/:postId/edit", render: ({ match }) => (React.createElement(PostEditorPage_1.PostEditorPage, { postId: parseInt(match.params.postId) })) }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/test", component: TestIndexPage_1.TestIndexPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/deploys", component: DeployStatusPage_1.DeployStatusPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/newsletter", component: NewsletterPage_1.NewsletterPage }),
                        React.createElement(react_router_dom_1.Route, { exact: true, path: "/", render: () => React.createElement(react_router_dom_1.Redirect, { to: "/charts" }) }),
                        React.createElement(react_router_dom_1.Route, { component: NotFoundPage_1.NotFoundPage }))))));
    }
};
AdminApp = __decorate([
    mobx_react_1.observer
], AdminApp);
exports.AdminApp = AdminApp;
//# sourceMappingURL=AdminApp.js.map