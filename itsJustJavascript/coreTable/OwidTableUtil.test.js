"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoreTableUtils_1 = require("./CoreTableUtils");
const OwidTable_1 = require("./OwidTable");
const OwidTableSynthesizers_1 = require("./OwidTableSynthesizers");
const OwidTableUtil_1 = require("./OwidTableUtil");
describe(OwidTableUtil_1.toPercentageColumnDef, () => {
    it("should format resulting column as percent", () => {
        const table = OwidTableSynthesizers_1.SynthesizeGDPTable(undefined, undefined, {
            numDecimalPlaces: 0,
            conversionFactor: 100,
        });
        const gdpColumn = table.get(OwidTableSynthesizers_1.SampleColumnSlugs.GDP);
        // Convert GDP column to percentage
        const columnDefs = CoreTableUtils_1.replaceDef(table.defs, [
            OwidTableUtil_1.toPercentageColumnDef(gdpColumn.def),
        ]);
        // Create new table with new column def
        const newTable = new OwidTable_1.OwidTable(``, columnDefs);
        const percentageColumn = newTable.get(OwidTableSynthesizers_1.SampleColumnSlugs.GDP);
        expect(percentageColumn.formatValue(10.12)).toEqual("10.12%");
        expect(percentageColumn.formatValueForMobile(10.12)).toEqual("10.12%");
    });
});
//# sourceMappingURL=OwidTableUtil.test.js.map