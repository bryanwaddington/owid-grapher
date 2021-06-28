"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoreColumnDef_1 = require("./CoreColumnDef");
const CoreTableColumns_1 = require("./CoreTableColumns");
const ErrorValues_1 = require("./ErrorValues");
const OwidTable_1 = require("./OwidTable");
describe(CoreColumnDef_1.ColumnTypeNames.Quarter, () => {
    const col = new CoreTableColumns_1.ColumnTypeMap.Numeric(new OwidTable_1.OwidTable(), { slug: "test" });
    it("should format correctly for csv", () => {
        const testValue = 12345678.9;
        const parsed = col.parse(testValue);
        const csvFormatted = col.formatForCsv(parsed);
        expect(csvFormatted).toEqual("12345678.9");
    });
});
describe(CoreColumnDef_1.ColumnTypeNames.Quarter, () => {
    const col = new CoreTableColumns_1.ColumnTypeMap.Quarter(new OwidTable_1.OwidTable(), { slug: "test" });
    it("should parse and format values correctly", () => {
        const testValues = [
            // Input string, parsed value, formatted output string
            ["2020-Q3", 8082, "Q3/2020"],
            ["2000-Q1", 8000, "Q1/2000"],
            ["02000-Q1", 8000, "Q1/2000"],
            ["1999-Q0", ErrorValues_1.ErrorValueTypes.InvalidQuarterValue],
            ["2018-Q5", ErrorValues_1.ErrorValueTypes.InvalidQuarterValue],
            ["2018-Q-1", ErrorValues_1.ErrorValueTypes.InvalidQuarterValue],
            ["0-Q1", 0, "Q1/0"],
            ["-1-Q3", -2, "Q3/-1"],
        ];
        for (const [inStr, expected, formattedStr] of testValues) {
            const parsed = col.parse(inStr);
            expect(parsed).toEqual(expected);
            if (formattedStr !== undefined && typeof parsed === "number")
                expect(col.formatValue(parsed)).toEqual(formattedStr);
        }
    });
    it("should format correctly for csv", () => {
        const inStr = "2020-Q1";
        const parsed = col.parse(inStr);
        const csvFormatted = col.formatForCsv(parsed);
        expect(csvFormatted).toEqual("2020-Q1");
    });
});
//# sourceMappingURL=CoreTableColumns.test.js.map