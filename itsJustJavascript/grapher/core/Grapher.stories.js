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
exports.Perf = exports.WithAuthorTimeFilter = exports.Faceting = exports.NoMap = exports.BlankGrapher = exports.MapFirst = exports.StackedArea = exports.StackedBar = exports.DiscreteBar = exports.ScatterPlot = exports.SlopeChart = exports.Line = void 0;
const React = __importStar(require("react"));
const Grapher_1 = require("./Grapher");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const GrapherConstants_1 = require("./GrapherConstants");
const OwidTable_1 = require("../../coreTable/OwidTable");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const ChartTypeSwitcher_1 = require("../chart/ChartTypeSwitcher");
exports.default = {
    title: "Grapher",
    component: Grapher_1.Grapher,
};
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 10 });
const basics = {
    table,
    selectedEntityNames: table.sampleEntityName(5),
    hasMapTab: true,
    yAxis: {
        canChangeScaleType: true,
    },
    xAxis: {
        canChangeScaleType: true,
    },
    dimensions: [
        {
            slug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
            property: GrapherConstants_1.DimensionProperty.y,
            variableId: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
        },
        {
            slug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
            property: GrapherConstants_1.DimensionProperty.x,
            variableId: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
        },
    ],
};
const Line = () => React.createElement(Grapher_1.Grapher, Object.assign({}, basics));
exports.Line = Line;
const SlopeChart = () => {
    const model = Object.assign({ type: GrapherConstants_1.ChartTypeName.SlopeChart }, basics);
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.SlopeChart = SlopeChart;
const ScatterPlot = () => {
    const model = Object.assign({ type: GrapherConstants_1.ChartTypeName.ScatterPlot }, basics);
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.ScatterPlot = ScatterPlot;
const DiscreteBar = () => {
    const model = Object.assign({ type: GrapherConstants_1.ChartTypeName.DiscreteBar }, basics);
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.DiscreteBar = DiscreteBar;
const StackedBar = () => {
    const model = Object.assign({ type: GrapherConstants_1.ChartTypeName.StackedBar }, basics);
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.StackedBar = StackedBar;
const StackedArea = () => {
    const model = Object.assign({ type: GrapherConstants_1.ChartTypeName.StackedArea }, basics);
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.StackedArea = StackedArea;
const MapFirst = () => {
    const model = Object.assign(Object.assign({}, basics), { tab: GrapherConstants_1.GrapherTabOption.map });
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.MapFirst = MapFirst;
const BlankGrapher = () => {
    const model = {
        type: GrapherConstants_1.ChartTypeName.WorldMap,
        tab: GrapherConstants_1.GrapherTabOption.map,
        table: OwidTable_1.BlankOwidTable(),
        hasMapTab: true,
    };
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.BlankGrapher = BlankGrapher;
const NoMap = () => {
    const model = Object.assign(Object.assign({}, basics), { hasMapTab: false });
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.NoMap = NoMap;
const Faceting = () => {
    const model = Object.assign({ type: GrapherConstants_1.ChartTypeName.StackedArea, facet: GrapherConstants_1.FacetStrategy.country }, basics);
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.Faceting = Faceting;
const WithAuthorTimeFilter = () => {
    const model = Object.assign(Object.assign({}, basics), { timelineMinTime: 1993, timelineMaxTime: 1996 });
    return React.createElement(Grapher_1.Grapher, Object.assign({}, model));
};
exports.WithAuthorTimeFilter = WithAuthorTimeFilter;
let PerfGrapher = class PerfGrapher extends React.Component {
    constructor() {
        super(...arguments);
        this.table = basics.table;
        this.chartTypeName = GrapherConstants_1.ChartTypeName.LineChart;
    }
    loadBigTable() {
        this.table = OwidTableSynthesizers_1.SynthesizeGDPTable({
            entityCount: 200,
            timeRange: [1500, 2000],
        });
    }
    changeChartType(type) {
        this.chartTypeName = type;
    }
    render() {
        const key = Math.random(); // I do this hack to force a rerender until can re-add the grapher model/grapher view that we used to have. @breck 10/29/2020
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("button", { onClick: this.loadBigTable }, "Big Table for Perf"),
                React.createElement(ChartTypeSwitcher_1.ChartTypeSwitcher, { onChange: this.changeChartType })),
            React.createElement(Grapher_1.Grapher, Object.assign({}, basics, { table: this.table, type: this.chartTypeName, key: key }))));
    }
};
__decorate([
    mobx_1.action.bound
], PerfGrapher.prototype, "loadBigTable", null);
__decorate([
    mobx_1.observable.ref
], PerfGrapher.prototype, "table", void 0);
__decorate([
    mobx_1.action.bound
], PerfGrapher.prototype, "changeChartType", null);
__decorate([
    mobx_1.observable
], PerfGrapher.prototype, "chartTypeName", void 0);
PerfGrapher = __decorate([
    mobx_react_1.observer
], PerfGrapher);
const Perf = () => React.createElement(PerfGrapher, null);
exports.Perf = Perf;
//# sourceMappingURL=Grapher.stories.js.map