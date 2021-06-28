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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scatter = exports.StackedArea = exports.MapChart = exports.StaticLineChartForExport = exports.LineChart = void 0;
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const GrapherConstants_1 = require("../core/GrapherConstants");
const Bounds_1 = require("../../clientUtils/Bounds");
const React = __importStar(require("react"));
const CaptionedChart_1 = require("./CaptionedChart");
exports.default = {
    title: "CaptionedChart",
    component: CaptionedChart_1.CaptionedChart,
};
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 5 });
const manager = {
    tabBounds: Bounds_1.DEFAULT_BOUNDS,
    table,
    selection: table.availableEntityNames,
    currentTitle: "This is the Title",
    subtitle: "A Subtitle",
    note: "Here are some footer notes",
    populateFromQueryParams: () => { },
    isReady: true,
};
const LineChart = () => React.createElement(CaptionedChart_1.CaptionedChart, { manager: manager });
exports.LineChart = LineChart;
const StaticLineChartForExport = () => {
    return (React.createElement(CaptionedChart_1.StaticCaptionedChart, { manager: Object.assign(Object.assign({}, manager), { isExportingtoSvgOrPng: true }) }));
};
exports.StaticLineChartForExport = StaticLineChartForExport;
const MapChart = () => (React.createElement(CaptionedChart_1.CaptionedChart, { manager: Object.assign(Object.assign({}, manager), { tab: GrapherConstants_1.GrapherTabOption.map }) }));
exports.MapChart = MapChart;
const StackedArea = () => (React.createElement(CaptionedChart_1.CaptionedChart, { manager: Object.assign(Object.assign({}, manager), { type: GrapherConstants_1.ChartTypeName.StackedArea, seriesStrategy: GrapherConstants_1.SeriesStrategy.entity }) }));
exports.StackedArea = StackedArea;
const Scatter = () => (React.createElement(CaptionedChart_1.CaptionedChart, { manager: Object.assign(Object.assign({}, manager), { type: GrapherConstants_1.ChartTypeName.ScatterPlot, table: table.filterByTargetTimes([1999], 0) }) }));
exports.Scatter = Scatter;
//# sourceMappingURL=CaptionedChart.stories.js.map