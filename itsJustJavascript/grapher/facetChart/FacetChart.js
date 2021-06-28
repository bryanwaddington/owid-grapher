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
exports.FacetChart = void 0;
const react_1 = __importDefault(require("react"));
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const mobx_1 = require("mobx");
const GrapherConstants_1 = require("../core/GrapherConstants");
const ChartTypeMap_1 = require("../chart/ChartTypeMap");
const FacetChartUtils_1 = require("./FacetChartUtils");
const ChartUtils_1 = require("../chart/ChartUtils");
const facetBackgroundColor = "transparent"; // we don't use color yet but may use it for background later
let FacetChart = class FacetChart extends react_1.default.Component {
    transformTable(table) {
        return table;
    }
    get inputTable() {
        return this.manager.table;
    }
    get transformedTable() {
        var _a;
        return ((_a = this.manager.transformedTable) !== null && _a !== void 0 ? _a : this.transformTable(this.inputTable));
    }
    get placedSeries() {
        var _a;
        const { manager, series } = this;
        const chartTypeName = (_a = this.props.chartTypeName) !== null && _a !== void 0 ? _a : GrapherConstants_1.ChartTypeName.LineChart;
        const count = series.length;
        const boundsArr = this.bounds.split(count, FacetChartUtils_1.getChartPadding(count));
        const { yColumnSlug, xColumnSlug, yColumnSlugs, colorColumnSlug, sizeColumnSlug, isRelativeMode, } = manager;
        const baseFontSize = FacetChartUtils_1.getFontSize(count, manager.baseFontSize);
        const lineStrokeWidth = count > 16 ? 1 : undefined;
        const table = this.transformedTable;
        return series.map((series, index) => {
            var _a;
            const bounds = boundsArr[index];
            const hideXAxis = false; // row < rows - 1 // todo: figure out design issues here
            const hideYAxis = false; // column > 0 // todo: figure out design issues here
            const hideLegend = false; // !(column !== columns - 1) // todo: only show 1?
            const hidePoints = true;
            const xAxisConfig = undefined;
            const yAxisConfig = undefined;
            const manager = Object.assign({ table,
                hideXAxis,
                hideYAxis,
                baseFontSize,
                lineStrokeWidth,
                hideLegend,
                hidePoints,
                xAxisConfig,
                yAxisConfig,
                yColumnSlug,
                xColumnSlug,
                yColumnSlugs,
                colorColumnSlug,
                sizeColumnSlug,
                isRelativeMode }, series.manager);
            return {
                bounds,
                chartTypeName: (_a = series.chartTypeName) !== null && _a !== void 0 ? _a : chartTypeName,
                manager,
                seriesName: series.seriesName,
            };
        });
    }
    get selectionArray() {
        return ChartUtils_1.makeSelectionArray(this.manager);
    }
    get countryFacets() {
        var _a, _b;
        const table = this.transformedTable.filterByEntityNames(this.selectionArray.selectedEntityNames);
        const sharedYDomain = table.domainFor(this.yColumnSlugs);
        const scaleType = (_a = this.manager.yAxis) === null || _a === void 0 ? void 0 : _a.scaleType;
        const sameXAxis = true;
        const xAxisConfig = sameXAxis
            ? {
                max: table.maxTime,
                min: table.minTime,
                scaleType,
            }
            : undefined;
        const hideLegend = ((_b = this.manager.yColumnSlugs) === null || _b === void 0 ? void 0 : _b.length) === 1;
        return this.selectionArray.selectedEntityNames.map((seriesName) => {
            const seriesTable = table.filterByEntityNames([seriesName]);
            const seriesYDomain = seriesTable.domainFor(this.yColumnSlugs);
            const yAxisConfig = this.manager.yAxis.facetAxisRange == GrapherConstants_1.FacetAxisRange.shared
                ? {
                    max: sharedYDomain[1],
                    min: sharedYDomain[0],
                    scaleType,
                }
                : {
                    max: seriesYDomain[1],
                    min: seriesYDomain[0],
                    scaleType,
                };
            return {
                seriesName,
                color: facetBackgroundColor,
                manager: {
                    table: seriesTable,
                    selection: [seriesName],
                    seriesStrategy: GrapherConstants_1.SeriesStrategy.column,
                    hideLegend,
                    yAxisConfig,
                    xAxisConfig,
                },
            };
        });
    }
    get columnFacets() {
        return this.yColumns.map((col) => {
            return {
                seriesName: col.displayName,
                color: facetBackgroundColor,
                manager: {
                    selection: this.selectionArray,
                    yColumnSlug: col.slug,
                    yColumnSlugs: [col.slug],
                    seriesStrategy: GrapherConstants_1.SeriesStrategy.entity,
                },
            };
        });
    }
    get yColumns() {
        return this.yColumnSlugs.map((slug) => this.inputTable.get(slug));
    }
    get yColumnSlugs() {
        return ChartUtils_1.autoDetectYColumnSlugs(this.manager);
    }
    get series() {
        const { facetStrategy } = this.manager;
        return facetStrategy === GrapherConstants_1.FacetStrategy.column
            ? this.columnFacets
            : this.countryFacets;
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    get manager() {
        return this.props.manager;
    }
    get failMessage() {
        return "";
    }
    get subtitleFontSize() {
        const { placedSeries, manager } = this;
        return FacetChartUtils_1.getFontSize(placedSeries.length, manager.baseFontSize);
    }
    render() {
        const { subtitleFontSize } = this;
        return this.placedSeries.map((smallChart, index) => {
            var _a;
            const ChartClass = (_a = ChartTypeMap_1.ChartComponentClassMap.get(smallChart.chartTypeName)) !== null && _a !== void 0 ? _a : ChartTypeMap_1.DefaultChartClass;
            const { bounds, seriesName } = smallChart;
            const shiftTop = smallChart.chartTypeName === GrapherConstants_1.ChartTypeName.LineChart ? 6 : 10;
            return (react_1.default.createElement(react_1.default.Fragment, { key: index },
                react_1.default.createElement("text", { x: bounds.x, y: bounds.top - shiftTop, fill: "#1d3d63", fontSize: subtitleFontSize, style: { fontWeight: 700 } }, seriesName),
                react_1.default.createElement(ChartClass, { bounds: bounds, manager: smallChart.manager })));
        });
    }
};
__decorate([
    mobx_1.computed
], FacetChart.prototype, "inputTable", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "transformedTable", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "placedSeries", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "selectionArray", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "countryFacets", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "columnFacets", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "yColumns", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "yColumnSlugs", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "series", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "manager", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "failMessage", null);
__decorate([
    mobx_1.computed
], FacetChart.prototype, "subtitleFontSize", null);
FacetChart = __decorate([
    mobx_react_1.observer
], FacetChart);
exports.FacetChart = FacetChart;
//# sourceMappingURL=FacetChart.js.map