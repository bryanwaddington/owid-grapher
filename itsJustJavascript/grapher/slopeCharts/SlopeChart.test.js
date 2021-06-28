#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SlopeChart_1 = require("./SlopeChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const SlopeChartConstants_1 = require("./SlopeChartConstants");
const OwidTableConstants_1 = require("../../coreTable/OwidTableConstants");
const Util_1 = require("../../clientUtils/Util");
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ timeRange: [2000, 2010] });
const manager = {
    table,
    yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
};
it("can create a new slope chart", () => {
    const chart = new SlopeChart_1.SlopeChart({ manager });
    expect(chart.series.length).toEqual(2);
});
it("slope charts can have different colors", () => {
    const manager = {
        table,
        yColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
        colorColumnSlug: OwidTableConstants_1.OwidTableSlugs.entityName,
    };
    const chart = new SlopeChart_1.SlopeChart({ manager });
    expect(chart.series[0].color).not.toEqual(SlopeChartConstants_1.DEFAULT_SLOPE_CHART_COLOR);
});
it("filters non-numeric values", () => {
    const table = OwidTableSynthesizers_1.SynthesizeFruitTableWithStringValues({
        entityCount: 2,
        timeRange: [2000, 2002],
    }, 1, 1);
    const manager = {
        table,
        yColumnSlugs: [OwidTableSynthesizers_1.SampleColumnSlugs.Fruit],
        selection: table.availableEntityNames,
    };
    const chart = new SlopeChart_1.SlopeChart({ manager });
    expect(chart.series.length).toEqual(1);
    expect(chart.series.every((series) => series.values.every((value) => Util_1.isNumber(value.x) && Util_1.isNumber(value.y)))).toBeTruthy();
});
//# sourceMappingURL=SlopeChart.test.js.map