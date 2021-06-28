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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstactStackedChart = void 0;
const Axis_1 = require("../axis/Axis");
const AxisConfig_1 = require("../axis/AxisConfig");
const GrapherConstants_1 = require("../core/GrapherConstants");
const Bounds_1 = require("../../clientUtils/Bounds");
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_1 = __importDefault(require("react"));
const ChartUtils_1 = require("../chart/ChartUtils");
const d3_scale_1 = require("d3-scale");
const d3_ease_1 = require("d3-ease");
const d3_selection_1 = require("d3-selection");
const ColorSchemes_1 = require("../color/ColorSchemes");
let AbstactStackedChart = class AbstactStackedChart extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.base = react_1.default.createRef();
    }
    transformTable(table) {
        table = table.filterByEntityNames(this.selectionArray.selectedEntityNames);
        // TODO: remove this filter once we don't have mixed type columns in datasets
        table = table
            .replaceNonNumericCellsWithErrorValues(this.yColumnSlugs)
            .dropRowsWithErrorValuesForAllColumns(this.yColumnSlugs);
        if (!this.props.disableLinearInterpolation) {
            this.yColumnSlugs.forEach((slug) => {
                table = table.interpolateColumnLinearly(slug);
            });
        }
        // Drop rows for which no valid data points exist for any display column
        // after interpolation, which most likely means they lie at the start/end
        // of the time range and were not extrapolated
        table = table.dropRowsWithErrorValuesForAnyColumn(this.yColumnSlugs);
        if (this.manager.isRelativeMode) {
            table = this.isEntitySeries
                ? table.toPercentageFromEachEntityForEachTime(this.yColumnSlugs[0])
                : table.toPercentageFromEachColumnForEachEntityAndTime(this.yColumnSlugs);
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
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get fontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get paddingForLegend() {
        return 0;
    }
    get renderUid() {
        return Util_1.guid();
    }
    get yColumns() {
        return this.transformedTable.getColumns(this.yColumnSlugs);
    }
    get yColumnSlugs() {
        var _a;
        return ((_a = this.manager.yColumnSlugsInSelectionOrder) !== null && _a !== void 0 ? _a : ChartUtils_1.autoDetectYColumnSlugs(this.manager));
    }
    componentDidMount() {
        // Fancy intro animation
        this.animSelection = d3_selection_1.select(this.base.current)
            .selectAll("clipPath > rect")
            .attr("width", 0);
        this.animSelection
            .transition()
            .duration(800)
            .ease(d3_ease_1.easeLinear)
            .attr("width", this.bounds.width)
            .on("end", () => this.forceUpdate()); // Important in case bounds changes during transition
        Util_1.exposeInstanceOnWindow(this);
    }
    componentWillUnmount() {
        if (this.animSelection)
            this.animSelection.interrupt();
    }
    get seriesStrategy() {
        return ChartUtils_1.autoDetectSeriesStrategy(this.manager);
    }
    get dualAxis() {
        const { bounds, horizontalAxisPart, verticalAxisPart, paddingForLegend, } = this;
        return new Axis_1.DualAxis({
            bounds: bounds.padRight(paddingForLegend),
            horizontalAxis: horizontalAxisPart,
            verticalAxis: verticalAxisPart,
        });
    }
    get horizontalAxisPart() {
        const axisConfig = this.manager.xAxis || new AxisConfig_1.AxisConfig(this.manager.xAxisConfig, this);
        if (this.manager.hideXAxis)
            axisConfig.hideAxis = true;
        const axis = axisConfig.toHorizontalAxis();
        axis.updateDomainPreservingUserSettings(this.transformedTable.timeDomainFor(this.yColumnSlugs));
        axis.formatColumn = this.inputTable.timeColumn;
        axis.hideFractionalTicks = true;
        axis.hideGridlines = true;
        return axis;
    }
    get verticalAxisPart() {
        var _a;
        // const lastSeries = this.series[this.series.length - 1]
        // const yValues = lastSeries.points.map((d) => d.yOffset + d.y)
        const yValues = this.allStackedPoints.map((point) => point.value + point.valueOffset);
        const axisConfig = this.manager.yAxis || new AxisConfig_1.AxisConfig(this.manager.yAxisConfig, this);
        if (this.manager.hideYAxis)
            axisConfig.hideAxis = true;
        const axis = axisConfig.toVerticalAxis();
        // Use user settings for axis, unless relative mode
        if (this.manager.isRelativeMode)
            axis.domain = [0, 100];
        else
            axis.updateDomainPreservingUserSettings([0, (_a = Util_1.max(yValues)) !== null && _a !== void 0 ? _a : 100]); // Stacked area chart must have its own y domain)
        axis.formatColumn = this.yColumns[0];
        return axis;
    }
    get columnsAsSeries() {
        return this.yColumns
            .map((col) => {
            return {
                isProjection: col.isProjection,
                seriesName: col.displayName,
                rows: col.owidRows,
            };
        })
            .reverse(); // For stacked charts, we want the first selected series to be on top, so we reverse the order of the stacks.
    }
    get entitiesAsSeries() {
        const { isProjection, owidRowsByEntityName } = this.yColumns[0];
        return this.selectionArray.selectedEntityNames
            .map((seriesName) => {
            return {
                isProjection,
                seriesName,
                rows: owidRowsByEntityName.get(seriesName) || [],
            };
        })
            .reverse(); // For stacked charts, we want the first selected series to be on top, so we reverse the order of the stacks.
    }
    get rawSeries() {
        return this.isEntitySeries
            ? this.entitiesAsSeries
            : this.columnsAsSeries;
    }
    get allStackedPoints() {
        return Util_1.flatten(this.series.map((series) => series.points));
    }
    get failMessage() {
        const { yColumnSlugs } = this;
        if (!yColumnSlugs.length)
            return "Missing variable";
        if (!this.series.length)
            return "No matching data";
        if (!this.allStackedPoints.length)
            return "No matching points";
        return "";
    }
    get colorScheme() {
        var _a;
        const scheme = (_a = (this.manager.baseColorScheme
            ? ColorSchemes_1.ColorSchemes[this.manager.baseColorScheme]
            : null)) !== null && _a !== void 0 ? _a : ColorSchemes_1.ColorSchemes.stackedAreaDefault;
        const seriesCount = this.isEntitySeries
            ? this.selectionArray.numSelectedEntities
            : this.yColumns.length;
        const baseColors = scheme.getColors(seriesCount);
        if (this.manager.invertColorScheme)
            baseColors.reverse();
        return d3_scale_1.scaleOrdinal(baseColors);
    }
    getColorForSeries(seriesName) {
        var _a;
        const table = this.transformedTable;
        const color = this.isEntitySeries
            ? table.getColorForEntityName(seriesName)
            : table.getColorForColumnByDisplayName(seriesName);
        return (_a = color !== null && color !== void 0 ? color : this.colorScheme(seriesName)) !== null && _a !== void 0 ? _a : "#ddd";
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    get isEntitySeries() {
        return this.seriesStrategy === GrapherConstants_1.SeriesStrategy.entity;
    }
    get seriesColors() {
        return this.series.map((series) => series.color);
    }
    /** Whether we want to display series with only zeroes. Defaults to true but e.g. StackedArea charts want to set this to false */
    get showAllZeroSeries() {
        return true;
    }
    get unstackedSeries() {
        return this.rawSeries
            .filter((series) => series.rows.length &&
            (this.showAllZeroSeries ||
                series.rows.some((row) => row.value !== 0)))
            .map((series) => {
            const { isProjection, seriesName, rows } = series;
            return {
                seriesName,
                isProjection,
                points: rows.map((row) => {
                    return {
                        position: row.time,
                        value: row.value,
                        valueOffset: 0,
                    };
                }),
                color: this.getColorForSeries(seriesName),
            };
        });
    }
    get series() {
        return this.unstackedSeries;
    }
};
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "manager", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "renderUid", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "yColumns", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "yColumnSlugs", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "seriesStrategy", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "dualAxis", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "horizontalAxisPart", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "verticalAxisPart", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "columnsAsSeries", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "entitiesAsSeries", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "rawSeries", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "allStackedPoints", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "colorScheme", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "isEntitySeries", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "seriesColors", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "unstackedSeries", null);
__decorate([
    mobx_1.computed
], AbstactStackedChart.prototype, "series", null);
AbstactStackedChart = __decorate([
    mobx_react_1.observer
], AbstactStackedChart);
exports.AbstactStackedChart = AbstactStackedChart;
//# sourceMappingURL=AbstractStackedChart.js.map