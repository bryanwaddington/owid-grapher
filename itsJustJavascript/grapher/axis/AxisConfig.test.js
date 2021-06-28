#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AxisConfig_1 = require("../axis/AxisConfig");
const GrapherConstants_1 = require("../core/GrapherConstants");
it("can create an axis, clone and modify the clone without affecting the original", () => {
    const axis = new AxisConfig_1.AxisConfig({ scaleType: GrapherConstants_1.ScaleType.linear });
    expect(axis.scaleType).toEqual(GrapherConstants_1.ScaleType.linear);
    const clone = axis.toVerticalAxis();
    clone.scaleType = GrapherConstants_1.ScaleType.log;
    expect(axis.scaleType).toEqual(GrapherConstants_1.ScaleType.linear);
    expect(clone.scaleType).toEqual(GrapherConstants_1.ScaleType.log);
});
it("can expand the domain beyond the user's settings and not shrink it", () => {
    const axis = new AxisConfig_1.AxisConfig({
        min: 0,
        max: 100,
        scaleType: GrapherConstants_1.ScaleType.linear,
    });
    const clone = axis.toVerticalAxis();
    clone.updateDomainPreservingUserSettings([5, 50]);
    expect(clone.domain).toEqual([0, 100]);
    clone.updateDomainPreservingUserSettings([-5, 500]);
    expect(clone.domain).toEqual([-5, 500]);
});
it("ignores undefined values", () => {
    const axis = new AxisConfig_1.AxisConfig({
        min: 0,
        max: 100,
        scaleType: GrapherConstants_1.ScaleType.linear,
    });
    const clone = axis.toVerticalAxis();
    clone.updateDomainPreservingUserSettings([undefined, 150]);
    expect(clone.domain).toEqual([0, 150]);
    clone.updateDomainPreservingUserSettings([-5, undefined]);
    expect(clone.domain).toEqual([-5, 150]);
    clone.updateDomainPreservingUserSettings([undefined, undefined]);
    expect(clone.domain).toEqual([-5, 150]);
});
//# sourceMappingURL=AxisConfig.test.js.map