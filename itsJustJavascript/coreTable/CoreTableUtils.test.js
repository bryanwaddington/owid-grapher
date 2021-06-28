#! /usr/bin/env jest
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoreColumnDef_1 = require("./CoreColumnDef");
const CoreTableUtils_1 = require("./CoreTableUtils");
const ErrorValues_1 = require("./ErrorValues");
describe(CoreTableUtils_1.interpolateRowValuesWithTolerance, () => {
    it("handles empty array", () => {
        expect(CoreTableUtils_1.interpolateRowValuesWithTolerance([], "value", "time", 2)).toEqual([]);
    });
    it("handles undefined values with infinte tolerance", () => {
        // This is an edge case that can cause problems
        expect(CoreTableUtils_1.interpolateRowValuesWithTolerance([{ value: undefined, time: 0 }], "value", "time", Infinity)).toEqual([{ value: ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance, time: 0 }]);
    });
    it("leaves array unchanged if tolerance = 0", () => {
        const result = CoreTableUtils_1.interpolateRowValuesWithTolerance([
            { value: 1, time: 0 },
            { value: undefined, time: 1 },
            { value: undefined, time: 2 },
            { value: 3, time: 3 },
        ], "value", "time", 0);
        expect(result[1].value).toEqual(ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance);
        expect(result[2].value).toEqual(ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance);
    });
    it("fills in gaps in simple case", () => {
        const result = CoreTableUtils_1.interpolateRowValuesWithTolerance([
            { value: 1, time: 0 },
            { value: undefined, time: 1 },
            { value: undefined, time: 2 },
            { value: 3, time: 3 },
        ], "value", "time", 2);
        expect(result.map((r) => r.value)).toEqual([1, 1, 3, 3]);
        expect(result.map((r) => r.time)).toEqual([0, 0, 3, 3]);
    });
    it("fills in initial and trailing values", () => {
        const result = CoreTableUtils_1.interpolateRowValuesWithTolerance([
            { value: undefined, time: 0 },
            { value: ErrorValues_1.ErrorValueTypes.NaNButShouldBeNumber, time: 1 },
            { value: 1, time: 2 },
            { value: ErrorValues_1.ErrorValueTypes.UndefinedButShouldBeNumber, time: 3 },
            { value: undefined, time: 4 },
            { value: undefined, time: 5 },
            { value: 3, time: 6 },
            { value: undefined, time: 7 },
        ], "value", "time", 1);
        expect(result.map((r) => r.value)).toEqual([
            ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance,
            1,
            1,
            1,
            ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance,
            3,
            3,
            3,
        ]);
        expect(result.map((r) => r.time)).toEqual([0, 2, 2, 2, 4, 6, 6, 6]);
    });
    it("handles infinity tolerance", () => {
        const result = CoreTableUtils_1.interpolateRowValuesWithTolerance([
            { value: undefined, time: 0 },
            { value: ErrorValues_1.ErrorValueTypes.NaNButShouldBeNumber, time: 1 },
            { value: 1, time: 2 },
            { value: undefined, time: 3 },
            { value: undefined, time: 4 },
        ], "value", "time", Infinity);
        expect(result.map((r) => r.value)).toEqual([1, 1, 1, 1, 1]);
        expect(result.map((r) => r.time)).toEqual([2, 2, 2, 2, 2]);
    });
});
describe(CoreTableUtils_1.toleranceInterpolation, () => {
    it("doesn't interpolate values beyond end", () => {
        const valuesAsc = [
            1,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            2,
        ];
        const timesAsc = [0, 1, 2, 3];
        const tolerance = 1;
        CoreTableUtils_1.toleranceInterpolation(valuesAsc, timesAsc, { timeTolerance: tolerance }, 0, 3);
        expect(valuesAsc).toEqual([
            1,
            1,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            2,
        ]);
    });
});
describe(CoreTableUtils_1.linearInterpolation, () => {
    it("interpolates, with extrapolation", () => {
        const values = [
            4,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            1,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
        ];
        const timesAsc = [0, 1, 2, 3, 4];
        CoreTableUtils_1.linearInterpolation(values, timesAsc, {
            extrapolateAtStart: true,
            extrapolateAtEnd: true,
        });
        expect(values).toEqual([4, 3, 2, 1, 1]);
    });
    it("interpolates, without extrapolation", () => {
        const values = [
            4,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            1,
            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
        ];
        const timesAsc = [0, 1, 2, 3, 4];
        CoreTableUtils_1.linearInterpolation(values, timesAsc, {});
        expect(values).toEqual([
            4,
            3,
            2,
            1,
            ErrorValues_1.ErrorValueTypes.NoValueForInterpolation,
        ]);
    });
});
describe("immutable memoization", () => {
    class WeatherForecast {
        constructor() {
            this.conditions = "rainy";
        }
        get forecast() {
            return this.conditions;
        }
    }
    __decorate([
        CoreTableUtils_1.imemo
    ], WeatherForecast.prototype, "forecast", null);
    it("runs getters once", () => {
        const forecast = new WeatherForecast();
        expect(forecast.forecast).toEqual("rainy");
        forecast.conditions = "sunny";
        expect(forecast.forecast).toEqual("rainy");
        const forecast2 = new WeatherForecast();
        forecast2.conditions = "sunny";
        expect(forecast2.forecast).toEqual("sunny");
    });
});
it("can get indexes of cell values to drop in an array", () => {
    const drops = CoreTableUtils_1.getDropIndexes(3, 2, 1);
    expect([1, 2, 3].map((value, index) => (drops.has(index) ? undefined : value))).toEqual([undefined, undefined, 3]);
});
describe("matrix methods", () => {
    it("turns an array of objects into arrays", () => {
        const str = `gdp,pop
1,2`;
        expect(CoreTableUtils_1.rowsToMatrix(CoreTableUtils_1.parseDelimited(str))).toEqual([
            ["gdp", "pop"],
            ["1", "2"],
        ]);
        expect(CoreTableUtils_1.rowsToMatrix(CoreTableUtils_1.parseDelimited(""))).toEqual(undefined);
        expect(CoreTableUtils_1.matrixToDelimited(CoreTableUtils_1.rowsToMatrix(CoreTableUtils_1.parseDelimited(str)), ",")).toEqual(str);
    });
    it("handles extra blank cells", () => {
        const table = CoreTableUtils_1.rowsToMatrix(CoreTableUtils_1.parseDelimited(`gdp pop code
123 345 usa
`));
        expect(CoreTableUtils_1.matrixToDelimited(CoreTableUtils_1.trimMatrix(table), " ")).toEqual(`gdp pop code
123 345 usa`);
    });
    it("can trim an array", () => {
        expect(CoreTableUtils_1.trimArray([1, "2", "", null, undefined])).toEqual([1, "2"]);
        const test = [1, "2", "", null, undefined, 1];
        expect(CoreTableUtils_1.trimArray(test)).toEqual(test);
    });
});
describe(CoreTableUtils_1.parseDelimited, () => {
    it("detects delimiter and parses delimited", () => {
        const str = `foo,bar
1,2`;
        expect(CoreTableUtils_1.parseDelimited(str)).toEqual(CoreTableUtils_1.parseDelimited(str.replace(/,/g, "\t")));
    });
});
describe(CoreTableUtils_1.guessColumnDefFromSlugAndRow, () => {
    it("can guess column defs", () => {
        const tests = [{ slug: "Entity", example: "USA" }];
        tests.forEach((testCase) => {
            expect(CoreTableUtils_1.guessColumnDefFromSlugAndRow(testCase.slug, testCase.example)
                .type).toEqual(CoreColumnDef_1.ColumnTypeNames.EntityName);
        });
    });
});
describe(CoreTableUtils_1.standardizeSlugs, () => {
    it("can handle empty rows", () => {
        expect(CoreTableUtils_1.standardizeSlugs([])).toEqual(undefined);
    });
});
describe(CoreTableUtils_1.emptyColumnsInFirstRowInDelimited, () => {
    it("detects slugs needing reparsing", () => {
        const str = `location,new_cases,new_tests
usa,,
canada,,`;
        expect(CoreTableUtils_1.emptyColumnsInFirstRowInDelimited(str)).toEqual([
            "new_cases",
            "new_tests",
        ]);
        expect(CoreTableUtils_1.emptyColumnsInFirstRowInDelimited("")).toEqual([]);
    });
});
describe(CoreTableUtils_1.trimEmptyRows, () => {
    it("trims rows", () => {
        const testCases = [
            {
                input: [["pop"], [123], [null], [""], [undefined]],
                length: 2,
            },
            {
                input: [[]],
                length: 0,
            },
            {
                input: [
                    ["pop", "gdp"],
                    [123, 345],
                    [undefined, 456],
                ],
                length: 3,
            },
        ];
        testCases.forEach((testCase) => {
            expect(CoreTableUtils_1.trimEmptyRows(testCase.input).length).toEqual(testCase.length);
        });
    });
});
describe(CoreTableUtils_1.sortColumnStore, () => {
    it("can sort", () => {
        const result = CoreTableUtils_1.sortColumnStore({ countries: ["usa", "can", "mex"], pops: [123, 21, 99] }, ["pops"]);
        expect(result["pops"]).toEqual([21, 99, 123]);
    });
});
describe(CoreTableUtils_1.concatColumnStores, () => {
    it("concats stores with matching columns", () => {
        expect(CoreTableUtils_1.concatColumnStores([
            {
                a: [1, 2],
                b: [5, 6],
            },
            {
                a: [3, 4],
                b: [7, 8],
            },
        ])).toEqual({
            a: [1, 2, 3, 4],
            b: [5, 6, 7, 8],
        });
    });
    it("concats column stores with missing columns", () => {
        expect(CoreTableUtils_1.concatColumnStores([
            {
                a: [1, 2],
                b: [6, 7],
            },
            {
                a: [3, 4],
                c: [0, 0],
            },
            { a: [5], b: [8] },
        ])).toEqual({
            a: [1, 2, 3, 4, 5],
            b: [
                6,
                7,
                ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
                ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
                8,
            ],
        });
    });
    it("respects slugsToKeep param", () => {
        expect(CoreTableUtils_1.concatColumnStores([
            {
                a: [1, 2],
                b: [6, 7],
            },
            {
                a: [3, 4],
                c: [0, 0],
            },
            { a: [5], b: [8] },
        ], ["a", "c"])).toEqual({
            a: [1, 2, 3, 4, 5],
            c: [
                ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
                ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
                0,
                0,
                ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder,
            ],
        });
    });
});
describe(CoreTableUtils_1.cartesianProduct, () => {
    it("correctly calculates a cartesian product", () => {
        const a = [1, 2, 3];
        const b = ["a", "b"];
        const product = CoreTableUtils_1.cartesianProduct(a, b);
        expect(product).toEqual([
            [1, "a"],
            [1, "b"],
            [2, "a"],
            [2, "b"],
            [3, "a"],
            [3, "b"],
        ]);
    });
});
//# sourceMappingURL=CoreTableUtils.test.js.map