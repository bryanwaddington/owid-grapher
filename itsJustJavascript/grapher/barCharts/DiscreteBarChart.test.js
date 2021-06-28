#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiscreteBarChart_1 = require("./DiscreteBarChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const DiscreteBarChartConstants_1 = require("./DiscreteBarChartConstants");
const ColorConstants_1 = require("../color/ColorConstants");
const GrapherConstants_1 = require("../core/GrapherConstants");
const SelectionArray_1 = require("../selection/SelectionArray");
const OwidTable_1 = require("../../coreTable/OwidTable");
const Util_1 = require("../../clientUtils/Util");
it("can create a new bar chart", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ timeRange: [2000, 2001] });
    const selection = new SelectionArray_1.SelectionArray([], table.availableEntities);
    const manager = {
        table,
        selection,
        yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
        endTime: 2000,
    };
    const chart = new DiscreteBarChart_1.DiscreteBarChart({ manager });
    expect(chart.failMessage).toBeTruthy();
    selection.selectAll();
    expect(chart.failMessage).toEqual("");
    const series = chart.series;
    expect(series.length).toEqual(2);
    expect(series[0].time).toBeTruthy();
});
describe("barcharts with columns as the series", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ timeRange: [2000, 2010] });
    const manager = {
        table,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Population, OwidTableSynthesizers_1.SampleColumnSlugs.GDP],
        selection: table.sampleEntityName(1),
    };
    const chart = new DiscreteBarChart_1.DiscreteBarChart({ manager });
    expect(chart.series.length).toEqual(2);
    it("can add colors to columns as series", () => {
        manager.baseColorScheme = ColorConstants_1.ColorSchemeName.Reds;
        const chart = new DiscreteBarChart_1.DiscreteBarChart({ manager });
        expect(chart.series[0].color).not.toEqual(DiscreteBarChartConstants_1.DEFAULT_BAR_COLOR);
    });
    it("can filter a series when there are no points (column strategy)", () => {
        const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
            entityCount: 1,
            timeRange: [2000, 2001],
        }).replaceRandomCells(1, [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit]);
        const chart = new DiscreteBarChart_1.DiscreteBarChart({
            manager: {
                seriesStrategy: GrapherConstants_1.SeriesStrategy.column,
                yColumnSlugs: [
                    OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
                    OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables,
                ],
                selection: table.sampleEntityName(1),
                table,
            },
        });
        expect(chart.series.length).toEqual(1);
    });
    it("can filter a series when there are no points (entity strategy)", () => {
        const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
            entityCount: 2,
            timeRange: [2000, 2001],
        }).replaceRandomCells(1, [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit]);
        const chart = new DiscreteBarChart_1.DiscreteBarChart({
            manager: {
                seriesStrategy: GrapherConstants_1.SeriesStrategy.entity,
                yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit],
                selection: table.sampleEntityName(2),
                table,
            },
        });
        expect(chart.series.length).toEqual(1);
    });
    it("displays interpolated date when value is not from current year", () => {
        const csv = `gdp,year,entityName,entityCode,entityId
1000,2019,USA,,
1001,2019,UK,,
1002,2020,UK,,`;
        const table = new OwidTable_1.OwidTable(csv)
            .interpolateColumnWithTolerance("gdp", 1)
            .filterByTargetTimes([2020]);
        const chart = new DiscreteBarChart_1.DiscreteBarChart({
            manager: {
                table,
                transformedTable: table,
                seriesStrategy: GrapherConstants_1.SeriesStrategy.entity,
                yColumnSlugs: ["gdp"],
                endTime: 2020,
            },
        });
        expect(chart.formatValue(chart.series[0])).toEqual("1,002");
        expect(chart.formatValue(chart.series[1])).toEqual("1,000 (2019)");
    });
});
it("filters non-numeric values", () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTableWithStringValues({
        entityCount: 2,
        timeRange: [2000, 2001],
    }, 1, 1);
    const manager = {
        table,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit],
        selection: table.availableEntityNames,
    };
    const chart = new DiscreteBarChart_1.DiscreteBarChart({ manager });
    expect(chart.series.length).toEqual(1);
    expect(chart.series.every((series) => Util_1.isNumber(series.value))).toBeTruthy();
});
//# sourceMappingURL=DiscreteBarChart.test.js.map