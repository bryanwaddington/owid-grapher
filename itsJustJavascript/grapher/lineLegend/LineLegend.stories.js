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
exports.TestCollisionDetection = void 0;
const Axis_1 = require("../axis/Axis");
const AxisConfig_1 = require("../axis/AxisConfig");
const React = __importStar(require("react"));
const LineLegend_1 = require("./LineLegend");
exports.default = {
    title: "LineLegend",
    component: LineLegend_1.LineLegend,
};
const verticalAxis = new AxisConfig_1.AxisConfig({
    min: 0,
    max: 100,
}).toVerticalAxis();
const horizontalAxis = new AxisConfig_1.AxisConfig({
    min: 0,
    max: 100,
}).toHorizontalAxis();
const dualAxis = new Axis_1.DualAxis({
    verticalAxis,
    horizontalAxis,
});
const collidingNumber = 50;
const manager = {
    labelSeries: [
        {
            seriesName: "Canada",
            label: "Canada",
            color: "red",
            yValue: collidingNumber,
            annotation: "A country in North America",
        },
        {
            seriesName: "USA",
            label: "USA",
            color: "blue",
            yValue: collidingNumber,
            annotation: "In between",
        },
        {
            seriesName: "Mexico",
            label: "Mexico",
            color: "green",
            yValue: 20,
            annotation: "Below",
        },
    ],
    legendX: 200,
    focusedSeriesNames: [],
    verticalAxis: dualAxis.verticalAxis,
};
const TestCollisionDetection = () => {
    return (React.createElement("svg", { width: 600, height: 400 },
        React.createElement(LineLegend_1.LineLegend, { manager: manager })));
};
exports.TestCollisionDetection = TestCollisionDetection;
//# sourceMappingURL=LineLegend.stories.js.map