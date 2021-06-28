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
exports.ColumnsAsSeries = exports.EntitiesAsSeriesWithTolerance = exports.EntitiesAsSeries = void 0;
const React = __importStar(require("react"));
const DiscreteBarChart_1 = require("./DiscreteBarChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
exports.default = {
    title: "DiscreteBarChart",
    component: DiscreteBarChart_1.DiscreteBarChart,
};
const EntitiesAsSeries = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        timeRange: [2009, 2010],
        entityCount: 10,
    });
    const manager = {
        table,
        selection: table.availableEntityNames,
        yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
    };
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(DiscreteBarChart_1.DiscreteBarChart, { manager: manager })));
};
exports.EntitiesAsSeries = EntitiesAsSeries;
const EntitiesAsSeriesWithTolerance = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        timeRange: [2009, 2011],
        entityCount: 10,
    })
        .rowFilter((row) => row.year === 2010 || Math.random() > 0.5, "Remove 50% of 2009 rows")
        .interpolateColumnWithTolerance(OwidTableSynthesizers_1.SampleColumnSlugs.Population, 1)
        .filterByTargetTimes([2009]);
    const manager = {
        table,
        // Pass transformed table to avoid applying tolerance again in transformTable()
        transformedTable: table,
        selection: table.availableEntityNames,
        yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
        endTime: 2009,
    };
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(DiscreteBarChart_1.DiscreteBarChart, { manager: manager })));
};
exports.EntitiesAsSeriesWithTolerance = EntitiesAsSeriesWithTolerance;
const ColumnsAsSeries = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({ entityCount: 1 });
    const manager = {
        table,
        selection: table.availableEntityNames,
    };
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(DiscreteBarChart_1.DiscreteBarChart, { manager: manager })));
};
exports.ColumnsAsSeries = ColumnsAsSeries;
//# sourceMappingURL=DiscreteBarChart.stories.js.map