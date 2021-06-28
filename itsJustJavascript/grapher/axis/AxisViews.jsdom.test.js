#! /usr/bin/env jest
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AxisConfig_1 = require("./AxisConfig");
const AxisViews_1 = require("./AxisViews");
const react_1 = __importDefault(require("react"));
const GrapherConstants_1 = require("../core/GrapherConstants");
const Axis_1 = require("./Axis");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
it("can create horizontal axis", () => {
    const axisConfig = new AxisConfig_1.AxisConfig({
        scaleType: GrapherConstants_1.ScaleType.linear,
        min: 0,
        max: 100,
    });
    const view = enzyme_1.shallow(react_1.default.createElement(AxisViews_1.HorizontalAxisGridLines, { horizontalAxis: axisConfig.toHorizontalAxis() }));
    expect(view).toBeTruthy();
});
it("can render a dual axis", () => {
    const verticalAxis = new AxisConfig_1.AxisConfig({
        scaleType: GrapherConstants_1.ScaleType.linear,
        min: 0,
        max: 100,
    }).toVerticalAxis();
    const horizontalAxis = new AxisConfig_1.AxisConfig({
        scaleType: GrapherConstants_1.ScaleType.linear,
        min: 0,
        max: 100,
    }).toHorizontalAxis();
    const dualAxis = new Axis_1.DualAxis({
        verticalAxis,
        horizontalAxis,
    });
    const view = enzyme_1.shallow(react_1.default.createElement(AxisViews_1.DualAxisComponent, { dualAxis: dualAxis }));
    expect(view).toBeTruthy();
});
//# sourceMappingURL=AxisViews.jsdom.test.js.map