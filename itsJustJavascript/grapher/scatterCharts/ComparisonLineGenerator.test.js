#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComparisonLineGenerator_1 = require("./ComparisonLineGenerator");
const GrapherConstants_1 = require("../core/GrapherConstants");
describe("For y = x", () => {
    it("returns the correct number of points", () => {
        const points = ComparisonLineGenerator_1.generateComparisonLinePoints("x", [0, 10], [0, 10], GrapherConstants_1.ScaleType.linear, GrapherConstants_1.ScaleType.linear);
        expect(points.length).toEqual(500);
    });
    it("it clamps points if they exceed the y max", () => {
        const points = ComparisonLineGenerator_1.generateComparisonLinePoints("x", [0, 10], [0, 5], GrapherConstants_1.ScaleType.linear, GrapherConstants_1.ScaleType.linear);
        expect(points.length).toEqual(251);
    });
});
describe("For y = 50*x", () => {
    it("returns the correct number of points", () => {
        const points = ComparisonLineGenerator_1.generateComparisonLinePoints("50*x", [0, 10], [0, 10], GrapherConstants_1.ScaleType.linear, GrapherConstants_1.ScaleType.linear);
        expect(points.length).toEqual(11);
    });
    it("returns the correct number of points for a log chart", () => {
        const points = ComparisonLineGenerator_1.generateComparisonLinePoints("50*x", [1e-6, 1e6], [0, 10], GrapherConstants_1.ScaleType.log, GrapherConstants_1.ScaleType.linear);
        expect(points.length).toEqual(221);
    });
});
//# sourceMappingURL=ComparisonLineGenerator.test.js.map