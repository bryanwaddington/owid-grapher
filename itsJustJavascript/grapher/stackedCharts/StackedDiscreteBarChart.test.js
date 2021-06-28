#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoreColumnDef_1 = require("../../coreTable/CoreColumnDef");
const OwidTable_1 = require("../../coreTable/OwidTable");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const SelectionArray_1 = require("../selection/SelectionArray");
const StackedDiscreteBarChart_1 = require("./StackedDiscreteBarChart");
it("can create a chart", () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
        timeRange: [2000, 2001],
        entityCount: 5,
    });
    const selection = new SelectionArray_1.SelectionArray();
    const manager = {
        table,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit, OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables],
        selection,
    };
    const chart = new StackedDiscreteBarChart_1.StackedDiscreteBarChart({ manager });
    expect(chart.failMessage).toBeTruthy();
    selection.addToSelection(table.sampleEntityName(5));
    expect(chart.failMessage).toEqual("");
    expect(chart.series.length).toEqual(2);
    expect(chart.series[0].points.length).toEqual(5);
});
it("can display a StackedDiscreteBar chart in relative mode", () => {
    const csv = `coal,gas,year,entityName
    20,30,2000,France
    6,14,2000,Spain`;
    const table = new OwidTable_1.OwidTable(csv, [
        { slug: "coal", type: CoreColumnDef_1.ColumnTypeNames.Numeric },
        { slug: "gas", type: CoreColumnDef_1.ColumnTypeNames.Numeric },
        { slug: "year", type: CoreColumnDef_1.ColumnTypeNames.Year },
    ]);
    const manager = {
        table,
        selection: table.availableEntityNames,
        yColumnSlugs: ["coal", "gas"],
        isRelativeMode: true,
    };
    const chart = new StackedDiscreteBarChart_1.StackedDiscreteBarChart({ manager });
    // Check that our absolute values get properly transformed into percentages
    expect(chart.failMessage).toEqual("");
    expect(chart.series.length).toEqual(2);
    expect(chart.series[0].points).toEqual([
        {
            position: "France",
            value: 40,
            valueOffset: 0,
            time: 2000,
            fake: false,
        },
        {
            position: "Spain",
            value: 30,
            valueOffset: 0,
            time: 2000,
            fake: false,
        },
    ]);
    expect(chart.series[1].points).toEqual([
        {
            position: "France",
            value: 60,
            valueOffset: 40,
            time: 2000,
            fake: false,
        },
        {
            position: "Spain",
            value: 70,
            valueOffset: 30,
            time: 2000,
            fake: false,
        },
    ]);
});
it("can display a chart with missing variable data for some entities", () => {
    const csv = `coal,gas,year,entityName
    20,,2000,France
    ,14,2000,Spain`;
    const table = new OwidTable_1.OwidTable(csv, [
        { slug: "coal", type: CoreColumnDef_1.ColumnTypeNames.Numeric },
        { slug: "gas", type: CoreColumnDef_1.ColumnTypeNames.Numeric },
        { slug: "year", type: CoreColumnDef_1.ColumnTypeNames.Year },
    ]);
    const manager = {
        table,
        selection: table.availableEntityNames,
        yColumnSlugs: ["coal", "gas"],
    };
    const chart = new StackedDiscreteBarChart_1.StackedDiscreteBarChart({ manager });
    // Check that our absolute values get properly transformed into percentages
    expect(chart.failMessage).toEqual("");
    expect(chart.series.length).toEqual(2);
    expect(chart.series[0].points).toEqual([
        {
            position: "France",
            value: 20,
            valueOffset: 0,
            time: 2000,
            fake: false,
        },
        {
            position: "Spain",
            value: 0,
            valueOffset: 0,
            time: 0,
            fake: true,
        },
    ]);
    expect(chart.series[1].points).toEqual([
        {
            position: "France",
            value: 0,
            valueOffset: 20,
            time: 0,
            fake: true,
        },
        {
            position: "Spain",
            value: 14,
            valueOffset: 0,
            time: 2000,
            fake: false,
        },
    ]);
});
describe("columns as series", () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
        timeRange: [2000, 2001],
        entityCount: 5,
    });
    const manager = {
        table,
        selection: table.sampleEntityName(5),
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit, OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables],
    };
    const chart = new StackedDiscreteBarChart_1.StackedDiscreteBarChart({ manager });
    it("renders the legend items in the order of yColumns", () => {
        expect(chart.categoricalLegendData.length).toEqual(2);
        expect(chart.categoricalLegendData.map((bin) => bin.value)).toEqual([
            OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
            OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables,
        ]);
    });
    it("render the stacked bars in order of yColumns", () => {
        expect(chart.series.length).toEqual(2);
        expect(chart.series.map((series) => series.seriesName)).toEqual([
            OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
            OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables,
        ]);
    });
});
//# sourceMappingURL=StackedDiscreteBarChart.test.js.map