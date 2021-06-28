#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const Grapher_1 = require("../core/Grapher");
const MapChart_1 = require("../mapCharts/MapChart");
const MapChart_sample_1 = require("../mapCharts/MapChart.sample");
const GrapherConstants_1 = require("./GrapherConstants");
describe("grapher and map charts", () => {
    describe("map time tolerance plus query string works with a map chart", () => {
        const grapher = new Grapher_1.Grapher(MapChart_sample_1.legacyMapGrapher);
        expect(grapher.mapColumnSlug).toBe("3512");
        expect(grapher.inputTable.minTime).toBe(2000);
        expect(grapher.inputTable.maxTime).toBe(2010);
        expect(grapher.times).toEqual([2000, 2010]);
        // Todo: not actually clear what the desired behavior is here (we have a query string time not actually an available time.)
        it("sets correct time handles", () => {
            expect(grapher.startHandleTimeBound).toBe(2000);
            expect(grapher.endHandleTimeBound).toBe(2000);
        });
    });
    it("can change time and see more points", () => {
        const manager = new Grapher_1.Grapher(MapChart_sample_1.legacyMapGrapher);
        const chart = new MapChart_1.MapChart({ manager });
        expect(Object.keys(chart.series).length).toEqual(1);
        manager.endHandleTimeBound = 2010;
        expect(Object.keys(chart.series).length).toEqual(2);
    });
});
const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 10 });
const basicGrapherConfig = {
    table,
    selectedEntityNames: table.sampleEntityName(5),
    dimensions: [
        {
            slug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
            property: GrapherConstants_1.DimensionProperty.y,
            variableId: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
        },
    ],
};
describe("grapher and discrete bar charts", () => {
    const grapher = new Grapher_1.Grapher(Object.assign({ type: GrapherConstants_1.ChartTypeName.DiscreteBar }, basicGrapherConfig));
    expect(grapher.chartInstance.series.length).toBeGreaterThan(0);
});
//# sourceMappingURL=GrapherWithChartTypes.jsdom.test.js.map