#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GrapherConstants_1 = require("../core/GrapherConstants");
const CoreTableColumns_1 = require("../../coreTable/CoreTableColumns");
const ErrorValues_1 = require("../../coreTable/ErrorValues");
const LegacyToOwidTable_1 = require("./LegacyToOwidTable");
const OwidTableConstants_1 = require("../../coreTable/OwidTableConstants");
describe(LegacyToOwidTable_1.legacyToOwidTableAndDimensions, () => {
    const legacyVariableConfig = {
        entityKey: { "1": { name: "World", code: "OWID_WRL", id: 1 } },
        variables: {
            "2": {
                id: 2,
                display: { conversionFactor: 100 },
                entities: [1],
                values: [8],
                years: [2020],
            },
        },
    };
    const legacyGrapherConfig = {
        dimensions: [
            {
                variableId: 2,
                property: GrapherConstants_1.DimensionProperty.y,
            },
        ],
    };
    it("contains the standard entity columns", () => {
        const { table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(legacyVariableConfig, legacyGrapherConfig);
        expect(table.columnSlugs).toEqual(expect.arrayContaining(OwidTableConstants_1.StandardOwidColumnDefs.map((def) => def.slug)));
        expect(table.entityNameColumn.valuesIncludingErrorValues).toEqual([
            "World",
        ]);
        expect(table.entityCodeColumn.valuesIncludingErrorValues).toEqual([
            "OWID_WRL",
        ]);
    });
    describe("conversionFactor", () => {
        it("applies the more specific chart-level conversionFactor", () => {
            const { table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(legacyVariableConfig, {
                dimensions: [
                    {
                        variableId: 2,
                        display: { conversionFactor: 10 },
                        property: GrapherConstants_1.DimensionProperty.y,
                    },
                ],
            });
            // Apply the chart-level conversionFactor (10)
            expect(table.rows[0]["2"]).toEqual(80);
        });
        it("applies the more variable-level conversionFactor if a chart-level one is not present", () => {
            const { table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(legacyVariableConfig, legacyGrapherConfig);
            // Apply the variable-level conversionFactor (100)
            expect(table.rows[0]["2"]).toEqual(800);
        });
    });
    describe("variables with years", () => {
        const legacyVariableConfig = {
            entityKey: {
                "1": { name: "World", code: "OWID_WRL", id: 1 },
                "2": { name: "High-income", code: null, id: 2 },
            },
            variables: {
                "2": {
                    id: 2,
                    entities: [1, 1, 1, 2],
                    values: [8, 9, 10, 11],
                    years: [2020, 2021, 2022, 2022],
                },
                "3": {
                    id: 3,
                    entities: [1, 2, 1],
                    values: [20, 21, 22],
                    years: [2022, 2022, 2024],
                },
            },
        };
        const legacyGrapherConfig = {
            dimensions: [
                {
                    variableId: 2,
                    property: GrapherConstants_1.DimensionProperty.y,
                },
                {
                    variableId: 3,
                    property: GrapherConstants_1.DimensionProperty.y,
                },
            ],
        };
        const { table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(legacyVariableConfig, legacyGrapherConfig);
        it("leaves ErrorValues when there were no values to join to", () => {
            // Currently joins may just be partial and have many blank values. CoreTable will fill those in with the
            // appropriate ErrorValue type. It may make sense to change that and normalize keys in this method.
            const worldRows = table.rows.filter((row) => row.entityName === "World");
            expect(worldRows[0]["3"]).toEqual(ErrorValues_1.ErrorValueTypes.NoMatchingValueAfterJoin);
            expect(worldRows[3]["2"]).toEqual(ErrorValues_1.ErrorValueTypes.NoMatchingValueAfterJoin);
        });
        it("duplicates 'year' column into 'time'", () => {
            expect(table.columnSlugs).toEqual(expect.arrayContaining([
                OwidTableConstants_1.OwidTableSlugs.year,
                OwidTableConstants_1.OwidTableSlugs.time,
            ]));
            expect(table.get(OwidTableConstants_1.OwidTableSlugs.time) instanceof CoreTableColumns_1.ColumnTypeMap.Year).toBeTruthy();
            expect(table.columnSlugs).not.toContain(OwidTableConstants_1.OwidTableSlugs.day);
            expect(table.get(OwidTableConstants_1.OwidTableSlugs.time).valuesAscending).toEqual([
                2020,
                2021,
                2022,
                2022,
                2024,
            ]);
        });
        it("handles `null` in country codes", () => {
            const highIncomeRows = table.rows.filter((row) => row.entityName === "High-income");
            expect(table.rows.length).toEqual(5);
            expect(highIncomeRows.length).toEqual(1);
        });
    });
    describe("variables with days", () => {
        const legacyVariableConfig = {
            entityKey: { "1": { name: "World", code: "OWID_WRL", id: 1 } },
            variables: {
                "2": {
                    id: 2,
                    entities: [1, 1, 1],
                    values: [8, 9, 10],
                    years: [-5, 0, 1],
                    display: {
                        yearIsDay: true,
                        zeroDay: "2020-01-21",
                    },
                },
                "3": {
                    id: 3,
                    entities: [1, 1],
                    values: [20, 21],
                    years: [-4, -3],
                    display: {
                        yearIsDay: true,
                        zeroDay: "2020-01-19",
                    },
                },
            },
        };
        const legacyGrapherConfig = {
            dimensions: [
                {
                    variableId: 2,
                    property: GrapherConstants_1.DimensionProperty.y,
                },
                {
                    variableId: 3,
                    property: GrapherConstants_1.DimensionProperty.y,
                },
            ],
        };
        const { table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(legacyVariableConfig, legacyGrapherConfig);
        it("shifts values in days array when zeroDay is is not EPOCH_DATE", () => {
            expect(table.get("2").uniqTimesAsc).toEqual([-5, 0, 1]);
            expect(table.get("3").uniqTimesAsc).toEqual([-6, -5]);
        });
        it("duplicates 'day' column into 'time'", () => {
            expect(table.columnSlugs).toEqual(expect.arrayContaining([
                OwidTableConstants_1.OwidTableSlugs.day,
                OwidTableConstants_1.OwidTableSlugs.time,
            ]));
            expect(table.get(OwidTableConstants_1.OwidTableSlugs.time) instanceof CoreTableColumns_1.ColumnTypeMap.Day).toBeTruthy();
            expect(table.columnSlugs).not.toContain(OwidTableConstants_1.OwidTableSlugs.year);
            expect(table.get(OwidTableConstants_1.OwidTableSlugs.time).valuesAscending).toEqual([
                -6,
                -5,
                0,
                1,
            ]);
        });
    });
    describe("variables with mixed days & years", () => {
        const legacyVariableConfig = {
            entityKey: { "1": { name: "World", code: "OWID_WRL", id: 1 } },
            variables: {
                "2": {
                    id: 2,
                    entities: [1, 1, 1],
                    values: [8, 9, 10],
                    years: [-5, 0, 1],
                    display: {
                        yearIsDay: true,
                        zeroDay: "2020-01-21",
                    },
                },
                "3": {
                    id: 3,
                    entities: [1, 1],
                    values: [20, 21],
                    years: [2020, 2021],
                },
            },
        };
        const legacyGrapherConfig = {
            dimensions: [
                {
                    variableId: 2,
                    property: GrapherConstants_1.DimensionProperty.y,
                },
                {
                    variableId: 3,
                    property: GrapherConstants_1.DimensionProperty.y,
                    targetYear: 2022,
                    display: {
                        tolerance: 1,
                    },
                },
            ],
        };
        const { table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(legacyVariableConfig, legacyGrapherConfig);
        it("duplicates 'day' column into 'time'", () => {
            expect(table.columnSlugs).toEqual(expect.arrayContaining([
                OwidTableConstants_1.OwidTableSlugs.day,
                OwidTableConstants_1.OwidTableSlugs.time,
            ]));
            expect(table.get(OwidTableConstants_1.OwidTableSlugs.time) instanceof CoreTableColumns_1.ColumnTypeMap.Day).toBeTruthy();
            expect(table.get(OwidTableConstants_1.OwidTableSlugs.time).uniqValues).toEqual([
                -5,
                0,
                1,
            ]);
        });
        describe("scatter-specific behavior", () => {
            it("only joins targetTime on Scatters", () => {
                expect(table.rows.length).toEqual(4);
            });
            it("joins targetTime", () => {
                const scatterLegacyGrapherConfig = Object.assign(Object.assign({}, legacyGrapherConfig), { type: GrapherConstants_1.ChartTypeName.ScatterPlot });
                const { table } = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(legacyVariableConfig, scatterLegacyGrapherConfig);
                expect(table.rows.length).toEqual(3);
                expect(table.columnSlugs.includes("3-2022")).toBeTruthy();
                const column = table.get("3-2022");
                expect(column.valuesIncludingErrorValues).toEqual([21, 21, 21]);
                expect(column.originalTimes).toEqual([2021, 2021, 2021]);
            });
        });
    });
});
const getLegacyVarSet = () => {
    return {
        variables: {
            "3512": {
                years: [1983, 1985, 1985],
                entities: [99, 45, 204],
                values: [5.5, 4.2, 12.6],
                id: 3512,
                name: "Prevalence of wasting, weight for height (% of children under 5)",
                unit: "% of children under 5",
                description: "Prevalence of...",
                shortUnit: "%",
                display: {
                    name: "Some Display Name",
                },
                source: {
                    id: 2174,
                    name: "World Bank - WDI: Prevalence of wasting, weight for height (% of children under 5)",
                    link: "http://data.worldbank.org/data-catalog/world-development-indicators",
                },
            },
        },
        entityKey: {
            45: { name: "Cape Verde", code: "CPV", id: 45 },
            99: { name: "Papua New Guinea", code: "PNG", id: 99 },
            204: { name: "Kiribati", code: "KIR", id: 204 },
        },
    };
};
const getLegacyGrapherConfig = () => {
    return {
        dimensions: [
            {
                property: GrapherConstants_1.DimensionProperty.y,
                variableId: 3512,
            },
        ],
    };
};
describe("creating a table from legacy", () => {
    const table = LegacyToOwidTable_1.legacyToOwidTableAndDimensions(getLegacyVarSet(), Object.assign(Object.assign({}, getLegacyGrapherConfig()), { selectedData: [{ entityId: 45, index: 0, color: "blue" }] })).table;
    const name = "Prevalence of wasting, weight for height (% of children under 5)";
    it("can create a table and detect columns from legacy", () => {
        expect(table.numRows).toEqual(3);
        expect(table.columnSlugs).toEqual([
            "entityName",
            "entityId",
            "entityCode",
            "entityColor",
            "year",
            "3512",
            "time", // todo: what is the best design here?
        ]);
        expect(table.columnNames).toEqual([
            "Entity",
            "entityId",
            "Code",
            "entityColor",
            "Year",
            name,
            "time",
        ]);
        expect(table.get("3512").displayName).toBe("Some Display Name");
    });
    it("can apply legacy unit conversion factors", () => {
        const varSet = getLegacyVarSet();
        varSet.variables["3512"].display.conversionFactor = 100;
        expect(LegacyToOwidTable_1.legacyToOwidTableAndDimensions(varSet, getLegacyGrapherConfig()).table.get("3512").values).toEqual([550, 420, 1260]);
    });
    it("can apply legacy selection colors", () => {
        expect(table.getColorForEntityName("Cape Verde")).toBe("blue");
        expect(table.getColorForEntityName("Kiribati")).toBe(undefined);
    });
    it("can export legacy to CSV", () => {
        const expected = `Entity,Code,Year,"Prevalence of wasting, weight for height (% of children under 5)"
Cape Verde,CPV,1985,4.2
Kiribati,KIR,1985,12.6
Papua New Guinea,PNG,1983,5.5`;
        expect(table.toPrettyCsv()).toEqual(expected);
    });
});
//# sourceMappingURL=LegacyToOwidTable.test.js.map