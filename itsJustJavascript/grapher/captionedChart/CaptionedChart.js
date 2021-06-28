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
exports.StaticCaptionedChart = exports.CaptionedChart = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const Header_1 = require("../header/Header");
const Footer_1 = require("../footer/Footer");
const ChartTypeMap_1 = require("../chart/ChartTypeMap");
const GrapherConstants_1 = require("../core/GrapherConstants");
const LoadingIndicator_1 = require("../loadingIndicator/LoadingIndicator");
const FacetChart_1 = require("../facetChart/FacetChart");
const faExchangeAlt_1 = require("@fortawesome/free-solid-svg-icons/faExchangeAlt");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const CollapsibleList_1 = require("../controls/CollapsibleList/CollapsibleList");
const Controls_1 = require("../controls/Controls");
const ScaleSelector_1 = require("../controls/ScaleSelector");
const AddEntityButton_1 = require("../controls/AddEntityButton");
const faPencilAlt_1 = require("@fortawesome/free-solid-svg-icons/faPencilAlt");
const Util_1 = require("../../clientUtils/Util");
const OUTSIDE_PADDING = 15;
const PADDING_BELOW_HEADER = 18;
const CONTROLS_ROW_HEIGHT = 36;
const PADDING_ABOVE_FOOTER = 25;
let CaptionedChart = class CaptionedChart extends React.Component {
    get manager() {
        return this.props.manager;
    }
    get containerElement() {
        var _a;
        return (_a = this.manager) === null || _a === void 0 ? void 0 : _a.containerElement;
    }
    get maxWidth() {
        var _a;
        return (_a = this.props.maxWidth) !== null && _a !== void 0 ? _a : this.bounds.width - OUTSIDE_PADDING * 2;
    }
    get header() {
        return new Header_1.Header({
            manager: this.manager,
            maxWidth: this.maxWidth,
        });
    }
    get footer() {
        return new Footer_1.Footer({
            manager: this.manager,
            maxWidth: this.maxWidth,
        });
    }
    get chartHeight() {
        const controlsRowHeight = this.controls.length ? CONTROLS_ROW_HEIGHT : 0;
        return (this.bounds.height -
            this.header.height -
            controlsRowHeight -
            this.footer.height -
            PADDING_ABOVE_FOOTER);
    }
    // todo: should we remove this and not make a distinction between map and chart tabs?
    get isMapTab() {
        return this.manager.tab === GrapherConstants_1.GrapherTabOption.map;
    }
    get bounds() {
        var _a, _b;
        return (_b = (_a = this.props.bounds) !== null && _a !== void 0 ? _a : this.manager.tabBounds) !== null && _b !== void 0 ? _b : Bounds_1.DEFAULT_BOUNDS;
    }
    // The bounds for the middle chart part
    get boundsForChart() {
        return new Bounds_1.Bounds(0, 0, this.bounds.width, this.chartHeight)
            .padWidth(OUTSIDE_PADDING)
            .padTop(this.isMapTab ? 0 : PADDING_BELOW_HEADER)
            .padBottom(OUTSIDE_PADDING);
    }
    get isFaceted() {
        return !this.isMapTab && !!this.manager.facetStrategy;
    }
    renderChart() {
        var _a, _b, _c;
        const { manager } = this;
        const bounds = this.boundsForChart;
        const chartTypeName = this.isMapTab
            ? GrapherConstants_1.ChartTypeName.WorldMap
            : (_b = (_a = manager.typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart) !== null && _a !== void 0 ? _a : manager.type) !== null && _b !== void 0 ? _b : GrapherConstants_1.ChartTypeName.LineChart;
        const ChartClass = (_c = ChartTypeMap_1.ChartComponentClassMap.get(chartTypeName)) !== null && _c !== void 0 ? _c : ChartTypeMap_1.DefaultChartClass;
        // Todo: make FacetChart a chart type name?
        if (this.isFaceted)
            return (React.createElement(FacetChart_1.FacetChart, { bounds: bounds, chartTypeName: chartTypeName, manager: manager }));
        return (React.createElement(ChartClass, { bounds: bounds, manager: manager, containerElement: this.containerElement }));
    }
    componentDidMount() {
        Util_1.exposeInstanceOnWindow(this, "captionedChart");
    }
    startSelecting() {
        this.manager.isSelectingData = true;
    }
    get controls() {
        const manager = this.manager;
        // Todo: we don't yet show any controls on Maps, but seems like we would want to.
        if (!manager.isReady || this.isMapTab)
            return [];
        const { showYScaleToggle, showXScaleToggle } = manager;
        const controls = [];
        if (showYScaleToggle)
            controls.push(React.createElement(ScaleSelector_1.ScaleSelector, { key: "scaleSelector", manager: manager.yAxis, prefix: showXScaleToggle ? "Y: " : "" }));
        if (showXScaleToggle)
            controls.push(React.createElement(ScaleSelector_1.ScaleSelector, { key: "scaleSelector", manager: manager.xAxis, prefix: "X: " }));
        if (manager.showSelectEntitiesButton)
            controls.push(React.createElement("button", { type: "button", key: "grapher-select-entities", "data-track-note": "grapher-select-entities", onClick: this.startSelecting },
                React.createElement("span", { className: "SelectEntitiesButton" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPencilAlt_1.faPencilAlt }),
                    `Select ${manager.entityTypePlural}`)));
        if (manager.showChangeEntityButton)
            controls.push(React.createElement("button", { type: "button", key: "grapher-change-entities", "data-track-note": "grapher-change-entity", className: "ChangeEntityButton", onClick: this.startSelecting },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExchangeAlt_1.faExchangeAlt }),
                " Change",
                " ",
                manager.entityType));
        if (manager.showAddEntityButton)
            controls.push(React.createElement(AddEntityButton_1.AddEntityButton, { key: "AddEntityButton", manager: manager }));
        if (manager.showZoomToggle)
            controls.push(React.createElement(Controls_1.ZoomToggle, { key: "ZoomToggle", manager: manager }));
        if (manager.showAbsRelToggle)
            controls.push(React.createElement(Controls_1.AbsRelToggle, { key: "AbsRelToggle", manager: manager }));
        if (this.isFaceted && manager.showFacetYRangeToggle)
            controls.push(React.createElement(Controls_1.FacetYRangeToggle, { key: "FacetYRangeToggle", manager: manager }));
        if (manager.showHighlightToggle)
            controls.push(React.createElement(Controls_1.HighlightToggle, { key: "highlight-toggle", manager: manager }));
        if (manager.showSmallCountriesFilterToggle)
            controls.push(React.createElement(Controls_1.FilterSmallCountriesToggle, { key: "FilterSmallCountriesToggle", manager: manager }));
        return controls;
    }
    get selectionArray() {
        return this.manager.selection;
    }
    renderControlsRow() {
        return this.controls.length ? (React.createElement("div", { className: "controlsRow" },
            React.createElement(CollapsibleList_1.CollapsibleList, null, this.controls))) : null;
    }
    renderLoadingIndicator() {
        return (React.createElement("foreignObject", Object.assign({}, this.boundsForChart.toProps()),
            React.createElement(LoadingIndicator_1.LoadingIndicator, { title: this.manager.whatAreWeWaitingFor })));
    }
    render() {
        const { bounds, chartHeight, maxWidth } = this;
        const { width } = bounds;
        const containerStyle = {
            position: "relative",
            clear: "both",
        };
        return (React.createElement(React.Fragment, null,
            React.createElement(Header_1.Header, { manager: this.manager, maxWidth: maxWidth }),
            this.renderControlsRow(),
            React.createElement("div", { style: containerStyle },
                React.createElement("svg", Object.assign({}, this.svgProps, { width: width, height: chartHeight, viewBox: `0 0 ${width} ${chartHeight}` }), this.manager.isReady
                    ? this.renderChart()
                    : this.renderLoadingIndicator())),
            React.createElement(Footer_1.Footer, { manager: this.manager, maxWidth: maxWidth })));
    }
    get svgProps() {
        var _a;
        return {
            xmlns: "http://www.w3.org/2000/svg",
            version: "1.1",
            style: {
                fontFamily: "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: (_a = this.manager.fontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE,
                backgroundColor: "white",
                textRendering: "optimizeLegibility",
                WebkitFontSmoothing: "antialiased",
            },
        };
    }
};
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "manager", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "containerElement", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "maxWidth", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "header", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "footer", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "chartHeight", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "isMapTab", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "boundsForChart", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "isFaceted", null);
__decorate([
    mobx_1.action.bound
], CaptionedChart.prototype, "startSelecting", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "controls", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], CaptionedChart.prototype, "svgProps", null);
CaptionedChart = __decorate([
    mobx_react_1.observer
], CaptionedChart);
exports.CaptionedChart = CaptionedChart;
let StaticCaptionedChart = class StaticCaptionedChart extends CaptionedChart {
    constructor(props) {
        super(props);
    }
    get paddedBounds() {
        return this.bounds.pad(OUTSIDE_PADDING);
    }
    // The bounds for the middle chart part
    get boundsForChart() {
        return this.paddedBounds
            .padTop(this.header.height)
            .padBottom(this.footer.height + PADDING_ABOVE_FOOTER)
            .padTop(this.isMapTab ? 0 : PADDING_BELOW_HEADER);
    }
    render() {
        const { bounds, paddedBounds } = this;
        const { width, height } = bounds;
        return (React.createElement("svg", Object.assign({}, this.svgProps, { width: width, height: height, viewBox: `0 0 ${width} ${height}` }),
            this.header.renderStatic(paddedBounds.x, paddedBounds.y),
            this.renderChart(),
            this.footer.renderStatic(paddedBounds.x, paddedBounds.bottom - this.footer.height)));
    }
};
__decorate([
    mobx_1.computed
], StaticCaptionedChart.prototype, "paddedBounds", null);
__decorate([
    mobx_1.computed
], StaticCaptionedChart.prototype, "boundsForChart", null);
StaticCaptionedChart = __decorate([
    mobx_react_1.observer
], StaticCaptionedChart);
exports.StaticCaptionedChart = StaticCaptionedChart;
//# sourceMappingURL=CaptionedChart.js.map