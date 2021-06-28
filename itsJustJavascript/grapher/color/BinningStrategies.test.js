#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinningStrategies_1 = require("./BinningStrategies");
const BinningStrategy_1 = require("./BinningStrategy");
describe(BinningStrategies_1.getBinMaximums, () => {
    it("returns no bins for empty array", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.quantiles,
            sortedValues: [],
            binCount: 5,
        })).toEqual([]);
    });
    it("returns no bins for zero bins", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.quantiles,
            sortedValues: [1, 2, 3, 4, 5],
            binCount: 0,
        })).toEqual([]);
    });
});
describe("ckmeans strategy", () => {
    it("doesn't duplicate bins for skewed distributions", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.ckmeans,
            sortedValues: [1, 1, 1, 1, 1, 5],
            binCount: 5,
        })).toEqual([1, 5]);
    });
    it("excludes bins less than minBinValue", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.ckmeans,
            sortedValues: [1, 1, 1, 1, 1, 5],
            binCount: 5,
            minBinValue: 1,
        })).toEqual([5]);
    });
    it("handles example", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.ckmeans,
            sortedValues: [1, 2, 4, 5, 12, 43, 52, 123, 234, 1244],
            binCount: 5,
        })).toEqual([12, 52, 123, 234, 1244]);
    });
    it("handles when there are more bins than values", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.ckmeans,
            sortedValues: [1, 2],
            binCount: 5,
        })).toEqual([1, 2]);
    });
});
describe("quantiles strategy", () => {
    it("doesn't duplicate bins for skewed distributions", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.quantiles,
            sortedValues: [1, 1, 1, 1, 1, 5],
            binCount: 5,
        })).toEqual([1, 5]);
    });
    it("excludes bins less than minBinValue", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.quantiles,
            sortedValues: [1, 1, 1, 1, 1, 5],
            binCount: 5,
            minBinValue: 1,
        })).toEqual([5]);
    });
    it("handles example", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.quantiles,
            sortedValues: [1, 10, 20, 50, 100],
            binCount: 4,
        })).toEqual([10, 20, 50, 100]);
    });
});
describe("equalInterval strategy", () => {
    it("starts from minBinValue", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.equalInterval,
            sortedValues: [300],
            binCount: 3,
            minBinValue: 0,
        })).toEqual([100, 200, 300]);
    });
    it("derives minBinValue if not specified", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.equalInterval,
            sortedValues: [100, 300],
            binCount: 2,
        })).toEqual([200, 300]);
    });
    it("handles example", () => {
        expect(BinningStrategies_1.getBinMaximums({
            binningStrategy: BinningStrategy_1.BinningStrategy.equalInterval,
            sortedValues: [1, 1.5, 2, 3, 7.5],
            binCount: 5,
            minBinValue: 0,
        })).toEqual([2, 4, 6, 8, 10]);
    });
});
//# sourceMappingURL=BinningStrategies.test.js.map