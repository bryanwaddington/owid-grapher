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
exports.OneChartPerMetric = exports.MultipleMetricsOneCountryPerChart = exports.OneMetricOneCountryPerChart = void 0;
const React = __importStar(require("react"));
const FacetChart_1 = require("./FacetChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const Bounds_1 = require("../../clientUtils/Bounds");
const GrapherConstants_1 = require("../core/GrapherConstants");
const AxisConfig_1 = require("../axis/AxisConfig");
// See https://storybook.js.org/docs/react/essentials/controls for Control Types
const CSF = {
    title: "FacetChart",
    component: FacetChart_1.FacetChart,
};
exports.default = CSF;
const bounds = new Bounds_1.Bounds(0, 0, 1000, 500);
const OneMetricOneCountryPerChart = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        entityCount: 4,
    });
    const manager = {
        table,
        selection: table.availableEntityNames,
        yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
        xColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
        yAxis: new AxisConfig_1.AxisConfig(),
    };
    return (React.createElement("svg", { width: bounds.width, height: bounds.height },
        React.createElement(FacetChart_1.FacetChart, { bounds: bounds, chartTypeName: GrapherConstants_1.ChartTypeName.LineChart, manager: manager })));
};
exports.OneMetricOneCountryPerChart = OneMetricOneCountryPerChart;
const MultipleMetricsOneCountryPerChart = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
        entityCount: 4,
    });
    return (React.createElement("svg", { width: bounds.width, height: bounds.height },
        React.createElement(FacetChart_1.FacetChart, { bounds: bounds, chartTypeName: GrapherConstants_1.ChartTypeName.LineChart, manager: {
                selection: table.availableEntityNames,
                table,
                yAxis: new AxisConfig_1.AxisConfig(),
            } })));
};
exports.MultipleMetricsOneCountryPerChart = MultipleMetricsOneCountryPerChart;
const OneChartPerMetric = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        entityCount: 2,
    });
    return (React.createElement("svg", { width: bounds.width, height: bounds.height },
        React.createElement(FacetChart_1.FacetChart, { bounds: bounds, chartTypeName: GrapherConstants_1.ChartTypeName.LineChart, manager: {
                facetStrategy: GrapherConstants_1.FacetStrategy.column,
                yColumnSlugs: table.numericColumnSlugs,
                selection: table.availableEntityNames,
                table,
            } })));
};
exports.OneChartPerMetric = OneChartPerMetric;
//# sourceMappingURL=FacetChart.stories.js.map