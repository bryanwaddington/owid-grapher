#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transforms_1 = require("./Transforms");
const ErrorValues_1 = require("./ErrorValues");
describe(Transforms_1.insertMissingValuePlaceholders, () => {
    const testCases = [
        {
            values: [2, -3, 10],
            years: [0, 2, 3],
            expected: [2, ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder, -3, 10],
        },
    ];
    it("computes the rolling average", () => {
        testCases.forEach((testCase) => {
            expect(Transforms_1.insertMissingValuePlaceholders(testCase.values, testCase.years)).toEqual(testCase.expected);
        });
    });
    const testCasesWithMissing = [
        {
            values: [0, 2, 3],
            years: [0, 2, 3],
            expected: [0, ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder, 2, 2.5],
        },
    ];
    it("computes the rolling average for data with missing values", () => {
        testCasesWithMissing.forEach((testCase) => {
            expect(Transforms_1.computeRollingAverage(Transforms_1.insertMissingValuePlaceholders(testCase.values, testCase.years), 2)).toEqual(testCase.expected);
        });
    });
});
describe(Transforms_1.computeRollingAverage, () => {
    const testCases = [
        // no smoothing
        {
            numbers: [2, 4, 6, 8],
            window: 1,
            align: "right",
            result: [2, 4, 6, 8],
        },
        {
            numbers: [1, -1, 1, -1],
            window: 2,
            align: "right",
            result: [1, 0, 0, 0],
        },
        {
            numbers: [1, undefined, null, -1, 1],
            window: 2,
            align: "right",
            result: [
                1,
                ErrorValues_1.ErrorValueTypes.UndefinedButShouldBeNumber,
                ErrorValues_1.ErrorValueTypes.NullButShouldBeNumber,
                -1,
                0,
            ],
        },
        {
            numbers: [1, 3, 5, 1],
            window: 3,
            align: "right",
            result: [1, 2, 3, 3],
        },
        {
            numbers: [0, 2, 4, 0],
            window: 3,
            align: "center",
            result: [1, 2, 2, 2],
        },
    ];
    it("computes the rolling average", () => {
        testCases.forEach((testCase) => {
            expect(Transforms_1.computeRollingAverage(testCase.numbers, testCase.window, testCase.align)).toEqual(testCase.result);
        });
    });
});
//# sourceMappingURL=Transforms.test.js.map