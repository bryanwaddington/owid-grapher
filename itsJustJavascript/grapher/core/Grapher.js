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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Grapher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessageRelatedQuestionUrl = exports.Grapher = void 0;
const React = __importStar(require("react"));
const ReactDOMServer = __importStar(require("react-dom/server"));
const mobx_1 = require("mobx");
const decko_1 = require("decko");
const Util_1 = require("../../clientUtils/Util");
const GrapherConstants_1 = require("../core/GrapherConstants");
const Cookies = __importStar(require("js-cookie"));
const ChartDimension_1 = require("../chart/ChartDimension");
const Bounds_1 = require("../../clientUtils/Bounds");
const TimeBounds_1 = require("../../clientUtils/TimeBounds");
const UrlUtils_1 = require("../../clientUtils/urls/UrlUtils");
const PopulationMap_1 = require("../../coreTable/PopulationMap");
const GrapherInterface_1 = require("../core/GrapherInterface");
const DimensionSlot_1 = require("../chart/DimensionSlot");
const EntityUrlBuilder_1 = require("./EntityUrlBuilder");
const AxisConfig_1 = require("../axis/AxisConfig");
const ColorScaleConfig_1 = require("../color/ColorScaleConfig");
const MapConfig_1 = require("../mapCharts/MapConfig");
const Persistable_1 = require("../persistable/Persistable");
const EntitiesOnTheMap_1 = require("../mapCharts/EntitiesOnTheMap");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faExclamationTriangle_1 = require("@fortawesome/free-solid-svg-icons/faExclamationTriangle");
const Controls_1 = require("../controls/Controls");
const Tooltip_1 = require("../tooltip/Tooltip");
const EntitySelectorModal_1 = require("../controls/EntitySelectorModal");
const DownloadTab_1 = require("../downloadTab/DownloadTab");
const ReactDOM = __importStar(require("react-dom"));
const mobx_react_1 = require("mobx-react");
require("d3-transition");
const SourcesTab_1 = require("../sourcesTab/SourcesTab");
const DataTable_1 = require("../dataTable/DataTable");
const MapChart_1 = require("../mapCharts/MapChart");
const CommandPalette_1 = require("../controls/CommandPalette");
const CaptionedChart_1 = require("../captionedChart/CaptionedChart");
const TimelineController_1 = require("../timeline/TimelineController");
const OwidTable_1 = require("../../coreTable/OwidTable");
const Mousetrap = __importStar(require("mousetrap"));
const ChartTypeMap_1 = require("../chart/ChartTypeMap");
const SelectionArray_1 = require("../selection/SelectionArray");
const LegacyToOwidTable_1 = require("./LegacyToOwidTable");
const ChartUtils_1 = require("../chart/ChartUtils");
const classnames_1 = __importDefault(require("classnames"));
const GrapherAnalytics_1 = require("./GrapherAnalytics");
const clientSettings_1 = require("../../settings/clientSettings");
const GrapherUrlMigrations_1 = require("./GrapherUrlMigrations");
const Url_1 = require("../../clientUtils/urls/Url");
const CoreTableColumns_1 = require("../../coreTable/CoreTableColumns");
const legacyConfigToConfig = (config) => {
    const legacyConfig = config;
    if (!legacyConfig.selectedData)
        return legacyConfig;
    const newConfig = Object.assign({}, legacyConfig);
    newConfig.selectedEntityIds = Util_1.uniq(legacyConfig.selectedData.map((row) => row.entityId)); // We need to do uniq because an EntityName may appear multiple times in the old graphers, once for each dimension
    return newConfig;
};
const DEFAULT_MS_PER_TICK = 100;
let Grapher = Grapher_1 = class Grapher extends React.Component {
    constructor(propsWithGrapherInstanceGetter = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        super(propsWithGrapherInstanceGetter);
        this.type = GrapherConstants_1.ChartTypeName.LineChart;
        this.id = undefined;
        this.version = 1;
        this.slug = undefined;
        this.title = undefined;
        this.subtitle = "";
        this.sourceDesc = undefined;
        this.note = "";
        this.hideTitleAnnotation = undefined;
        this.minTime = undefined;
        this.maxTime = undefined;
        this.timelineMinTime = undefined;
        this.timelineMaxTime = undefined;
        this.addCountryMode = GrapherConstants_1.EntitySelectionMode.MultipleEntities;
        this.highlightToggle = undefined;
        this.stackMode = GrapherConstants_1.StackMode.absolute;
        this.hideLegend = false;
        this.logo = undefined;
        this.hideLogo = undefined;
        this.hideRelativeToggle = true;
        this.entityType = "country";
        this.entityTypePlural = "countries";
        this.hideTimeline = undefined;
        this.zoomToSelection = undefined;
        this.minPopulationFilter = undefined;
        this.showYearLabels = undefined; // Always show year in labels for bar charts
        this.hasChartTab = true;
        this.hasMapTab = false;
        this.tab = GrapherConstants_1.GrapherTabOption.chart;
        this.overlay = undefined;
        this.internalNotes = "";
        this.variantName = undefined;
        this.originUrl = "";
        this.isPublished = undefined;
        this.baseColorScheme = undefined;
        this.invertColorScheme = undefined;
        this.hideLinesOutsideTolerance = undefined;
        this.hideConnectedScatterLines = undefined; // Hides lines between points when timeline spans multiple years. Requested by core-econ for certain charts
        this.scatterPointLabelStrategy = undefined;
        this.compareEndPointsOnly = undefined;
        this.matchingEntitiesOnly = undefined;
        this.showFacetYRangeToggle = true;
        this.xAxis = new AxisConfig_1.AxisConfig(undefined, this);
        this.yAxis = new AxisConfig_1.AxisConfig(undefined, this);
        this.colorScale = new ColorScaleConfig_1.ColorScaleConfig();
        this.map = new MapConfig_1.MapConfig();
        this.dimensions = [];
        this.ySlugs = undefined;
        this.xSlug = undefined;
        this.colorSlug = undefined;
        this.sizeSlug = undefined;
        this.tableSlugs = undefined;
        this.backgroundSeriesLimit = undefined;
        this.selectedEntityNames = [];
        this.selectedEntityColors = {};
        this.selectedEntityIds = [];
        this.excludedEntities = undefined;
        this.comparisonLines = []; // todo: Persistables?
        this.relatedQuestions = []; // todo: Persistables?
        this.annotation = undefined;
        this.owidDataset = undefined; // This is temporarily used for testing. Will be removed
        this.manuallyProvideData = false; // This will be removed.
        // TODO: Pass these 5 in as options, don't get them as globals.
        this.isDev = this.props.env === "development";
        this.analytics = new GrapherAnalytics_1.GrapherAnalytics((_a = this.props.env) !== null && _a !== void 0 ? _a : "");
        this.isEditor = typeof window !== "undefined" && window.isEditor === true;
        this.bakedGrapherURL = clientSettings_1.BAKED_GRAPHER_URL;
        this.adminBaseUrl = clientSettings_1.ADMIN_BASE_URL;
        this.legacyConfigAsAuthored = {};
        this.isMediaCard = false;
        this.isExportingtoSvgOrPng = false;
        this.isPlaying = false;
        this.isSelectingData = false;
        this.populationFilterToggleOption = 1e6;
        // at startDrag, we want to show the full axis
        this.useTimelineDomains = false;
        this._baseFontSize = GrapherConstants_1.BASE_FONT_SIZE;
        // Keeps a running cache of series colors at the Grapher level.
        this.seriesColorMap = new Map();
        this.externalCsvLink = "";
        this.disposers = [];
        this.popups = [];
        this.base = React.createRef();
        this.hasBeenVisible = false;
        this.selection = (_c = (_b = this.manager) === null || _b === void 0 ? void 0 : _b.selection) !== null && _c !== void 0 ? _c : new SelectionArray_1.SelectionArray((_d = this.props.selectedEntityNames) !== null && _d !== void 0 ? _d : [], (_f = (_e = this.props.table) === null || _e === void 0 ? void 0 : _e.availableEntities) !== null && _f !== void 0 ? _f : []);
        this.disableAutoFaceting = true; // turned off for now
        this._shortcutsBound = false;
        this.isShareMenuActive = false;
        this.debounceMode = false;
        this.msPerTick = DEFAULT_MS_PER_TICK;
        this.timelineController = new TimelineController_1.TimelineController(this);
        // For now I am only exposing this programmatically for the dashboard builder. Setting this to true
        // allows you to still use add country "modes" without showing the buttons in order to prioritize
        // another entity selector over the built in ones.
        this.hideEntityControls = false;
        const { getGrapherInstance } = propsWithGrapherInstanceGetter, props = __rest(propsWithGrapherInstanceGetter, ["getGrapherInstance"]);
        this.inputTable = (_g = props.table) !== null && _g !== void 0 ? _g : OwidTable_1.BlankOwidTable(`initialGrapherTable`);
        const modernConfig = props ? legacyConfigToConfig(props) : props;
        if (props)
            this.setAuthoredVersion(props);
        this.updateFromObject(modernConfig);
        if (!props.table)
            this.downloadData();
        this.populateFromQueryParams(GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams((_h = props.queryStr) !== null && _h !== void 0 ? _h : ""));
        if (this.isEditor)
            this.ensureValidConfigWhenEditing();
        if (getGrapherInstance)
            getGrapherInstance(this); // todo: possibly replace with more idiomatic ref
        this.checkVisibility = Util_1.throttle(this.checkVisibility, 400);
    }
    get dataTableSlugs() {
        return this.tableSlugs ? this.tableSlugs.split(" ") : this.newSlugs;
    }
    /**
     * todo: factor this out and make more RAII.
     *
     * Explorers create 1 Grapher instance, but as the user clicks around the Explorer loads other author created Graphers.
     * But currently some Grapher features depend on knowing how the current state is different than the "authored state".
     * So when an Explorer updates the grapher, it also needs to update this "original state".
     */
    setAuthoredVersion(config) {
        this.legacyConfigAsAuthored = config;
    }
    updateAuthoredVersion(config) {
        this.legacyConfigAsAuthored = Object.assign(Object.assign({}, this.legacyConfigAsAuthored), config);
    }
    toObject() {
        var _a;
        const obj = Persistable_1.objectWithPersistablesToObject(this, GrapherInterface_1.grapherKeysToSerialize);
        if (this.selection.hasSelection)
            obj.selectedEntityNames = this.selection.selectedEntityNames;
        Persistable_1.deleteRuntimeAndUnchangedProps(obj, defaultObject);
        // todo: nulls got into the DB for this one. we can remove after moving Graphers from DB.
        if (obj.stackMode === null)
            delete obj.stackMode;
        // JSON doesn't support Infinity, so we use strings instead.
        if (obj.minTime)
            obj.minTime = TimeBounds_1.minTimeToJSON(this.minTime);
        if (obj.maxTime)
            obj.maxTime = TimeBounds_1.maxTimeToJSON(this.maxTime);
        // todo: remove dimensions concept
        if ((_a = this.legacyConfigAsAuthored) === null || _a === void 0 ? void 0 : _a.dimensions)
            obj.dimensions = this.legacyConfigAsAuthored.dimensions;
        return obj;
    }
    downloadData() {
        if (this.manuallyProvideData) {
        }
        else if (this.owidDataset)
            this._receiveLegacyDataAndApplySelection(this.owidDataset);
        else
            this.downloadLegacyDataFromOwidVariableIds();
    }
    updateFromObject(obj) {
        var _a;
        if (!obj)
            return;
        // we can remove when we purge current graphers which have this set.
        if (obj.stackMode === null)
            delete obj.stackMode;
        Persistable_1.updatePersistables(this, obj);
        // Regression fix: some legacies have this set to Null. Todo: clean DB.
        if (obj.originUrl === null)
            this.originUrl = "";
        // JSON doesn't support Infinity, so we use strings instead.
        this.minTime = TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity(obj.minTime);
        this.maxTime = TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(obj.maxTime);
        // Todo: remove once we are more RAII.
        if ((_a = obj === null || obj === void 0 ? void 0 : obj.dimensions) === null || _a === void 0 ? void 0 : _a.length)
            this.setDimensionsFromConfigs(obj.dimensions);
    }
    populateFromQueryParams(params) {
        var _a;
        // Set tab if specified
        const tab = params.tab;
        if (tab) {
            if (!this.availableTabs.includes(tab))
                console.error("Unexpected tab: " + tab);
            else
                this.tab = tab;
        }
        const overlay = params.overlay;
        if (overlay) {
            if (!this.availableTabs.includes(overlay))
                console.error("Unexpected overlay: " + overlay);
            else
                this.overlay = overlay;
        }
        // Stack mode for bar and stacked area charts
        this.stackMode = ((_a = params.stackMode) !== null && _a !== void 0 ? _a : this.stackMode);
        this.zoomToSelection =
            params.zoomToSelection === "true" ? true : this.zoomToSelection;
        this.minPopulationFilter = params.minPopulationFilter
            ? parseInt(params.minPopulationFilter)
            : this.minPopulationFilter;
        // Axis scale mode
        const xScaleType = params.xScale;
        if (xScaleType) {
            if (xScaleType === GrapherConstants_1.ScaleType.linear || xScaleType === GrapherConstants_1.ScaleType.log)
                this.xAxis.scaleType = xScaleType;
            else
                console.error("Unexpected xScale: " + xScaleType);
        }
        const yScaleType = params.yScale;
        if (yScaleType) {
            if (yScaleType === GrapherConstants_1.ScaleType.linear || yScaleType === GrapherConstants_1.ScaleType.log)
                this.yAxis.scaleType = yScaleType;
            else
                console.error("Unexpected xScale: " + yScaleType);
        }
        const time = params.time;
        if (time !== undefined && time !== "")
            this.setTimeFromTimeQueryParam(time);
        const endpointsOnly = params.endpointsOnly;
        if (endpointsOnly !== undefined)
            this.compareEndPointsOnly = endpointsOnly === "1" ? true : undefined;
        const region = params.region;
        if (region !== undefined)
            this.map.projection = region;
        const selection = EntityUrlBuilder_1.getSelectedEntityNamesParam(Url_1.Url.fromQueryParams(params));
        if (this.addCountryMode !== GrapherConstants_1.EntitySelectionMode.Disabled && selection)
            this.selection.setSelectedEntities(selection);
    }
    setTimeFromTimeQueryParam(time) {
        this.timelineHandleTimeBounds = TimeBounds_1.getTimeDomainFromQueryString(time).map((time) => { var _a; return (_a = Util_1.findClosestTime(this.times, time)) !== null && _a !== void 0 ? _a : time; });
    }
    get isChartOrMapTab() {
        return this.tab === GrapherConstants_1.GrapherTabOption.chart || this.isOnMapTab;
    }
    get isOnMapTab() {
        return this.tab === GrapherConstants_1.GrapherTabOption.map;
    }
    get tableForSelection() {
        // This table specifies which entities can be selected in the charts EntitySelectorModal.
        // It should contain all entities that can be selected, and none more.
        // Depending on the chart type, the criteria for being able to select an entity are
        // different; e.g. for scatterplots, the entity needs to (1) not be excluded and
        // (2) needs to have data for the x and y dimension.
        if (this.isScatter || this.isSlopeChart)
            // for scatter and slope charts, the `transformTable()` call takes care of removing
            // all entities that cannot be selected
            return this.tableAfterAuthorTimelineAndActiveChartTransform;
        // for other chart types, the `transformTable()` call would sometimes remove too many
        // entities, and we want to use the inputTable instead (which should have exactly the
        // entities where data is available)
        return this.inputTable;
    }
    // If an author sets a timeline filter run it early in the pipeline so to the charts it's as if the filtered times do not exist
    get tableAfterAuthorTimelineFilter() {
        var _a, _b;
        const table = this.inputTable;
        if (this.timelineMinTime === undefined &&
            this.timelineMaxTime === undefined)
            return table;
        return table.filterByTimeRange((_a = this.timelineMinTime) !== null && _a !== void 0 ? _a : -Infinity, (_b = this.timelineMaxTime) !== null && _b !== void 0 ? _b : Infinity);
    }
    // Convenience method for debugging
    windowQueryParams(str = location.search) {
        return UrlUtils_1.strToQueryParams(str);
    }
    get tableAfterAuthorTimelineAndActiveChartTransform() {
        const table = this.tableAfterAuthorTimelineFilter;
        if (!this.isReady || !this.isChartOrMapTab)
            return table;
        return this.chartInstance.transformTable(table);
    }
    get chartInstance() {
        // Note: when timeline handles on a LineChart are collapsed into a single handle, the
        // LineChart turns into a DiscreteBar.
        return this.isOnMapTab
            ? new MapChart_1.MapChart({ manager: this })
            : this.chartInstanceExceptMap;
    }
    // When Map becomes a first-class chart instance, we should drop this
    get chartInstanceExceptMap() {
        var _a;
        const chartTypeName = this
            .typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart;
        const ChartClass = (_a = ChartTypeMap_1.ChartComponentClassMap.get(chartTypeName)) !== null && _a !== void 0 ? _a : ChartTypeMap_1.DefaultChartClass;
        return new ChartClass({ manager: this });
    }
    get table() {
        return this.tableAfterAuthorTimelineFilter;
    }
    get tableAfterAuthorTimelineAndActiveChartTransformAndPopulationFilter() {
        const table = this.tableAfterAuthorTimelineAndActiveChartTransform;
        // todo: could make these separate memoized computeds to speed up
        // todo: add cross filtering. 1 dimension at a time.
        return this.minPopulationFilter
            ? table.filterByPopulationExcept(this.minPopulationFilter, this.selection.selectedEntityNames)
            : table;
    }
    get tableAfterAllTransformsAndFilters() {
        var _a;
        const { startTime, endTime } = this;
        const table = this
            .tableAfterAuthorTimelineAndActiveChartTransformAndPopulationFilter;
        if (startTime === undefined || endTime === undefined)
            return table;
        if (this.isOnMapTab)
            return table.filterByTargetTimes([endTime], (_a = this.map.timeTolerance) !== null && _a !== void 0 ? _a : table.get(this.mapColumnSlug).tolerance);
        if (this.isDiscreteBar || this.isLineChartThatTurnedIntoDiscreteBar)
            return table.filterByTargetTimes([endTime], table.get(this.yColumnSlugs[0]).tolerance);
        if (this.isSlopeChart)
            return table.filterByTargetTimes([startTime, endTime]);
        return table.filterByTimeRange(startTime, endTime);
    }
    get transformedTable() {
        return this.tableAfterAllTransformsAndFilters;
    }
    get isStaging() {
        if (typeof location === undefined)
            return false;
        return location.host.includes("staging");
    }
    get editUrl() {
        var _a, _b;
        if (!this.showAdminControls && !this.isDev && !this.isStaging)
            return undefined;
        return `${this.adminBaseUrl}/admin/${(_b = (_a = this.manager) === null || _a === void 0 ? void 0 : _a.editUrl) !== null && _b !== void 0 ? _b : `charts/${this.id}/edit`}`;
    }
    // Make the default filter toggle option reflect what is initially loaded.
    get populationFilterOption() {
        if (this.minPopulationFilter)
            this.populationFilterToggleOption = this.minPopulationFilter;
        return this.populationFilterToggleOption;
    }
    // Checks if the data 1) is about countries and 2) has countries with less than the filter option. Used to partly determine whether to show the filter control.
    get hasCountriesSmallerThanFilterOption() {
        return this.inputTable.availableEntityNames.some((entityName) => PopulationMap_1.populationMap[entityName] &&
            PopulationMap_1.populationMap[entityName] < this.populationFilterOption);
    }
    /**
     * Whether the chart is rendered in an Admin context (e.g. on owid.cloud).
     */
    get useAdminAPI() {
        if (typeof window === "undefined")
            return false;
        return window.admin !== undefined;
    }
    /**
     * Whether the user viewing the chart is an admin and we should show admin controls,
     * like the "Edit" option in the share menu.
     */
    get showAdminControls() {
        // This cookie is set by visiting ourworldindata.org/identifyadmin on the static site.
        // There is an iframe on owid.cloud to trigger a visit to that page.
        return !!Cookies.get(GrapherConstants_1.CookieKey.isAdmin);
    }
    downloadLegacyDataFromOwidVariableIds() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.variableIds.length === 0)
                // No data to download
                return;
            try {
                if (this.useAdminAPI) {
                    const json = yield window.admin.getJSON(`/api/data/variables/${this.dataFileName}`);
                    this._receiveLegacyDataAndApplySelection(json);
                }
                else {
                    const response = yield fetch(this.dataUrl);
                    if (!response.ok)
                        throw new Error(response.statusText);
                    const json = yield response.json();
                    this._receiveLegacyDataAndApplySelection(json);
                }
            }
            catch (err) {
                console.log(`Error fetching '${this.dataUrl}'`);
                console.error(err);
            }
        });
    }
    receiveLegacyData(json) {
        this._receiveLegacyDataAndApplySelection(json);
    }
    _setInputTable(json, legacyConfig) {
        var _a, _b;
        const { dimensions, table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(json, legacyConfig);
        this.inputTable = table;
        // We need to reset the dimensions because some of them may have changed slugs in the legacy
        // transformation (can happen when columns use targetTime)
        this.setDimensionsFromConfigs(dimensions);
        this.appendNewEntitySelectionOptions();
        if ((_b = (_a = this.manager) === null || _a === void 0 ? void 0 : _a.selection) === null || _b === void 0 ? void 0 : _b.hasSelection) {
            // Selection is managed externally, do nothing.
        }
        else if (this.selection.hasSelection) {
            // User has changed the selection, use theris
        }
        else
            this.applyOriginalSelectionAsAuthored();
    }
    rebuildInputOwidTable() {
        if (!this.legacyVariableDataJson)
            return;
        this._setInputTable(this.legacyVariableDataJson, this.legacyConfigAsAuthored);
    }
    _receiveLegacyDataAndApplySelection(json) {
        this.legacyVariableDataJson = json;
        this.rebuildInputOwidTable();
    }
    appendNewEntitySelectionOptions() {
        const { selection } = this;
        const currentEntities = selection.availableEntityNameSet;
        const missingEntities = this.availableEntities.filter((entity) => !currentEntities.has(entity.entityName));
        selection.addAvailableEntityNames(missingEntities);
    }
    applyOriginalSelectionAsAuthored() {
        if (this.selectedEntityNames.length)
            this.selection.setSelectedEntities(this.selectedEntityNames);
        else if (this.selectedEntityIds.length)
            this.selection.setSelectedEntitiesByEntityId(this.selectedEntityIds);
    }
    get baseFontSize() {
        if (this.isMediaCard)
            return 24;
        else if (this.isExportingtoSvgOrPng)
            return 18;
        return this._baseFontSize;
    }
    set baseFontSize(val) {
        this._baseFontSize = val;
    }
    // Ready to go iff we have retrieved data for every variable associated with the chart
    get isReady() {
        return this.whatAreWeWaitingFor === "";
    }
    get whatAreWeWaitingFor() {
        const { newSlugs, inputTable, dimensions } = this;
        if (newSlugs.length || dimensions.length === 0) {
            const missingColumns = newSlugs.filter((slug) => !inputTable.has(slug));
            return missingColumns.length
                ? `Waiting for columns ${missingColumns.join(",")} in table '${inputTable.tableSlug}'. ${inputTable.tableDescription}`
                : "";
        }
        if (dimensions.length > 0 && this.loadingDimensions.length === 0)
            return "";
        return `Waiting for dimensions ${this.loadingDimensions.join(",")}.`;
    }
    // If we are using new slugs and not dimensions, Grapher is ready.
    get newSlugs() {
        const { xSlug, colorSlug, sizeSlug } = this;
        const ySlugs = this.ySlugs ? this.ySlugs.split(" ") : [];
        return Util_1.excludeUndefined([...ySlugs, xSlug, colorSlug, sizeSlug]);
    }
    get loadingDimensions() {
        return this.dimensions.filter((dim) => !this.inputTable.has(dim.columnSlug));
    }
    get isInIFrame() {
        return Util_1.isInIFrame();
    }
    get times() {
        const columnSlugs = this.isOnMapTab
            ? [this.mapColumnSlug]
            : this.yColumnSlugs;
        // Generate the times only after the chart transform has been applied, so that we don't show
        // times on the timeline for which data may not exist, e.g. when the selected entity
        // doesn't contain data for all years in the table.
        // -@danielgavrilov, 2020-10-22
        return this.tableAfterAuthorTimelineAndActiveChartTransformAndPopulationFilter.getTimesUniqSortedAscForColumns(columnSlugs);
    }
    get startHandleTimeBound() {
        if (this.onlySingleTimeSelectionPossible)
            return this.endHandleTimeBound;
        return this.timelineHandleTimeBounds[0];
    }
    set startHandleTimeBound(newValue) {
        if (this.onlySingleTimeSelectionPossible)
            this.timelineHandleTimeBounds = [newValue, newValue];
        else
            this.timelineHandleTimeBounds = [
                newValue,
                this.timelineHandleTimeBounds[1],
            ];
    }
    set endHandleTimeBound(newValue) {
        if (this.onlySingleTimeSelectionPossible)
            this.timelineHandleTimeBounds = [newValue, newValue];
        else
            this.timelineHandleTimeBounds = [
                this.timelineHandleTimeBounds[0],
                newValue,
            ];
    }
    get endHandleTimeBound() {
        return this.timelineHandleTimeBounds[1];
    }
    get startTime() {
        return Util_1.findClosestTime(this.times, this.startHandleTimeBound);
    }
    get endTime() {
        return Util_1.findClosestTime(this.times, this.endHandleTimeBound);
    }
    get onlySingleTimeSelectionPossible() {
        return (this.isDiscreteBar || this.isStackedDiscreteBar || this.isOnMapTab);
    }
    get shouldLinkToOwid() {
        if (this.props.isEmbeddedInAnOwidPage ||
            this.isExportingtoSvgOrPng ||
            !this.isInIFrame)
            return false;
        return true;
    }
    get variableIds() {
        return Util_1.uniq(this.dimensions.map((d) => d.variableId));
    }
    get dataFileName() {
        return `${this.variableIds.join("+")}.json?v=${this.isEditor ? undefined : this.cacheTag}`;
    }
    get dataUrl() {
        var _a;
        return `${(_a = this.bakedGrapherURL) !== null && _a !== void 0 ? _a : ""}/data/variables/${this.dataFileName}`;
    }
    get hasOWIDLogo() {
        return (!this.hideLogo && (this.logo === undefined || this.logo === "owid"));
    }
    // todo: did this name get botched in a merge?
    get hasFatalErrors() {
        return this.relatedQuestions.some((question) => !!exports.getErrorMessageRelatedQuestionUrl(question));
    }
    dispose() {
        this.disposers.forEach((dispose) => dispose());
    }
    get fontSize() {
        return this.baseFontSize;
    }
    // todo: can we remove this?
    // I believe these states can only occur during editing.
    ensureValidConfigWhenEditing() {
        this.disposers.push(mobx_1.reaction(() => this.variableIds, this.downloadLegacyDataFromOwidVariableIds));
        const disposers = [
            mobx_1.autorun(() => {
                if (!this.availableTabs.includes(this.tab))
                    mobx_1.runInAction(() => (this.tab = this.availableTabs[0]));
            }),
            mobx_1.autorun(() => {
                const validDimensions = this.validDimensions;
                if (!Util_1.isEqual(this.dimensions, validDimensions))
                    this.dimensions = validDimensions;
            }),
        ];
        this.disposers.push(...disposers);
    }
    get validDimensions() {
        const { dimensions } = this;
        const validProperties = this.dimensionSlots.map((d) => d.property);
        let validDimensions = dimensions.filter((dim) => validProperties.includes(dim.property));
        this.dimensionSlots.forEach((slot) => {
            if (!slot.allowMultiple)
                validDimensions = Util_1.uniqWith(validDimensions, (a, b) => a.property === slot.property &&
                    a.property === b.property);
        });
        return validDimensions;
    }
    // todo: do we need this?
    get originUrlWithProtocol() {
        let url = this.originUrl;
        if (!url.startsWith("http"))
            url = `https://${url}`;
        return url;
    }
    get overlayTab() {
        return this.overlay;
    }
    get currentTab() {
        return this.overlay ? this.overlay : this.tab;
    }
    set currentTab(desiredTab) {
        var _a;
        if (desiredTab === GrapherConstants_1.GrapherTabOption.chart ||
            desiredTab === GrapherConstants_1.GrapherTabOption.map ||
            desiredTab === GrapherConstants_1.GrapherTabOption.table) {
            this.tab = desiredTab;
            this.overlay = undefined;
            return;
        }
        // table tab cannot be downloaded, so revert to default tab
        if (desiredTab === GrapherConstants_1.GrapherTabOption.download && this.isOnTableTab)
            this.tab = (_a = this.authorsVersion.tab) !== null && _a !== void 0 ? _a : GrapherConstants_1.GrapherTabOption.chart;
        this.overlay = desiredTab;
    }
    get timelineHandleTimeBounds() {
        if (this.isOnMapTab) {
            const time = TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(this.map.time);
            return [time, time];
        }
        return [
            // Handle `undefined` values in minTime/maxTime
            TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity(this.minTime),
            TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(this.maxTime),
        ];
    }
    set timelineHandleTimeBounds(value) {
        if (this.isOnMapTab) {
            this.map.time = value[1];
        }
        else {
            this.minTime = value[0];
            this.maxTime = value[1];
        }
    }
    // Get the dimension slots appropriate for this type of chart
    get dimensionSlots() {
        const xAxis = new DimensionSlot_1.DimensionSlot(this, GrapherConstants_1.DimensionProperty.x);
        const yAxis = new DimensionSlot_1.DimensionSlot(this, GrapherConstants_1.DimensionProperty.y);
        const color = new DimensionSlot_1.DimensionSlot(this, GrapherConstants_1.DimensionProperty.color);
        const size = new DimensionSlot_1.DimensionSlot(this, GrapherConstants_1.DimensionProperty.size);
        if (this.isScatter)
            return [yAxis, xAxis, size, color];
        else if (this.isTimeScatter)
            return [yAxis, xAxis];
        else if (this.isSlopeChart)
            return [yAxis, size, color];
        return [yAxis];
    }
    get filledDimensions() {
        return this.isReady ? this.dimensions : [];
    }
    addDimension(config) {
        this.dimensions.push(new ChartDimension_1.ChartDimension(config, this));
    }
    setDimensionsForProperty(property, newConfigs) {
        let newDimensions = [];
        this.dimensionSlots.forEach((slot) => {
            if (slot.property === property)
                newDimensions = newDimensions.concat(newConfigs.map((config) => new ChartDimension_1.ChartDimension(config, this)));
            else
                newDimensions = newDimensions.concat(slot.dimensions);
        });
        this.dimensions = newDimensions;
    }
    setDimensionsFromConfigs(configs) {
        this.dimensions = configs.map((config) => new ChartDimension_1.ChartDimension(config, this));
    }
    get displaySlug() {
        var _a;
        return (_a = this.slug) !== null && _a !== void 0 ? _a : Util_1.slugify(this.displayTitle);
    }
    get availableTabs() {
        return [
            this.hasChartTab && GrapherConstants_1.GrapherTabOption.chart,
            this.hasMapTab && GrapherConstants_1.GrapherTabOption.map,
            GrapherConstants_1.GrapherTabOption.table,
            GrapherConstants_1.GrapherTabOption.sources,
            GrapherConstants_1.GrapherTabOption.download,
        ].filter(Util_1.identity);
    }
    get currentTitle() {
        let text = this.displayTitle;
        const selectedEntityNames = this.selection.selectedEntityNames;
        const showTitleAnnotation = !this.hideTitleAnnotation;
        if (this.tab === GrapherConstants_1.GrapherTabOption.chart &&
            this.addCountryMode !== GrapherConstants_1.EntitySelectionMode.MultipleEntities &&
            selectedEntityNames.length === 1 &&
            (showTitleAnnotation || this.canChangeEntity)) {
            const entityStr = selectedEntityNames[0];
            if (entityStr === null || entityStr === void 0 ? void 0 : entityStr.length)
                text = `${text}, ${entityStr}`;
        }
        if (showTitleAnnotation && this.isLineChart && this.isRelativeMode)
            text = "Change in " + Util_1.lowerCaseFirstLetterUnlessAbbreviation(text);
        if (this.isReady &&
            (showTitleAnnotation ||
                (this.hasTimeline &&
                    (this.isLineChartThatTurnedIntoDiscreteBar ||
                        this.isOnMapTab))))
            text += this.timeTitleSuffix;
        return text.trim();
    }
    get hasTimeline() {
        // we don't have more than one distinct time point in our data, so it doesn't make sense to show a timeline
        if (this.times.length <= 1)
            return false;
        switch (this.currentTab) {
            // the map tab has its own `hideTimeline` option
            case GrapherConstants_1.GrapherTabOption.map:
                return !this.map.hideTimeline;
            // use the chart-level `hideTimeline` option for the table, too
            case GrapherConstants_1.GrapherTabOption.table:
                return !this.hideTimeline;
            // StackedBar, StackedArea, and DiscreteBar charts never display a timeline
            case GrapherConstants_1.GrapherTabOption.chart:
                return (!this.hideTimeline &&
                    !(this.isStackedBar ||
                        this.isStackedArea ||
                        this.isDiscreteBar));
            // never show a timeline while we're showing one of these two overlays
            case GrapherConstants_1.GrapherTabOption.download:
            case GrapherConstants_1.GrapherTabOption.sources:
                return false;
        }
    }
    get areHandlesOnSameTime() {
        const times = this.tableAfterAuthorTimelineFilter.timeColumn.uniqValues;
        const [start, end] = this.timelineHandleTimeBounds.map((time) => Util_1.findClosestTime(times, time));
        return start === end;
    }
    get mapColumnSlug() {
        const mapColumnSlug = this.map.columnSlug;
        // If there's no mapColumnSlug or there is one but it's not in the dimensions array, use the first ycolumn
        if (!mapColumnSlug ||
            !this.dimensions.some((dim) => dim.columnSlug === mapColumnSlug))
            return this.yColumnSlug;
        return mapColumnSlug;
    }
    getColumnForProperty(property) {
        var _a;
        return (_a = this.dimensions.find((dim) => dim.property === property)) === null || _a === void 0 ? void 0 : _a.column;
    }
    getSlugForProperty(property) {
        var _a;
        return (_a = this.dimensions.find((dim) => dim.property === property)) === null || _a === void 0 ? void 0 : _a.columnSlug;
    }
    get yColumns() {
        return this.filledDimensions
            .filter((dim) => dim.property === GrapherConstants_1.DimensionProperty.y)
            .map((dim) => dim.column);
    }
    get yColumnSlugsInSelectionOrder() {
        var _a;
        return ((_a = this.selectedColumnSlugs) === null || _a === void 0 ? void 0 : _a.length)
            ? this.selectedColumnSlugs
            : this.yColumnSlugs;
    }
    get yColumnSlugs() {
        return this.ySlugs
            ? this.ySlugs.split(" ")
            : this.dimensions
                .filter((dim) => dim.property === GrapherConstants_1.DimensionProperty.y)
                .map((dim) => dim.columnSlug);
    }
    get yColumnSlug() {
        return this.ySlugs
            ? this.ySlugs.split(" ")[0]
            : this.getSlugForProperty(GrapherConstants_1.DimensionProperty.y);
    }
    get xColumnSlug() {
        var _a;
        return (_a = this.xSlug) !== null && _a !== void 0 ? _a : this.getSlugForProperty(GrapherConstants_1.DimensionProperty.x);
    }
    get sizeColumnSlug() {
        var _a;
        return (_a = this.sizeSlug) !== null && _a !== void 0 ? _a : this.getSlugForProperty(GrapherConstants_1.DimensionProperty.size);
    }
    get colorColumnSlug() {
        var _a;
        return ((_a = this.colorSlug) !== null && _a !== void 0 ? _a : this.getSlugForProperty(GrapherConstants_1.DimensionProperty.color));
    }
    get yScaleType() {
        return this.yAxis.scaleType;
    }
    get xScaleType() {
        return this.xAxis.scaleType;
    }
    get timeTitleSuffix() {
        const timeColumn = this.table.timeColumn;
        if (timeColumn.isMissing)
            return ""; // Do not show year until data is loaded
        const { startTime, endTime } = this;
        if (startTime === undefined || endTime === undefined)
            return "";
        const time = startTime === endTime
            ? timeColumn.formatValue(startTime)
            : timeColumn.formatValue(startTime) +
                " to " +
                timeColumn.formatValue(endTime);
        return ", " + time;
    }
    get sourcesLine() {
        var _a;
        return (_a = this.sourceDesc) !== null && _a !== void 0 ? _a : this.defaultSourcesLine;
    }
    // Columns that are used as a dimension in the currently active view
    get activeColumnSlugs() {
        const { yColumnSlugs, xColumnSlug, sizeColumnSlug, colorColumnSlug, } = this;
        return Util_1.excludeUndefined([
            ...yColumnSlugs,
            xColumnSlug,
            sizeColumnSlug,
            colorColumnSlug,
        ]);
    }
    get columnsWithSources() {
        // Only use dimensions/columns that are actually part of the visualization
        // In Explorers, this also ensures that only columns which are currently in use will be shown in Sources tab
        const columnSlugs = Util_1.uniq(this.activeColumnSlugs);
        // exclude some columns that are "too common" (they are used in most scatter plots for color & size)
        // todo: this sort of conditional we could do in a smarter editor, and not at runtime
        const excludedColumnSlugs = [
            "72",
            "123", // "Countries Continent", usually used as color in scatter plots, slope charts, etc.
        ];
        return this.inputTable
            .getColumns(columnSlugs)
            .filter((column) => !!column.source.name &&
            !excludedColumnSlugs.includes(column.slug));
    }
    get defaultSourcesLine() {
        let sourceNames = this.columnsWithSources.map((column) => { var _a; return (_a = column.source.name) !== null && _a !== void 0 ? _a : ""; });
        // Shorten automatic source names for certain major sources: todo: this sort of thing we could do in a smarter editor, and not at runtime
        sourceNames = sourceNames.map((sourceName) => {
            for (const majorSource of [
                "World Bank – WDI",
                "World Bank",
                "ILOSTAT",
            ]) {
                if (sourceName.startsWith(majorSource))
                    return majorSource;
            }
            return sourceName;
        });
        return Util_1.uniq(sourceNames).join(", ");
    }
    get axisDimensions() {
        return this.filledDimensions.filter((dim) => dim.property === GrapherConstants_1.DimensionProperty.y ||
            dim.property === GrapherConstants_1.DimensionProperty.x);
    }
    // todo: remove when we remove dimensions
    get yColumnsFromDimensionsOrSlugsOrAuto() {
        return this.yColumns.length
            ? this.yColumns
            : this.table.getColumns(ChartUtils_1.autoDetectYColumnSlugs(this));
    }
    get defaultTitle() {
        const yColumns = this.yColumnsFromDimensionsOrSlugsOrAuto;
        if (this.isScatter)
            return this.axisDimensions
                .map((dimension) => dimension.column.displayName)
                .join(" vs. ");
        const uniqueDatasetNames = Util_1.uniq(Util_1.excludeUndefined(yColumns.map((col) => col.def.datasetName)));
        if (this.hasMultipleYColumns && uniqueDatasetNames.length === 1)
            return uniqueDatasetNames[0];
        if (yColumns.length === 2)
            return yColumns.map((col) => col.displayName).join(" and ");
        return yColumns.map((col) => col.displayName).join(", ");
    }
    get displayTitle() {
        var _a;
        return (_a = this.title) !== null && _a !== void 0 ? _a : this.defaultTitle;
    }
    // Returns an object ready to be serialized to JSON
    get object() {
        return this.toObject();
    }
    get typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart() {
        // Switch to bar chart if a single year is selected. Todo: do we want to do this?
        return this.isLineChartThatTurnedIntoDiscreteBar
            ? GrapherConstants_1.ChartTypeName.DiscreteBar
            : this.type;
    }
    get isLineChart() {
        return this.type === GrapherConstants_1.ChartTypeName.LineChart;
    }
    get isScatter() {
        return this.type === GrapherConstants_1.ChartTypeName.ScatterPlot;
    }
    get isTimeScatter() {
        return this.type === GrapherConstants_1.ChartTypeName.TimeScatter;
    }
    get isStackedArea() {
        return this.type === GrapherConstants_1.ChartTypeName.StackedArea;
    }
    get isSlopeChart() {
        return this.type === GrapherConstants_1.ChartTypeName.SlopeChart;
    }
    get isDiscreteBar() {
        return this.type === GrapherConstants_1.ChartTypeName.DiscreteBar;
    }
    get isStackedBar() {
        return this.type === GrapherConstants_1.ChartTypeName.StackedBar;
    }
    get isStackedDiscreteBar() {
        return this.type === GrapherConstants_1.ChartTypeName.StackedDiscreteBar;
    }
    get isLineChartThatTurnedIntoDiscreteBar() {
        return this.isLineChart && this.areHandlesOnSameTime;
    }
    get activeColorScale() {
        const chart = this.chartInstance;
        return chart.colorScale;
    }
    get activeColorScaleExceptMap() {
        const chart = this.chartInstanceExceptMap;
        return chart.colorScale;
    }
    get supportsMultipleYColumns() {
        return !(this.isScatter || this.isTimeScatter || this.isSlopeChart);
    }
    get xDimension() {
        return this.filledDimensions.find((d) => d.property === GrapherConstants_1.DimensionProperty.x);
    }
    // todo: this is only relevant for scatter plots. move to scatter plot class?
    // todo: remove this. Should be done as a simple column transform at the data level.
    // Possible to override the x axis dimension to target a special year
    // In case you want to graph say, education in the past and democracy today https://ourworldindata.org/grapher/correlation-between-education-and-democracy
    get xOverrideTime() {
        var _a;
        return (_a = this.xDimension) === null || _a === void 0 ? void 0 : _a.targetYear;
    }
    // todo: this is only relevant for scatter plots. move to scatter plot class?
    set xOverrideTime(value) {
        this.xDimension.targetYear = value;
    }
    get idealBounds() {
        return this.isMediaCard
            ? new Bounds_1.Bounds(0, 0, 1200, 630)
            : new Bounds_1.Bounds(0, 0, 850, 600);
    }
    get hasYDimension() {
        return this.dimensions.some((d) => d.property === GrapherConstants_1.DimensionProperty.y);
    }
    get staticSVG() {
        const _isExportingtoSvgOrPng = this.isExportingtoSvgOrPng;
        this.isExportingtoSvgOrPng = true;
        const staticSvg = ReactDOMServer.renderToStaticMarkup(React.createElement(CaptionedChart_1.StaticCaptionedChart, { manager: this, bounds: this.idealBounds }));
        this.isExportingtoSvgOrPng = _isExportingtoSvgOrPng;
        return staticSvg;
    }
    get mapConfig() {
        return this.map;
    }
    get cacheTag() {
        return this.version.toString();
    }
    get mapIsClickable() {
        return (this.hasChartTab &&
            (this.isLineChart || this.isScatter) &&
            !Util_1.isMobile());
    }
    get relativeToggleLabel() {
        if (this.isScatter || this.isTimeScatter)
            return "Average annual change";
        else if (this.isLineChart)
            return "Relative change";
        return "Relative";
    }
    // NB: The timeline scatterplot in relative mode calculates changes relative
    // to the lower bound year rather than creating an arrow chart
    get isRelativeMode() {
        return this.stackMode === GrapherConstants_1.StackMode.relative;
    }
    get canToggleRelativeMode() {
        if (this.isLineChart)
            return (!this.hideRelativeToggle &&
                !this.areHandlesOnSameTime &&
                this.yScaleType !== GrapherConstants_1.ScaleType.log);
        return !this.hideRelativeToggle;
    }
    // Filter data to what can be display on the map (across all times)
    get mappableData() {
        return this.inputTable
            .get(this.mapColumnSlug)
            .owidRows.filter((row) => EntitiesOnTheMap_1.isOnTheMap(row.entityName));
    }
    static renderGrapherIntoContainer(config, containerNode) {
        const grapherInstanceRef = React.createRef();
        const setBoundsFromContainerAndRender = () => {
            const props = Object.assign(Object.assign({}, config), { bounds: Bounds_1.Bounds.fromRect(containerNode.getBoundingClientRect()) });
            ReactDOM.render(React.createElement(Grapher_1, Object.assign({ ref: grapherInstanceRef }, props)), containerNode);
        };
        setBoundsFromContainerAndRender();
        window.addEventListener("resize", Util_1.throttle(setBoundsFromContainerAndRender, 400));
        return grapherInstanceRef.current;
    }
    static renderSingleGrapherOnGrapherPage(jsonConfig) {
        const container = document.getElementsByTagName("figure")[0];
        try {
            Grapher_1.renderGrapherIntoContainer(Object.assign(Object.assign({}, jsonConfig), { bindUrlToWindow: true, enableKeyboardShortcuts: true, queryStr: window.location.search }), container);
        }
        catch (err) {
            container.innerHTML = `<img src="/grapher/exports/${jsonConfig.slug}.svg"/><p>Unable to load interactive visualization</p>`;
            container.setAttribute("id", "fallback");
            throw err;
        }
    }
    get isMobile() {
        return Util_1.isMobile();
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get isPortrait() {
        return this.bounds.width < this.bounds.height && this.bounds.width < 850;
    }
    get widthForDeviceOrientation() {
        return this.isPortrait ? 400 : 680;
    }
    get heightForDeviceOrientation() {
        return this.isPortrait ? 640 : 480;
    }
    get useIdealBounds() {
        const { isEditor, isExportingtoSvgOrPng, bounds, widthForDeviceOrientation, heightForDeviceOrientation, isInIFrame, } = this;
        // For these, defer to the bounds that is set externally
        if (this.props.isEmbeddedInAnOwidPage ||
            this.props.manager ||
            isInIFrame)
            return false;
        // If the user is using interactive version and then goes to export chart, use current bounds to maintain WSYIWYG
        if (isExportingtoSvgOrPng)
            return false;
        // todo: can remove this if we drop old adminSite editor
        if (isEditor)
            return true;
        // If the available space is very small, we use all of the space given to us
        if (bounds.height < heightForDeviceOrientation ||
            bounds.width < widthForDeviceOrientation)
            return false;
        return true;
    }
    // If we have a big screen to be in, we can define our own aspect ratio and sit in the center
    get scaleToFitIdeal() {
        return Math.min((this.bounds.width * 0.95) / this.widthForDeviceOrientation, (this.bounds.height * 0.95) / this.heightForDeviceOrientation);
    }
    // These are the final render dimensions
    // Todo: add explanation around why isExporting removes 5 px
    get renderWidth() {
        return this.useIdealBounds
            ? this.widthForDeviceOrientation * this.scaleToFitIdeal
            : this.bounds.width - (this.isExportingtoSvgOrPng ? 0 : 5);
    }
    get renderHeight() {
        return this.useIdealBounds
            ? this.heightForDeviceOrientation * this.scaleToFitIdeal
            : this.bounds.height - (this.isExportingtoSvgOrPng ? 0 : 5);
    }
    get tabBounds() {
        const bounds = new Bounds_1.Bounds(0, 0, this.renderWidth, this.renderHeight);
        return this.isExportingtoSvgOrPng
            ? bounds
            : bounds.padBottom(this.footerControlsHeight);
    }
    get containerElement() {
        return this.base.current || undefined;
    }
    setError(err) {
        this.uncaughtError = err;
    }
    clearErrors() {
        this.uncaughtError = undefined;
    }
    // todo: clean up this popup stuff
    addPopup(vnode) {
        this.popups = this.popups.concat([vnode]);
    }
    removePopup(vnodeType) {
        this.popups = this.popups.filter((d) => !(d.type === vnodeType));
    }
    get isOnTableTab() {
        return this.tab === GrapherConstants_1.GrapherTabOption.table;
    }
    renderPrimaryTab() {
        if (this.isChartOrMapTab)
            return React.createElement(CaptionedChart_1.CaptionedChart, { manager: this });
        const { tabBounds } = this;
        if (this.isOnTableTab)
            // todo: should this "Div" and styling just be in DataTable class?
            return (React.createElement("div", { className: "tableTab", style: Object.assign(Object.assign({}, tabBounds.toCSS()), { position: "absolute" }) },
                React.createElement(DataTable_1.DataTable, { bounds: tabBounds, manager: this })));
        return undefined;
    }
    renderOverlayTab() {
        const bounds = this.tabBounds;
        if (this.overlayTab === GrapherConstants_1.GrapherTabOption.sources)
            return (React.createElement(SourcesTab_1.SourcesTab, { key: "sourcesTab", bounds: bounds, manager: this }));
        if (this.overlayTab === GrapherConstants_1.GrapherTabOption.download)
            return (React.createElement(DownloadTab_1.DownloadTab, { key: "downloadTab", bounds: bounds, manager: this }));
        return undefined;
    }
    get commandPalette() {
        return this.props.enableKeyboardShortcuts ? (React.createElement(CommandPalette_1.CommandPalette, { commands: this.keyboardShortcuts, display: "none" })) : null;
    }
    formatTimeFn(time) {
        return this.inputTable.timeColumnFormatFunction(time);
    }
    toggleTabCommand() {
        this.currentTab = Util_1.next(this.availableTabs, this.currentTab);
    }
    togglePlayingCommand() {
        this.timelineController.togglePlay();
    }
    get availableEntities() {
        return this.tableForSelection.availableEntities;
    }
    get keyboardShortcuts() {
        const temporaryFacetTestCommands = Util_1.range(0, 10).map((num) => {
            return {
                combo: `${num}`,
                fn: () => this.randomSelection(num),
            };
        });
        const shortcuts = [
            ...temporaryFacetTestCommands,
            {
                combo: "t",
                fn: () => this.toggleTabCommand(),
                title: "Toggle tab",
                category: "Navigation",
            },
            {
                combo: "?",
                fn: () => CommandPalette_1.CommandPalette.togglePalette(),
                title: `Toggle Help`,
                category: "Navigation",
            },
            {
                combo: "a",
                fn: () => this.selection.hasSelection
                    ? this.selection.clearSelection()
                    : this.selection.selectAll(),
                title: this.selection.hasSelection
                    ? `Select None`
                    : `Select All`,
                category: "Selection",
            },
            {
                combo: "f",
                fn: () => this.toggleFilterAllCommand(),
                title: "Hide unselected",
                category: "Selection",
            },
            {
                combo: "p",
                fn: () => this.togglePlayingCommand(),
                title: this.isPlaying ? `Pause` : `Play`,
                category: "Timeline",
            },
            {
                combo: "f",
                fn: () => this.toggleFacetStrategy(),
                title: `Toggle Faceting`,
                category: "Chart",
            },
            {
                combo: "l",
                fn: () => this.toggleYScaleTypeCommand(),
                title: "Toggle Y log/linear",
                category: "Chart",
            },
            {
                combo: "esc",
                fn: () => this.clearErrors(),
            },
            {
                combo: "z",
                fn: () => this.toggleTimelineCommand(),
                title: "Latest/Earliest/All period",
                category: "Timeline",
            },
            {
                combo: "shift+o",
                fn: () => this.clearQueryParams(),
                title: "Reset to original",
                category: "Navigation",
            },
        ];
        if (this.slideShow) {
            const slideShow = this.slideShow;
            shortcuts.push({
                combo: "right",
                fn: () => slideShow.playNext(),
                title: "Next chart",
                category: "Browse",
            });
            shortcuts.push({
                combo: "left",
                fn: () => slideShow.playPrevious(),
                title: "Previous chart",
                category: "Browse",
            });
        }
        return shortcuts;
    }
    toggleTimelineCommand() {
        // Todo: add tests for this
        this.setTimeFromTimeQueryParam(Util_1.next(["latest", "earliest", ".."], this.timeParam));
    }
    toggleFilterAllCommand() {
        this.minPopulationFilter =
            this.minPopulationFilter === 2e9 ? undefined : 2e9;
    }
    toggleYScaleTypeCommand() {
        this.yAxis.scaleType = Util_1.next([GrapherConstants_1.ScaleType.linear, GrapherConstants_1.ScaleType.log], this.yAxis.scaleType);
    }
    toggleFacetStrategy() {
        this.facet = Util_1.next(this.availableFacetStrategies, this.facet);
    }
    get hasMultipleYColumns() {
        return this.yColumnSlugs.length > 1;
    }
    get selectedColumnSlugs() {
        const { selectedData } = this.legacyConfigAsAuthored;
        const dimensions = this.filledDimensions;
        if (selectedData) {
            const columnSlugs = selectedData.map((item) => {
                var _a;
                const columnSlug = (_a = dimensions[item.index]) === null || _a === void 0 ? void 0 : _a.columnSlug;
                if (!columnSlug)
                    console.warn(`Couldn't find specified dimension in chart config`, item);
                return columnSlug;
            });
            return Util_1.uniq(Util_1.excludeUndefined(columnSlugs));
        }
        return [];
    }
    get availableFacetStrategies() {
        const strategies = [undefined];
        if (this.hasMultipleYColumns)
            strategies.push(GrapherConstants_1.FacetStrategy.column);
        if (this.selection.numSelectedEntities > 1)
            strategies.push(GrapherConstants_1.FacetStrategy.country);
        return strategies;
    }
    get facetStrategy() {
        if (this.facet && this.availableFacetStrategies.includes(this.facet))
            return this.facet;
        if (this.disableAutoFaceting)
            return undefined;
        // Auto facet on SingleEntity charts with multiple selected entities
        if (this.addCountryMode === GrapherConstants_1.EntitySelectionMode.SingleEntity &&
            this.selection.numSelectedEntities > 1)
            return GrapherConstants_1.FacetStrategy.country;
        // Auto facet when multiple slugs and multiple entities selected. todo: not sure if this is correct.
        if (this.addCountryMode === GrapherConstants_1.EntitySelectionMode.MultipleEntities &&
            this.hasMultipleYColumns &&
            this.selection.numSelectedEntities > 1)
            return GrapherConstants_1.FacetStrategy.column;
        return undefined;
    }
    randomSelection(num) {
        // Continent, Population, GDP PC, GDP, PopDens, UN, Language, etc.
        this.clearErrors();
        const currentSelection = this.selection.selectedEntityNames.length;
        const newNum = num ? num : currentSelection ? currentSelection * 2 : 10;
        this.selection.setSelectedEntities(Util_1.sampleFrom(this.selection.availableEntityNames, newNum, Date.now()));
    }
    renderError() {
        var _a;
        return (React.createElement("div", { title: (_a = this.uncaughtError) === null || _a === void 0 ? void 0 : _a.message, style: {
                width: "100%",
                height: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                lineHeight: 1.5,
                padding: "3rem",
            } },
            React.createElement("p", { style: { color: "#cc0000", fontWeight: 700 } },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExclamationTriangle_1.faExclamationTriangle }),
                GrapherConstants_1.ThereWasAProblemLoadingThisChart),
            React.createElement("p", null,
                "We have been notified of this error, please check back later whether it's been fixed. If the error persists, get in touch with us at",
                " ",
                React.createElement("a", { href: `mailto:info@ourworldindata.org?subject=Broken chart on page ${window.location.href}` }, "info@ourworldindata.org"),
                "."),
            this.uncaughtError && this.uncaughtError.message && (React.createElement("pre", { style: { fontSize: "11px" } },
                "Error: ",
                this.uncaughtError.message))));
    }
    resetAnnotation() {
        this.renderAnnotation(undefined);
    }
    renderAnnotation(annotation) {
        var _a;
        this.setAuthoredVersion(this.props);
        this.reset();
        this.updateFromObject(Object.assign({}, this.props));
        this.populateFromQueryParams(GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams((_a = this.props.queryStr) !== null && _a !== void 0 ? _a : ""));
        this.annotation = annotation;
    }
    render() {
        const { isExportingtoSvgOrPng, isPortrait } = this;
        // TODO how to handle errors in exports?
        // TODO tidy this up
        if (isExportingtoSvgOrPng)
            return this.renderPrimaryTab(); // todo: remove this? should have a simple toStaticSVG for importing.
        const { renderWidth, renderHeight } = this;
        const style = {
            width: renderWidth,
            height: renderHeight,
            fontSize: this.baseFontSize,
        };
        const classes = classnames_1.default("GrapherComponent", isExportingtoSvgOrPng && "isExportingToSvgOrPng", isPortrait && "GrapherPortraitClass");
        return (React.createElement("div", { ref: this.base, className: classes, style: style },
            this.commandPalette,
            this.uncaughtError ? this.renderError() : this.renderReady()));
    }
    renderReady() {
        return (React.createElement(React.Fragment, null,
            this.hasBeenVisible && this.renderPrimaryTab(),
            React.createElement(Controls_1.FooterControls, { manager: this }),
            this.renderOverlayTab(),
            this.popups,
            React.createElement(Tooltip_1.TooltipView, { width: this.renderWidth, height: this.renderHeight, tooltipProvider: this }),
            this.isSelectingData && (React.createElement(EntitySelectorModal_1.EntitySelectorModal, { canChangeEntity: this.canChangeEntity, selectionArray: this.selection, key: "entitySelector", isMobile: this.isMobile, onDismiss: mobx_1.action(() => (this.isSelectingData = false)) }))));
    }
    // Chart should only render SVG when it's on the screen
    checkVisibility() {
        if (!this.hasBeenVisible && Util_1.isVisible(this.base.current))
            this.hasBeenVisible = true;
    }
    setBaseFontSize() {
        const { renderWidth } = this;
        if (renderWidth <= 400)
            this.baseFontSize = 14;
        else if (renderWidth < 1080)
            this.baseFontSize = 16;
        else if (renderWidth >= 1080)
            this.baseFontSize = 18;
    }
    // Binds chart properties to global window title and URL. This should only
    // ever be invoked from top-level JavaScript.
    bindToWindow() {
        // There is a surprisingly considerable performance overhead to updating the url
        // while animating, so we debounce to allow e.g. smoother timelines
        const pushParams = () => UrlUtils_1.setWindowQueryStr(UrlUtils_1.queryParamsToStr(this.changedParams));
        const debouncedPushParams = Util_1.debounce(pushParams, 100);
        mobx_1.reaction(() => this.changedParams, () => (this.debounceMode ? debouncedPushParams() : pushParams()));
        mobx_1.autorun(() => (document.title = this.currentTitle));
    }
    componentDidMount() {
        window.addEventListener("scroll", this.checkVisibility);
        this.setBaseFontSize();
        this.checkVisibility();
        Util_1.exposeInstanceOnWindow(this, "grapher");
        if (this.props.bindUrlToWindow)
            this.bindToWindow();
        if (this.props.enableKeyboardShortcuts)
            this.bindKeyboardShortcuts();
    }
    bindKeyboardShortcuts() {
        if (this._shortcutsBound)
            return;
        this.keyboardShortcuts.forEach((shortcut) => {
            Mousetrap.bind(shortcut.combo, () => {
                shortcut.fn();
                this.analytics.logKeyboardShortcut(shortcut.title || "", shortcut.combo);
                return false;
            });
        });
        this._shortcutsBound = true;
    }
    unbindKeyboardShortcuts() {
        if (!this._shortcutsBound)
            return;
        this.keyboardShortcuts.forEach((shortcut) => {
            Mousetrap.unbind(shortcut.combo);
        });
        this._shortcutsBound = false;
    }
    componentWillUnmount() {
        this.unbindKeyboardShortcuts();
        window.removeEventListener("scroll", this.checkVisibility);
        this.dispose();
    }
    componentDidUpdate() {
        this.setBaseFontSize();
        this.checkVisibility();
    }
    componentDidCatch(error, info) {
        this.setError(error);
        this.analytics.logGrapherViewError(error, info);
    }
    get hasRelatedQuestion() {
        if (!this.relatedQuestions.length)
            return false;
        const question = this.relatedQuestions[0];
        return !!question && !!question.text && !!question.url;
    }
    get footerControlsLines() {
        return this.hasTimeline ? 2 : 1;
    }
    get footerControlsHeight() {
        const footerRowHeight = 32; // todo: cleanup. needs to keep in sync with grapher.scss' $footerRowHeight
        return (this.footerControlsLines * footerRowHeight +
            (this.hasRelatedQuestion ? 20 : 0));
    }
    clearQueryParams() {
        const { authorsVersion } = this;
        this.tab = authorsVersion.tab;
        this.xAxis.scaleType = authorsVersion.xAxis.scaleType;
        this.yAxis.scaleType = authorsVersion.yAxis.scaleType;
        this.stackMode = authorsVersion.stackMode;
        this.zoomToSelection = authorsVersion.zoomToSelection;
        this.minPopulationFilter = authorsVersion.minPopulationFilter;
        this.compareEndPointsOnly = authorsVersion.compareEndPointsOnly;
        this.minTime = authorsVersion.minTime;
        this.maxTime = authorsVersion.maxTime;
        this.map.time = authorsVersion.map.time;
        this.map.projection = authorsVersion.map.projection;
        this.selection.clearSelection();
        this.applyOriginalSelectionAsAuthored();
    }
    // Todo: come up with a more general pattern?
    // The idea here is to reset the Grapher to a blank slate, so that if you updateFromObject and the object contains some blanks, those blanks
    // won't overwrite defaults (like type == LineChart). RAII would probably be better, but this works for now.
    reset() {
        const grapher = new Grapher_1();
        this.title = grapher.title;
        this.subtitle = grapher.subtitle;
        this.type = grapher.type;
        this.ySlugs = grapher.ySlugs;
        this.xSlug = grapher.xSlug;
        this.colorSlug = grapher.colorSlug;
        this.sizeSlug = grapher.sizeSlug;
        this.hasMapTab = grapher.hasMapTab;
        this.facet = undefined;
        this.hasChartTab = grapher.hasChartTab;
        this.map = grapher.map;
        this.yAxis.scaleType = grapher.yAxis.scaleType;
        this.yAxis.min = grapher.yAxis.min;
    }
    get allParams() {
        var _a;
        const params = {};
        params.tab = this.tab;
        params.xScale = this.xAxis.scaleType;
        params.yScale = this.yAxis.scaleType;
        params.stackMode = this.stackMode;
        params.zoomToSelection = this.zoomToSelection ? "true" : undefined;
        params.minPopulationFilter = (_a = this.minPopulationFilter) === null || _a === void 0 ? void 0 : _a.toString();
        params.endpointsOnly = this.compareEndPointsOnly ? "1" : "0";
        params.time = this.timeParam;
        params.region = this.map.projection;
        return EntityUrlBuilder_1.setSelectedEntityNamesParam(Url_1.Url.fromQueryParams(params), this.selectedEntitiesIfDifferentThanAuthors).queryParams;
    }
    // Todo: move all Graphers to git. Upgrade the selection property; delete the entityId stuff, and remove this.
    get selectedEntitiesIfDifferentThanAuthors() {
        var _a;
        const authoredConfig = this.legacyConfigAsAuthored;
        const originalSelectedEntityIds = ((_a = authoredConfig.selectedData) === null || _a === void 0 ? void 0 : _a.map((row) => row.entityId)) || [];
        const currentSelectedEntityIds = this.selection.allSelectedEntityIds;
        const entityIdsThatTheUserDeselected = Util_1.difference(currentSelectedEntityIds, originalSelectedEntityIds);
        if (currentSelectedEntityIds.length !==
            originalSelectedEntityIds.length ||
            entityIdsThatTheUserDeselected.length)
            return this.selection.selectedEntityNames;
        return undefined;
    }
    // Autocomputed url params to reflect difference between current grapher state
    // and original config state
    get changedParams() {
        return Util_1.differenceObj(this.allParams, this.authorsVersion.allParams);
    }
    // If you want to compare current state against the published grapher.
    get authorsVersion() {
        return new Grapher_1(Object.assign(Object.assign({}, this.legacyConfigAsAuthored), { manager: undefined, manuallyProvideData: true, queryStr: "" }));
    }
    get queryStr() {
        return UrlUtils_1.queryParamsToStr(this.changedParams);
    }
    get baseUrl() {
        var _a;
        return this.isPublished
            ? `${(_a = this.bakedGrapherURL) !== null && _a !== void 0 ? _a : "/grapher"}/${this.displaySlug}`
            : undefined;
    }
    get manager() {
        return this.props.manager;
    }
    // Get the full url representing the canonical location of this grapher state
    get canonicalUrl() {
        var _a, _b;
        return ((_b = (_a = this.manager) === null || _a === void 0 ? void 0 : _a.canonicalUrl) !== null && _b !== void 0 ? _b : (this.baseUrl ? this.baseUrl + this.queryStr : undefined));
    }
    get embedUrl() {
        var _a, _b;
        return (_b = (_a = this.manager) === null || _a === void 0 ? void 0 : _a.embedDialogUrl) !== null && _b !== void 0 ? _b : this.canonicalUrl;
    }
    get embedDialogAdditionalElements() {
        var _a;
        return (_a = this.manager) === null || _a === void 0 ? void 0 : _a.embedDialogAdditionalElements;
    }
    get hasUserChangedTimeHandles() {
        const authorsVersion = this.authorsVersion;
        return (this.minTime !== authorsVersion.minTime ||
            this.maxTime !== authorsVersion.maxTime);
    }
    get hasUserChangedMapTimeHandle() {
        return this.map.time !== this.authorsVersion.map.time;
    }
    get timeParam() {
        const { timeColumn } = this.table;
        const formatTime = (t) => TimeBounds_1.timeBoundToTimeBoundString(t, timeColumn instanceof CoreTableColumns_1.ColumnTypeMap.Day);
        if (this.isOnMapTab) {
            return this.map.time !== undefined &&
                this.hasUserChangedMapTimeHandle
                ? formatTime(this.map.time)
                : undefined;
        }
        if (!this.hasUserChangedTimeHandles)
            return undefined;
        const [startTime, endTime] = this.timelineHandleTimeBounds.map(formatTime);
        return startTime === endTime ? startTime : `${startTime}..${endTime}`;
    }
    onPlay() {
        this.analytics.logGrapherTimelinePlay(this.slug);
    }
    // todo: restore this behavior??
    onStartPlayOrDrag() {
        this.debounceMode = true;
        this.useTimelineDomains = true;
    }
    onStopPlayOrDrag() {
        this.debounceMode = false;
        this.useTimelineDomains = false;
    }
    get disablePlay() {
        return this.isSlopeChart;
    }
    formatTime(value) {
        const timeColumn = this.table.timeColumn;
        if (timeColumn.isMissing)
            return this.table.timeColumnFormatFunction(value);
        return Util_1.isMobile()
            ? timeColumn.formatValueForMobile(value)
            : timeColumn.formatValue(value);
    }
    get showSmallCountriesFilterToggle() {
        return this.isScatter && this.hasCountriesSmallerThanFilterOption;
    }
    get showYScaleToggle() {
        if (this.isRelativeMode)
            return false;
        if (this.isStackedArea || this.isStackedBar)
            return false; // We currently do not have these charts with log scale
        return this.yAxis.canChangeScaleType;
    }
    get showXScaleToggle() {
        if (this.isRelativeMode)
            return false;
        return this.xAxis.canChangeScaleType;
    }
    get showZoomToggle() {
        return this.isScatter && this.selection.hasSelection;
    }
    get showAbsRelToggle() {
        if (!this.canToggleRelativeMode)
            return false;
        if (this.isScatter)
            return this.xOverrideTime === undefined && this.hasTimeline;
        return (this.isStackedArea ||
            this.isStackedDiscreteBar ||
            this.isScatter ||
            this.isLineChart);
    }
    get showHighlightToggle() {
        return this.isScatter && !!this.highlightToggle;
    }
    get showChangeEntityButton() {
        return !this.hideEntityControls && this.canChangeEntity;
    }
    get showAddEntityButton() {
        return (!this.hideEntityControls &&
            this.canSelectMultipleEntities &&
            (this.isLineChart ||
                this.isStackedArea ||
                this.isDiscreteBar ||
                this.isStackedDiscreteBar));
    }
    get showSelectEntitiesButton() {
        return (!this.hideEntityControls &&
            this.addCountryMode !== GrapherConstants_1.EntitySelectionMode.Disabled &&
            this.numSelectableEntityNames > 1 &&
            !this.showAddEntityButton &&
            !this.showChangeEntityButton);
    }
    get canSelectMultipleEntities() {
        if (this.numSelectableEntityNames < 2)
            return false;
        if (this.addCountryMode === GrapherConstants_1.EntitySelectionMode.MultipleEntities)
            return true;
        if (this.addCountryMode === GrapherConstants_1.EntitySelectionMode.SingleEntity &&
            this.facetStrategy)
            return true;
        return false;
    }
    // This is just a helper method to return the correct table for providing entity choices. We want to
    // provide the root table, not the transformed table.
    // A user may have added time or other filters that would filter out all rows from certain entities, but
    // we may still want to show those entities as available in a picker. We also do not want to do things like
    // hide the Add Entity button as the user drags the timeline.
    get numSelectableEntityNames() {
        return this.selection.numAvailableEntityNames;
    }
    get canChangeEntity() {
        return (!this.isScatter &&
            this.addCountryMode === GrapherConstants_1.EntitySelectionMode.SingleEntity &&
            this.numSelectableEntityNames > 1);
    }
    get startSelectingWhenLineClicked() {
        return this.showAddEntityButton;
    }
};
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "type", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "id", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "version", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "slug", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "title", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "subtitle", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "sourceDesc", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "note", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hideTitleAnnotation", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "minTime", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "maxTime", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "timelineMinTime", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "timelineMaxTime", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "addCountryMode", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "highlightToggle", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "stackMode", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hideLegend", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "logo", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hideLogo", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hideRelativeToggle", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "entityType", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "entityTypePlural", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hideTimeline", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "zoomToSelection", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "minPopulationFilter", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "showYearLabels", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hasChartTab", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hasMapTab", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "tab", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "overlay", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "internalNotes", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "variantName", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "originUrl", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "isPublished", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "baseColorScheme", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "invertColorScheme", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "hideLinesOutsideTolerance", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "hideConnectedScatterLines", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "scatterPointLabelStrategy", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "compareEndPointsOnly", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "matchingEntitiesOnly", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "showFacetYRangeToggle", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "xAxis", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "yAxis", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "colorScale", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "map", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "dimensions", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "ySlugs", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "xSlug", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "colorSlug", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "sizeSlug", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "tableSlugs", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "backgroundSeriesLimit", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "selectedEntityNames", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "selectedEntityColors", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "selectedEntityIds", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "excludedEntities", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "comparisonLines", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "relatedQuestions", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "annotation", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "bakedGrapherURL", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "inputTable", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "legacyConfigAsAuthored", void 0);
__decorate([
    mobx_1.computed
], Grapher.prototype, "dataTableSlugs", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "setAuthoredVersion", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "updateAuthoredVersion", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "downloadData", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "updateFromObject", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "populateFromQueryParams", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "setTimeFromTimeQueryParam", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isChartOrMapTab", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isOnMapTab", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "tableForSelection", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "tableAfterAuthorTimelineFilter", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "tableAfterAuthorTimelineAndActiveChartTransform", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "chartInstance", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "chartInstanceExceptMap", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "table", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "tableAfterAuthorTimelineAndActiveChartTransformAndPopulationFilter", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "tableAfterAllTransformsAndFilters", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "transformedTable", null);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "isMediaCard", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "isExportingtoSvgOrPng", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "tooltip", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "isPlaying", void 0);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "isSelectingData", void 0);
__decorate([
    mobx_1.computed
], Grapher.prototype, "editUrl", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "populationFilterOption", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasCountriesSmallerThanFilterOption", null);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "useTimelineDomains", void 0);
__decorate([
    mobx_1.computed
], Grapher.prototype, "useAdminAPI", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showAdminControls", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "downloadLegacyDataFromOwidVariableIds", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "receiveLegacyData", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "_setInputTable", null);
__decorate([
    mobx_1.action
], Grapher.prototype, "rebuildInputOwidTable", null);
__decorate([
    mobx_1.observable
], Grapher.prototype, "legacyVariableDataJson", void 0);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "_receiveLegacyDataAndApplySelection", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "appendNewEntitySelectionOptions", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "applyOriginalSelectionAsAuthored", null);
__decorate([
    mobx_1.observable
], Grapher.prototype, "_baseFontSize", void 0);
__decorate([
    mobx_1.computed
], Grapher.prototype, "baseFontSize", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isReady", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "whatAreWeWaitingFor", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "newSlugs", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "loadingDimensions", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isInIFrame", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "times", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "startHandleTimeBound", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "endHandleTimeBound", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "startTime", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "endTime", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "onlySingleTimeSelectionPossible", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "shouldLinkToOwid", null);
__decorate([
    mobx_1.computed.struct
], Grapher.prototype, "variableIds", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "dataFileName", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "dataUrl", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasOWIDLogo", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasFatalErrors", null);
__decorate([
    decko_1.bind
], Grapher.prototype, "dispose", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "fontSize", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "ensureValidConfigWhenEditing", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "validDimensions", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "originUrlWithProtocol", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "overlayTab", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "currentTab", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "timelineHandleTimeBounds", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "dimensionSlots", null);
__decorate([
    mobx_1.computed.struct
], Grapher.prototype, "filledDimensions", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "addDimension", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "setDimensionsForProperty", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "setDimensionsFromConfigs", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "displaySlug", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "availableTabs", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "currentTitle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasTimeline", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "areHandlesOnSameTime", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "mapColumnSlug", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "yColumns", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "yColumnSlugsInSelectionOrder", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "yColumnSlugs", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "yColumnSlug", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "xColumnSlug", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "sizeColumnSlug", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "colorColumnSlug", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "yScaleType", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "xScaleType", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "timeTitleSuffix", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "sourcesLine", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "activeColumnSlugs", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "columnsWithSources", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "defaultSourcesLine", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "axisDimensions", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "yColumnsFromDimensionsOrSlugsOrAuto", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "defaultTitle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "displayTitle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "object", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isLineChart", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isScatter", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isTimeScatter", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isStackedArea", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isSlopeChart", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isDiscreteBar", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isStackedBar", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isStackedDiscreteBar", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isLineChartThatTurnedIntoDiscreteBar", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "activeColorScale", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "activeColorScaleExceptMap", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "supportsMultipleYColumns", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "xDimension", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "xOverrideTime", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "idealBounds", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasYDimension", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "mapConfig", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "cacheTag", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "mapIsClickable", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "relativeToggleLabel", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isRelativeMode", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "canToggleRelativeMode", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "mappableData", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isMobile", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isPortrait", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "widthForDeviceOrientation", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "heightForDeviceOrientation", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "useIdealBounds", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "scaleToFitIdeal", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "renderWidth", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "renderHeight", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "tabBounds", null);
__decorate([
    mobx_1.observable.ref
], Grapher.prototype, "popups", void 0);
__decorate([
    mobx_1.computed
], Grapher.prototype, "containerElement", null);
__decorate([
    mobx_1.observable
], Grapher.prototype, "hasBeenVisible", void 0);
__decorate([
    mobx_1.observable
], Grapher.prototype, "uncaughtError", void 0);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "setError", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "clearErrors", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "isOnTableTab", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "toggleTabCommand", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "togglePlayingCommand", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "availableEntities", null);
__decorate([
    mobx_1.observable
], Grapher.prototype, "slideShow", void 0);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "toggleTimelineCommand", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "toggleFilterAllCommand", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "toggleYScaleTypeCommand", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "toggleFacetStrategy", null);
__decorate([
    mobx_1.observable
], Grapher.prototype, "facet", void 0);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasMultipleYColumns", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "selectedColumnSlugs", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "availableFacetStrategies", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "facetStrategy", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "randomSelection", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "resetAnnotation", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "renderAnnotation", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "checkVisibility", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "setBaseFontSize", null);
__decorate([
    mobx_1.observable
], Grapher.prototype, "isShareMenuActive", void 0);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasRelatedQuestion", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "footerControlsLines", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "footerControlsHeight", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "clearQueryParams", null);
__decorate([
    mobx_1.action.bound
], Grapher.prototype, "reset", null);
__decorate([
    mobx_1.computed.struct
], Grapher.prototype, "allParams", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "selectedEntitiesIfDifferentThanAuthors", null);
__decorate([
    mobx_1.computed.struct
], Grapher.prototype, "changedParams", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "authorsVersion", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "queryStr", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "baseUrl", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "manager", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "canonicalUrl", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "embedUrl", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "embedDialogAdditionalElements", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasUserChangedTimeHandles", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "hasUserChangedMapTimeHandle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "timeParam", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "disablePlay", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showSmallCountriesFilterToggle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showYScaleToggle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showXScaleToggle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showZoomToggle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showAbsRelToggle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showHighlightToggle", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showChangeEntityButton", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showAddEntityButton", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "showSelectEntitiesButton", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "canSelectMultipleEntities", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "numSelectableEntityNames", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "canChangeEntity", null);
__decorate([
    mobx_1.computed
], Grapher.prototype, "startSelectingWhenLineClicked", null);
__decorate([
    mobx_1.observable
], Grapher.prototype, "hideEntityControls", void 0);
Grapher = Grapher_1 = __decorate([
    mobx_react_1.observer
], Grapher);
exports.Grapher = Grapher;
const defaultObject = Persistable_1.objectWithPersistablesToObject(new Grapher(), GrapherInterface_1.grapherKeysToSerialize);
const getErrorMessageRelatedQuestionUrl = (question) => {
    return question.text
        ? (!question.url && "Missing URL") ||
            (!question.url.match(/^https?:\/\//) &&
                "URL should start with http(s)://") ||
            undefined
        : undefined;
};
exports.getErrorMessageRelatedQuestionUrl = getErrorMessageRelatedQuestionUrl;
//# sourceMappingURL=Grapher.js.map