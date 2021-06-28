#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const SelectionArray_1 = require("../selection/SelectionArray");
const Util_1 = require("../../clientUtils/Util");
const StackedBarChart_1 = require("./StackedBarChart");
it("can create a chart", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ timeRange: [2000, 2010] });
    const selection = new SelectionArray_1.SelectionArray();
    const manager = {
        table,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Population],
        selection,
    };
    const chart = new StackedBarChart_1.StackedBarChart({ manager });
    expect(chart.failMessage).toBeTruthy();
    selection.addToSelection(table.sampleEntityName(1));
    expect(chart.failMessage).toEqual("");
    expect(chart.series[0].points.length).toEqual(10);
});
describe("stackedbar chart with columns as series", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable();
    const manager = {
        table,
        selection: table.sampleEntityName(1),
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.GDP, OwidTableSynthesizers_1.SampleColumnSlugs.Population],
    };
    const chart = new StackedBarChart_1.StackedBarChart({ manager });
    it("render the legend items in the same stack order as the chart, bottom stack item on bottom of chart", () => {
        expect(chart.series.length).toEqual(2);
        // The stacking happens bottom to top, so we need to .reverse()
        expect(chart.series.map((series) => series.seriesName).reverse()).toEqual([OwidTableSynthesizers_1.SampleColumnSlugs.GDP, OwidTableSynthesizers_1.SampleColumnSlugs.Population]);
    });
});
describe("stackedbar chart with entities as series", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 5 });
    const manager = {
        table,
        selection: table.availableEntityNames,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Population],
    };
    const chart = new StackedBarChart_1.StackedBarChart({ manager });
    it("can render complete data correctly", () => {
        expect(chart.series.length).toEqual(5);
        expect(chart.series[0].points[0].value).toBeTruthy();
    });
    it("can handle a missing row", () => {
        const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 5 }).dropRandomRows(1, 1);
        const manager = {
            table,
            selection: table.availableEntityNames,
            yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Population],
        };
        const chart = new StackedBarChart_1.StackedBarChart({ manager });
        expect(chart.series.length).toEqual(5);
        expect(chart.series[0].points[0].value).toBeTruthy();
    });
});
it("filters non-numeric values", () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTableWithStringValues({
        entityCount: 2,
        timeRange: [1900, 2000],
    }, 20, 1);
    const manager = {
        table,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit],
        selection: table.availableEntityNames,
    };
    const chart = new StackedBarChart_1.StackedBarChart({ manager });
    expect(chart.series.length).toEqual(2);
    expect(chart.series.every((series) => series.points.every((point) => Util_1.isNumber(point.position) && Util_1.isNumber(point.value)))).toBeTruthy();
});
//# sourceMappingURL=StackedBarChart.test.js.map