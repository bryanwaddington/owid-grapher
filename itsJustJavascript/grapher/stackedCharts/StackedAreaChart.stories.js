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
exports.ColumnsAsSeriesWithMissingRowsAndInterpolationRelative = exports.ColumnsAsSeriesWithMissingCells = exports.ColumnsAsSeriesRelative = exports.ColumnsAsSeries = exports.EntitiesAsSeriesWithMissingRowsNoInterpolationRelative = exports.EntitiesAsSeriesWithMissingRowsAndInterpolationRelative = exports.EntitiesAsSeriesWithMissingRowsNoInterpolation = exports.EntitiesAsSeriesWithMissingRowsAndInterpolation = exports.EntitiesAsSeries = exports.EntitiesAsSeriesRelative = void 0;
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const React = __importStar(require("react"));
const StackedAreaChart_1 = require("./StackedAreaChart");
exports.default = {
    title: "StackedAreaChart",
    component: StackedAreaChart_1.StackedAreaChart,
};
const seed = Date.now();
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
    entityCount: 10,
    timeRange: [1950, 2010],
}, seed);
const entitiesChart = {
    table,
    selection: table.sampleEntityName(5),
    yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.GDP],
};
const EntitiesAsSeriesRelative = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: Object.assign(Object.assign({}, entitiesChart), { isRelativeMode: true }) })));
exports.EntitiesAsSeriesRelative = EntitiesAsSeriesRelative;
const EntitiesAsSeries = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: Object.assign(Object.assign({}, entitiesChart), { isRelativeMode: false }) })));
exports.EntitiesAsSeries = EntitiesAsSeries;
const EntitiesAsSeriesWithMissingRowsAndInterpolation = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: Object.assign(Object.assign({}, entitiesChart), { table: table.dropRandomRows(30, seed) }) })));
exports.EntitiesAsSeriesWithMissingRowsAndInterpolation = EntitiesAsSeriesWithMissingRowsAndInterpolation;
const EntitiesAsSeriesWithMissingRowsNoInterpolation = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { disableLinearInterpolation: true, manager: Object.assign(Object.assign({}, entitiesChart), { table: table.dropRandomRows(30, seed) }) })));
exports.EntitiesAsSeriesWithMissingRowsNoInterpolation = EntitiesAsSeriesWithMissingRowsNoInterpolation;
const EntitiesAsSeriesWithMissingRowsAndInterpolationRelative = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: Object.assign(Object.assign({}, entitiesChart), { table: table.dropRandomRows(30, seed), isRelativeMode: true }) })));
exports.EntitiesAsSeriesWithMissingRowsAndInterpolationRelative = EntitiesAsSeriesWithMissingRowsAndInterpolationRelative;
const EntitiesAsSeriesWithMissingRowsNoInterpolationRelative = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { disableLinearInterpolation: true, manager: Object.assign(Object.assign({}, entitiesChart), { table: table.dropRandomRows(30, seed), isRelativeMode: true }) })));
exports.EntitiesAsSeriesWithMissingRowsNoInterpolationRelative = EntitiesAsSeriesWithMissingRowsNoInterpolationRelative;
const colTable = OwidTableSynthesizers_1.SynthesizeFruitTable();
const columnsChart = {
    table: colTable,
    selection: colTable.sampleEntityName(1),
};
const ColumnsAsSeries = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: columnsChart })));
exports.ColumnsAsSeries = ColumnsAsSeries;
const ColumnsAsSeriesRelative = () => (React.createElement("svg", { width: 600, height: 600 },
    React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: Object.assign(Object.assign({}, columnsChart), { isRelativeMode: true }) })));
exports.ColumnsAsSeriesRelative = ColumnsAsSeriesRelative;
const ColumnsAsSeriesWithMissingCells = () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable().replaceRandomCells(200, [
        OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
    ]);
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: {
                selection: table.sampleEntityName(1),
                table,
            } })));
};
exports.ColumnsAsSeriesWithMissingCells = ColumnsAsSeriesWithMissingCells;
const ColumnsAsSeriesWithMissingRowsAndInterpolationRelative = () => {
    let table = OwidTableSynthesizers_1.SynthesizeFruitTable().dropRandomRows(30, seed);
    const firstCol = table.columnsAsArray[0];
    const junkFoodColumn = Object.assign(Object.assign({}, firstCol.def), { slug: "junkFood", name: "JunkFood", values: firstCol.values.slice().reverse() });
    table = table.appendColumns([junkFoodColumn]);
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(StackedAreaChart_1.StackedAreaChart, { manager: {
                selection: table.sampleEntityName(1),
                table,
                isRelativeMode: true,
            } })));
};
exports.ColumnsAsSeriesWithMissingRowsAndInterpolationRelative = ColumnsAsSeriesWithMissingRowsAndInterpolationRelative;
//# sourceMappingURL=StackedAreaChart.stories.js.map