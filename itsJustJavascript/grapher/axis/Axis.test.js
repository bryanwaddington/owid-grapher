#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Axis_1 = require("../axis/Axis");
const GrapherConstants_1 = require("../core/GrapherConstants");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const AxisConfig_1 = require("./AxisConfig");
it("can create an axis", () => {
    const axisConfig = new AxisConfig_1.AxisConfig({
        scaleType: GrapherConstants_1.ScaleType.linear,
        min: 0,
        max: 100,
    });
    const axis = new Axis_1.HorizontalAxis(axisConfig);
    expect(axis.domain).toEqual([0, 100]);
    const ticks = axis.getTickValues();
    expect(ticks.length).toBeGreaterThan(1);
    expect(axis.getFormattedTicks().length).toEqual(ticks.length);
});
it("can assign a column to an axis", () => {
    const axisConfig = new AxisConfig_1.AxisConfig({
        scaleType: GrapherConstants_1.ScaleType.linear,
        min: 0,
        max: 100,
    });
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable();
    const axis = new Axis_1.HorizontalAxis(axisConfig);
    axis.formatColumn = table.get("GDP");
    axis.clone();
    const ticks = axis.getTickValues();
    expect(ticks.length).toBeGreaterThan(1);
});
//# sourceMappingURL=Axis.test.js.map