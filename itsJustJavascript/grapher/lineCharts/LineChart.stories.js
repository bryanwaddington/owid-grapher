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
exports.MultiColumnMultiCountry = exports.MultiColumnSingleCountry = exports.WithAnnotations = exports.WithoutCirclesOnPoints = exports.WithLogScaleAndNegativeAndZeroValues = exports.SingleColumnMultiCountry = void 0;
const React = __importStar(require("react"));
const LineChart_1 = require("../lineCharts/LineChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const GrapherConstants_1 = require("../core/GrapherConstants");
const Bounds_1 = require("../../clientUtils/Bounds");
const Util_1 = require("../../clientUtils/Util");
const OwidTableConstants_1 = require("../../coreTable/OwidTableConstants");
exports.default = {
    title: "LineChart",
    component: LineChart_1.LineChart,
};
const SingleColumnMultiCountry = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable();
    const bounds = new Bounds_1.Bounds(0, 0, 500, 250);
    return (React.createElement("div", null,
        React.createElement("svg", { width: 500, height: 250 },
            React.createElement(LineChart_1.LineChart, { bounds: bounds, manager: {
                    table,
                    yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.GDP],
                    selection: table.availableEntityNames,
                } })),
        React.createElement("div", null, "With missing data:"),
        React.createElement("svg", { width: 500, height: 250 },
            React.createElement(LineChart_1.LineChart, { bounds: bounds, manager: {
                    table: table.dropRandomRows(50),
                    selection: table.availableEntityNames,
                    yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.GDP],
                } }))));
};
exports.SingleColumnMultiCountry = SingleColumnMultiCountry;
const WithLogScaleAndNegativeAndZeroValues = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTableWithNonPositives({
        entityCount: 2,
        timeRange: [1900, 2000],
    });
    const bounds = new Bounds_1.Bounds(0, 0, 500, 250);
    const bounds2 = new Bounds_1.Bounds(0, 270, 500, 250);
    return (React.createElement("svg", { width: 500, height: 550 },
        React.createElement(LineChart_1.LineChart, { bounds: bounds, manager: {
                table,
                selection: table.availableEntityNames,
                yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit],
            } }),
        React.createElement(LineChart_1.LineChart, { bounds: bounds2, manager: {
                table,
                selection: table.availableEntityNames,
                yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit],
                yAxisConfig: { scaleType: GrapherConstants_1.ScaleType.log },
            } })));
};
exports.WithLogScaleAndNegativeAndZeroValues = WithLogScaleAndNegativeAndZeroValues;
const WithoutCirclesOnPoints = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        entityCount: 6,
        timeRange: [1900, 2000],
    });
    return (React.createElement("div", null,
        React.createElement("svg", { width: 600, height: 600 },
            React.createElement(LineChart_1.LineChart, { manager: {
                    table,
                    yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.GDP],
                    selection: table.availableEntityNames,
                } }))));
};
exports.WithoutCirclesOnPoints = WithoutCirclesOnPoints;
const WithAnnotations = () => {
    let table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        entityCount: 6,
        timeRange: [1900, 2000],
    });
    // todo: eventually we should create a better API for annotations
    table = table.appendColumns([
        {
            slug: Util_1.makeAnnotationsSlug(OwidTableSynthesizers_1.SampleColumnSlugs.GDP),
            values: table
                .get(OwidTableConstants_1.OwidTableSlugs.entityName)
                .values.map((name) => `${name} is a country`),
        },
    ]);
    return (React.createElement("div", null,
        React.createElement("svg", { width: 600, height: 600 },
            React.createElement(LineChart_1.LineChart, { manager: {
                    table,
                    yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.GDP],
                    selection: table.availableEntityNames,
                } }))));
};
exports.WithAnnotations = WithAnnotations;
const MultiColumnSingleCountry = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable();
    const bounds = new Bounds_1.Bounds(0, 0, 500, 250);
    return (React.createElement("div", null,
        React.createElement("svg", { width: 500, height: 250 },
            React.createElement(LineChart_1.LineChart, { bounds: bounds, manager: { table, selection: table.sampleEntityName(1) } })),
        React.createElement("div", null, "With missing data:"),
        React.createElement("svg", { width: 500, height: 250 },
            React.createElement(LineChart_1.LineChart, { bounds: bounds, manager: {
                    table: table.dropRandomRows(100),
                    selection: table.sampleEntityName(1),
                } }))));
};
exports.MultiColumnSingleCountry = MultiColumnSingleCountry;
const MultiColumnMultiCountry = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({ entityCount: 5 });
    const bounds = new Bounds_1.Bounds(0, 0, 500, 250);
    return (React.createElement("svg", { width: 500, height: 250 },
        React.createElement(LineChart_1.LineChart, { bounds: bounds, manager: { table, selection: table.availableEntityNames } })));
};
exports.MultiColumnMultiCountry = MultiColumnMultiCountry;
//# sourceMappingURL=LineChart.stories.js.map