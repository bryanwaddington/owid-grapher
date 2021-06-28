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
exports.ChartEditorPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const react_router_dom_1 = require("react-router-dom");
const Bounds_1 = require("../clientUtils/Bounds");
const Util_1 = require("../clientUtils/Util");
const Grapher_1 = require("../grapher/core/Grapher");
const ChartEditor_1 = require("./ChartEditor");
const EditorBasicTab_1 = require("./EditorBasicTab");
const EditorDataTab_1 = require("./EditorDataTab");
const EditorTextTab_1 = require("./EditorTextTab");
const EditorCustomizeTab_1 = require("./EditorCustomizeTab");
const EditorScatterTab_1 = require("./EditorScatterTab");
const EditorMapTab_1 = require("./EditorMapTab");
const EditorHistoryTab_1 = require("./EditorHistoryTab");
const EditorReferencesTab_1 = require("./EditorReferencesTab");
const SaveButtons_1 = require("./SaveButtons");
const Forms_1 = require("./Forms");
const AdminLayout_1 = require("./AdminLayout");
const AdminAppContext_1 = require("./AdminAppContext");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faMobile_1 = require("@fortawesome/free-solid-svg-icons/faMobile");
const faDesktop_1 = require("@fortawesome/free-solid-svg-icons/faDesktop");
const VisionDeficiencies_1 = require("./VisionDeficiencies");
let TabBinder = class TabBinder extends React.Component {
    componentDidMount() {
        //window.addEventListener("hashchange", this.onHashChange)
        this.onHashChange();
        this.dispose = mobx_1.autorun(() => {
            //setTimeout(() => window.location.hash = `#${tab}-tab`, 100)
        });
    }
    componentWillUnmount() {
        //window.removeEventListener("hashchange", this.onHashChange)
        this.dispose();
    }
    render() {
        return null;
    }
    onHashChange() {
        const match = window.location.hash.match(/#(.+?)-tab/);
        if (match) {
            const tab = match[1];
            if (this.props.editor.grapher &&
                this.props.editor.availableTabs.includes(tab))
                this.props.editor.tab = tab;
        }
    }
};
__decorate([
    mobx_1.action.bound
], TabBinder.prototype, "onHashChange", null);
TabBinder = __decorate([
    mobx_react_1.observer
], TabBinder);
let ChartEditorPage = class ChartEditorPage extends React.Component {
    constructor() {
        super(...arguments);
        this.grapher = new Grapher_1.Grapher();
        this.database = new ChartEditor_1.EditorDatabase({});
        this.logs = [];
        this.references = [];
        this.redirects = [];
        this._isDbSet = false;
        this._isGrapherSet = false;
    }
    fetchGrapher() {
        return __awaiter(this, void 0, void 0, function* () {
            const { grapherId, grapherConfig } = this.props;
            const { admin } = this.context;
            const json = grapherId === undefined
                ? grapherConfig
                : yield admin.getJSON(`/api/charts/${grapherId}.config.json`);
            this.loadGrapherJson(json);
        });
    }
    get isReady() {
        return this._isDbSet && this._isGrapherSet;
    }
    loadGrapherJson(json) {
        var _a;
        this.grapherElement = (React.createElement(Grapher_1.Grapher, Object.assign({}, Object.assign(Object.assign({}, json), { bounds: ((_a = this.editor) === null || _a === void 0 ? void 0 : _a.previewMode) === "mobile"
                ? new Bounds_1.Bounds(0, 0, 360, 500)
                : new Bounds_1.Bounds(0, 0, 800, 600), getGrapherInstance: (grapher) => {
                this.grapher = grapher;
            } }))));
        this._isGrapherSet = true;
    }
    setDb(json) {
        this.database = new ChartEditor_1.EditorDatabase(json);
        this._isDbSet = true;
    }
    fetchData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin } = this.context;
            const json = yield admin.getJSON(`/api/editorData/namespaces.json`);
            this.setDb(json);
        });
    }
    fetchLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const { grapherId } = this.props;
            const { admin } = this.context;
            const json = grapherId === undefined
                ? []
                : yield admin.getJSON(`/api/charts/${grapherId}.logs.json`);
            mobx_1.runInAction(() => (this.logs = json.logs));
        });
    }
    fetchRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            const { grapherId } = this.props;
            const { admin } = this.context;
            const json = grapherId === undefined
                ? []
                : yield admin.getJSON(`/api/charts/${grapherId}.references.json`);
            mobx_1.runInAction(() => (this.references = json.references || []));
        });
    }
    fetchRedirects() {
        return __awaiter(this, void 0, void 0, function* () {
            const { grapherId } = this.props;
            const { admin } = this.context;
            const json = grapherId === undefined
                ? []
                : yield admin.getJSON(`/api/charts/${grapherId}.redirects.json`);
            mobx_1.runInAction(() => (this.redirects = json.redirects));
        });
    }
    get admin() {
        return this.context.admin;
    }
    get editor() {
        if (!this.isReady)
            return undefined;
        return new ChartEditor_1.ChartEditor({ manager: this });
    }
    refresh() {
        this.fetchGrapher();
        this.fetchData();
        this.fetchLogs();
        this.fetchRefs();
        this.fetchRedirects();
    }
    componentDidMount() {
        this.refresh();
        this.dispose = mobx_1.reaction(() => this.editor && this.editor.previewMode, () => {
            if (this.editor) {
                localStorage.setItem("editorPreviewMode", this.editor.previewMode);
            }
        });
    }
    // This funny construction allows the "new chart" link to work by forcing an update
    // even if the props don't change
    UNSAFE_componentWillReceiveProps() {
        setTimeout(() => this.refresh(), 0);
    }
    componentWillUnmount() {
        this.dispose();
    }
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, { noSidebar: true },
            React.createElement("main", { className: "ChartEditorPage" },
                (this.editor === undefined ||
                    this.editor.currentRequest) && React.createElement(Forms_1.LoadingBlocker, null),
                this.editor !== undefined && this.renderReady(this.editor))));
    }
    renderReady(editor) {
        const { grapher, availableTabs, previewMode } = editor;
        return (React.createElement(React.Fragment, null,
            !editor.newChartId && (React.createElement(react_router_dom_1.Prompt, { when: editor.isModified, message: "Are you sure you want to leave? Unsaved changes will be lost." })),
            editor.newChartId && (React.createElement(react_router_dom_1.Redirect, { to: `/charts/${editor.newChartId}/edit` })),
            React.createElement(TabBinder, { editor: editor }),
            React.createElement("div", { className: "chart-editor-settings" },
                React.createElement("div", { className: "p-2" },
                    React.createElement("ul", { className: "nav nav-tabs" }, availableTabs.map((tab) => (React.createElement("li", { key: tab, className: "nav-item" },
                        React.createElement("a", { className: "nav-link" +
                                (tab === editor.tab
                                    ? " active"
                                    : ""), onClick: () => (editor.tab = tab) },
                            Util_1.capitalize(tab),
                            tab === "refs" &&
                                this.references.length
                                ? ` (${this.references.length})`
                                : "")))))),
                React.createElement("div", { className: "innerForm container" },
                    editor.tab === "basic" && (React.createElement(EditorBasicTab_1.EditorBasicTab, { editor: editor })),
                    editor.tab === "text" && (React.createElement(EditorTextTab_1.EditorTextTab, { editor: editor })),
                    editor.tab === "data" && (React.createElement(EditorDataTab_1.EditorDataTab, { editor: editor })),
                    editor.tab === "customize" && (React.createElement(EditorCustomizeTab_1.EditorCustomizeTab, { editor: editor })),
                    editor.tab === "scatter" && (React.createElement(EditorScatterTab_1.EditorScatterTab, { grapher: grapher })),
                    editor.tab === "map" && (React.createElement(EditorMapTab_1.EditorMapTab, { editor: editor })),
                    editor.tab === "revisions" && (React.createElement(EditorHistoryTab_1.EditorHistoryTab, { editor: editor })),
                    editor.tab === "refs" && (React.createElement(EditorReferencesTab_1.EditorReferencesTab, { editor: editor }))),
                React.createElement(SaveButtons_1.SaveButtons, { editor: editor })),
            React.createElement("div", { className: "chart-editor-view" },
                React.createElement("figure", { "data-grapher-src": true, style: {
                        filter: this.simulateVisionDeficiency &&
                            `url(#${this.simulateVisionDeficiency.id})`,
                    } }, this.grapherElement),
                React.createElement("div", null,
                    React.createElement("div", { className: "btn-group", "data-toggle": "buttons", style: { whiteSpace: "nowrap" } },
                        React.createElement("label", { className: "btn btn-light" +
                                (previewMode === "mobile" ? " active" : ""), title: "Mobile preview" },
                            React.createElement("input", { type: "radio", onChange: mobx_1.action(() => (editor.previewMode = "mobile")), name: "previewSize", id: "mobile", checked: previewMode === "mobile" }),
                            " ",
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faMobile_1.faMobile })),
                        React.createElement("label", { className: "btn btn-light" +
                                (previewMode === "desktop" ? " active" : ""), title: "Desktop preview" },
                            React.createElement("input", { onChange: mobx_1.action(() => (editor.previewMode = "desktop")), type: "radio", name: "previewSize", id: "desktop", checked: previewMode === "desktop" }),
                            " ",
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDesktop_1.faDesktop }))),
                    React.createElement("div", { className: "form-group d-inline-block", style: { width: 250, marginLeft: 15 } },
                        "Emulate vision deficiency:",
                        " ",
                        React.createElement(VisionDeficiencies_1.VisionDeficiencyDropdown, { onChange: mobx_1.action((option) => (this.simulateVisionDeficiency =
                                option.deficiency)) }))),
                React.createElement(VisionDeficiencies_1.VisionDeficiencySvgFilters, null))));
    }
};
ChartEditorPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable.ref
], ChartEditorPage.prototype, "grapher", void 0);
__decorate([
    mobx_1.observable.ref
], ChartEditorPage.prototype, "database", void 0);
__decorate([
    mobx_1.observable
], ChartEditorPage.prototype, "logs", void 0);
__decorate([
    mobx_1.observable
], ChartEditorPage.prototype, "references", void 0);
__decorate([
    mobx_1.observable
], ChartEditorPage.prototype, "redirects", void 0);
__decorate([
    mobx_1.observable.ref
], ChartEditorPage.prototype, "grapherElement", void 0);
__decorate([
    mobx_1.observable
], ChartEditorPage.prototype, "simulateVisionDeficiency", void 0);
__decorate([
    mobx_1.observable
], ChartEditorPage.prototype, "_isDbSet", void 0);
__decorate([
    mobx_1.observable
], ChartEditorPage.prototype, "_isGrapherSet", void 0);
__decorate([
    mobx_1.computed
], ChartEditorPage.prototype, "isReady", null);
__decorate([
    mobx_1.action.bound
], ChartEditorPage.prototype, "loadGrapherJson", null);
__decorate([
    mobx_1.action.bound
], ChartEditorPage.prototype, "setDb", null);
__decorate([
    mobx_1.computed
], ChartEditorPage.prototype, "admin", null);
__decorate([
    mobx_1.computed
], ChartEditorPage.prototype, "editor", null);
__decorate([
    mobx_1.action.bound
], ChartEditorPage.prototype, "refresh", null);
ChartEditorPage = __decorate([
    mobx_react_1.observer
], ChartEditorPage);
exports.ChartEditorPage = ChartEditorPage;
//# sourceMappingURL=ChartEditorPage.js.map