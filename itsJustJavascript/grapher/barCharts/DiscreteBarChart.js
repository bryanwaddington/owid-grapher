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
exports.DiscreteBarChart = void 0;
const React = __importStar(require("react"));
const d3_selection_1 = require("d3-selection");
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const GrapherConstants_1 = require("../core/GrapherConstants");
const AxisViews_1 = require("../axis/AxisViews");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const AxisConfig_1 = require("../axis/AxisConfig");
const ColorSchemes_1 = require("../color/ColorSchemes");
const DiscreteBarChartConstants_1 = require("./DiscreteBarChartConstants");
const ChartUtils_1 = require("../chart/ChartUtils");
const labelToTextPadding = 10;
const labelToBarPadding = 5;
let DiscreteBarChart = class DiscreteBarChart extends React.Component {
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
        if (this.isLogScale)
            table = table.replaceNonPositiveCellsForLogScale(this.yColumnSlugs);
        table = table.dropRowsWithErrorValuesForAllColumns(this.yColumnSlugs);
        this.yColumnSlugs.forEach((slug) => {
            table = table.interpolateColumnWithTolerance(slug);
        });
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
    get targetTime() {
        return this.manager.endTime;
    }
    get isLogScale() {
        return this.yAxis.scaleType === GrapherConstants_1.ScaleType.log;
    }
    get bounds() {
        var _a;
        return ((_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS).padRight(10);
    }
    get baseFontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get legendLabelStyle() {
        return {
            fontSize: 0.75 * this.baseFontSize,
            fontWeight: 700,
        };
    }
    get valueLabelStyle() {
        return {
            fontSize: 0.75 * this.baseFontSize,
            fontWeight: 400,
        };
    }
    // Account for the width of the legend
    get legendWidth() {
        const labels = this.series.map((series) => series.seriesName);
        const longestLabel = Util_1.maxBy(labels, (d) => d.length);
        return Bounds_1.Bounds.forText(longestLabel, this.legendLabelStyle).width;
    }
    get hasPositive() {
        return this.series.some((d) => d.value >= 0);
    }
    get hasNegative() {
        return this.series.some((d) => d.value < 0);
    }
    // The amount of space we need to allocate for bar end labels on the right
    get rightValueLabelWidth() {
        if (!this.hasPositive)
            return 0;
        const positiveLabels = this.series
            .filter((d) => d.value >= 0)
            .map((d) => this.formatValue(d));
        const longestPositiveLabel = Util_1.maxBy(positiveLabels, (l) => l.length);
        return Bounds_1.Bounds.forText(longestPositiveLabel, this.valueLabelStyle).width;
    }
    // The amount of space we need to allocate for bar end labels on the left
    // These are only present if there are negative values
    // We pad this a little so it doesn't run directly up against the bar labels themselves
    get leftValueLabelWidth() {
        if (!this.hasNegative)
            return 0;
        const negativeLabels = this.series
            .filter((d) => d.value < 0)
            .map((d) => this.formatValue(d));
        const longestNegativeLabel = Util_1.maxBy(negativeLabels, (l) => l.length);
        return (Bounds_1.Bounds.forText(longestNegativeLabel, this.valueLabelStyle).width +
            labelToTextPadding);
    }
    get x0() {
        if (!this.isLogScale)
            return 0;
        const minValue = Util_1.min(this.series.map((d) => d.value));
        return minValue !== undefined ? Math.min(1, minValue) : 1;
    }
    // Now we can work out the main x axis scale
    get xDomainDefault() {
        const allValues = this.series.map((d) => d.value);
        return [
            Math.min(this.x0, Util_1.min(allValues)),
            Math.max(this.x0, Util_1.max(allValues)),
        ];
    }
    get xRange() {
        return [
            this.bounds.left + this.legendWidth + this.leftValueLabelWidth,
            this.bounds.right - this.rightValueLabelWidth,
        ];
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
            .padLeft(this.legendWidth + this.leftValueLabelWidth)
            .padBottom(this.axis.height)
            .padRight(this.rightValueLabelWidth);
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    // Leave space for extra bar at bottom to show "Add country" button
    get barCount() {
        return this.series.length;
    }
    get barHeight() {
        return (0.8 * this.innerBounds.height) / this.barCount;
    }
    get barSpacing() {
        return this.innerBounds.height / this.barCount - this.barHeight;
    }
    get barPlacements() {
        const { series, axis } = this;
        return series.map((d) => {
            const isNegative = d.value < 0;
            const barX = isNegative ? axis.place(d.value) : axis.place(this.x0);
            const barWidth = isNegative
                ? axis.place(this.x0) - barX
                : axis.place(d.value) - barX;
            return { x: barX, width: barWidth };
        });
    }
    get barWidths() {
        return this.barPlacements.map((b) => b.width);
    }
    d3Bars() {
        return d3_selection_1.select(this.base.current).selectAll("g.bar > rect");
    }
    animateBarWidth() {
        this.d3Bars()
            .transition()
            .attr("width", (_, i) => this.barWidths[i]);
    }
    componentDidMount() {
        this.d3Bars().attr("width", 0);
        this.animateBarWidth();
        Util_1.exposeInstanceOnWindow(this);
    }
    componentDidUpdate() {
        // Animating the bar width after a render ensures there's no race condition, where the
        // initial animation (in componentDidMount) did override the now-changed bar width in
        // some cases. Updating the animation with the updated bar widths fixes that.
        this.animateBarWidth();
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.bounds, message: this.failMessage }));
        const { series, bounds, axis, innerBounds, barHeight, barSpacing, } = this;
        let yOffset = innerBounds.top + barHeight / 2;
        return (React.createElement("g", { ref: this.base, className: "DiscreteBarChart" },
            React.createElement("rect", { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height, opacity: 0, fill: "rgba(255,255,255,0)" }),
            React.createElement(AxisViews_1.HorizontalAxisComponent, { bounds: bounds, axis: axis, axisPosition: innerBounds.bottom }),
            React.createElement(AxisViews_1.HorizontalAxisGridLines, { horizontalAxis: axis, bounds: innerBounds }),
            series.map((series) => {
                // Todo: add a "placedSeries" getter to get the transformed series, then just loop over the placedSeries and render a bar for each
                const isNegative = series.value < 0;
                const barX = isNegative
                    ? axis.place(series.value)
                    : axis.place(this.x0);
                const barWidth = isNegative
                    ? axis.place(this.x0) - barX
                    : axis.place(series.value) - barX;
                const valueLabel = this.formatValue(series);
                const labelX = isNegative
                    ? barX -
                        Bounds_1.Bounds.forText(valueLabel, this.valueLabelStyle)
                            .width -
                        labelToTextPadding
                    : barX - labelToBarPadding;
                // Using transforms for positioning to enable better (subpixel) transitions
                // Width transitions don't work well on iOS Safari – they get interrupted and
                // it appears very slow. Also be careful with negative bar charts.
                const result = (React.createElement("g", { key: series.seriesName, className: "bar", transform: `translate(0, ${yOffset})` },
                    React.createElement("text", Object.assign({ x: 0, y: 0, transform: `translate(${labelX}, 0)`, fill: "#555", dominantBaseline: "middle", textAnchor: "end" }, this.legendLabelStyle), series.seriesName),
                    React.createElement("rect", { x: 0, y: 0, transform: `translate(${barX}, ${-barHeight / 2})`, width: barWidth, height: barHeight, fill: series.color, opacity: 0.85, style: { transition: "height 200ms ease" } }),
                    React.createElement("text", Object.assign({ x: 0, y: 0, transform: `translate(${axis.place(series.value) +
                            (isNegative
                                ? -labelToBarPadding
                                : labelToBarPadding)}, 0)`, fill: "#666", dominantBaseline: "middle", textAnchor: isNegative ? "end" : "start" }, this.valueLabelStyle), valueLabel)));
                yOffset += barHeight + barSpacing;
                return result;
            })));
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
    formatValue(series) {
        const column = this.yColumns[0]; // todo: do we need to use the right column here?
        const { transformedTable } = this;
        const showYearLabels = this.manager.showYearLabels || series.time !== this.targetTime;
        const displayValue = column.formatValueShort(series.value);
        return (displayValue +
            (showYearLabels
                ? ` (${transformedTable.timeColumnFormatFunction(series.time)})`
                : ""));
    }
    get yColumnSlugs() {
        return ChartUtils_1.autoDetectYColumnSlugs(this.manager);
    }
    get seriesStrategy() {
        var _a;
        return ((_a = this.manager.seriesStrategy) !== null && _a !== void 0 ? _a : (this.yColumnSlugs.length > 1 &&
            this.selectionArray.numSelectedEntities === 1
            ? GrapherConstants_1.SeriesStrategy.column
            : GrapherConstants_1.SeriesStrategy.entity));
    }
    get yColumns() {
        return this.transformedTable.getColumns(this.yColumnSlugs);
    }
    get columnsAsSeries() {
        return Util_1.excludeUndefined(this.yColumns.map((col) => {
            const row = Util_1.first(col.owidRows);
            // Do not plot a bar if column has no data for the selected time
            if (!row)
                return undefined;
            return {
                row,
                seriesName: col.displayName,
                color: col.def.color,
            };
        }));
    }
    get entitiesAsSeries() {
        const { transformedTable } = this;
        return this.yColumns[0].owidRows.map((row) => {
            return {
                seriesName: row.entityName,
                color: transformedTable.getColorForEntityName(row.entityName),
                row,
            };
        });
    }
    get sortedRawSeries() {
        const raw = this.seriesStrategy === GrapherConstants_1.SeriesStrategy.entity
            ? this.entitiesAsSeries
            : this.columnsAsSeries;
        return Util_1.sortBy(raw, (series) => series.row.value);
    }
    get colorScheme() {
        var _a;
        // If this DiscreteBarChart stems from a LineChart, we want to match its (default) color
        // scheme OWID Distinct. Otherwise, use an all-blue color scheme (`undefined`) as default.
        const defaultColorScheme = this.manager.isLineChart
            ? ColorSchemes_1.ColorSchemes["owid-distinct"]
            : undefined;
        return ((_a = (this.manager.baseColorScheme
            ? ColorSchemes_1.ColorSchemes[this.manager.baseColorScheme]
            : undefined)) !== null && _a !== void 0 ? _a : defaultColorScheme);
    }
    get valuesToColorsMap() {
        const { manager, colorScheme, sortedRawSeries } = this;
        return colorScheme === null || colorScheme === void 0 ? void 0 : colorScheme.getUniqValueColorMap(Util_1.uniq(sortedRawSeries.map((series) => series.row.value)), manager.invertColorScheme);
    }
    get series() {
        const { manager, colorScheme } = this;
        const series = this.sortedRawSeries
            .slice() // we need to clone/slice here so `.reverse()` doesn't modify `this.sortedRawSeries` in-place
            .reverse()
            .map((rawSeries) => {
            var _a, _b;
            const { row, seriesName, color } = rawSeries;
            const series = Object.assign(Object.assign({}, row), { seriesName, color: (_b = color !== null && color !== void 0 ? color : (_a = this.valuesToColorsMap) === null || _a === void 0 ? void 0 : _a.get(row.value)) !== null && _b !== void 0 ? _b : DiscreteBarChartConstants_1.DEFAULT_BAR_COLOR });
            return series;
        });
        if (manager.isLineChart) {
            // For LineChart-based bar charts, we want to assign colors from the color scheme.
            // This way we get consistent between the DiscreteBarChart and the LineChart (by using the same logic).
            colorScheme === null || colorScheme === void 0 ? void 0 : colorScheme.assignColors(series, manager.invertColorScheme, this.seriesStrategy === GrapherConstants_1.SeriesStrategy.entity
                ? this.inputTable.entityNameColorIndex
                : this.inputTable.columnDisplayNameToColorMap, manager.seriesColorMap);
        }
        return series;
    }
};
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "manager", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "targetTime", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "isLogScale", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "baseFontSize", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "legendLabelStyle", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "valueLabelStyle", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "legendWidth", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "hasPositive", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "hasNegative", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "rightValueLabelWidth", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "leftValueLabelWidth", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "x0", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "xDomainDefault", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "xRange", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "yAxis", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "axis", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "innerBounds", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "barCount", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "barHeight", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "barSpacing", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "barPlacements", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "barWidths", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "yColumnSlugs", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "seriesStrategy", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "yColumns", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "columnsAsSeries", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "entitiesAsSeries", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "sortedRawSeries", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "colorScheme", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "valuesToColorsMap", null);
__decorate([
    mobx_1.computed
], DiscreteBarChart.prototype, "series", null);
DiscreteBarChart = __decorate([
    mobx_react_1.observer
], DiscreteBarChart);
exports.DiscreteBarChart = DiscreteBarChart;
//# sourceMappingURL=DiscreteBarChart.js.map