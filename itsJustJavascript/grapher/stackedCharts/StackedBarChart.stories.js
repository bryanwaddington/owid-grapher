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
exports.EntitiesAsSeriesWithMissingRows = exports.EntitiesAsSeries = exports.ColumnsAsSeries = void 0;
const React = __importStar(require("react"));
const StackedBarChart_1 = require("./StackedBarChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
exports.default = {
    title: "StackedBarChart",
    component: StackedBarChart_1.StackedBarChart,
};
const ColumnsAsSeries = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable();
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(StackedBarChart_1.StackedBarChart, { manager: { table, selection: table.sampleEntityName(1) } })));
};
exports.ColumnsAsSeries = ColumnsAsSeries;
const EntitiesAsSeries = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 5 });
    const manager = {
        table,
        selection: table.availableEntityNames,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Population],
    };
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(StackedBarChart_1.StackedBarChart, { manager: manager })));
};
exports.EntitiesAsSeries = EntitiesAsSeries;
const EntitiesAsSeriesWithMissingRows = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 5 }).dropRandomRows(30);
    const manager = {
        table,
        selection: table.availableEntityNames,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Population],
    };
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(StackedBarChart_1.StackedBarChart, { manager: manager })));
};
exports.EntitiesAsSeriesWithMissingRows = EntitiesAsSeriesWithMissingRows;
//# sourceMappingURL=StackedBarChart.stories.js.map