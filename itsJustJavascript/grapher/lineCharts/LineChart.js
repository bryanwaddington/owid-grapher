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
exports.LineChart = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const d3_selection_1 = require("d3-selection");
const d3_ease_1 = require("d3-ease");
const Bounds_1 = require("../../clientUtils/Bounds");
const AxisViews_1 = require("../axis/AxisViews");
const Axis_1 = require("../axis/Axis");
const PointVector_1 = require("../../clientUtils/PointVector");
const LineLegend_1 = require("../lineLegend/LineLegend");
const ComparisonLine_1 = require("../scatterCharts/ComparisonLine");
const Tooltip_1 = require("../tooltip/Tooltip");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const d3_array_1 = require("d3-array");
const GrapherConstants_1 = require("../core/GrapherConstants");
const ColorSchemes_1 = require("../color/ColorSchemes");
const AxisConfig_1 = require("../axis/AxisConfig");
const LineChartUtils_1 = require("./LineChartUtils");
const ChartUtils_1 = require("../chart/ChartUtils");
const BLUR_COLOR = "#eee";
let Lines = class Lines extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    get allValues() {
        return Util_1.flatten(this.props.placedSeries.map((series) => series.points));
    }
    onCursorMove(ev) {
        const { dualAxis } = this.props;
        const { horizontalAxis } = dualAxis;
        const mouse = Util_1.getRelativeMouse(this.base.current, ev);
        let hoverX;
        if (dualAxis.innerBounds.contains(mouse)) {
            const closestValue = Util_1.minBy(this.allValues, (point) => Math.abs(horizontalAxis.place(point.x) - mouse.x));
            hoverX = closestValue === null || closestValue === void 0 ? void 0 : closestValue.x;
        }
        this.props.onHover(hoverX);
    }
    onCursorLeave() {
        this.props.onHover(undefined);
    }
    get bounds() {
        const { horizontalAxis, verticalAxis } = this.props.dualAxis;
        return Bounds_1.Bounds.fromCorners(new PointVector_1.PointVector(horizontalAxis.range[0], verticalAxis.range[0]), new PointVector_1.PointVector(horizontalAxis.range[1], verticalAxis.range[1]));
    }
    get focusedLines() {
        const { focusedSeriesNames } = this.props;
        // If nothing is focused, everything is
        if (!focusedSeriesNames.length)
            return this.props.placedSeries;
        return this.props.placedSeries.filter((series) => focusedSeriesNames.includes(series.seriesName));
    }
    get backgroundLines() {
        const { focusedSeriesNames } = this.props;
        return this.props.placedSeries.filter((series) => !focusedSeriesNames.includes(series.seriesName));
    }
    // Don't display point markers if there are very many of them for performance reasons
    // Note that we're using circle elements instead of marker-mid because marker performance in Safari 10 is very poor for some reason
    get hasMarkers() {
        if (this.props.hidePoints)
            return false;
        return (Util_1.sum(this.focusedLines.map((series) => series.placedPoints.length)) <
            500);
    }
    get strokeWidth() {
        var _a;
        return (_a = this.props.lineStrokeWidth) !== null && _a !== void 0 ? _a : 1.5;
    }
    renderFocusGroups() {
        return this.focusedLines.map((series, index) => {
            // If the series only contains one point, then we will always want to show a marker/circle
            // because we can't draw a line.
            const showMarkers = (this.hasMarkers || series.placedPoints.length === 1) &&
                !series.isProjection;
            return (React.createElement("g", { key: index },
                React.createElement("path", { stroke: series.color, strokeLinecap: "round", d: Util_1.pointsToPath(series.placedPoints.map((value) => [
                        value.x,
                        value.y,
                    ])), fill: "none", strokeWidth: this.strokeWidth, strokeDasharray: series.isProjection ? "1,4" : undefined }),
                showMarkers && (React.createElement("g", { fill: series.color }, series.placedPoints.map((value, index) => (React.createElement("circle", { key: index, cx: value.x, cy: value.y, r: 2 })))))));
        });
    }
    renderBackgroundGroups() {
        return this.backgroundLines.map((series, index) => (React.createElement("g", { key: index },
            React.createElement("path", { key: ChartUtils_1.getSeriesKey(series, "line"), strokeLinecap: "round", stroke: "#ddd", d: Util_1.pointsToPath(series.placedPoints.map((value) => [
                    value.x,
                    value.y,
                ])), fill: "none", strokeWidth: 1 }))));
    }
    componentDidMount() {
        const base = this.base.current;
        const container = base.closest("svg");
        container.addEventListener("mousemove", this.onCursorMove);
        container.addEventListener("mouseleave", this.onCursorLeave);
        container.addEventListener("touchstart", this.onCursorMove);
        container.addEventListener("touchmove", this.onCursorMove);
        container.addEventListener("touchend", this.onCursorLeave);
        container.addEventListener("touchcancel", this.onCursorLeave);
        this.container = container;
    }
    componentWillUnmount() {
        const { container } = this;
        if (!container)
            return;
        container.removeEventListener("mousemove", this.onCursorMove);
        container.removeEventListener("mouseleave", this.onCursorLeave);
        container.removeEventListener("touchstart", this.onCursorMove);
        container.removeEventListener("touchmove", this.onCursorMove);
        container.removeEventListener("touchend", this.onCursorLeave);
        container.removeEventListener("touchcancel", this.onCursorLeave);
    }
    render() {
        const { bounds } = this;
        return (React.createElement("g", { ref: this.base, className: "Lines" },
            React.createElement("rect", { x: Math.round(bounds.x), y: Math.round(bounds.y), width: Math.round(bounds.width), height: Math.round(bounds.height), fill: "rgba(255,255,255,0)", opacity: 0 }),
            this.renderBackgroundGroups(),
            this.renderFocusGroups()));
    }
};
__decorate([
    mobx_1.computed
], Lines.prototype, "allValues", null);
__decorate([
    mobx_1.action.bound
], Lines.prototype, "onCursorMove", null);
__decorate([
    mobx_1.action.bound
], Lines.prototype, "onCursorLeave", null);
__decorate([
    mobx_1.computed
], Lines.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], Lines.prototype, "focusedLines", null);
__decorate([
    mobx_1.computed
], Lines.prototype, "backgroundLines", null);
__decorate([
    mobx_1.computed
], Lines.prototype, "hasMarkers", null);
__decorate([
    mobx_1.computed
], Lines.prototype, "strokeWidth", null);
Lines = __decorate([
    mobx_react_1.observer
], Lines);
let LineChart = class LineChart extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        // todo: rename mouseHoverX -> hoverX and hoverX -> activeX
        this.mouseHoverX = undefined;
        this.defaultRightPadding = 1;
    }
    transformTable(table) {
        table = table.filterByEntityNames(this.selectionArray.selectedEntityNames);
        // TODO: remove this filter once we don't have mixed type columns in datasets
        table = table.replaceNonNumericCellsWithErrorValues(this.yColumnSlugs);
        if (this.isLogScale)
            table = table.replaceNonPositiveCellsForLogScale(this.manager.yColumnSlugs);
        return table;
    }
    get inputTable() {
        return this.manager.table;
    }
    get transformedTableFromGrapher() {
        var _a;
        return ((_a = this.manager.transformedTable) !== null && _a !== void 0 ? _a : this.transformTable(this.inputTable));
    }
    get transformedTable() {
        var _a;
        let table = this.transformedTableFromGrapher;
        // The % growth transform cannot be applied in transformTable() because it will filter out
        // any rows before startHandleTimeBound and change the timeline bounds.
        const { isRelativeMode, startHandleTimeBound } = this.manager;
        if (isRelativeMode && startHandleTimeBound !== undefined) {
            table = table.toTotalGrowthForEachColumnComparedToStartTime(startHandleTimeBound, (_a = this.manager.yColumnSlugs) !== null && _a !== void 0 ? _a : []);
        }
        return table;
    }
    onHover(hoverX) {
        this.mouseHoverX = hoverX;
    }
    get hoverX() {
        var _a, _b;
        return (_a = this.mouseHoverX) !== null && _a !== void 0 ? _a : (_b = this.props.manager.annotation) === null || _b === void 0 ? void 0 : _b.year;
    }
    get manager() {
        return this.props.manager;
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get maxLegendWidth() {
        return this.bounds.width / 3;
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    seriesIsBlurred(series) {
        return (this.isFocusMode &&
            !this.focusedSeriesNames.includes(series.seriesName));
    }
    get tooltip() {
        const { hoverX, dualAxis, inputTable, formatColumn } = this;
        if (hoverX === undefined)
            return undefined;
        const sortedData = Util_1.sortBy(this.series, (series) => {
            const value = series.points.find((point) => point.x === hoverX);
            return value !== undefined ? -value.y : Infinity;
        });
        const formatted = inputTable.timeColumnFormatFunction(hoverX);
        return (React.createElement(Tooltip_1.Tooltip, { tooltipManager: this.manager, x: dualAxis.horizontalAxis.place(hoverX), y: dualAxis.verticalAxis.rangeMin +
                dualAxis.verticalAxis.rangeSize / 2, style: { padding: "0.3em" }, offsetX: 5 },
            React.createElement("table", { style: {
                    fontSize: "0.9em",
                    lineHeight: "1.4em",
                    whiteSpace: "normal",
                } },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", { colSpan: 3 },
                            React.createElement("strong", null, formatted))),
                    sortedData.map((series) => {
                        const value = series.points.find((point) => point.x === hoverX);
                        const annotation = this.getAnnotationsForSeries(series.seriesName);
                        // It sometimes happens that data is missing for some years for a particular
                        // entity. If the user hovers over these years, we want to show a "No data"
                        // notice. However, we only want to show this notice when we are in the middle
                        // of a time series – when data points exist before and after the current year.
                        // Otherwise we want to entirely exclude the entity from the tooltip.
                        if (!value) {
                            const [startX, endX] = d3_array_1.extent(series.points, (point) => point.x);
                            if (startX === undefined ||
                                endX === undefined ||
                                startX > hoverX ||
                                endX < hoverX)
                                return undefined;
                        }
                        const isBlur = this.seriesIsBlurred(series) ||
                            value === undefined;
                        const textColor = isBlur ? "#ddd" : "#333";
                        const annotationColor = isBlur ? "#ddd" : "#999";
                        const circleColor = isBlur
                            ? BLUR_COLOR
                            : series.color;
                        return (React.createElement("tr", { key: ChartUtils_1.getSeriesKey(series), style: { color: textColor } },
                            React.createElement("td", null,
                                React.createElement("div", { style: {
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "5px",
                                        backgroundColor: circleColor,
                                        display: "inline-block",
                                        marginRight: "2px",
                                    } })),
                            React.createElement("td", { style: {
                                    paddingRight: "0.8em",
                                    fontSize: "0.9em",
                                } },
                                series.seriesName,
                                annotation && (React.createElement("span", { className: "tooltipAnnotation", style: {
                                        color: annotationColor,
                                        fontSize: "90%",
                                    } },
                                    " ",
                                    annotation))),
                            React.createElement("td", { style: {
                                    textAlign: "right",
                                    whiteSpace: "nowrap",
                                } }, !value
                                ? "No data"
                                : formatColumn.formatValueShort(value.y, { noTrailingZeroes: false }))));
                    })))));
    }
    onLegendClick() {
        if (this.manager.startSelectingWhenLineClicked)
            this.manager.isSelectingData = true;
    }
    onLegendMouseOver(seriesName) {
        this.hoveredSeriesName = seriesName;
    }
    onLegendMouseLeave() {
        this.hoveredSeriesName = undefined;
    }
    get focusedSeriesNames() {
        var _a, _b, _c;
        const entityName = (_c = (_b = (_a = this.props.manager.annotation) === null || _a === void 0 ? void 0 : _a.entityName) !== null && _b !== void 0 ? _b : this.hoveredSeriesName) !== null && _c !== void 0 ? _c : undefined;
        return entityName ? [entityName] : [];
    }
    get isFocusMode() {
        return this.focusedSeriesNames.length > 0;
    }
    componentDidMount() {
        if (!this.manager.isExportingtoSvgOrPng)
            this.runFancyIntroAnimation();
        Util_1.exposeInstanceOnWindow(this);
    }
    runFancyIntroAnimation() {
        this.animSelection = d3_selection_1.select(this.base.current)
            .selectAll("clipPath > rect")
            .attr("width", 0);
        this.animSelection
            .transition()
            .duration(800)
            .ease(d3_ease_1.easeLinear)
            .attr("width", this.bounds.width)
            .on("end", () => this.forceUpdate()); // Important in case bounds changes during transition
    }
    componentWillUnmount() {
        if (this.animSelection)
            this.animSelection.interrupt();
    }
    get renderUid() {
        return Util_1.guid();
    }
    get fontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get legendX() {
        var _a;
        return this.bounds.right - (((_a = this.legendDimensions) === null || _a === void 0 ? void 0 : _a.width) || 0);
    }
    get legendDimensions() {
        return this.manager.hideLegend
            ? undefined
            : new LineLegend_1.LineLegend({ manager: this });
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.props.bounds, message: this.failMessage }));
        const { manager, tooltip, dualAxis, hoverX, renderUid, bounds } = this;
        const { horizontalAxis, verticalAxis } = dualAxis;
        const comparisonLines = manager.comparisonLines || [];
        // The tiny bit of extra space in the clippath is to ensure circles centered on the very edge are still fully visible
        const clipPath = ChartUtils_1.makeClipPath(renderUid, {
            x: dualAxis.innerBounds.x - 10,
            y: bounds.y - 18,
            width: bounds.width + 10,
            height: bounds.height * 2,
        });
        return (React.createElement("g", { ref: this.base, className: "LineChart" },
            clipPath.element,
            React.createElement(AxisViews_1.DualAxisComponent, { dualAxis: dualAxis, showTickMarks: true }),
            React.createElement("g", { clipPath: clipPath.id },
                comparisonLines.map((line, index) => (React.createElement(ComparisonLine_1.ComparisonLine, { key: index, dualAxis: dualAxis, comparisonLine: line }))),
                React.createElement(LineLegend_1.LineLegend, { manager: this }),
                React.createElement(Lines, { dualAxis: dualAxis, placedSeries: this.placedSeries, hidePoints: manager.hidePoints, onHover: this.onHover, focusedSeriesNames: this.focusedSeriesNames, lineStrokeWidth: manager.lineStrokeWidth })),
            hoverX !== undefined && (React.createElement("g", { className: "hoverIndicator" },
                this.series.map((series) => {
                    const value = series.points.find((point) => point.x === hoverX);
                    if (!value || this.seriesIsBlurred(series))
                        return null;
                    return (React.createElement("circle", { key: ChartUtils_1.getSeriesKey(series), cx: horizontalAxis.place(value.x), cy: verticalAxis.place(value.y), r: 4, fill: series.color }));
                }),
                React.createElement("line", { x1: horizontalAxis.place(hoverX), y1: verticalAxis.range[0], x2: horizontalAxis.place(hoverX), y2: verticalAxis.range[1], stroke: "rgba(180,180,180,.4)" }))),
            tooltip));
    }
    get failMessage() {
        const message = ChartUtils_1.getDefaultFailMessage(this.manager);
        if (message)
            return message;
        if (!this.series.length)
            return "No matching data";
        return "";
    }
    get yColumns() {
        return this.yColumnSlugs.map((slug) => this.transformedTable.get(slug));
    }
    get yColumnSlugs() {
        return ChartUtils_1.autoDetectYColumnSlugs(this.manager);
    }
    get formatColumn() {
        return this.yColumns[0];
    }
    // todo: for now just works with 1 y column
    get annotationsMap() {
        var _a;
        return (_a = this.inputTable
            .getAnnotationColumnForColumn(this.yColumnSlugs[0])) === null || _a === void 0 ? void 0 : _a.getUniqueValuesGroupedBy(this.inputTable.entityNameSlug);
    }
    getAnnotationsForSeries(seriesName) {
        const annotationsMap = this.annotationsMap;
        const annos = annotationsMap === null || annotationsMap === void 0 ? void 0 : annotationsMap.get(seriesName);
        return annos
            ? Array.from(annos.values())
                .filter((anno) => anno)
                .join(" & ")
            : undefined;
    }
    get colorScheme() {
        var _a;
        return ((_a = (this.manager.baseColorScheme
            ? ColorSchemes_1.ColorSchemes[this.manager.baseColorScheme]
            : null)) !== null && _a !== void 0 ? _a : ColorSchemes_1.ColorSchemes["owid-distinct"]);
    }
    get seriesStrategy() {
        const hasNormalAndProjectedSeries = this.yColumns.some((col) => col.isProjection) &&
            this.yColumns.some((col) => !col.isProjection);
        return ChartUtils_1.autoDetectSeriesStrategy(this.manager, hasNormalAndProjectedSeries);
    }
    get isLogScale() {
        return this.yAxisConfig.scaleType === GrapherConstants_1.ScaleType.log;
    }
    get series() {
        const arrOfSeries = Util_1.flatten(this.yColumns.map((col) => LineChartUtils_1.columnToLineChartSeriesArray(col, this.seriesStrategy, !!this.manager.canSelectMultipleEntities)));
        this.colorScheme.assignColors(arrOfSeries, this.manager.invertColorScheme, this.seriesStrategy === GrapherConstants_1.SeriesStrategy.entity
            ? this.inputTable.entityNameColorIndex
            : this.inputTable.columnDisplayNameToColorMap, this.manager.seriesColorMap);
        return arrOfSeries;
    }
    get allPoints() {
        return Util_1.flatten(this.series.map((series) => series.points));
    }
    get placedSeries() {
        const { dualAxis } = this;
        const { horizontalAxis, verticalAxis } = dualAxis;
        return this.series
            .slice()
            .reverse()
            .map((series) => {
            return Object.assign(Object.assign({}, series), { placedPoints: series.points.map((point) => new PointVector_1.PointVector(Math.round(horizontalAxis.place(point.x)), Math.round(verticalAxis.place(point.y)))) });
        });
    }
    // Order of the legend items on a line chart should visually correspond
    // to the order of the lines as the approach the legend
    get labelSeries() {
        // If there are any projections, ignore non-projection legends
        // Bit of a hack
        let seriesToShow = this.series;
        if (seriesToShow.some((series) => !!series.isProjection))
            seriesToShow = seriesToShow.filter((series) => series.isProjection);
        return seriesToShow.map((series) => {
            const { seriesName, color } = series;
            const lastValue = Util_1.last(series.points).y;
            return {
                color,
                seriesName,
                // E.g. https://ourworldindata.org/grapher/size-poverty-gap-world
                label: this.manager.hideLegend ? "" : `${seriesName}`,
                annotation: this.getAnnotationsForSeries(seriesName),
                yValue: lastValue,
            };
        });
    }
    // todo: Refactor
    get dualAxis() {
        return new Axis_1.DualAxis({
            bounds: this.bounds.padRight(this.legendDimensions
                ? this.legendDimensions.width
                : this.defaultRightPadding),
            verticalAxis: this.verticalAxisPart,
            horizontalAxis: this.horizontalAxisPart,
        });
    }
    get verticalAxis() {
        return this.dualAxis.verticalAxis;
    }
    get horizontalAxisPart() {
        var _a;
        const { manager } = this;
        const axisConfig = (_a = manager.xAxis) !== null && _a !== void 0 ? _a : new AxisConfig_1.AxisConfig(manager.xAxisConfig, this);
        if (manager.hideXAxis)
            axisConfig.hideAxis = true;
        const axis = axisConfig.toHorizontalAxis();
        axis.updateDomainPreservingUserSettings(this.transformedTable.timeDomainFor(this.yColumnSlugs));
        axis.scaleType = GrapherConstants_1.ScaleType.linear;
        axis.formatColumn = this.inputTable.timeColumn;
        axis.hideFractionalTicks = true;
        axis.hideGridlines = true;
        return axis;
    }
    get yAxisConfig() {
        var _a;
        const { manager } = this;
        return (_a = manager.yAxis) !== null && _a !== void 0 ? _a : new AxisConfig_1.AxisConfig(manager.yAxisConfig, this);
    }
    get verticalAxisPart() {
        const { manager } = this;
        const axisConfig = this.yAxisConfig;
        if (manager.hideYAxis)
            axisConfig.hideAxis = true;
        const yDomain = this.transformedTable.domainFor(this.yColumnSlugs);
        const domain = axisConfig.domain;
        const axis = axisConfig.toVerticalAxis();
        axis.updateDomainPreservingUserSettings([
            Math.min(domain[0], yDomain[0]),
            Math.max(domain[1], yDomain[1]),
        ]);
        axis.hideFractionalTicks = this.yColumns.every((yColumn) => yColumn.isAllIntegers); // all y axis points are integral, don't show fractional ticks in that case
        axis.label = "";
        axis.formatColumn = this.formatColumn;
        return axis;
    }
};
__decorate([
    mobx_1.computed
], LineChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "transformedTableFromGrapher", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.observable
], LineChart.prototype, "mouseHoverX", void 0);
__decorate([
    mobx_1.action.bound
], LineChart.prototype, "onHover", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "hoverX", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "manager", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "maxLegendWidth", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "tooltip", null);
__decorate([
    mobx_1.observable
], LineChart.prototype, "hoveredSeriesName", void 0);
__decorate([
    mobx_1.action.bound
], LineChart.prototype, "onLegendClick", null);
__decorate([
    mobx_1.action.bound
], LineChart.prototype, "onLegendMouseOver", null);
__decorate([
    mobx_1.action.bound
], LineChart.prototype, "onLegendMouseLeave", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "focusedSeriesNames", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "isFocusMode", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "renderUid", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "legendDimensions", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "yColumns", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "yColumnSlugs", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "formatColumn", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "annotationsMap", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "colorScheme", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "seriesStrategy", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "isLogScale", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "series", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "allPoints", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "placedSeries", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "labelSeries", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "dualAxis", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "verticalAxis", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "horizontalAxisPart", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "yAxisConfig", null);
__decorate([
    mobx_1.computed
], LineChart.prototype, "verticalAxisPart", null);
LineChart = __decorate([
    mobx_react_1.observer
], LineChart);
exports.LineChart = LineChart;
//# sourceMappingURL=LineChart.js.map