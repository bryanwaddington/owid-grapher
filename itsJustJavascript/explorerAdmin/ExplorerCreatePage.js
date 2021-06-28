"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ExplorerCreatePage = void 0;
const mobx_react_1 = require("mobx-react");
const react_1 = __importDefault(require("react"));
const react_2 = require("@handsontable/react");
const mobx_1 = require("mobx");
const ExplorerProgram_1 = require("../explorer/ExplorerProgram");
const GitCmsClient_1 = require("../gitCms/GitCmsClient");
const react_router_dom_1 = require("react-router-dom");
const Util_1 = require("../clientUtils/Util");
const LoadingIndicator_1 = require("../grapher/loadingIndicator/LoadingIndicator");
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
const ExplorerCommands_1 = require("./ExplorerCommands");
const GrammarUtils_1 = require("../gridLang/GrammarUtils");
const classnames_1 = __importDefault(require("classnames"));
const GitCmsConstants_1 = require("../gitCms/GitCmsConstants");
const RESERVED_NAMES = [ExplorerConstants_1.DefaultNewExplorerSlug, "index", "new", "create"]; // don't allow authors to save explorers with these names, otherwise might create some annoying situations.
let ExplorerCreatePage = class ExplorerCreatePage extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.isReady = false;
        this.gitCmsClient = new GitCmsClient_1.GitCmsClient(GitCmsConstants_1.GIT_CMS_BASE_ROUTE);
        this.programOnDisk = new ExplorerProgram_1.ExplorerProgram("", "");
        this.program = new ExplorerProgram_1.ExplorerProgram(this.props.slug, "");
        this.gitCmsBranchName = this.props.gitCmsBranchName;
    }
    get manager() {
        var _a;
        return (_a = this.props.manager) !== null && _a !== void 0 ? _a : {};
    }
    loadingModalOff() {
        this.manager.loadingIndicatorSetting = "off";
    }
    loadingModalOn() {
        this.manager.loadingIndicatorSetting = "loading";
    }
    resetLoadingModal() {
        this.manager.loadingIndicatorSetting = "default";
    }
    componentDidMount() {
        this.loadingModalOff();
        Util_1.exposeInstanceOnWindow(this, "explorerEditor");
        if (this.props.doNotFetch)
            return;
        this.fetchExplorerProgramOnLoad();
        this.startPollingLocalStorageForPreviewChanges();
    }
    startPollingLocalStorageForPreviewChanges() {
        setInterval(() => {
            const savedQueryParamsJSON = localStorage.getItem(`${ExplorerConstants_1.UNSAVED_EXPLORER_PREVIEW_QUERYPARAMS}${this.program.slug}`);
            if (typeof savedQueryParamsJSON === "string")
                this.program.decisionMatrix.setValuesFromChoiceParams(JSON.parse(savedQueryParamsJSON));
        }, 1000);
    }
    componentWillUnmount() {
        this.resetLoadingModal();
    }
    fetchExplorerProgramOnLoad() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { slug } = this.props;
            const response = yield this.gitCmsClient.readRemoteFile({
                filepath: ExplorerProgram_1.makeFullPath(slug),
            });
            this.programOnDisk = new ExplorerProgram_1.ExplorerProgram("", (_a = response.content) !== null && _a !== void 0 ? _a : "");
            this.setProgram((_b = this.draftIfAny) !== null && _b !== void 0 ? _b : this.programOnDisk.toString());
            this.isReady = true;
            if (this.isModified)
                alert(`Your browser has a changed draft of '${slug}'. If you want to clear your local changes, click the "Clear Changes" button in the top right.`);
        });
    }
    setProgram(code) {
        this.program = new ExplorerProgram_1.ExplorerProgram(this.program.slug, code);
        this.saveDraft(code);
    }
    saveDraft(code) {
        localStorage.setItem(ExplorerConstants_1.UNSAVED_EXPLORER_DRAFT + this.program.slug, code);
    }
    get draftIfAny() {
        return localStorage.getItem(ExplorerConstants_1.UNSAVED_EXPLORER_DRAFT + this.program.slug);
    }
    clearDraft() {
        localStorage.removeItem(ExplorerConstants_1.UNSAVED_EXPLORER_DRAFT + this.program.slug);
    }
    _save(slug, commitMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadingModalOn();
            this.program.slug = slug;
            yield this.gitCmsClient.writeRemoteFile({
                filepath: this.program.fullPath,
                content: this.program.toString(),
                commitMessage,
            });
            this.loadingModalOff();
            this.programOnDisk = new ExplorerProgram_1.ExplorerProgram("", this.program.toString());
            this.setProgram(this.programOnDisk.toString());
            this.clearDraft();
        });
    }
    saveAs() {
        return __awaiter(this, void 0, void 0, function* () {
            const userSlug = prompt(`Create a slug (URL friendly name) for this explorer. Your new file will be pushed to the '${this.props.gitCmsBranchName}' branch on GitHub.`, this.program.slug);
            if (!userSlug)
                return;
            const slug = Util_1.slugify(userSlug);
            if (!slug) {
                alert(`'${slug}' is not a valid slug`);
                return;
            }
            if (new Set(RESERVED_NAMES).has(slug.toLowerCase())) {
                alert(`Cannot save '${userSlug}' because that is one of the reserved names: ${RESERVED_NAMES.join(", ")}`);
                return;
            }
            yield this._save(slug, `Saving ${this.program.slug} as ${slug}`);
            window.location.href = slug;
        });
    }
    clearChanges() {
        if (!confirm("Are you sure you want to clear your local changes?"))
            return;
        this.setProgram(this.programOnDisk.toString());
        this.clearDraft();
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const commitMessage = prompt(`Enter a message describing this change. Your change will be pushed to the '${this.props.gitCmsBranchName}' on GitHub.`, `Updated ${this.program.slug}`);
            if (!commitMessage)
                return;
            yield this._save(this.program.slug, commitMessage);
        });
    }
    get isModified() {
        return this.programOnDisk.toString() !== this.program.toString();
    }
    onSave() {
        if (this.program.isNewFile)
            this.saveAs();
        else if (this.isModified)
            this.save();
    }
    render() {
        if (!this.isReady)
            return react_1.default.createElement(LoadingIndicator_1.LoadingIndicator, null);
        const { program, isModified } = this;
        const { isNewFile, slug } = program;
        const previewLink = `/admin/${ExplorerConstants_1.EXPLORERS_PREVIEW_ROUTE}/${slug}`;
        const buttons = [];
        buttons.push(react_1.default.createElement("button", { key: "save", disabled: !isModified && !isNewFile, className: classnames_1.default("btn", "btn-primary"), onClick: this.onSave, title: "Saves file to disk, commits and pushes to GitHub" }, "Save"));
        buttons.push(react_1.default.createElement("button", { key: "saveAs", disabled: isNewFile, title: isNewFile
                ? "You need to save this file first."
                : "Saves file to disk, commits and pushes to GitHub", className: classnames_1.default("btn", "btn-secondary"), onClick: this.saveAs }, "Save As"));
        buttons.push(react_1.default.createElement("button", { key: "clear", disabled: !isModified, title: isModified ? "" : "No changes", className: classnames_1.default("btn", "btn-secondary"), onClick: this.clearChanges }, "Clear Changes"));
        const modifiedMessage = isModified
            ? "Are you sure you want to leave? You have unsaved changes."
            : ""; // todo: provide an explanation of how many cells are modified.
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(react_router_dom_1.Prompt, { when: isModified, message: modifiedMessage }),
            react_1.default.createElement("main", { style: {
                    padding: 0,
                    position: "relative",
                } },
                react_1.default.createElement("div", { className: "ExplorerCreatePageHeader" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(TemplatesComponent, { onChange: this.setProgram, isNewFile: isNewFile })),
                    react_1.default.createElement("div", { style: { textAlign: "right" } }, buttons)),
                react_1.default.createElement(HotEditor, { onChange: this.setProgram, program: program, programOnDisk: this.programOnDisk }),
                react_1.default.createElement(PictureInPicture, { previewLink: previewLink }),
                react_1.default.createElement("a", { className: "PreviewLink", href: previewLink }, "Visit preview"))));
    }
};
__decorate([
    mobx_1.computed
], ExplorerCreatePage.prototype, "manager", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "loadingModalOff", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "loadingModalOn", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "resetLoadingModal", null);
__decorate([
    mobx_1.action
], ExplorerCreatePage.prototype, "componentDidMount", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "startPollingLocalStorageForPreviewChanges", null);
__decorate([
    mobx_1.observable
], ExplorerCreatePage.prototype, "isReady", void 0);
__decorate([
    mobx_1.action
], ExplorerCreatePage.prototype, "componentWillUnmount", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "fetchExplorerProgramOnLoad", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "setProgram", null);
__decorate([
    mobx_1.observable.ref
], ExplorerCreatePage.prototype, "programOnDisk", void 0);
__decorate([
    mobx_1.observable.ref
], ExplorerCreatePage.prototype, "program", void 0);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "_save", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "saveAs", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "clearChanges", null);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "save", null);
__decorate([
    mobx_1.computed
], ExplorerCreatePage.prototype, "isModified", null);
__decorate([
    mobx_1.observable
], ExplorerCreatePage.prototype, "gitCmsBranchName", void 0);
__decorate([
    mobx_1.action.bound
], ExplorerCreatePage.prototype, "onSave", null);
ExplorerCreatePage = __decorate([
    mobx_react_1.observer
], ExplorerCreatePage);
exports.ExplorerCreatePage = ExplorerCreatePage;
class HotEditor extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.hotTableComponent = react_1.default.createRef();
    }
    get program() {
        return this.props.program;
    }
    get programOnDisk() {
        return this.props.programOnDisk;
    }
    updateProgramFromHot() {
        var _a;
        const newVersion = (_a = this.hotTableComponent.current) === null || _a === void 0 ? void 0 : _a.hotInstance.getData();
        if (!newVersion)
            return;
        const newProgram = ExplorerProgram_1.ExplorerProgram.fromMatrix(this.program.slug, newVersion);
        if (this.program.toString() === newProgram.toString())
            return;
        this.props.onChange(newProgram.toString());
    }
    get hotSettings() {
        const { program, programOnDisk } = this;
        const data = program.asArrays;
        const { currentlySelectedGrapherRow } = program;
        const cells = function (row, column) {
            var _a;
            const { comment, cssClasses, optionKeywords, placeholder, contents, } = program.getCell({ row, column });
            const cellContentsOnDisk = programOnDisk.getCellContents({
                row,
                column,
            });
            const cellProperties = {};
            const allClasses = (_a = cssClasses === null || cssClasses === void 0 ? void 0 : cssClasses.slice()) !== null && _a !== void 0 ? _a : [];
            if (cellContentsOnDisk !== contents) {
                if (contents === "" && cellContentsOnDisk === undefined)
                    allClasses.push("cellCreated");
                else if (GrammarUtils_1.isEmpty(contents))
                    allClasses.push("cellDeleted");
                else if (GrammarUtils_1.isEmpty(cellContentsOnDisk))
                    allClasses.push("cellCreated");
                else
                    allClasses.push("cellChanged");
            }
            if (currentlySelectedGrapherRow === row && column)
                allClasses.push(`currentlySelectedGrapherRow`);
            cellProperties.className = allClasses.join(" ");
            cellProperties.comment = comment ? { value: comment } : undefined;
            cellProperties.placeholder = placeholder;
            if (optionKeywords && optionKeywords.length) {
                cellProperties.type = "autocomplete";
                cellProperties.source = optionKeywords;
            }
            return cellProperties;
        };
        const hotSettings = {
            afterChange: () => this.updateProgramFromHot(),
            afterRemoveRow: () => this.updateProgramFromHot(),
            afterRemoveCol: () => this.updateProgramFromHot(),
            allowInsertColumn: false,
            allowInsertRow: true,
            autoRowSize: false,
            autoColumnSize: false,
            cells,
            colHeaders: true,
            comments: true,
            contextMenu: {
                items: {
                    AutofillColDefCommand: new ExplorerCommands_1.AutofillColDefCommand(program, (newProgram) => this.props.onChange(newProgram)).toHotCommand(),
                    InlineDataCommand: new ExplorerCommands_1.InlineDataCommand(program, (newProgram) => this.props.onChange(newProgram)).toHotCommand(),
                    SelectAllHitsCommand: new ExplorerCommands_1.SelectAllHitsCommand(program).toHotCommand(),
                    sp0: { name: "---------" },
                    row_above: {},
                    row_below: {},
                    sp1: { name: "---------" },
                    remove_row: {},
                    remove_col: {},
                    sp2: { name: "---------" },
                    undo: {},
                    redo: {},
                    sp3: { name: "---------" },
                    copy: {},
                    cut: {},
                },
            },
            data,
            height: "100%",
            manualColumnResize: true,
            manualRowMove: true,
            minCols: program.width + 3,
            minSpareCols: 2,
            minRows: 40,
            minSpareRows: 20,
            rowHeaders: true,
            search: true,
            stretchH: "all",
            width: "100%",
            wordWrap: false,
        };
        return hotSettings;
    }
    render() {
        return (react_1.default.createElement(react_2.HotTable, { settings: this.hotSettings, ref: this.hotTableComponent, licenseKey: "non-commercial-and-evaluation" }));
    }
}
__decorate([
    mobx_1.computed
], HotEditor.prototype, "program", null);
__decorate([
    mobx_1.computed
], HotEditor.prototype, "programOnDisk", null);
__decorate([
    mobx_1.action.bound
], HotEditor.prototype, "updateProgramFromHot", null);
class PictureInPicture extends react_1.default.Component {
    render() {
        return (react_1.default.createElement("iframe", { src: this.props.previewLink, className: "ExplorerPipPreview" }));
    }
}
class TemplatesComponent extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.templates = [];
        this.gitCmsClient = new GitCmsClient_1.GitCmsClient(GitCmsConstants_1.GIT_CMS_BASE_ROUTE);
    }
    loadTemplate(filename) {
        this.props.onChange(this.templates.find((template) => template.filename === filename)
            .content);
    }
    componentDidMount() {
        if (this.props.isNewFile)
            this.fetchTemplatesOnLoad();
    }
    fetchTemplatesOnLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.gitCmsClient.readRemoteFiles({
                glob: "*template*",
                folder: "explorers",
            });
            this.templates = response.files;
        });
    }
    render() {
        return this.templates.map((template) => (react_1.default.createElement("button", { className: classnames_1.default("btn", "btn-primary"), key: template.filename, onClick: () => this.loadTemplate(template.filename) }, template.filename
            .replace(ExplorerProgram_1.EXPLORER_FILE_SUFFIX, "")
            .replace("-", " "))));
    }
}
__decorate([
    mobx_1.action.bound
], TemplatesComponent.prototype, "loadTemplate", null);
__decorate([
    mobx_1.observable.ref
], TemplatesComponent.prototype, "templates", void 0);
__decorate([
    mobx_1.action.bound
], TemplatesComponent.prototype, "fetchTemplatesOnLoad", null);
//# sourceMappingURL=ExplorerCreatePage.js.map