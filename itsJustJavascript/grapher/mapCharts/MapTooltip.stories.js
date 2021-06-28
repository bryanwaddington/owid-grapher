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
exports.WithSparkChart = void 0;
const React = __importStar(require("react"));
const MapTooltip_1 = require("./MapTooltip");
const Grapher_1 = require("../core/Grapher");
const MapChart_sample_1 = require("./MapChart.sample");
exports.default = {
    title: "MapTooltip",
    component: MapTooltip_1.MapTooltip,
};
// todo: refactor TooltipView stuff so we can decouple from Grapher
const WithSparkChart = () => (React.createElement(Grapher_1.Grapher, Object.assign({}, MapChart_sample_1.legacyMapGrapher)));
exports.WithSparkChart = WithSparkChart;
//# sourceMappingURL=MapTooltip.stories.js.map