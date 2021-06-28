"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultChartClass = exports.ChartComponentClassMap = void 0;
const ScatterPlotChart_1 = require("../scatterCharts/ScatterPlotChart");
const TimeScatterChart_1 = require("../scatterCharts/TimeScatterChart");
const SlopeChart_1 = require("../slopeCharts/SlopeChart");
const LineChart_1 = require("../lineCharts/LineChart");
const StackedAreaChart_1 = require("../stackedCharts/StackedAreaChart");
const DiscreteBarChart_1 = require("../barCharts/DiscreteBarChart");
const StackedBarChart_1 = require("../stackedCharts/StackedBarChart");
const GrapherConstants_1 = require("../core/GrapherConstants");
const MapChart_1 = require("../mapCharts/MapChart");
const StackedDiscreteBarChart_1 = require("../stackedCharts/StackedDiscreteBarChart");
exports.ChartComponentClassMap = new Map([
    [GrapherConstants_1.ChartTypeName.DiscreteBar, DiscreteBarChart_1.DiscreteBarChart],
    [GrapherConstants_1.ChartTypeName.LineChart, LineChart_1.LineChart],
    [GrapherConstants_1.ChartTypeName.SlopeChart, SlopeChart_1.SlopeChart],
    [GrapherConstants_1.ChartTypeName.StackedArea, StackedAreaChart_1.StackedAreaChart],
    [GrapherConstants_1.ChartTypeName.StackedBar, StackedBarChart_1.StackedBarChart],
    [GrapherConstants_1.ChartTypeName.StackedDiscreteBar, StackedDiscreteBarChart_1.StackedDiscreteBarChart],
    [GrapherConstants_1.ChartTypeName.ScatterPlot, ScatterPlotChart_1.ScatterPlotChart],
    [GrapherConstants_1.ChartTypeName.TimeScatter, TimeScatterChart_1.TimeScatterChart],
    [GrapherConstants_1.ChartTypeName.WorldMap, MapChart_1.MapChart],
]);
exports.DefaultChartClass = LineChart_1.LineChart;
//# sourceMappingURL=ChartTypeMap.js.map