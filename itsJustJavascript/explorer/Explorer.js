"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Explorer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explorer = void 0;
const react_1 = __importDefault(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const ExplorerControls_1 = require("../explorer/ExplorerControls");
const react_dom_1 = __importDefault(require("react-dom"));
const ExplorerProgram_1 = require("../explorer/ExplorerProgram");
const Grapher_1 = require("../grapher/core/Grapher");
const Util_1 = require("../clientUtils/Util");
const SlideShowController_1 = require("../grapher/slideshowController/SlideShowController");
const ExplorerConstants_1 = require("./ExplorerConstants");
const SelectionArray_1 = require("../grapher/selection/SelectionArray");
const ErrorValues_1 = require("../coreTable/ErrorValues");
const Bounds_1 = require("../clientUtils/Bounds");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faChartLine_1 = require("@fortawesome/free-solid-svg-icons/faChartLine");
const EntityPicker_1 = require("../grapher/controls/entityPicker/EntityPicker");
const classnames_1 = __importDefault(require("classnames"));
const CoreColumnDef_1 = require("../coreTable/CoreColumnDef");
const OwidTable_1 = require("../coreTable/OwidTable");
const clientSettings_1 = require("../settings/clientSettings");
const ExplorerUrlMigrations_1 = require("./urlMigrations/ExplorerUrlMigrations");
const Url_1 = require("../clientUtils/urls/Url");
const EntityUrlBuilder_1 = require("../grapher/core/EntityUrlBuilder");
const PromiseCache_1 = require("../clientUtils/PromiseCache");
const PromiseSwitcher_1 = require("../clientUtils/PromiseSwitcher");
const renderLivePreviewVersion = (props) => {
    let renderedVersion;
    setInterval(() => {
        var _a;
        const versionToRender = (_a = localStorage.getItem(ExplorerConstants_1.UNSAVED_EXPLORER_DRAFT + props.slug)) !== null && _a !== void 0 ? _a : props.program;
        if (versionToRender === renderedVersion)
            return;
        const newProps = Object.assign(Object.assign({}, props), { program: versionToRender });
        react_dom_1.default.render(react_1.default.createElement(Explorer, Object.assign({}, newProps, { queryStr: window.location.search, key: Date.now() })), document.getElementById(ExplorerConstants_1.ExplorerContainerId));
        renderedVersion = versionToRender;
    }, 1000);
};
const isNarrow = () => window.screen.width < 450 || document.documentElement.clientWidth <= 800;
let Explorer = Explorer_1 = class Explorer extends react_1.default.Component {
    constructor() {
        var _a, _b;
        super(...arguments);
        this.initialQueryParams = Url_1.Url.fromQueryStr((_a = this.props.queryStr) !== null && _a !== void 0 ? _a : "")
            .queryParams;
        this.explorerProgram = ExplorerProgram_1.ExplorerProgram.fromJson(this.props).initDecisionMatrix(this.initialQueryParams);
        // only used for the checkbox at the bottom of the embed dialog
        this.embedDialogHideControls = true;
        this.selection = (_b = this.props.selection) !== null && _b !== void 0 ? _b : new SelectionArray_1.SelectionArray(this.explorerProgram.selection, undefined, this.explorerProgram.entityType);
        this.persistedGrapherQueryParamsBySelectedRow = new Map();
        this.futureGrapherTable = new PromiseSwitcher_1.PromiseSwitcher({
            onResolve: (table) => this.setGrapherTable(table),
            onReject: (error) => { var _a; return (_a = this.grapher) === null || _a === void 0 ? void 0 : _a.setError(error); },
        });
        this.tableLoader = new PromiseCache_1.PromiseCache((slug) => this.explorerProgram.constructTable(slug));
        this.onChangeChoice = (choiceTitle) => (value) => {
            const { currentlySelectedGrapherRow } = this.explorerProgram;
            this.explorerProgram.decisionMatrix.setValueCommand(choiceTitle, value);
            if (currentlySelectedGrapherRow)
                this.reactToUserChangingSelection(currentlySelectedGrapherRow);
        };
        this.isNarrow = isNarrow();
        this.grapherContainerRef = react_1.default.createRef();
        this.grapherBounds = Bounds_1.DEFAULT_BOUNDS;
        this.grapherRef = react_1.default.createRef();
        this.showMobileControlsPopup = false;
        this.entityPickerMetric = this.initialQueryParams.pickerMetric;
        this.entityPickerSort = this.initialQueryParams.pickerSort;
        this.entityPickerTableIsLoading = false;
        this.futureEntityPickerTable = new PromiseSwitcher_1.PromiseSwitcher({
            onResolve: (table) => {
                this.entityPickerTable = table;
                this.entityPickerTableIsLoading = false;
            },
            onReject: () => {
                this.entityPickerTableIsLoading = false;
            },
        });
    }
    // caution: do a ctrl+f to find untyped usages
    static renderSingleExplorerOnExplorerPage(program, grapherConfigs, urlMigrationSpec) {
        const props = Object.assign(Object.assign({}, program), { grapherConfigs, isEmbeddedInAnOwidPage: false, isInStandalonePage: true });
        if (window.location.href.includes(ExplorerConstants_1.EXPLORERS_PREVIEW_ROUTE)) {
            renderLivePreviewVersion(props);
            return;
        }
        let url = Url_1.Url.fromURL(window.location.href);
        // Handle redirect spec that's baked on the page.
        // e.g. the old COVID Grapher to Explorer redirects are implemented this way.
        if (urlMigrationSpec) {
            const { explorerUrlMigrationId, baseQueryStr } = urlMigrationSpec;
            const migration = ExplorerUrlMigrations_1.explorerUrlMigrationsById[explorerUrlMigrationId];
            if (migration) {
                url = migration.migrateUrl(url, baseQueryStr);
            }
            else {
                console.error(`No explorer URL migration with id ${explorerUrlMigrationId}`);
            }
        }
        // Handle explorer-specific migrations.
        // This is how we migrate the old CO2 explorer to the new CO2 explorer.
        // Because they are on the same path, we can't handle it like we handle
        // the COVID explorer redirects above.
        url = ExplorerUrlMigrations_1.migrateExplorerUrl(url);
        // Update the window URL
        Url_1.setWindowUrl(url);
        react_dom_1.default.render(react_1.default.createElement(Explorer_1, Object.assign({}, props, { queryStr: url.queryStr })), document.getElementById(ExplorerConstants_1.ExplorerContainerId));
    }
    setGrapher(grapher) {
        this.grapher = grapher;
    }
    get grapherConfigs() {
        const arr = this.props.grapherConfigs || [];
        const grapherConfigsMap = new Map();
        arr.forEach((config) => grapherConfigsMap.set(config.id, config));
        return grapherConfigsMap;
    }
    componentDidMount() {
        var _a, _b;
        this.setGrapher(this.grapherRef.current);
        this.updateGrapherFromExplorer();
        this.updateEntityPickerTable();
        let url = Url_1.Url.fromQueryParams(this.initialQueryParams);
        if ((_a = this.props.selection) === null || _a === void 0 ? void 0 : _a.hasSelection) {
            url = EntityUrlBuilder_1.setSelectedEntityNamesParam(url, this.props.selection.selectedEntityNames);
        }
        (_b = this.grapher) === null || _b === void 0 ? void 0 : _b.populateFromQueryParams(url.queryParams);
        Util_1.exposeInstanceOnWindow(this, "explorer");
        this.onResizeThrottled = Util_1.throttle(this.onResize, 100);
        window.addEventListener("resize", this.onResizeThrottled);
        this.onResize(); // call resize for the first time to initialize chart
        if (this.props.isInStandalonePage)
            this.bindToWindow();
    }
    componentWillUnmount() {
        if (this.onResizeThrottled)
            window.removeEventListener("resize", this.onResizeThrottled);
    }
    initSlideshow() {
        const grapher = this.grapher;
        if (!grapher || grapher.slideShow)
            return;
        grapher.slideShow = new SlideShowController_1.SlideShowController(this.explorerProgram.decisionMatrix.allDecisionsAsQueryParams(), 0, this);
    }
    // todo: break this method up and unit test more. this is pretty ugly right now.
    reactToUserChangingSelection(oldSelectedRow) {
        if (!this.grapher || !this.explorerProgram.currentlySelectedGrapherRow)
            return; // todo: can we remove this?
        this.initSlideshow();
        const oldGrapherParams = this.grapher.changedParams;
        this.persistedGrapherQueryParamsBySelectedRow.set(oldSelectedRow, oldGrapherParams);
        const newGrapherParams = Object.assign(Object.assign({}, this.persistedGrapherQueryParamsBySelectedRow.get(this.explorerProgram.currentlySelectedGrapherRow)), { time: this.grapher.timeParam });
        this.updateGrapherFromExplorer();
        this.grapher.populateFromQueryParams(newGrapherParams);
    }
    setGrapherTable(table) {
        if (this.grapher) {
            this.grapher.inputTable = table;
            this.grapher.appendNewEntitySelectionOptions();
        }
    }
    updateGrapherFromExplorer() {
        var _a, _b;
        const grapher = this.grapher;
        if (!grapher)
            return;
        const grapherConfigFromExplorer = this.explorerProgram.grapherConfig;
        const { grapherId, tableSlug, yScaleToggle, yAxisMin, facetYRange, } = grapherConfigFromExplorer;
        const hasGrapherId = grapherId && ErrorValues_1.isNotErrorValue(grapherId);
        const grapherConfig = hasGrapherId
            ? (_a = this.grapherConfigs.get(grapherId)) !== null && _a !== void 0 ? _a : {}
            : {};
        const config = Object.assign(Object.assign(Object.assign({}, grapherConfig), grapherConfigFromExplorer), { hideEntityControls: this.showExplorerControls, manuallyProvideData: tableSlug ? true : false });
        grapher.setAuthoredVersion(config);
        grapher.reset();
        grapher.yAxis.canChangeScaleType = yScaleToggle;
        grapher.yAxis.min = yAxisMin;
        if (facetYRange) {
            grapher.yAxis.facetAxisRange = facetYRange;
        }
        grapher.updateFromObject(config);
        if (!hasGrapherId) {
            // Clear any error messages, they are likely to be related to dataset loading.
            (_b = this.grapher) === null || _b === void 0 ? void 0 : _b.clearErrors();
            // Set a table immediately. A BlankTable shows a loading animation.
            this.setGrapherTable(OwidTable_1.BlankOwidTable(tableSlug, `Loading table '${tableSlug}'`));
            this.futureGrapherTable.set(this.tableLoader.get(tableSlug));
            grapher.id = 0;
        }
        // Download data if this is a Grapher ID inside the Explorer specification
        grapher.downloadData();
        grapher.slug = this.explorerProgram.slug;
        if (this.downloadDataLink)
            grapher.externalCsvLink = this.downloadDataLink;
    }
    setSlide(choiceParams) {
        this.explorerProgram.decisionMatrix.setValuesFromChoiceParams(choiceParams);
    }
    get currentChoiceParams() {
        const { decisionMatrix } = this.explorerProgram;
        return decisionMatrix.currentParams;
    }
    get queryParams() {
        if (!this.grapher)
            return {};
        if (window.location.href.includes(ExplorerConstants_1.EXPLORERS_PREVIEW_ROUTE))
            localStorage.setItem(ExplorerConstants_1.UNSAVED_EXPLORER_PREVIEW_QUERYPARAMS +
                this.explorerProgram.slug, JSON.stringify(this.currentChoiceParams));
        let url = Url_1.Url.fromQueryParams(Util_1.omitUndefinedValues(Object.assign(Object.assign(Object.assign({}, this.grapher.changedParams), { pickerSort: this.entityPickerSort, pickerMetric: this.entityPickerMetric, hideControls: this.initialQueryParams.hideControls || undefined }), this.currentChoiceParams)));
        url = EntityUrlBuilder_1.setSelectedEntityNamesParam(url, this.selection.hasSelection
            ? this.selection.selectedEntityNames
            : undefined);
        return url.queryParams;
    }
    get currentUrl() {
        return Url_1.Url.fromURL(this.baseUrl).setQueryParams(this.queryParams);
    }
    bindToWindow() {
        // There is a surprisingly considerable performance overhead to updating the url
        // while animating, so we debounce to allow e.g. smoother timelines
        const pushParams = () => Url_1.setWindowUrl(this.currentUrl);
        const debouncedPushParams = Util_1.debounce(pushParams, 100);
        mobx_1.reaction(() => this.queryParams, () => {
            var _a;
            return ((_a = this.grapher) === null || _a === void 0 ? void 0 : _a.debounceMode)
                ? debouncedPushParams()
                : pushParams();
        });
    }
    get panels() {
        return this.explorerProgram.decisionMatrix.choicesWithAvailability.map((choice) => (react_1.default.createElement(ExplorerControls_1.ExplorerControlPanel, { key: choice.title, explorerSlug: this.explorerProgram.slug, choice: choice, onChange: this.onChangeChoice(choice.title), isMobile: this.isNarrow })));
    }
    renderHeaderElement() {
        return (react_1.default.createElement("div", { className: "ExplorerHeaderBox" },
            react_1.default.createElement("div", null),
            react_1.default.createElement("div", { className: "ExplorerTitle" }, this.explorerProgram.explorerTitle),
            react_1.default.createElement("div", { className: "ExplorerSubtitle", dangerouslySetInnerHTML: {
                    __html: this.explorerProgram.explorerSubtitle || "",
                } })));
    }
    get isInIFrame() {
        return Util_1.isInIFrame();
    }
    get showExplorerControls() {
        if (!this.props.isEmbeddedInAnOwidPage && !this.isInIFrame)
            return true;
        // Only allow hiding controls on embedded pages
        return !(this.explorerProgram.hideControls ||
            this.initialQueryParams.hideControls === "true");
    }
    get downloadDataLink() {
        return this.explorerProgram.downloadDataLink;
    }
    renderControlBar() {
        return (react_1.default.createElement(ExplorerControls_1.ExplorerControlBar, { isMobile: this.isNarrow, showControls: this.showMobileControlsPopup, closeControls: this.closeControls }, this.panels));
    }
    renderEntityPicker() {
        return (react_1.default.createElement(EntityPicker_1.EntityPicker, { key: "entityPicker", manager: this, isDropdownMenu: this.isNarrow }));
    }
    toggleMobileControls() {
        this.showMobileControlsPopup = !this.showMobileControlsPopup;
    }
    onResize() {
        this.isNarrow = isNarrow();
        this.grapherBounds = this.getGrapherBounds() || this.grapherBounds;
    }
    // Todo: add better logic to maximize the size of the Grapher
    getGrapherBounds() {
        const grapherContainer = this.grapherContainerRef.current;
        return grapherContainer
            ? new Bounds_1.Bounds(0, 0, grapherContainer.clientWidth, grapherContainer.clientHeight)
            : undefined;
    }
    get mobileCustomizeButton() {
        return (react_1.default.createElement("a", { className: "btn btn-primary mobile-button", onClick: this.toggleMobileControls, "data-track-note": "covid-customize-chart" },
            react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faChartLine_1.faChartLine }),
            " Customize chart"));
    }
    closeControls() {
        this.showMobileControlsPopup = false;
    }
    // todo: add tests for this and better tests for this class in general
    get showHeaderElement() {
        return (this.showExplorerControls &&
            this.explorerProgram.explorerTitle &&
            this.panels.length > 0);
    }
    render() {
        const { showExplorerControls, showHeaderElement } = this;
        return (react_1.default.createElement("div", { className: classnames_1.default({
                Explorer: true,
                "mobile-explorer": this.isNarrow,
                HideControls: !showExplorerControls,
                "is-embed": this.props.isEmbeddedInAnOwidPage,
            }) },
            showHeaderElement && this.renderHeaderElement(),
            showHeaderElement && this.renderControlBar(),
            showExplorerControls && this.renderEntityPicker(),
            showExplorerControls &&
                this.isNarrow &&
                this.mobileCustomizeButton,
            react_1.default.createElement("div", { className: "ExplorerFigure", ref: this.grapherContainerRef },
                react_1.default.createElement(Grapher_1.Grapher, { bounds: this.grapherBounds, enableKeyboardShortcuts: true, manager: this, ref: this.grapherRef }))));
    }
    get editUrl() {
        return `${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/${this.props.slug}`;
    }
    get baseUrl() {
        return `${clientSettings_1.BAKED_BASE_URL}/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/${this.props.slug}`;
    }
    get canonicalUrl() {
        var _a;
        return (_a = this.props.canonicalUrl) !== null && _a !== void 0 ? _a : this.currentUrl.fullUrl;
    }
    get embedDialogUrl() {
        return this.currentUrl.updateQueryParams({
            hideControls: this.embedDialogHideControls.toString(),
        }).fullUrl;
    }
    embedDialogToggleHideControls() {
        this.embedDialogHideControls = !this.embedDialogHideControls;
    }
    get embedDialogAdditionalElements() {
        return (react_1.default.createElement("div", { style: { marginTop: ".5rem" } },
            react_1.default.createElement("label", null,
                react_1.default.createElement("input", { type: "checkbox", checked: this.embedDialogHideControls, onChange: this.embedDialogToggleHideControls }),
                " ",
                "Hide controls")));
    }
    get grapherTable() {
        var _a;
        return (_a = this.grapher) === null || _a === void 0 ? void 0 : _a.tableAfterAuthorTimelineFilter;
    }
    updateEntityPickerTable() {
        if (this.entityPickerMetric) {
            this.entityPickerTableIsLoading = true;
            this.futureEntityPickerTable.set(this.tableLoader.get(this.getTableSlugOfColumnSlug(this.entityPickerMetric)));
        }
    }
    setEntityPicker({ metric, sort, } = {}) {
        if (metric)
            this.entityPickerMetric = metric;
        if (sort)
            this.entityPickerSort = sort;
        this.updateEntityPickerTable();
    }
    tableSlugHasColumnSlug(tableSlug, columnSlug) {
        var _a;
        const columnDefsByTableSlug = this.explorerProgram.columnDefsByTableSlug;
        return !!((_a = columnDefsByTableSlug
            .get(tableSlug)) === null || _a === void 0 ? void 0 : _a.find((def) => def.slug === columnSlug));
    }
    getTableSlugOfColumnSlug(columnSlug) {
        // In most cases, column slugs will be duplicated in the tables, e.g. entityName.
        // Prefer the current Grapher table if it contains the column slug.
        const grapherTableSlug = this.explorerProgram.grapherConfig.tableSlug;
        if (this.tableSlugHasColumnSlug(grapherTableSlug, columnSlug)) {
            return grapherTableSlug;
        }
        // ...otherwise, search all tables for the column slug
        return this.explorerProgram.tableSlugs.find((tableSlug) => this.tableSlugHasColumnSlug(tableSlug, columnSlug));
    }
    get entityPickerColumnDefs() {
        const allColumnDefs = Util_1.uniqBy(Util_1.flatten(Array.from(this.explorerProgram.columnDefsByTableSlug.values())), (def) => def.slug);
        if (this.explorerProgram.pickerColumnSlugs) {
            const columnDefsBySlug = Util_1.keyMap(allColumnDefs, (def) => def.slug);
            // Preserve the order of columns in the Explorer `pickerColumnSlugs`
            return Util_1.excludeUndefined(this.explorerProgram.pickerColumnSlugs.map((slug) => columnDefsBySlug.get(slug)));
        }
        else {
            const discardColumnTypes = new Set([
                CoreColumnDef_1.ColumnTypeNames.Year,
                CoreColumnDef_1.ColumnTypeNames.Date,
                CoreColumnDef_1.ColumnTypeNames.Day,
                CoreColumnDef_1.ColumnTypeNames.EntityId,
                CoreColumnDef_1.ColumnTypeNames.EntityCode,
            ]);
            return allColumnDefs.filter((def) => def.type === undefined || !discardColumnTypes.has(def.type));
        }
    }
    get requiredColumnSlugs() {
        var _a, _b;
        return (_b = (_a = this.grapher) === null || _a === void 0 ? void 0 : _a.newSlugs) !== null && _b !== void 0 ? _b : [];
    }
};
__decorate([
    mobx_1.observable
], Explorer.prototype, "embedDialogHideControls", void 0);
__decorate([
    mobx_1.observable.ref
], Explorer.prototype, "grapher", void 0);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "setGrapher", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "grapherConfigs", null);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "reactToUserChangingSelection", null);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "setGrapherTable", null);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "updateGrapherFromExplorer", null);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "setSlide", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "currentChoiceParams", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "queryParams", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "currentUrl", null);
__decorate([
    mobx_1.observable
], Explorer.prototype, "isNarrow", void 0);
__decorate([
    mobx_1.computed
], Explorer.prototype, "isInIFrame", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "showExplorerControls", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "downloadDataLink", null);
__decorate([
    mobx_1.observable
], Explorer.prototype, "grapherContainerRef", void 0);
__decorate([
    mobx_1.observable.ref
], Explorer.prototype, "grapherBounds", void 0);
__decorate([
    mobx_1.observable.ref
], Explorer.prototype, "grapherRef", void 0);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "toggleMobileControls", null);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "onResize", null);
__decorate([
    mobx_1.observable
], Explorer.prototype, "showMobileControlsPopup", void 0);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "closeControls", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "showHeaderElement", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "editUrl", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "baseUrl", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "canonicalUrl", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "embedDialogUrl", null);
__decorate([
    mobx_1.action.bound
], Explorer.prototype, "embedDialogToggleHideControls", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "embedDialogAdditionalElements", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "grapherTable", null);
__decorate([
    mobx_1.observable
], Explorer.prototype, "entityPickerMetric", void 0);
__decorate([
    mobx_1.observable
], Explorer.prototype, "entityPickerSort", void 0);
__decorate([
    mobx_1.observable.ref
], Explorer.prototype, "entityPickerTable", void 0);
__decorate([
    mobx_1.observable.ref
], Explorer.prototype, "entityPickerTableIsLoading", void 0);
__decorate([
    mobx_1.computed
], Explorer.prototype, "entityPickerColumnDefs", null);
__decorate([
    mobx_1.computed
], Explorer.prototype, "requiredColumnSlugs", null);
Explorer = Explorer_1 = __decorate([
    mobx_react_1.observer
], Explorer);
exports.Explorer = Explorer;
//# sourceMappingURL=Explorer.js.map