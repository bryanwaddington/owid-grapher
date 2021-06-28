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
var StackedDiscreteBarChart_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackedDiscreteBarChart = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const GrapherConstants_1 = require("../core/GrapherConstants");
const AxisViews_1 = require("../axis/AxisViews");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const AxisConfig_1 = require("../axis/AxisConfig");
const ChartUtils_1 = require("../chart/ChartUtils");
const StackedUtils_1 = require("../stackedCharts/StackedUtils");
const ColorSchemes_1 = require("../color/ColorSchemes");
const HorizontalColorLegends_1 = require("../horizontalColorLegend/HorizontalColorLegends");
const ColorScaleBin_1 = require("../color/ColorScaleBin");
const Tippy_1 = require("../chart/Tippy");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faInfoCircle_1 = require("@fortawesome/free-solid-svg-icons/faInfoCircle");
const ColorUtils_1 = require("../color/ColorUtils");
const react_flip_toolkit_1 = require("react-flip-toolkit");
const BrowserUtil_1 = require("../../clientUtils/BrowserUtil");
const labelToBarPadding = 5;
let StackedDiscreteBarChart = StackedDiscreteBarChart_1 = class StackedDiscreteBarChart extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    transformTable(table) {
        if (!this.yColumnSlugs.length)
            return table;
        table = table.filterByEntityNames(this.selectionArray.selectedEntityNames);
        // TODO: remove this filter once we don't have mixed type columns in datasets
        table = table.replaceNonNumericCellsWithErrorValues(this.yColumnSlugs);
        table = table.dropRowsWithErrorValuesForAllColumns(this.yColumnSlugs);
        this.yColumnSlugs.forEach((slug) => {
            table = table.interpolateColumnWithTolerance(slug);
        });
        if (this.manager.isRelativeMode) {
            table = table.toPercentageFromEachColumnForEachEntityAndTime(this.yColumnSlugs);
        }
        return table;
    }
    get inputTable() {
        return this.manager.table;
    }
    get transformedTable() {
        var _a;
        return ((_a = this.manager.transformedTable) !== null && _a !== void 0 ? _a : this.transformTable(this.inputTable));
    }
    get manager() {
        return this.props.manager;
    }
    get bounds() {
        var _a;
        return ((_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS).padRight(10);
    }
    get baseFontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get labelStyle() {
        return {
            fontSize: 0.75 * this.baseFontSize,
            fontWeight: 700,
        };
    }
    // Account for the width of the legend
    get labelWidth() {
        const labels = this.items.map((item) => item.label);
        const longestLabel = Util_1.maxBy(labels, (d) => d.length);
        return Bounds_1.Bounds.forText(longestLabel, this.labelStyle).width;
    }
    get x0() {
        return 0;
    }
    get allPoints() {
        return Util_1.flatten(this.series.map((series) => series.points));
    }
    // Now we can work out the main x axis scale
    get xDomainDefault() {
        const maxValues = this.allPoints.map((point) => point.value + point.valueOffset);
        return [
            Math.min(this.x0, Util_1.min(maxValues)),
            Math.max(this.x0, Util_1.max(maxValues)),
        ];
    }
    get xRange() {
        return [this.bounds.left + this.labelWidth, this.bounds.right];
    }
    get yAxis() {
        return this.manager.yAxis || new AxisConfig_1.AxisConfig();
    }
    get axis() {
        // NB: We use the user's YAxis options here to make the XAxis
        const axis = this.yAxis.toHorizontalAxis();
        axis.updateDomainPreservingUserSettings(this.xDomainDefault);
        axis.formatColumn = this.yColumns[0]; // todo: does this work for columns as series?
        axis.range = this.xRange;
        axis.label = "";
        return axis;
    }
    get innerBounds() {
        return this.bounds
            .padLeft(this.labelWidth)
            .padBottom(this.axis.height)
            .padTop(this.legendPaddingTop)
            .padTop(this.legend.height);
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    get items() {
        const entityNames = this.selectionArray.selectedEntityNames;
        const items = entityNames
            .map((entityName) => ({
            label: entityName,
            bars: Util_1.excludeUndefined(this.series.map((series) => {
                const point = series.points.find((point) => point.position === entityName);
                if (!point)
                    return undefined;
                return {
                    point,
                    color: series.color,
                    seriesName: series.seriesName,
                };
            })),
        }))
            .filter((item) => item.bars.length);
        if (this.manager.isRelativeMode) {
            // TODO: This is more of a stopgap to prevent the chart from being super jumpy in
            // relative mode. Once we have an option to sort by a specific metric, that'll help.
            // Until then, we're sorting by label to prevent any jumping.
            return Util_1.sortBy(items, (item) => item.label);
        }
        else {
            return Util_1.sortBy(items, (item) => {
                var _a;
                const lastPoint = (_a = Util_1.last(item.bars)) === null || _a === void 0 ? void 0 : _a.point;
                if (!lastPoint)
                    return 0;
                return lastPoint.valueOffset + lastPoint.value;
            }).reverse();
        }
    }
    get barHeight() {
        return (0.8 * this.innerBounds.height) / this.items.length;
    }
    get barSpacing() {
        return this.innerBounds.height / this.items.length - this.barHeight;
    }
    // legend props
    get legendPaddingTop() {
        return this.baseFontSize;
    }
    get legendX() {
        return this.bounds.x;
    }
    get categoryLegendY() {
        return this.bounds.top;
    }
    get legendWidth() {
        return this.bounds.width;
    }
    get legendAlign() {
        return HorizontalColorLegends_1.LegendAlign.left;
    }
    get fontSize() {
        return this.baseFontSize;
    }
    get categoricalLegendData() {
        return this.series.map((series, index) => {
            return new ColorScaleBin_1.CategoricalBin({
                index,
                value: series.seriesName,
                label: series.seriesName,
                color: series.color,
            });
        });
    }
    onLegendMouseOver(bin) {
        this.focusSeriesName = bin.value;
    }
    onLegendMouseLeave() {
        this.focusSeriesName = undefined;
    }
    get legend() {
        return new HorizontalColorLegends_1.HorizontalCategoricalColorLegend({ manager: this });
    }
    get formatColumn() {
        return this.yColumns[0];
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.bounds, message: this.failMessage }));
        const { bounds, axis, innerBounds, barHeight, barSpacing } = this;
        // Animation don't work correctly on Safari at the moment - see https://github.com/aholachek/react-flip-toolkit/issues/159
        // a stopgap, they are currently disabled on Safari until we find a better solution
        const shouldAnimate = !BrowserUtil_1.prefersReducedMotion() && !BrowserUtil_1.isSafari;
        let yOffset = innerBounds.top + barHeight / 2;
        return (React.createElement("g", { ref: this.base, className: "StackedDiscreteBarChart" },
            React.createElement("rect", { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height, opacity: 0, fill: "rgba(255,255,255,0)" }),
            React.createElement(AxisViews_1.HorizontalAxisComponent, { bounds: bounds, axis: axis, axisPosition: innerBounds.bottom }),
            React.createElement(AxisViews_1.HorizontalAxisGridLines, { horizontalAxis: axis, bounds: innerBounds }),
            React.createElement(HorizontalColorLegends_1.HorizontalCategoricalColorLegend, { manager: this }),
            React.createElement(react_flip_toolkit_1.Flipper, { flipKey: this.items.map((i) => i.label), element: "g" }, this.items.map(({ label, bars }) => {
                // Using transforms for positioning to enable better (subpixel) transitions
                // Width transitions don't work well on iOS Safari – they get interrupted and
                // it appears very slow. Also be careful with negative bar charts.
                const tooltipProps = {
                    label,
                    bars,
                    targetTime: this.manager.endTime,
                    timeColumn: this.inputTable.timeColumn,
                    formatColumn: this.formatColumn,
                };
                // This custom spring is quite gentle and doesn't wobble.
                const spring = { stiffness: 160, damping: 26 };
                const result = (React.createElement(react_flip_toolkit_1.Flipped, { key: label, flipId: label, translate: true, spring: spring, shouldFlip: () => shouldAnimate },
                    React.createElement("g", { key: label, className: "bar", transform: `translate(0, ${yOffset})` },
                        React.createElement(Tippy_1.TippyIfInteractive, { lazy: true, isInteractive: !this.manager.isExportingtoSvgOrPng, hideOnClick: false, content: React.createElement(StackedDiscreteBarChart_1.Tooltip, Object.assign({}, tooltipProps)) },
                            React.createElement("text", Object.assign({ x: 0, y: 0, transform: `translate(${axis.place(this.x0) -
                                    labelToBarPadding}, 0)`, fill: "#555", dominantBaseline: "middle", textAnchor: "end" }, this.labelStyle), label)),
                        bars.map((bar) => this.renderBar(bar, Object.assign(Object.assign({}, tooltipProps), { highlightedSeriesName: bar.seriesName }))))));
                yOffset += barHeight + barSpacing;
                return result;
            }))));
    }
    renderBar(bar, tooltipProps) {
        const { axis, formatColumn, focusSeriesName, barHeight } = this;
        const { point, color, seriesName } = bar;
        const isFaint = focusSeriesName !== undefined && focusSeriesName !== seriesName;
        const barX = axis.place(this.x0 + point.valueOffset);
        const barWidth = axis.place(point.value) - axis.place(this.x0);
        // Compute how many decimal places we should show.
        // Basically, this makes us show 2 significant digits, or no decimal places if the number
        // is big enough already.
        const magnitude = Util_1.numberMagnitude(point.value);
        const barLabel = formatColumn.formatValueShort(point.value, {
            numDecimalPlaces: Math.max(0, -magnitude + 2),
        });
        const labelFontSize = 0.7 * this.baseFontSize;
        const labelBounds = Bounds_1.Bounds.forText(barLabel, {
            fontSize: labelFontSize,
        });
        // Check that we have enough space to show the bar label
        const showLabelInsideBar = labelBounds.width < 0.85 * barWidth &&
            labelBounds.height < 0.85 * barHeight;
        const labelColor = ColorUtils_1.isDarkColor(color) ? "#fff" : "#000";
        return (React.createElement(Tippy_1.TippyIfInteractive, { lazy: true, isInteractive: !this.manager.isExportingtoSvgOrPng, key: seriesName, hideOnClick: false, content: React.createElement(StackedDiscreteBarChart_1.Tooltip, Object.assign({}, tooltipProps)) },
            React.createElement("g", null,
                React.createElement("rect", { x: 0, y: 0, transform: `translate(${barX}, ${-barHeight / 2})`, width: barWidth, height: barHeight, fill: color, opacity: isFaint ? 0.1 : 0.85, style: {
                        transition: "height 200ms ease",
                    } }),
                showLabelInsideBar && (React.createElement("text", { x: barX + barWidth / 2, y: 0, width: barWidth, height: barHeight, fill: labelColor, opacity: isFaint ? 0 : 1, fontSize: labelFontSize, textAnchor: "middle", dominantBaseline: "middle" }, barLabel)))));
    }
    static Tooltip(props) {
        let hasTimeNotice = false;
        return (React.createElement("table", { style: {
                lineHeight: "1em",
                whiteSpace: "normal",
                borderSpacing: "0.5em",
            } },
            React.createElement("tbody", null,
                React.createElement("tr", null,
                    React.createElement("td", { colSpan: 4, style: { color: "#111" } },
                        React.createElement("strong", null, props.label))),
                props.bars.map((bar) => {
                    const { highlightedSeriesName } = props;
                    const squareColor = bar.color;
                    const isHighlighted = bar.seriesName === highlightedSeriesName;
                    const isFaint = highlightedSeriesName !== undefined &&
                        !isHighlighted;
                    const shouldShowTimeNotice = !bar.point.fake &&
                        bar.point.time !== props.targetTime;
                    hasTimeNotice || (hasTimeNotice = shouldShowTimeNotice);
                    return (React.createElement("tr", { key: `${bar.seriesName}`, style: {
                            color: isHighlighted
                                ? "#000"
                                : isFaint
                                    ? "#707070"
                                    : "#444",
                            fontWeight: isHighlighted
                                ? "bold"
                                : undefined,
                        } },
                        React.createElement("td", null,
                            React.createElement("div", { style: {
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: squareColor,
                                    display: "inline-block",
                                } })),
                        React.createElement("td", { style: {
                                paddingRight: "0.8em",
                                fontSize: "0.9em",
                            } }, bar.seriesName),
                        React.createElement("td", { style: {
                                textAlign: "right",
                                whiteSpace: "nowrap",
                            } }, bar.point.fake
                            ? "No data"
                            : props.formatColumn.formatValueShort(bar.point.value, {
                                noTrailingZeroes: false,
                            })),
                        shouldShowTimeNotice && (React.createElement("td", { style: {
                                fontWeight: "normal",
                                color: "#707070",
                                fontSize: "0.8em",
                                whiteSpace: "nowrap",
                                paddingLeft: "8px",
                            } },
                            React.createElement("span", { className: "icon" },
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faInfoCircle_1.faInfoCircle, style: {
                                        marginRight: "0.25em",
                                    } }),
                                " "),
                            props.timeColumn.formatValue(bar.point.time)))));
                }),
                hasTimeNotice && (React.createElement("tr", null,
                    React.createElement("td", { colSpan: 4, style: {
                            color: "#707070",
                            fontSize: "0.8em",
                            paddingTop: "10px",
                        } },
                        React.createElement("div", { style: { display: "flex" } },
                            React.createElement("span", { className: "icon", style: { marginRight: "0.5em" } },
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faInfoCircle_1.faInfoCircle }),
                                " "),
                            React.createElement("span", null,
                                "No data available for",
                                " ",
                                props.timeColumn.formatValue(props.targetTime),
                                ". Showing closest available data point instead."))))))));
    }
    get failMessage() {
        const column = this.yColumns[0];
        if (!column)
            return "No column to chart";
        if (!this.selectionArray.hasSelection)
            return `No data selected`;
        // TODO is it better to use .series for this check?
        return this.yColumns.every((col) => col.isEmpty)
            ? `No matching data in columns ${this.yColumnSlugs.join(", ")}`
            : "";
    }
    get yColumnSlugs() {
        var _a;
        return ((_a = this.manager.yColumnSlugsInSelectionOrder) !== null && _a !== void 0 ? _a : ChartUtils_1.autoDetectYColumnSlugs(this.manager));
    }
    get yColumns() {
        return this.transformedTable.getColumns(this.yColumnSlugs);
    }
    get colorScheme() {
        var _a;
        return ((_a = (this.manager.baseColorScheme
            ? ColorSchemes_1.ColorSchemes[this.manager.baseColorScheme]
            : undefined)) !== null && _a !== void 0 ? _a : ColorSchemes_1.ColorSchemes["owid-distinct"]);
    }
    get unstackedSeries() {
        return (this.yColumns
            .map((col, i) => {
            var _a;
            return {
                seriesName: col.displayName,
                color: (_a = col.def.color) !== null && _a !== void 0 ? _a : this.colorScheme.getColors(this.yColumns.length)[i],
                points: col.owidRows.map((row) => ({
                    time: row.time,
                    position: row.entityName,
                    value: row.value,
                    valueOffset: 0,
                })),
            };
        })
            // Do not plot columns without data
            .filter((series) => series.points.length > 0));
    }
    get series() {
        return StackedUtils_1.stackSeries(StackedUtils_1.withMissingValuesAsZeroes(this.unstackedSeries));
    }
};
__decorate([
    mobx_1.observable
], StackedDiscreteBarChart.prototype, "focusSeriesName", void 0);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "manager", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "baseFontSize", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "labelStyle", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "labelWidth", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "x0", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "allPoints", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "xDomainDefault", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "xRange", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "yAxis", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "axis", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "innerBounds", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "items", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "barHeight", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "barSpacing", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "legendPaddingTop", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "categoryLegendY", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "legendWidth", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "legendAlign", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "categoricalLegendData", null);
__decorate([
    mobx_1.action.bound
], StackedDiscreteBarChart.prototype, "onLegendMouseOver", null);
__decorate([
    mobx_1.action.bound
], StackedDiscreteBarChart.prototype, "onLegendMouseLeave", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "legend", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "formatColumn", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "yColumnSlugs", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "yColumns", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "colorScheme", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "unstackedSeries", null);
__decorate([
    mobx_1.computed
], StackedDiscreteBarChart.prototype, "series", null);
StackedDiscreteBarChart = StackedDiscreteBarChart_1 = __decorate([
    mobx_react_1.observer
], StackedDiscreteBarChart);
exports.StackedDiscreteBarChart = StackedDiscreteBarChart;
//# sourceMappingURL=StackedDiscreteBarChart.js.map