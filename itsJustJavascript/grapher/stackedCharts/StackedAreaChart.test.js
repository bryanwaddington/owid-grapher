#! /usr/bin/env jest
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StackedAreaChart_1 = require("./StackedAreaChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const mobx_1 = require("mobx");
const AxisConfig_1 = require("../axis/AxisConfig");
const SelectionArray_1 = require("../selection/SelectionArray");
const OwidTable_1 = require("../../coreTable/OwidTable");
const CoreColumnDef_1 = require("../../coreTable/CoreColumnDef");
const Util_1 = require("../../clientUtils/Util");
class MockManager {
    constructor() {
        this.table = OwidTableSynthesizers_1.SynthesizeGDPTable({
            timeRange: [1950, 2010],
        });
        this.yColumnSlugs = [OwidTableSynthesizers_1.SampleColumnSlugs.GDP];
        this.yAxis = new AxisConfig_1.AxisConfig({ min: 0, max: 200 });
        this.isRelativeMode = false;
        this.selection = new SelectionArray_1.SelectionArray();
    }
}
__decorate([
    mobx_1.observable
], MockManager.prototype, "isRelativeMode", void 0);
it("can create a basic chart", () => {
    const manager = new MockManager();
    const chart = new StackedAreaChart_1.StackedAreaChart({ manager });
    expect(chart.failMessage).toBeTruthy();
    manager.selection.addToSelection(manager.table.availableEntityNames);
    expect(chart.failMessage).toEqual("");
});
describe("column charts", () => {
    it("can show custom colors for a column series", () => {
        let table = OwidTableSynthesizers_1.SynthesizeFruitTable();
        table = table.updateDefs((def) => {
            def.color = def.slug; // Slug is not a valid color but good enough for testing
            return def;
        });
        const columnsChart = {
            table,
            selection: table.sampleEntityName(1),
            yColumnSlugs: [
                OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
                OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables,
            ],
        };
        const chart = new StackedAreaChart_1.StackedAreaChart({ manager: columnsChart });
        expect(chart.series.map((series) => series.color)).toEqual([
            OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables,
            OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
        ]);
    });
    it("assigns valid colors to columns without pre-defined colors", () => {
        const table = OwidTableSynthesizers_1.SynthesizeFruitTable();
        const columnsChart = {
            table,
            selection: table.sampleEntityName(1),
            yColumnSlugs: [
                OwidTableSynthesizers_1.SampleColumnSlugs.Fruit,
                OwidTableSynthesizers_1.SampleColumnSlugs.Vegetables,
            ],
        };
        const chart = new StackedAreaChart_1.StackedAreaChart({ manager: columnsChart });
        const assignedColors = chart.series.map((series) => series.color);
        expect(assignedColors).toHaveLength(2);
        for (const color of assignedColors)
            expect(color).toMatch(/^#[0-9a-f]{6}$/i); // valid hex color string
    });
});
it("use author axis settings unless relative mode", () => {
    const manager = new MockManager();
    const chart = new StackedAreaChart_1.StackedAreaChart({ manager });
    expect(chart.verticalAxis.domain[1]).toBeGreaterThan(100);
    manager.isRelativeMode = true;
    expect(chart.verticalAxis.domain).toEqual([0, 100]);
});
it("shows a failure message if there are columns but no series", () => {
    const chart = new StackedAreaChart_1.StackedAreaChart({
        manager: { table: OwidTableSynthesizers_1.SynthesizeFruitTable() },
    });
    expect(chart.failMessage).toBeTruthy();
});
it("can filter a series when there are no points", () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTable({
        entityCount: 2,
        timeRange: [2000, 2003],
    }).replaceRandomCells(6, [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit]);
    const chart = new StackedAreaChart_1.StackedAreaChart({
        manager: {
            selection: table.sampleEntityName(1),
            table,
        },
    });
    expect(chart.series.length).toEqual(0);
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
    const chart = new StackedAreaChart_1.StackedAreaChart({ manager });
    expect(chart.series.length).toEqual(2);
    expect(chart.series.every((series) => series.points.every((point) => Util_1.isNumber(point.position) && Util_1.isNumber(point.value)))).toBeTruthy();
});
it("should drop missing values at start or end", () => {
    const csv = `gdp,year,entityName
    ,2000,france
    ,2001,france
    1,2002,france
    2,2003,france
    8,2004,france
    ,2005,france
    ,2000,uk
    ,2001,uk
    5,2002,uk
    18,2003,uk
    2,2004,uk
    ,2005,uk`;
    const table = new OwidTable_1.OwidTable(csv, [
        { slug: "gdp", type: CoreColumnDef_1.ColumnTypeNames.Numeric },
        { slug: "year", type: CoreColumnDef_1.ColumnTypeNames.Year },
    ]);
    const manager = {
        table,
        yColumnSlugs: ["gdp"],
        selection: table.availableEntityNames,
    };
    const chart = new StackedAreaChart_1.StackedAreaChart({ manager });
    expect(chart.series.length).toEqual(2);
    expect(chart.series[0].points.length).toEqual(3);
    expect(chart.series[1].points.length).toEqual(3);
});
//# sourceMappingURL=StackedAreaChart.test.js.map