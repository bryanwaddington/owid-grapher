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
exports.CategoricalBins = void 0;
const React = __importStar(require("react"));
const VerticalColorLegend_1 = require("./VerticalColorLegend");
exports.default = {
    title: "VerticalColorLegend",
    component: VerticalColorLegend_1.VerticalColorLegend,
};
const manager = {
    maxLegendWidth: 500,
    title: "Legend Title",
    legendItems: [
        {
            label: "Canada",
            color: "red",
        },
        {
            label: "Mexico",
            color: "green",
        },
    ],
    activeColors: ["red", "green"],
};
const CategoricalBins = () => {
    return (React.createElement("svg", { width: 600, height: 400 },
        React.createElement(VerticalColorLegend_1.VerticalColorLegend, { manager: manager })));
};
exports.CategoricalBins = CategoricalBins;
//# sourceMappingURL=VerticalColorLegend.stories.js.map