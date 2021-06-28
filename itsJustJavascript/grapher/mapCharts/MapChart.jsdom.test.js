#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const MapChart_1 = require("./MapChart");
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({
    timeRange: [2000, 2001],
    entityNames: ["France", "Germany", "World"],
});
const manager = {
    table,
    mapColumnSlug: OwidTableSynthesizers_1.SampleColumnSlugs.Population,
    endTime: 2000,
};
it("can create a new Map chart", () => {
    const chart = new MapChart_1.MapChart({ manager });
    expect(Object.keys(chart.series).length).toEqual(2);
    const legends = chart.colorScale.legendBins;
    expect(Object.keys(legends).length).toBeGreaterThan(1);
});
it("filters out non-map entities from colorScaleColumn", () => {
    const chart = new MapChart_1.MapChart({ manager });
    expect(chart.colorScaleColumn.uniqEntityNames).toEqual(expect.arrayContaining(["France", "Germany"]));
});
//# sourceMappingURL=MapChart.jsdom.test.js.map