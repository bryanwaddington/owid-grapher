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
exports.AutoColors = void 0;
const React = __importStar(require("react"));
const MapChart_1 = require("./MapChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
exports.default = {
    title: "MapChart",
    component: MapChart_1.MapChart,
};
const AutoColors = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
        timeRange: [2000, 2010],
        entityCount: 200,
    });
    return (React.createElement("svg", { width: 600, height: 600 },
        React.createElement(MapChart_1.MapChart, { manager: { table } })));
};
exports.AutoColors = AutoColors;
//# sourceMappingURL=MapChart.stories.js.map