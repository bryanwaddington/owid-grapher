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
exports.CustomColors = exports.AverageAnnualChange = exports.OneYearWithSizeAndColorColumn = exports.MultipleYearsWithConnectedLinesAndBackgroundLines = exports.MultipleYearsWithConnectedLines = exports.LogScaleWithNonPositives = exports.LogScales = exports.WithComparisonLinesAndSelection = exports.OneYearWithSizeColumn = void 0;
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const GrapherConstants_1 = require("../core/GrapherConstants");
const Bounds_1 = require("../../clientUtils/Bounds");
const React = __importStar(require("react"));
const ScatterPlotChart_1 = require("./ScatterPlotChart");
exports.default = {
    title: "ScatterPlotChart",
    component: ScatterPlotChart_1.ScatterPlotChart,
};
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 20 });
const basicSetup = {
    table,
    selection: table.availableEntityNames,
    yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
    xColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
    yAxisConfig: {
        min: 0,
    },
    xAxisConfig: {
        min: 0,
    },
};
const table2 = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 20 }).filterByTargetTimes([2000], 0);
const oneYear = Object.assign(Object.assign({}, basicSetup), { selection: table2.availableEntityNames, table: table2 });
const oneYearWithSizeColumn = Object.assign(Object.assign({}, oneYear), { sizeColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.LifeExpectancy });
const oneYearWithComparisons = Object.assign(Object.assign({}, oneYear), { comparisonLines: [
        {
            label: "GDP = Population * 1000",
            yEquals: "1000*x",
        },
    ] });
const size = { width: Bounds_1.DEFAULT_BOUNDS.width, height: Bounds_1.DEFAULT_BOUNDS.height };
const OneYearWithSizeColumn = () => {
    return (React.createElement("svg", Object.assign({}, size),
        React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: oneYearWithSizeColumn })));
};
exports.OneYearWithSizeColumn = OneYearWithSizeColumn;
const WithComparisonLinesAndSelection = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 200 }).filterByTargetTimes([2000], 0);
    const manager = Object.assign(Object.assign({}, oneYearWithComparisons), { table, selection: table.sampleEntityName(5) });
    return (React.createElement(React.Fragment, null,
        React.createElement("svg", Object.assign({}, size),
            React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: manager })),
        React.createElement("svg", Object.assign({}, size),
            React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: Object.assign(Object.assign({}, manager), { backgroundSeriesLimit: 10 }) }))));
};
exports.WithComparisonLinesAndSelection = WithComparisonLinesAndSelection;
const LogScales = () => {
    const yAxisConfig = {
        scaleType: GrapherConstants_1.ScaleType.log,
        min: 0,
    };
    const xAxisConfig = {
        scaleType: GrapherConstants_1.ScaleType.log,
        min: 0,
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("svg", Object.assign({}, size),
            React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: oneYearWithComparisons })),
        React.createElement("svg", Object.assign({}, size),
            React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: Object.assign(Object.assign({}, oneYearWithComparisons), { yAxisConfig }) })),
        React.createElement("svg", Object.assign({}, size),
            React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: Object.assign(Object.assign({}, oneYearWithComparisons), { xAxisConfig }) })),
        React.createElement("svg", Object.assign({}, size),
            React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: Object.assign(Object.assign({}, oneYearWithComparisons), { yAxisConfig,
                    xAxisConfig }) }))));
};
exports.LogScales = LogScales;
const LogScaleWithNonPositives = () => {
    const manager = {
        table: OwidTableSynthesizers_1.SynthesizeFruitTableWithNonPositives(),
        selection: table.availableEntityNames,
        yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
        xColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables,
        yAxisConfig: {
            min: 0,
            scaleType: GrapherConstants_1.ScaleType.log,
        },
        xAxisConfig: {
            min: 0,
            scaleType: GrapherConstants_1.ScaleType.log,
        },
    };
    return (React.createElement("svg", Object.assign({}, size),
        React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: manager })));
};
exports.LogScaleWithNonPositives = LogScaleWithNonPositives;
const MultipleYearsWithConnectedLines = () => (React.createElement("svg", Object.assign({}, size),
    React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: basicSetup })));
exports.MultipleYearsWithConnectedLines = MultipleYearsWithConnectedLines;
const MultipleYearsWithConnectedLinesAndBackgroundLines = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 20 });
    return (React.createElement("svg", Object.assign({}, size),
        React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: Object.assign(Object.assign({}, basicSetup), { table, selection: table.sampleEntityName(2) }) })));
};
exports.MultipleYearsWithConnectedLinesAndBackgroundLines = MultipleYearsWithConnectedLinesAndBackgroundLines;
// TODO
const OneYearWithSizeAndColorColumn = () => {
    return (React.createElement("svg", Object.assign({}, size),
        React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: Object.assign(Object.assign({}, oneYearWithSizeColumn), { colorColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.LifeExpectancy }) })));
};
exports.OneYearWithSizeAndColorColumn = OneYearWithSizeAndColorColumn;
// TODO
const AverageAnnualChange = () => {
    return (React.createElement("svg", Object.assign({}, size),
        React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: oneYear })));
};
exports.AverageAnnualChange = AverageAnnualChange;
// TODO
const CustomColors = () => {
    return (React.createElement("svg", Object.assign({}, size),
        React.createElement(ScatterPlotChart_1.ScatterPlotChart, { manager: oneYear })));
};
exports.CustomColors = CustomColors;
//# sourceMappingURL=ScatterPlotChart.stories.js.map