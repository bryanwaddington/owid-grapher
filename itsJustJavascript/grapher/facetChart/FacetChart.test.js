#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FacetChart_1 = require("./FacetChart");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const GrapherConstants_1 = require("../core/GrapherConstants");
const AxisConfig_1 = require("../axis/AxisConfig");
it("can create a new FacetChart", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ timeRange: [2000, 2010] });
    const manager = {
        table,
        selection: table.availableEntityNames,
        yAxis: new AxisConfig_1.AxisConfig(),
    };
    const chart = new FacetChart_1.FacetChart({ manager });
    // default to country facets
    expect(chart.series.length).toEqual(2);
    // switch to column facets
    manager.facetStrategy = GrapherConstants_1.FacetStrategy.column;
    expect(chart.series.length).toEqual(3);
});
it("uses the transformed data for display in country mode", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ timeRange: [2000, 2010] });
    const manager = {
        table,
        selection: table.availableEntityNames,
        // simulate the transformation that is done by Grapher on the data
        transformedTable: table.filterByTimeRange(2002, 2008),
        facetStrategy: GrapherConstants_1.FacetStrategy.country,
        yAxis: new AxisConfig_1.AxisConfig(),
    };
    const chart = new FacetChart_1.FacetChart({ manager });
    // we should be using the transformed table
    chart.series.forEach((s) => {
        expect(s.manager.table.minTime).toEqual(2002);
        expect(s.manager.table.maxTime).toEqual(2008);
    });
});
//# sourceMappingURL=FacetChart.test.js.map