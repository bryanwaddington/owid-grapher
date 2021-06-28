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
exports.ExplorersIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Util_1 = require("../clientUtils/Util");
const ExplorerProgram_1 = require("../explorer/ExplorerProgram");
const GitCmsClient_1 = require("../gitCms/GitCmsClient");
const GitCmsConstants_1 = require("../gitCms/GitCmsConstants");
const moment_1 = __importDefault(require("moment"));
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
const LoadingIndicator_1 = require("../grapher/loadingIndicator/LoadingIndicator");
const clientSettings_1 = require("../settings/clientSettings");
let ExplorerRow = class ExplorerRow extends React.Component {
    render() {
        var _a;
        const { explorer, searchHighlight, gitCmsBranchName, indexPage, } = this.props;
        const { slug, lastCommit, filename, googleSheet, isPublished, explorerTitle, title, grapherCount, tableCount, inlineTableCount, } = explorer;
        const publishedUrl = `${clientSettings_1.BAKED_BASE_URL}/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/${slug}`;
        const repoPath = `${GitCmsConstants_1.GIT_CMS_REPO_URL}/commits/${gitCmsBranchName}/${ExplorerConstants_1.EXPLORERS_GIT_CMS_FOLDER}/`;
        const lastCommitLink = `${GitCmsConstants_1.GIT_CMS_REPO_URL}/commit/${lastCommit === null || lastCommit === void 0 ? void 0 : lastCommit.hash}`;
        const titleToShow = (_a = explorerTitle !== null && explorerTitle !== void 0 ? explorerTitle : title) !== null && _a !== void 0 ? _a : "";
        const fileHistoryButton = (React.createElement("a", { key: "explorers", href: repoPath + filename }, "Full History"));
        const googleSheetButton = googleSheet ? (React.createElement(React.Fragment, null,
            React.createElement("span", null, " | "),
            React.createElement("a", { key: "googleSheets", href: googleSheet }, "Google Sheet"))) : null;
        const hasEdits = localStorage.getItem(`${ExplorerConstants_1.UNSAVED_EXPLORER_DRAFT}${slug}`);
        return (React.createElement("tr", null,
            React.createElement("td", null,
                !isPublished ? (React.createElement("span", { className: "text-secondary" }, slug)) : (React.createElement("a", { href: publishedUrl }, slug)),
                " - ",
                React.createElement("a", { href: `/admin/${ExplorerConstants_1.EXPLORERS_PREVIEW_ROUTE}/${slug}` }, "Preview")),
            React.createElement("td", null,
                searchHighlight
                    ? searchHighlight(titleToShow)
                    : titleToShow,
                React.createElement("div", { style: { fontSize: "80%", opacity: 0.8 } }, `${grapherCount} grapher${grapherCount > 1 ? "s" : ""}. ${tableCount} table${tableCount === 1 ? "" : "s"}${inlineTableCount
                    ? ` (${inlineTableCount} inline)`
                    : ""}.`)),
            React.createElement("td", null,
                React.createElement("div", null, lastCommit === null || lastCommit === void 0 ? void 0 : lastCommit.message),
                React.createElement("div", { style: { fontSize: "80%", opacity: 0.8 } },
                    React.createElement("a", { href: lastCommitLink }, lastCommit
                        ? moment_1.default(lastCommit.date).fromNow()
                        : ""),
                    " ",
                    "by ", lastCommit === null || lastCommit === void 0 ? void 0 :
                    lastCommit.author_name,
                    " | ",
                    fileHistoryButton,
                    googleSheetButton)),
            React.createElement("td", null,
                React.createElement("a", { href: `${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/${slug}`, className: "btn btn-primary", title: hasEdits ? "*You have local edits" : "" },
                    "Edit",
                    hasEdits ? "*" : "")),
            React.createElement("td", null,
                React.createElement("button", { className: "btn btn-danger", onClick: () => indexPage.togglePublishedStatus(filename) }, isPublished ? "Unpublish" : "Publish")),
            React.createElement("td", null,
                React.createElement("button", { className: "btn btn-danger", onClick: () => indexPage.deleteFile(filename) },
                    "Delete",
                    " "))));
    }
};
ExplorerRow = __decorate([
    mobx_react_1.observer
], ExplorerRow);
let ExplorerList = class ExplorerList extends React.Component {
    render() {
        const { props } = this;
        return (React.createElement("table", { className: "table table-bordered" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Slug"),
                    React.createElement("th", null, "Title"),
                    React.createElement("th", null, "Last Updated"),
                    React.createElement("th", null),
                    React.createElement("th", null),
                    React.createElement("th", null))),
            React.createElement("tbody", null, props.explorers.map((explorer) => (React.createElement(ExplorerRow, { indexPage: this.props.indexPage, key: explorer.slug, explorer: explorer, searchHighlight: props.searchHighlight, gitCmsBranchName: props.gitCmsBranchName }))))));
    }
};
ExplorerList = __decorate([
    mobx_react_1.observer
], ExplorerList);
let ExplorersIndexPage = class ExplorersIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.explorers = [];
        this.needsPull = false;
        this.maxVisibleRows = 50;
        this.gitCmsClient = new GitCmsClient_1.GitCmsClient(GitCmsConstants_1.GIT_CMS_BASE_ROUTE);
        this.gitCmsBranchName = GitCmsConstants_1.GIT_CMS_DEFAULT_BRANCH;
        this.isReady = false;
    }
    get explorersToShow() {
        return Util_1.orderBy(this.explorers, (program) => { var _a; return moment_1.default((_a = program.lastCommit) === null || _a === void 0 ? void 0 : _a.date).unix(); }, ["desc"]);
    }
    onShowMore() {
        this.maxVisibleRows += 100;
    }
    pullFromGithub() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.gitCmsClient.pullFromGithub();
            alert(JSON.stringify(result));
            window.location.reload();
        });
    }
    render() {
        if (!this.isReady)
            return React.createElement(LoadingIndicator_1.LoadingIndicator, { title: "Loading explorer list" });
        const { explorersToShow, numTotalRows } = this;
        const highlight = (text) => {
            if (this.highlightSearch) {
                const html = text.replace(new RegExp(this.highlightSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i"), (s) => `<b>${s}</b>`);
                return React.createElement("span", { dangerouslySetInnerHTML: { __html: html } });
            }
            else
                return text;
        };
        const needsPull = true; // todo: implement needsPull on server side and then use this.needsPull
        const pullButton = needsPull && (React.createElement("span", null,
            React.createElement("a", { href: "#", onClick: this.pullFromGithub }, "Check for new commits from GitHub"),
            " "));
        return (React.createElement("main", { className: "DatasetsIndexPage" },
            React.createElement("div", { className: "ExplorersListPageHeader" },
                React.createElement("div", null,
                    "Showing ",
                    explorersToShow.length,
                    " of ",
                    numTotalRows,
                    " ",
                    "explorers"),
                React.createElement("div", { style: { textAlign: "right" } },
                    React.createElement("a", { className: "btn btn-primary", href: `/admin/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/${ExplorerConstants_1.DefaultNewExplorerSlug}` }, "Create"))),
            React.createElement(ExplorerList, { explorers: explorersToShow, searchHighlight: highlight, indexPage: this, gitCmsBranchName: this.gitCmsBranchName }),
            pullButton,
            " |",
            " ",
            React.createElement("a", { href: `${GitCmsConstants_1.GIT_CMS_REPO_URL}/commits/${this.gitCmsBranchName}` },
                "See branch '",
                this.gitCmsBranchName,
                "' history on GitHub"),
            React.createElement("br", null),
            React.createElement("br", null)));
    }
    fetchAllExplorers() {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchInput } = this;
            const response = yield fetch(ExplorerConstants_1.GetAllExplorersRoute);
            const json = (yield response.json());
            if (!json.success)
                alert(JSON.stringify(json.errorMessage));
            this.needsPull = json.needsPull;
            this.isReady = true;
            mobx_1.runInAction(() => {
                if (searchInput === this.searchInput) {
                    this.explorers = json.explorers.map((exp) => ExplorerProgram_1.ExplorerProgram.fromJson(exp));
                    this.numTotalRows = json.explorers.length;
                    this.highlightSearch = searchInput;
                    this.gitCmsBranchName = json.gitCmsBranchName;
                }
            });
        });
    }
    get manager() {
        var _a;
        return (_a = this.props.manager) !== null && _a !== void 0 ? _a : {};
    }
    loadingModalOn() {
        this.manager.loadingIndicatorSetting = "loading";
    }
    resetLoadingModal() {
        this.manager.loadingIndicatorSetting = "default";
    }
    togglePublishedStatus(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const explorer = this.explorers.find((exp) => exp.filename === filename);
            const newVersion = explorer.setPublished(!explorer.isPublished);
            this.loadingModalOn();
            yield this.gitCmsClient.writeRemoteFile({
                filepath: newVersion.fullPath,
                content: newVersion.toString(),
                commitMessage: `Setting publish status of ${filename} to ${newVersion.isPublished}`,
            });
            this.resetLoadingModal();
            this.fetchAllExplorers();
        });
    }
    deleteFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!confirm(`Are you sure you want to delete "${filename}"?`))
                return;
            this.loadingModalOn();
            yield this.gitCmsClient.deleteRemoteFile({
                filepath: `${ExplorerConstants_1.EXPLORERS_GIT_CMS_FOLDER}/${filename}`,
            });
            this.resetLoadingModal();
            this.fetchAllExplorers();
        });
    }
    componentDidMount() {
        this.dispose = mobx_1.reaction(() => this.searchInput || this.maxVisibleRows, Util_1.debounce(() => this.fetchAllExplorers(), 200));
        this.fetchAllExplorers();
    }
    componentWillUnmount() {
        this.dispose();
    }
};
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "explorers", void 0);
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "needsPull", void 0);
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "maxVisibleRows", void 0);
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "numTotalRows", void 0);
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "searchInput", void 0);
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "highlightSearch", void 0);
__decorate([
    mobx_1.computed
], ExplorersIndexPage.prototype, "explorersToShow", null);
__decorate([
    mobx_1.action.bound
], ExplorersIndexPage.prototype, "onShowMore", null);
__decorate([
    mobx_1.action.bound
], ExplorersIndexPage.prototype, "pullFromGithub", null);
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "gitCmsBranchName", void 0);
__decorate([
    mobx_1.observable
], ExplorersIndexPage.prototype, "isReady", void 0);
__decorate([
    mobx_1.computed
], ExplorersIndexPage.prototype, "manager", null);
__decorate([
    mobx_1.action.bound
], ExplorersIndexPage.prototype, "loadingModalOn", null);
__decorate([
    mobx_1.action.bound
], ExplorersIndexPage.prototype, "resetLoadingModal", null);
__decorate([
    mobx_1.action.bound
], ExplorersIndexPage.prototype, "togglePublishedStatus", null);
__decorate([
    mobx_1.action.bound
], ExplorersIndexPage.prototype, "deleteFile", null);
ExplorersIndexPage = __decorate([
    mobx_react_1.observer
], ExplorersIndexPage);
exports.ExplorersIndexPage = ExplorersIndexPage;
//# sourceMappingURL=ExplorersListPage.js.map