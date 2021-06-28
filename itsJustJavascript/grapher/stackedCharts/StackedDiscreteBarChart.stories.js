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
exports.ColumnsAsSeriesRelative = exports.ColumnsAsSeries = void 0;
const React = __importStar(require("react"));
const StackedDiscreteBarChart_1 = require("./StackedDiscreteBarChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
exports.default = {
    title: "StackedDiscreteBarChart",
    component: StackedDiscreteBarChart_1.StackedDiscreteBarChart,
};
const ColumnsAsSeries = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
        timeRange: [2000, 2001],
        entityCount: 5,
    });
    return (React.createElement("svg", { width: 640, height: 600 },
        React.createElement(StackedDiscreteBarChart_1.StackedDiscreteBarChart, { manager: { table, selection: table.sampleEntityName(5) } })));
};
exports.ColumnsAsSeries = ColumnsAsSeries;
const ColumnsAsSeriesRelative = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
        timeRange: [2000, 2001],
        entityCount: 5,
    });
    return (React.createElement("svg", { width: 640, height: 600 },
        React.createElement(StackedDiscreteBarChart_1.StackedDiscreteBarChart, { manager: {
                table,
                selection: table.sampleEntityName(5),
                isRelativeMode: true,
            } })));
};
exports.ColumnsAsSeriesRelative = ColumnsAsSeriesRelative;
//# sourceMappingURL=StackedDiscreteBarChart.stories.js.map