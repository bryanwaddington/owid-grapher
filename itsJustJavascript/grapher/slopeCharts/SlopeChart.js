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
var SlopeChartAxis_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlopeChart = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const VerticalColorLegend_1 = require("../verticalColorLegend/VerticalColorLegend");
const ColorScale_1 = require("../color/ColorScale");
const GrapherConstants_1 = require("../core/GrapherConstants");
const d3_scale_1 = require("d3-scale");
const d3_array_1 = require("d3-array");
const d3_selection_1 = require("d3-selection");
const Text_1 = require("../text/Text");
const TextWrap_1 = require("../text/TextWrap");
const SlopeChartConstants_1 = require("./SlopeChartConstants");
const ChartUtils_1 = require("../chart/ChartUtils");
const ColorConstants_1 = require("../color/ColorConstants");
let SlopeChart = class SlopeChart extends React.Component {
    constructor() {
        super(...arguments);
        this.sidebarMinWidth = 100;
        this.colorScale = new ColorScale_1.ColorScale(this);
        this.defaultBaseColorScheme = ColorConstants_1.ColorSchemeName.continents;
    }
    transformTable(table) {
        if (!table.has(this.yColumnSlug))
            return table;
        // TODO: remove this filter once we don't have mixed type columns in datasets
        table = table.replaceNonNumericCellsWithErrorValues([this.yColumnSlug]);
        return table
            .dropRowsWithErrorValuesForColumn(this.yColumnSlug)
            .interpolateColumnWithTolerance(this.yColumnSlug);
    }
    get manager() {
        return this.props.manager;
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get fontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get legendItems() {
        return this.colorScale.legendBins
            .filter((bin) => this.colorsInUse.includes(bin.color))
            .map((bin) => {
            var _a, _b;
            return {
                key: (_a = bin.label) !== null && _a !== void 0 ? _a : "",
                label: (_b = bin.label) !== null && _b !== void 0 ? _b : "",
                color: bin.color,
            };
        });
    }
    get maxLegendWidth() {
        return this.sidebarMaxWidth;
    }
    onSlopeMouseOver(slopeProps) {
        this.hoverKey = slopeProps.seriesName;
    }
    onSlopeMouseLeave() {
        this.hoverKey = undefined;
    }
    onSlopeClick() {
        const { manager, hoverKey } = this;
        if (manager.addCountryMode === GrapherConstants_1.EntitySelectionMode.Disabled ||
            !manager.addCountryMode ||
            hoverKey === undefined) {
            return;
        }
        this.selectionArray.toggleSelection(hoverKey);
    }
    onLegendMouseOver(color) {
        this.hoverColor = color;
    }
    onLegendMouseLeave() {
        this.hoverColor = undefined;
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    get selectedEntityNames() {
        return this.selectionArray.selectedEntityNames;
    }
    // When the color legend is clicked, toggle selection fo all associated keys
    onLegendClick() {
        const { manager, hoverColor } = this;
        if (manager.addCountryMode === GrapherConstants_1.EntitySelectionMode.Disabled ||
            !manager.addCountryMode ||
            hoverColor === undefined)
            return;
        const seriesNamesToToggle = this.series
            .filter((g) => g.color === hoverColor)
            .map((g) => g.seriesName);
        const areAllSeriesActive = Util_1.intersection(seriesNamesToToggle, this.selectedEntityNames)
            .length === seriesNamesToToggle.length;
        if (areAllSeriesActive)
            this.selectionArray.setSelectedEntities(Util_1.without(this.selectedEntityNames, ...seriesNamesToToggle));
        else
            this.selectionArray.setSelectedEntities(this.selectedEntityNames.concat(seriesNamesToToggle));
    }
    // Colors on the legend for which every matching group is focused
    get focusColors() {
        const { colorsInUse } = this;
        return colorsInUse.filter((color) => {
            const matchingSeriesNames = this.series
                .filter((g) => g.color === color)
                .map((g) => g.seriesName);
            return (Util_1.intersection(matchingSeriesNames, this.selectedEntityNames)
                .length === matchingSeriesNames.length);
        });
    }
    get focusKeys() {
        return this.selectedEntityNames;
    }
    // All currently hovered group keys, combining the legend and the main UI
    get hoverKeys() {
        const { hoverColor, hoverKey } = this;
        const hoverKeys = hoverColor === undefined
            ? []
            : Util_1.uniq(this.series
                .filter((g) => g.color === hoverColor)
                .map((g) => g.seriesName));
        if (hoverKey !== undefined)
            hoverKeys.push(hoverKey);
        return hoverKeys;
    }
    // Colors currently on the chart and not greyed out
    get activeColors() {
        const { hoverKeys, focusKeys } = this;
        const activeKeys = hoverKeys.concat(focusKeys);
        if (activeKeys.length === 0)
            // No hover or focus means they're all active by default
            return Util_1.uniq(this.series.map((g) => g.color));
        return Util_1.uniq(this.series
            .filter((g) => activeKeys.indexOf(g.seriesName) !== -1)
            .map((g) => g.color));
    }
    // Only show colors on legend that are actually in use
    get colorsInUse() {
        return Util_1.uniq(this.series.map((series) => series.color));
    }
    get sidebarMaxWidth() {
        return this.bounds.width * 0.5;
    }
    get legendWidth() {
        return new VerticalColorLegend_1.VerticalColorLegend({ manager: this }).width;
    }
    get sidebarWidth() {
        const { sidebarMinWidth, sidebarMaxWidth, legendWidth } = this;
        return Math.max(Math.min(legendWidth, sidebarMaxWidth), sidebarMinWidth);
    }
    // correction is to account for the space taken by the legend
    get innerBounds() {
        const { sidebarWidth, showLegend } = this;
        return showLegend
            ? this.bounds.padRight(sidebarWidth + 20)
            : this.bounds;
    }
    // verify the validity of data used to show legend
    // this is for backwards compatibility with charts that were added without legend
    // eg: https://ourworldindata.org/grapher/mortality-rate-improvement-by-cohort
    get showLegend() {
        const { colorsInUse } = this;
        const { legendBins } = this.colorScale;
        return legendBins.some((bin) => colorsInUse.includes(bin.color));
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.props.bounds, message: this.failMessage }));
        const { manager } = this.props;
        const { series, focusKeys, hoverKeys, innerBounds, showLegend } = this;
        const legend = showLegend ? (React.createElement(VerticalColorLegend_1.VerticalColorLegend, { manager: this })) : (React.createElement("div", null));
        return (React.createElement("g", { className: "slopeChart" },
            React.createElement(LabelledSlopes, { manager: manager, bounds: innerBounds, yColumn: this.yColumn, seriesArr: series, focusKeys: focusKeys, hoverKeys: hoverKeys, onMouseOver: this.onSlopeMouseOver, onMouseLeave: this.onSlopeMouseLeave, onClick: this.onSlopeClick }),
            legend));
    }
    get legendY() {
        return this.bounds.top;
    }
    get legendX() {
        return this.bounds.right - this.sidebarWidth;
    }
    get failMessage() {
        if (this.yColumn.isMissing)
            return "Missing Y column";
        else if (Util_1.isEmpty(this.series))
            return "No matching data";
        return "";
    }
    get colorScaleConfig() {
        return this.manager.colorScale;
    }
    get colorScaleColumn() {
        return this.colorColumn;
    }
    get yColumn() {
        return this.transformedTable.get(this.yColumnSlug);
    }
    get yColumnSlug() {
        return ChartUtils_1.autoDetectYColumnSlugs(this.manager)[0];
    }
    get colorColumn() {
        // NB: This is tricky. Often it seems we use the Continent variable (123) for colors, but we only have 1 year for that variable, which
        // would likely get filtered by any time filtering. So we need to jump up to the root table to get the color values we want.
        // We should probably refactor this as part of a bigger color refactoring.
        return this.inputTable.get(this.manager.colorColumnSlug);
    }
    get transformedTable() {
        var _a;
        return ((_a = this.manager.transformedTable) !== null && _a !== void 0 ? _a : this.transformTable(this.inputTable));
    }
    get inputTable() {
        return this.manager.table;
    }
    // helper method to directly get the associated color value given an Entity
    // dimension data saves color a level deeper. eg: { Afghanistan => { 2015: Asia|Color }}
    // this returns that data in the form { Afghanistan => Asia }
    get colorBySeriesName() {
        const { colorScale, colorColumn } = this;
        if (colorColumn.isMissing)
            return new Map();
        const colorByEntity = new Map();
        colorColumn.valueByEntityNameAndTime.forEach((timeToColorMap, seriesName) => {
            const values = Array.from(timeToColorMap.values());
            const key = Util_1.last(values);
            colorByEntity.set(seriesName, colorScale.getColor(key));
        });
        return colorByEntity;
    }
    get sizeColumn() {
        return this.transformedTable.get(this.manager.sizeColumnSlug);
    }
    // helper method to directly get the associated size value given an Entity
    // dimension data saves size a level deeper. eg: { Afghanistan => { 1990: 1, 2015: 10 }}
    // this returns that data in the form { Afghanistan => 1 }
    get sizeByEntity() {
        const sizeCol = this.sizeColumn;
        const sizeByEntity = new Map();
        if (sizeCol)
            sizeCol.valueByEntityNameAndTime.forEach((timeToSizeMap, entity) => {
                const values = Array.from(timeToSizeMap.values());
                sizeByEntity.set(entity, values[0]); // hack: default to the value associated with the first time
            });
        return sizeByEntity;
    }
    componentDidMount() {
        Util_1.exposeInstanceOnWindow(this);
    }
    get series() {
        const column = this.yColumn;
        if (!column)
            return [];
        const { colorBySeriesName, sizeByEntity } = this;
        const { minTime, maxTime } = column;
        const table = this.inputTable;
        return column.uniqEntityNames
            .map((seriesName) => {
            var _a, _b;
            const values = [];
            const yValues = column.valueByEntityNameAndTime.get(seriesName) || [];
            yValues.forEach((value, time) => {
                if (time !== minTime && time !== maxTime)
                    return;
                values.push({
                    x: time,
                    y: value,
                });
            });
            const color = (_b = (_a = table.getColorForEntityName(seriesName)) !== null && _a !== void 0 ? _a : colorBySeriesName.get(seriesName)) !== null && _b !== void 0 ? _b : SlopeChartConstants_1.DEFAULT_SLOPE_CHART_COLOR;
            return {
                seriesName,
                color,
                size: sizeByEntity.get(seriesName) || 1,
                values,
            };
        })
            .filter((series) => series.values.length >= 2);
    }
};
__decorate([
    mobx_1.observable
], SlopeChart.prototype, "hoverKey", void 0);
__decorate([
    mobx_1.observable
], SlopeChart.prototype, "hoverColor", void 0);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "manager", null);
__decorate([
    mobx_1.computed.struct
], SlopeChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "legendItems", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "maxLegendWidth", null);
__decorate([
    mobx_1.action.bound
], SlopeChart.prototype, "onSlopeMouseOver", null);
__decorate([
    mobx_1.action.bound
], SlopeChart.prototype, "onSlopeMouseLeave", null);
__decorate([
    mobx_1.action.bound
], SlopeChart.prototype, "onSlopeClick", null);
__decorate([
    mobx_1.action.bound
], SlopeChart.prototype, "onLegendMouseOver", null);
__decorate([
    mobx_1.action.bound
], SlopeChart.prototype, "onLegendMouseLeave", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "selectedEntityNames", null);
__decorate([
    mobx_1.action.bound
], SlopeChart.prototype, "onLegendClick", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "focusColors", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "focusKeys", null);
__decorate([
    mobx_1.computed.struct
], SlopeChart.prototype, "hoverKeys", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "activeColors", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "colorsInUse", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "sidebarMaxWidth", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "legendWidth", null);
__decorate([
    mobx_1.computed.struct
], SlopeChart.prototype, "sidebarWidth", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "innerBounds", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "showLegend", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "legendY", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "colorScaleConfig", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "colorScaleColumn", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "yColumn", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "yColumnSlug", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "colorColumn", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "colorBySeriesName", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "sizeColumn", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "sizeByEntity", null);
__decorate([
    mobx_1.computed
], SlopeChart.prototype, "series", null);
SlopeChart = __decorate([
    mobx_react_1.observer
], SlopeChart);
exports.SlopeChart = SlopeChart;
let SlopeChartAxis = SlopeChartAxis_1 = class SlopeChartAxis extends React.Component {
    static calculateBounds(containerBounds, props) {
        const { scale, column } = props;
        const longestTick = Util_1.maxBy(scale.ticks(6).map((tick) => column.formatValueShort(tick)), (tick) => tick.length);
        const axisWidth = Bounds_1.Bounds.forText(longestTick).width;
        return new Bounds_1.Bounds(containerBounds.x, containerBounds.y, axisWidth, containerBounds.height);
    }
    static getTicks(scale, scaleType) {
        if (scaleType === GrapherConstants_1.ScaleType.log) {
            let minPower10 = Math.ceil(Math.log(scale.domain()[0]) / Math.log(10));
            if (!isFinite(minPower10))
                minPower10 = 0;
            let maxPower10 = Math.floor(Math.log(scale.domain()[1]) / Math.log(10));
            if (maxPower10 <= minPower10)
                maxPower10 += 1;
            const tickValues = [];
            for (let i = minPower10; i <= maxPower10; i++) {
                tickValues.push(Math.pow(10, i));
            }
            return tickValues;
        }
        else {
            return scale.ticks(6);
        }
    }
    get ticks() {
        return SlopeChartAxis_1.getTicks(this.props.scale, this.props.scaleType);
    }
    render() {
        const { bounds, scale, orient, column } = this.props;
        const { ticks } = this;
        const textColor = "#666";
        return (React.createElement("g", { className: "axis", fontSize: "0.8em" }, ticks.map((tick, i) => {
            return (React.createElement("text", { key: i, x: orient === "left" ? bounds.left : bounds.right, y: scale(tick), fill: textColor, dominantBaseline: "middle", textAnchor: orient === "left" ? "start" : "end" }, column.formatValueShort(tick)));
        })));
    }
};
__decorate([
    mobx_1.computed
], SlopeChartAxis.prototype, "ticks", null);
SlopeChartAxis = SlopeChartAxis_1 = __decorate([
    mobx_react_1.observer
], SlopeChartAxis);
let Slope = class Slope extends React.Component {
    get isInBackground() {
        const { isLayerMode, isHovered, isFocused } = this.props;
        if (!isLayerMode)
            return false;
        return !(isHovered || isFocused);
    }
    render() {
        const { x1, y1, x2, y2, color, size, hasLeftLabel, hasRightLabel, leftValueStr, rightValueStr, leftLabel, rightLabel, labelFontSize, leftLabelBounds, rightLabelBounds, isFocused, isHovered, } = this.props;
        const { isInBackground } = this;
        const lineColor = isInBackground ? "#e2e2e2" : color; //'#89C9CF'
        const labelColor = isInBackground ? "#aaa" : "#333";
        const opacity = isHovered ? 1 : isFocused ? 0.7 : 0.5;
        const lineStrokeWidth = isHovered
            ? size * 2
            : isFocused
                ? 1.5 * size
                : size;
        const leftValueLabelBounds = Bounds_1.Bounds.forText(leftValueStr, {
            fontSize: labelFontSize,
        });
        const rightValueLabelBounds = Bounds_1.Bounds.forText(rightValueStr, {
            fontSize: labelFontSize,
        });
        return (React.createElement("g", { className: "slope" },
            hasLeftLabel &&
                leftLabel.render(leftLabelBounds.x + leftLabelBounds.width, leftLabelBounds.y, {
                    textAnchor: "end",
                    fill: labelColor,
                    fontWeight: isFocused || isHovered ? "bold" : undefined,
                }),
            hasLeftLabel && (React.createElement(Text_1.Text, { x: x1 - 8, y: y1 - leftValueLabelBounds.height / 2, textAnchor: "end", fontSize: labelFontSize, fill: labelColor, fontWeight: isFocused || isHovered ? "bold" : undefined }, leftValueStr)),
            React.createElement("circle", { cx: x1, cy: y1, r: isFocused || isHovered ? 4 : 2, fill: lineColor, opacity: opacity }),
            React.createElement("line", { ref: (el) => (this.line = el), x1: x1, y1: y1, x2: x2, y2: y2, stroke: lineColor, strokeWidth: lineStrokeWidth, opacity: opacity }),
            React.createElement("circle", { cx: x2, cy: y2, r: isFocused || isHovered ? 4 : 2, fill: lineColor, opacity: opacity }),
            hasRightLabel && (React.createElement(Text_1.Text, { x: x2 + 8, y: y2 - rightValueLabelBounds.height / 2, fontSize: labelFontSize, fill: labelColor, fontWeight: isFocused || isHovered ? "bold" : undefined }, rightValueStr)),
            hasRightLabel &&
                rightLabel.render(rightLabelBounds.x, rightLabelBounds.y, {
                    fill: labelColor,
                    fontWeight: isFocused || isHovered ? "bold" : undefined,
                })));
    }
};
__decorate([
    mobx_1.computed
], Slope.prototype, "isInBackground", null);
Slope = __decorate([
    mobx_react_1.observer
], Slope);
let LabelledSlopes = class LabelledSlopes extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    get data() {
        return this.props.seriesArr;
    }
    get yColumn() {
        return this.props.yColumn;
    }
    get manager() {
        return this.props.manager;
    }
    get bounds() {
        return this.props.bounds;
    }
    get focusedSeriesNames() {
        return Util_1.intersection(this.props.focusKeys || [], this.data.map((g) => g.seriesName));
    }
    get hoveredSeriesNames() {
        return Util_1.intersection(this.props.hoverKeys || [], this.data.map((g) => g.seriesName));
    }
    // Layered mode occurs when any entity on the chart is hovered or focused
    // Then, a special "foreground" set of entities is rendered over the background
    get isLayerMode() {
        return (this.focusedSeriesNames.length > 0 ||
            this.hoveredSeriesNames.length > 0);
    }
    get isPortrait() {
        return this.bounds.width < 400;
    }
    get allValues() {
        return Util_1.flatten(this.props.seriesArr.map((g) => g.values));
    }
    get xDomainDefault() {
        return Util_1.domainExtent(this.allValues.map((v) => v.x), GrapherConstants_1.ScaleType.linear);
    }
    get yScaleType() {
        var _a;
        return ((_a = this.manager.yAxis) === null || _a === void 0 ? void 0 : _a.scaleType) || GrapherConstants_1.ScaleType.linear;
    }
    get yDomainDefault() {
        return Util_1.domainExtent(this.allValues.map((v) => v.y), this.yScaleType || GrapherConstants_1.ScaleType.linear);
    }
    get xDomain() {
        return this.xDomainDefault;
    }
    get yDomain() {
        var _a;
        const domain = ((_a = this.manager.yAxis) === null || _a === void 0 ? void 0 : _a.domain) || [Infinity, -Infinity];
        const domainDefault = this.yDomainDefault;
        return [
            Math.min(domain[0], domainDefault[0]),
            Math.max(domain[1], domainDefault[1]),
        ];
    }
    get sizeScale() {
        return d3_scale_1.scaleLinear()
            .domain(d3_array_1.extent(this.props.seriesArr.map((series) => series.size)))
            .range([1, 4]);
    }
    get yScaleConstructor() {
        return this.yScaleType === GrapherConstants_1.ScaleType.log ? d3_scale_1.scaleLog : d3_scale_1.scaleLinear;
    }
    get yScale() {
        return this.yScaleConstructor()
            .domain(this.yDomain)
            .range(this.props.bounds.padBottom(50).yRange());
    }
    get xScale() {
        const { bounds, isPortrait, xDomain, yScale, yColumn } = this;
        const padding = isPortrait
            ? 0
            : SlopeChartAxis.calculateBounds(bounds, {
                orient: "left",
                scale: yScale,
                column: yColumn,
            }).width;
        return d3_scale_1.scaleLinear()
            .domain(xDomain)
            .range(bounds.padWidth(padding).xRange());
    }
    get maxLabelWidth() {
        return this.bounds.width / 5;
    }
    get initialSlopeData() {
        const { data, isPortrait, xScale, yScale, sizeScale, yColumn, maxLabelWidth: maxWidth, } = this;
        const slopeData = [];
        const yDomain = yScale.domain();
        data.forEach((series) => {
            var _a;
            // Ensure values fit inside the chart
            if (!series.values.every((d) => d.y >= yDomain[0] && d.y <= yDomain[1]))
                return;
            const text = series.seriesName;
            const [v1, v2] = series.values;
            const [x1, x2] = [xScale(v1.x), xScale(v2.x)];
            const [y1, y2] = [yScale(v1.y), yScale(v2.y)];
            const fontSize = (isPortrait ? 0.6 : 0.65) *
                ((_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE);
            const leftValueStr = yColumn.formatValueShort(v1.y);
            const rightValueStr = yColumn.formatValueShort(v2.y);
            const leftValueWidth = Bounds_1.Bounds.forText(leftValueStr, {
                fontSize,
            }).width;
            const rightValueWidth = Bounds_1.Bounds.forText(rightValueStr, {
                fontSize,
            }).width;
            const leftLabel = new TextWrap_1.TextWrap({
                maxWidth,
                fontSize,
                text,
            });
            const rightLabel = new TextWrap_1.TextWrap({
                maxWidth,
                fontSize,
                text,
            });
            slopeData.push({
                x1,
                y1,
                x2,
                y2,
                color: series.color,
                size: sizeScale(series.size) || 1,
                leftValueStr,
                rightValueStr,
                leftValueWidth,
                rightValueWidth,
                leftLabel,
                rightLabel,
                labelFontSize: fontSize,
                seriesName: series.seriesName,
                isFocused: false,
                isHovered: false,
                hasLeftLabel: true,
                hasRightLabel: true,
            });
        });
        return slopeData;
    }
    get maxValueWidth() {
        return Util_1.max(this.initialSlopeData.map((s) => s.leftValueWidth));
    }
    get labelAccountedSlopeData() {
        const { maxLabelWidth, maxValueWidth } = this;
        return this.initialSlopeData.map((slope) => {
            // Squish slopes to make room for labels
            const x1 = slope.x1 + maxLabelWidth + maxValueWidth + 8;
            const x2 = slope.x2 - maxLabelWidth - maxValueWidth - 8;
            // Position the labels
            const leftLabelBounds = new Bounds_1.Bounds(x1 - slope.leftValueWidth - 12 - slope.leftLabel.width, slope.y1 - slope.leftLabel.height / 2, slope.leftLabel.width, slope.leftLabel.height);
            const rightLabelBounds = new Bounds_1.Bounds(x2 + slope.rightValueWidth + 12, slope.y2 - slope.rightLabel.height / 2, slope.rightLabel.width, slope.rightLabel.height);
            return Object.assign(Object.assign({}, slope), { x1: x1, x2: x2, leftLabelBounds: leftLabelBounds, rightLabelBounds: rightLabelBounds });
        });
    }
    get backgroundGroups() {
        return this.slopeData.filter((group) => !(group.isHovered || group.isFocused));
    }
    get foregroundGroups() {
        return this.slopeData.filter((group) => !!(group.isHovered || group.isFocused));
    }
    // Get the final slope data with hover focusing and collision detection
    get slopeData() {
        const { focusedSeriesNames, hoveredSeriesNames } = this;
        let slopeData = this.labelAccountedSlopeData;
        slopeData = slopeData.map((slope) => {
            return Object.assign(Object.assign({}, slope), { isFocused: focusedSeriesNames.includes(slope.seriesName), isHovered: hoveredSeriesNames.includes(slope.seriesName) });
        });
        // How to work out which of two slopes to prioritize for labelling conflicts
        function chooseLabel(s1, s2) {
            if (s1.isHovered && !s2.isHovered)
                // Hovered slopes always have priority
                return s1;
            else if (!s1.isHovered && s2.isHovered)
                return s2;
            else if (s1.isFocused && !s2.isFocused)
                // Focused slopes are next in priority
                return s1;
            else if (!s1.isFocused && s2.isFocused)
                return s2;
            else if (s1.hasLeftLabel && !s2.hasLeftLabel)
                // Slopes which already have one label are prioritized for the other side
                return s1;
            else if (!s1.hasLeftLabel && s2.hasLeftLabel)
                return s2;
            else if (s1.size > s2.size)
                // Larger sizes get the next priority
                return s1;
            else if (s2.size > s1.size)
                return s2;
            else
                return s1; // Equal priority, just do the first one
        }
        // Eliminate overlapping labels, one pass for each side
        slopeData.forEach((s1) => {
            slopeData.forEach((s2) => {
                if (s1 !== s2 &&
                    s1.hasLeftLabel &&
                    s2.hasLeftLabel &&
                    s1.leftLabelBounds.intersects(s2.leftLabelBounds)) {
                    if (chooseLabel(s1, s2) === s1)
                        s2.hasLeftLabel = false;
                    else
                        s1.hasLeftLabel = false;
                }
            });
        });
        slopeData.forEach((s1) => {
            slopeData.forEach((s2) => {
                if (s1 !== s2 &&
                    s1.hasRightLabel &&
                    s2.hasRightLabel &&
                    s1.rightLabelBounds.intersects(s2.rightLabelBounds)) {
                    if (chooseLabel(s1, s2) === s1)
                        s2.hasRightLabel = false;
                    else
                        s1.hasRightLabel = false;
                }
            });
        });
        // Order by focus/hover and size for draw order
        slopeData = Util_1.sortBy(slopeData, (slope) => slope.size);
        slopeData = Util_1.sortBy(slopeData, (slope) => slope.isFocused || slope.isHovered ? 1 : 0);
        return slopeData;
    }
    onMouseLeave() {
        if (this.mouseFrame !== undefined)
            cancelAnimationFrame(this.mouseFrame);
        if (this.props.onMouseLeave)
            this.props.onMouseLeave();
    }
    onMouseMove(ev) {
        const mouse = Util_1.getRelativeMouse(this.base.current, ev.nativeEvent);
        this.mouseFrame = requestAnimationFrame(() => {
            if (this.props.bounds.contains(mouse)) {
                const distToSlope = new Map();
                for (const s of this.slopeData) {
                    const dist = Math.abs((s.y2 - s.y1) * mouse.x -
                        (s.x2 - s.x1) * mouse.y +
                        s.x2 * s.y1 -
                        s.y2 * s.x1) / Math.sqrt(Math.pow((s.y2 - s.y1), 2) + Math.pow((s.x2 - s.x1), 2));
                    distToSlope.set(s, dist);
                }
                const closestSlope = Util_1.minBy(this.slopeData, (s) => distToSlope.get(s));
                if (closestSlope &&
                    distToSlope.get(closestSlope) < 20 &&
                    this.props.onMouseOver) {
                    this.props.onMouseOver(closestSlope);
                }
                else {
                    this.props.onMouseLeave();
                }
            }
        });
    }
    onClick() {
        if (this.props.onClick)
            this.props.onClick();
    }
    componentDidMount() {
        this.playIntroAnimation();
    }
    playIntroAnimation() {
        // Nice little intro animation
        d3_selection_1.select(this.base.current)
            .select(".slopes")
            .attr("stroke-dasharray", "100%")
            .attr("stroke-dashoffset", "100%")
            .transition()
            .attr("stroke-dashoffset", "0%");
    }
    renderGroups(groups) {
        const { isLayerMode } = this;
        return groups.map((slope) => (React.createElement(Slope, Object.assign({ key: slope.seriesName }, slope, { isLayerMode: isLayerMode }))));
    }
    render() {
        var _a;
        const baseFontSize = (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
        const yScaleType = this.yScaleType;
        const { bounds, slopeData, isPortrait, xDomain, yScale, onMouseMove, yColumn, } = this;
        if (Util_1.isEmpty(slopeData))
            return React.createElement(NoDataModal_1.NoDataModal, { manager: this.props.manager, bounds: bounds });
        const { x1, x2 } = slopeData[0];
        const [y1, y2] = yScale.range();
        return (React.createElement("g", { className: "LabelledSlopes", ref: this.base, onMouseMove: onMouseMove, onTouchMove: onMouseMove, onTouchStart: onMouseMove, onMouseLeave: this.onMouseLeave, onClick: this.onClick },
            React.createElement("rect", { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, fill: "rgba(255,255,255,0)", opacity: 0 }),
            React.createElement("g", { className: "gridlines" }, SlopeChartAxis.getTicks(yScale, yScaleType).map((tick, i) => {
                return (React.createElement("line", { key: i, x1: x1, y1: yScale(tick), x2: x2, y2: yScale(tick), stroke: "#eee", strokeDasharray: "3,2" }));
            })),
            !isPortrait && (React.createElement(SlopeChartAxis, { orient: "left", column: yColumn, scale: yScale, scaleType: yScaleType, bounds: bounds })),
            !isPortrait && (React.createElement(SlopeChartAxis, { orient: "right", column: yColumn, scale: yScale, scaleType: yScaleType, bounds: bounds })),
            React.createElement("line", { x1: x1, y1: y1, x2: x1, y2: y2, stroke: "#333" }),
            React.createElement("line", { x1: x2, y1: y1, x2: x2, y2: y2, stroke: "#333" }),
            React.createElement(Text_1.Text, { x: x1, y: y1 + 10, textAnchor: "middle", fill: "#666", fontSize: baseFontSize }, xDomain[0].toString()),
            React.createElement(Text_1.Text, { x: x2, y: y1 + 10, textAnchor: "middle", fill: "#666", fontSize: baseFontSize }, xDomain[1].toString()),
            React.createElement("g", { className: "slopes" },
                this.renderGroups(this.backgroundGroups),
                this.renderGroups(this.foregroundGroups))));
    }
};
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "data", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "yColumn", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "manager", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "focusedSeriesNames", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "hoveredSeriesNames", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "isLayerMode", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "isPortrait", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "allValues", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "xDomainDefault", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "yScaleType", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "yDomainDefault", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "xDomain", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "yDomain", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "sizeScale", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "yScaleConstructor", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "yScale", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "xScale", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "maxLabelWidth", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "initialSlopeData", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "maxValueWidth", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "labelAccountedSlopeData", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "backgroundGroups", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "foregroundGroups", null);
__decorate([
    mobx_1.computed
], LabelledSlopes.prototype, "slopeData", null);
__decorate([
    mobx_1.action.bound
], LabelledSlopes.prototype, "onMouseLeave", null);
__decorate([
    mobx_1.action.bound
], LabelledSlopes.prototype, "onMouseMove", null);
__decorate([
    mobx_1.action.bound
], LabelledSlopes.prototype, "onClick", null);
LabelledSlopes = __decorate([
    mobx_react_1.observer
], LabelledSlopes);
//# sourceMappingURL=SlopeChart.js.map