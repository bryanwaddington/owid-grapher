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
exports.BlankSlopeChart = exports.WithColorColumn = exports.Default = void 0;
const React = __importStar(require("react"));
const SlopeChart_1 = require("./SlopeChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const OwidTable_1 = require("../../coreTable/OwidTable");
exports.default = {
    title: "SlopeChart",
    component: SlopeChart_1.SlopeChart,
};
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 10 });
const Default = () => {
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(SlopeChart_1.SlopeChart, { manager: { table } })));
};
exports.Default = Default;
const WithColorColumn = () => {
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(SlopeChart_1.SlopeChart, { manager: {
                table,
                colorColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
                yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
            } })));
};
exports.WithColorColumn = WithColorColumn;
const BlankSlopeChart = () => {
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(SlopeChart_1.SlopeChart, { manager: {
                table: OwidTable_1.BlankOwidTable(),
            } })));
};
exports.BlankSlopeChart = BlankSlopeChart;
//# sourceMappingURL=SlopeChart.stories.js.map