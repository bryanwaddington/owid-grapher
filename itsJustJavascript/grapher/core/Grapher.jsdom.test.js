#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grapher_1 = require("../core/Grapher");
const GrapherConstants_1 = require("./GrapherConstants");
const TimeBounds_1 = require("../../clientUtils/TimeBounds");
const OwidTableSynthesizers_1 = require("../../coreTable/OwidTableSynthesizers");
const Util_1 = require("../../clientUtils/Util");
const GrapherUrlMigrations_1 = require("./GrapherUrlMigrations");
const EntityUrlBuilder_1 = require("./EntityUrlBuilder");
const UrlUtils_1 = require("../../clientUtils/urls/UrlUtils");
const Url_1 = require("../../clientUtils/urls/Url");
const OwidTable_1 = require("../../coreTable/OwidTable");
const MapConfig_1 = require("../mapCharts/MapConfig");
const CoreColumnDef_1 = require("../../coreTable/CoreColumnDef");
const SelectionArray_1 = require("../selection/SelectionArray");
const TestGrapherConfig = () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 10 });
    return {
        table,
        selection: table.sampleEntityName(5),
        dimensions: [
            {
                slug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
                property: GrapherConstants_1.DimensionProperty.y,
                variableId: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
            },
        ],
    };
};
it("regression fix: container options are not serialized", () => {
    const grapher = new Grapher_1.Grapher({ xAxis: { min: 1 } });
    const obj = grapher.toObject().xAxis;
    expect(obj.max).toBe(undefined);
    expect(obj.containerOptions).toBe(undefined); // Regression test: should never be a containerOptions
});
it("can get dimension slots", () => {
    const grapher = new Grapher_1.Grapher();
    expect(grapher.dimensionSlots.length).toBe(1);
    grapher.type = GrapherConstants_1.ChartTypeName.ScatterPlot;
    expect(grapher.dimensionSlots.length).toBe(4);
});
it("an empty Grapher serializes to an empty object", () => {
    expect(new Grapher_1.Grapher().toObject()).toEqual({});
});
it("a bad chart type does not crash grapher", () => {
    const input = { type: "fff" };
    expect(new Grapher_1.Grapher(input).toObject()).toEqual(input);
});
it("does not preserve defaults in the object", () => {
    expect(new Grapher_1.Grapher({ tab: GrapherConstants_1.GrapherTabOption.chart }).toObject()).toEqual({});
});
const unit = "% of children under 5";
const name = "Some display name";
const legacyConfig = {
    dimensions: [
        {
            variableId: 3512,
            property: GrapherConstants_1.DimensionProperty.y,
            display: {
                unit,
            },
        },
    ],
    owidDataset: {
        variables: {
            "3512": {
                years: [2000, 2010, 2010],
                entities: [207, 15, 207],
                values: [4, 20, 34],
                id: 3512,
                display: {
                    name,
                },
            },
        },
        entityKey: {
            "15": { name: "Afghanistan", id: 15, code: "AFG" },
            "207": { name: "Iceland", id: 207, code: "ISL" },
        },
    },
    selectedData: [
        { entityId: 207, index: 0 },
        { entityId: 15, index: 1 },
    ],
};
it("can apply legacy chart dimension settings", () => {
    const grapher = new Grapher_1.Grapher(legacyConfig);
    const col = grapher.yColumns[0];
    expect(col.unit).toEqual(unit);
    expect(col.displayName).toEqual(name);
});
it("correctly identifies changes to passed-in selection", () => {
    const selection = new SelectionArray_1.SelectionArray();
    const grapher = new Grapher_1.Grapher(Object.assign(Object.assign({}, legacyConfig), { manager: { selection } }));
    expect(grapher.changedParams).toEqual({});
    expect(selection.selectedEntityNames).toEqual(["Iceland", "Afghanistan"]);
    selection.deselectEntity("Afghanistan");
    expect(grapher.changedParams).toEqual({ country: "~ISL" });
});
it("can fallback to a ycolumn if a map variableId does not exist", () => {
    const config = Object.assign(Object.assign({}, legacyConfig), { hasMapTab: true, map: { variableId: 444 } });
    const grapher = new Grapher_1.Grapher(config);
    expect(grapher.mapColumnSlug).toEqual("3512");
});
it("can generate a url with country selection even if there is no entity code", () => {
    const config = Object.assign(Object.assign({}, legacyConfig), { selectedData: [] });
    const grapher = new Grapher_1.Grapher(config);
    expect(grapher.queryStr).toBe("");
    grapher.selection.selectAll();
    expect(grapher.queryStr).toContain("AFG");
    const config2 = Object.assign(Object.assign({}, legacyConfig), { selectedData: [] });
    config2.owidDataset.entityKey[15].code = undefined;
    const grapher2 = new Grapher_1.Grapher(config2);
    expect(grapher2.queryStr).toBe("");
    grapher2.selection.selectAll();
    expect(grapher2.queryStr).toContain("AFG");
});
describe("hasTimeline", () => {
    it("charts with timeline", () => {
        const grapher = new Grapher_1.Grapher(legacyConfig);
        grapher.type = GrapherConstants_1.ChartTypeName.LineChart;
        expect(grapher.hasTimeline).toBeTruthy();
        grapher.type = GrapherConstants_1.ChartTypeName.SlopeChart;
        expect(grapher.hasTimeline).toBeTruthy();
    });
    it("charts without timeline", () => {
        const grapher = new Grapher_1.Grapher(legacyConfig);
        grapher.type = GrapherConstants_1.ChartTypeName.StackedBar;
        expect(grapher.hasTimeline).toBeFalsy();
        grapher.type = GrapherConstants_1.ChartTypeName.StackedArea;
        expect(grapher.hasTimeline).toBeFalsy();
        grapher.type = GrapherConstants_1.ChartTypeName.DiscreteBar;
        expect(grapher.hasTimeline).toBeFalsy();
    });
    it("map tab has timeline even if chart doesn't", () => {
        const grapher = new Grapher_1.Grapher(legacyConfig);
        grapher.hideTimeline = true;
        grapher.type = GrapherConstants_1.ChartTypeName.LineChart;
        expect(grapher.hasTimeline).toBeFalsy();
        grapher.tab = GrapherConstants_1.GrapherTabOption.map;
        expect(grapher.hasTimeline).toBeTruthy();
        grapher.map.hideTimeline = true;
        expect(grapher.hasTimeline).toBeFalsy();
    });
    it("table tab has timeline even if chart doesn't", () => {
        const grapher = new Grapher_1.Grapher(legacyConfig);
        grapher.type = GrapherConstants_1.ChartTypeName.StackedBar;
        expect(grapher.hasTimeline).toBeFalsy();
        grapher.tab = GrapherConstants_1.GrapherTabOption.table;
        expect(grapher.hasTimeline).toBeTruthy();
    });
    it("source and download tabs do not have a timeline", () => {
        const grapher = new Grapher_1.Grapher(legacyConfig);
        grapher.type = GrapherConstants_1.ChartTypeName.LineChart;
        grapher.currentTab = GrapherConstants_1.GrapherTabOption.sources;
        expect(grapher.hasTimeline).toBeFalsy();
        grapher.currentTab = GrapherConstants_1.GrapherTabOption.download;
        expect(grapher.hasTimeline).toBeFalsy();
    });
});
const getGrapher = () => new Grapher_1.Grapher({
    dimensions: [
        {
            variableId: 142609,
            property: GrapherConstants_1.DimensionProperty.y,
        },
    ],
    owidDataset: {
        variables: {
            "142609": {
                years: [-1, 0, 1, 2],
                entities: [1, 2, 1, 2],
                values: [51, 52, 53, 54],
                id: 142609,
                display: { zeroDay: "2020-01-21", yearIsDay: true },
            },
        },
        entityKey: {
            "1": { name: "United Kingdom", code: "GBR", id: 1 },
            "2": { name: "Ireland", code: "IRL", id: 2 },
        },
    },
    minTime: -5000,
    maxTime: 5000,
});
function fromQueryParams(params, props) {
    const grapher = new Grapher_1.Grapher(props);
    grapher.populateFromQueryParams(GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams(UrlUtils_1.queryParamsToStr(params)));
    return grapher;
}
function toQueryParams(props) {
    const grapher = new Grapher_1.Grapher({
        minTime: -5000,
        maxTime: 5000,
        map: { time: 5000 },
    });
    if (props)
        grapher.updateFromObject(props);
    return grapher.changedParams;
}
it("can serialize scaleType if it changes", () => {
    expect(new Grapher_1.Grapher().changedParams.xScale).toEqual(undefined);
    const grapher = new Grapher_1.Grapher({
        xAxis: { scaleType: GrapherConstants_1.ScaleType.linear },
    });
    expect(grapher.changedParams.xScale).toEqual(undefined);
    grapher.xAxis.scaleType = GrapherConstants_1.ScaleType.log;
    expect(grapher.changedParams.xScale).toEqual(GrapherConstants_1.ScaleType.log);
});
describe("currentTitle", () => {
    it("shows the year of the selected data in the title", () => {
        const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 2, timeRange: [2000, 2010] }, 1);
        const grapher = new Grapher_1.Grapher({
            table,
            selectedEntityNames: table.availableEntityNames,
            dimensions: [
                {
                    slug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
                    property: GrapherConstants_1.DimensionProperty.y,
                    variableId: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
                },
            ],
        });
        grapher.timelineHandleTimeBounds = [2001, 2005];
        expect(grapher.currentTitle).toContain("2001");
        expect(grapher.currentTitle).toContain("2005");
        expect(grapher.currentTitle).not.toContain("Infinity");
        grapher.timelineHandleTimeBounds = [1900, 2020];
        expect(grapher.currentTitle).toContain("2000");
        expect(grapher.currentTitle).toContain("2009");
        grapher.timelineHandleTimeBounds = [-Infinity, Infinity];
        expect(grapher.currentTitle).toContain("2000");
        expect(grapher.currentTitle).toContain("2009");
        grapher.timelineHandleTimeBounds = [Infinity, Infinity];
        expect(grapher.currentTitle).not.toContain("2000");
        expect(grapher.currentTitle).toContain("2009");
    });
    it("can generate a title when all you have is a table and ySlug", () => {
        const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 2, timeRange: [2000, 2010] }, 1);
        const grapher = new Grapher_1.Grapher({
            table,
            ySlugs: "GDP",
        });
        expect(grapher.currentTitle).toContain("GDP");
    });
});
describe("authors can use maxTime", () => {
    it("can can create a discretebar chart with correct maxtime", () => {
        const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ timeRange: [2000, 2010] });
        const grapher = new Grapher_1.Grapher({
            table,
            type: GrapherConstants_1.ChartTypeName.DiscreteBar,
            selectedEntityNames: table.availableEntityNames,
            maxTime: 2005,
            ySlugs: "GDP",
        });
        const chart = grapher.chartInstance;
        expect(chart.failMessage).toBeFalsy();
    });
});
describe("line chart to bar chart and bar chart race", () => {
    const grapher = new Grapher_1.Grapher(TestGrapherConfig());
    it("can create a new line chart with different start and end times", () => {
        expect(grapher.typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart).toEqual(GrapherConstants_1.ChartTypeName.LineChart);
        expect(grapher.endHandleTimeBound).toBeGreaterThan(grapher.startHandleTimeBound);
    });
    describe("switches from a line chart to a bar chart when there is only 1 year selected", () => {
        const grapher = new Grapher_1.Grapher(TestGrapherConfig());
        const lineSeries = grapher.chartInstance.series;
        expect(grapher.typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart).toEqual(GrapherConstants_1.ChartTypeName.LineChart);
        grapher.startHandleTimeBound = 2000;
        grapher.endHandleTimeBound = 2000;
        expect(grapher.typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart).toEqual(GrapherConstants_1.ChartTypeName.DiscreteBar);
        it("still has a timeline even though its now a bar chart", () => {
            expect(grapher.hasTimeline).toBe(true);
        });
        it("keeps same series colors when it switches from line chart to bar chart", () => {
            const barSeries = grapher.chartInstance.series;
            const barColors = Util_1.orderBy(barSeries, "seriesName").map((series) => series.color);
            const linecolors = Util_1.orderBy(lineSeries, "seriesName").map((series) => series.color);
            expect(barColors).toEqual(linecolors);
        });
    });
    it("turns into a line chart race when playing a line chart that currently shows as a bar chart", () => {
        grapher.startHandleTimeBound = -Infinity;
        grapher.endHandleTimeBound = -Infinity;
        grapher.timelineController.play(1);
        expect(grapher.startHandleTimeBound).not.toEqual(grapher.endHandleTimeBound);
        expect(grapher.typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart).toEqual(GrapherConstants_1.ChartTypeName.LineChart);
    });
    it("turns into a bar chart when constrained start & end handles are equal", () => {
        grapher.startHandleTimeBound = 5000;
        grapher.endHandleTimeBound = Infinity;
        expect(grapher.typeExceptWhenLineChartAndSingleTimeThenWillBeBarChart).toEqual(GrapherConstants_1.ChartTypeName.DiscreteBar);
    });
});
describe("urls", () => {
    it("can change base url", () => {
        const url = new Grapher_1.Grapher({
            isPublished: true,
            slug: "foo",
            bakedGrapherURL: "/grapher",
        });
        expect(url.baseUrl).toEqual("/grapher/foo");
    });
    it("does not include country param in url if unchanged", () => {
        var _a;
        const grapher = new Grapher_1.Grapher(legacyConfig);
        grapher.isPublished = true;
        expect((_a = grapher.canonicalUrl) === null || _a === void 0 ? void 0 : _a.includes("country")).toBeFalsy();
    });
    it("can upgrade legacy urls", () => {
        expect(GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams("?year=2000")).toEqual({
            time: "2000",
        });
        // Do not override time if set
        expect(GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams("?year=2000&time=2001..2002")).toEqual({ time: "2001..2002" });
    });
    it("doesn't apply selection if addCountryMode is 'disabled'", () => {
        const grapher = new Grapher_1.Grapher({
            selectedEntityNames: ["usa", "canada"],
            addCountryMode: GrapherConstants_1.EntitySelectionMode.Disabled,
        });
        const url = EntityUrlBuilder_1.setSelectedEntityNamesParam(Url_1.Url.fromQueryParams({}), [
            "usa",
        ]);
        grapher.populateFromQueryParams(url.queryParams);
        expect(grapher.selection.selectedEntityNames).toEqual(["usa", "canada"]);
    });
});
describe("time domain tests", () => {
    const seed = 1;
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 2, timeRange: [2000, 2010] }, seed).replaceRandomCells(17, [OwidTableSynthesizers_1.SampleColumnSlugs.GDP], seed);
    const grapher = new Grapher_1.Grapher({
        table,
        selectedEntityNames: table.availableEntityNames,
        dimensions: [
            {
                slug: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
                property: GrapherConstants_1.DimensionProperty.y,
                variableId: OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
            },
        ],
    });
    it("get the default time domain from the primary dimensions", () => {
        expect(grapher.times).toEqual([2003, 2004, 2008]);
        expect(grapher.startHandleTimeBound).toEqual(-Infinity);
        expect(grapher.endHandleTimeBound).toEqual(Infinity);
    });
});
describe("time parameter", () => {
    describe("with years", () => {
        const tests = [
            { name: "single year", query: "1500", param: [1500, 1500] },
            {
                name: "single year negative",
                query: "-1500",
                param: [-1500, -1500],
            },
            { name: "single year zero", query: "0", param: [0, 0] },
            {
                name: "single year latest",
                query: "latest",
                param: [
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                ],
            },
            {
                name: "single year earliest",
                query: "earliest",
                param: [
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                ],
            },
            { name: "two years", query: "2000..2005", param: [2000, 2005] },
            {
                name: "negative years",
                query: "-500..-1",
                param: [-500, -1],
            },
            {
                name: "right unbounded",
                query: "2000..latest",
                param: [2000, TimeBounds_1.TimeBoundValue.positiveInfinity],
            },
            {
                name: "left unbounded",
                query: "earliest..2005",
                param: [TimeBounds_1.TimeBoundValue.negativeInfinity, 2005],
            },
            {
                name: "left unbounded",
                query: "earliest..latest",
                param: [
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                ],
            },
            // The queries below can be considered legacy and are no longer generated this way,
            // but we still want to support existing URLs of this form
            {
                name: "right unbounded [legacy]",
                query: "2000..",
                param: [2000, TimeBounds_1.TimeBoundValue.positiveInfinity],
                irreversible: true,
            },
            {
                name: "left unbounded [legacy]",
                query: "..2005",
                param: [TimeBounds_1.TimeBoundValue.negativeInfinity, 2005],
                irreversible: true,
            },
            {
                name: "both unbounded [legacy]",
                query: "..",
                param: [
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                ],
                irreversible: true,
            },
        ];
        for (const test of tests) {
            it(`parse ${test.name}`, () => {
                const grapher = fromQueryParams({ time: test.query });
                const [start, end] = grapher.timelineHandleTimeBounds;
                expect(start).toEqual(test.param[0]);
                expect(end).toEqual(test.param[1]);
            });
            if (!test.irreversible) {
                it(`encode ${test.name}`, () => {
                    const params = toQueryParams({
                        minTime: test.param[0],
                        maxTime: test.param[1],
                    });
                    expect(params.time).toEqual(test.query);
                });
            }
        }
        it("empty string doesn't change time", () => {
            const grapher = fromQueryParams({ time: "" }, { minTime: 0, maxTime: 5 });
            const [start, end] = grapher.timelineHandleTimeBounds;
            expect(start).toEqual(0);
            expect(end).toEqual(5);
        });
        it("doesn't include URL param if it's identical to original config", () => {
            const grapher = new Grapher_1.Grapher({
                minTime: 0,
                maxTime: 75,
            });
            expect(grapher.changedParams.time).toEqual(undefined);
        });
        it("doesn't include URL param if unbounded is encoded as `undefined`", () => {
            const grapher = new Grapher_1.Grapher({
                minTime: undefined,
                maxTime: 75,
            });
            expect(grapher.changedParams.time).toEqual(undefined);
        });
    });
    describe("with days", () => {
        const tests = [
            {
                name: "single day (date)",
                query: "2020-01-22",
                param: [1, 1],
            },
            {
                name: "single day negative (date)",
                query: "2020-01-01",
                param: [-20, -20],
            },
            {
                name: "single day zero (date)",
                query: "2020-01-21",
                param: [0, 0],
            },
            {
                name: "single day latest",
                query: "latest",
                param: [
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                ],
            },
            {
                name: "single day earliest",
                query: "earliest",
                param: [
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                ],
            },
            {
                name: "two days",
                query: "2020-01-01..2020-02-01",
                param: [-20, 11],
            },
            {
                name: "left unbounded (date)",
                query: "earliest..2020-02-01",
                param: [TimeBounds_1.TimeBoundValue.negativeInfinity, 11],
            },
            {
                name: "right unbounded (date)",
                query: "2020-01-01..latest",
                param: [-20, TimeBounds_1.TimeBoundValue.positiveInfinity],
            },
            {
                name: "both unbounded (date)",
                query: "earliest..latest",
                param: [
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                ],
            },
            // The queries below can be considered legacy and are no longer generated this way,
            // but we still want to support existing URLs of this form
            {
                name: "right unbounded (date) [legacy]",
                query: "2020-01-01..",
                param: [-20, TimeBounds_1.TimeBoundValue.positiveInfinity],
                irreversible: true,
            },
            {
                name: "left unbounded (date) [legacy]",
                query: "..2020-01-01",
                param: [TimeBounds_1.TimeBoundValue.negativeInfinity, -20],
                irreversible: true,
            },
            {
                name: "both unbounded [legacy]",
                query: "..",
                param: [
                    TimeBounds_1.TimeBoundValue.negativeInfinity,
                    TimeBounds_1.TimeBoundValue.positiveInfinity,
                ],
                irreversible: true,
            },
            {
                name: "single day (number)",
                query: "5",
                param: [5, 5],
                irreversible: true,
            },
            {
                name: "range (number)",
                query: "-5..5",
                param: [-5, 5],
                irreversible: true,
            },
            {
                name: "unbounded range (number)",
                query: "-500..",
                param: [-500, TimeBounds_1.TimeBoundValue.positiveInfinity],
                irreversible: true,
            },
        ];
        for (const test of tests) {
            it(`parse ${test.name}`, () => {
                const grapher = getGrapher();
                grapher.populateFromQueryParams({ time: test.query });
                const [start, end] = grapher.timelineHandleTimeBounds;
                expect(start).toEqual(test.param[0]);
                expect(end).toEqual(test.param[1]);
            });
            if (!test.irreversible) {
                it(`encode ${test.name}`, () => {
                    const grapher = getGrapher();
                    grapher.updateFromObject({
                        minTime: test.param[0],
                        maxTime: test.param[1],
                    });
                    const params = grapher.changedParams;
                    expect(params.time).toEqual(test.query);
                });
            }
        }
    });
});
it("canChangeEntity reflects all available entities before transforms", () => {
    const table = OwidTableSynthesizers_1.SynthesizeGDPTable();
    const grapher = new Grapher_1.Grapher({
        addCountryMode: GrapherConstants_1.EntitySelectionMode.SingleEntity,
        table,
        selectedEntityNames: table.sampleEntityName(1),
    });
    expect(grapher.canChangeEntity).toBe(true);
});
describe("year parameter (applies to map only)", () => {
    describe("with years", () => {
        const tests = [
            { name: "single year", query: "1500", param: 1500 },
            {
                name: "single year negative",
                query: "-1500",
                param: -1500,
            },
            { name: "single year zero", query: "0", param: 0 },
            {
                name: "single year latest",
                query: "latest",
                param: TimeBounds_1.TimeBoundValue.positiveInfinity,
            },
            {
                name: "single year earliest",
                query: "earliest",
                param: TimeBounds_1.TimeBoundValue.negativeInfinity,
            },
        ];
        for (const test of tests) {
            it(`parse ${test.name}`, () => {
                const grapher = fromQueryParams({ year: test.query });
                expect(grapher.timelineHandleTimeBounds[1]).toEqual(test.param);
            });
            it(`encode ${test.name}`, () => {
                const params = toQueryParams({
                    tab: GrapherConstants_1.GrapherTabOption.map,
                    map: { time: test.param },
                });
                expect(params.time).toEqual(test.query);
            });
        }
        it("empty string doesn't change time", () => {
            const grapher = fromQueryParams({ year: "", time: "2015" });
            expect(grapher.timelineHandleTimeBounds[1]).toEqual(2015);
        });
    });
    describe("with days", () => {
        const tests = [
            { name: "single day", query: "2020-01-30", param: 9 },
            {
                name: "single day negative",
                query: "2020-01-01",
                param: -20,
            },
            { name: "single day zero", query: "2020-01-21", param: 0 },
            {
                name: "single day latest",
                query: "latest",
                param: TimeBounds_1.TimeBoundValue.positiveInfinity,
            },
            {
                name: "single day earliest",
                query: "earliest",
                param: TimeBounds_1.TimeBoundValue.negativeInfinity,
            },
            {
                name: "single day (number)",
                query: "0",
                param: 0,
                irreversible: true,
            },
        ];
        for (const test of tests) {
            describe(`parse ${test.name}`, () => {
                const grapher = getGrapher();
                grapher.populateFromQueryParams(GrapherUrlMigrations_1.legacyToCurrentGrapherQueryParams(`?year=${test.query}`));
                expect(grapher.timelineHandleTimeBounds).toEqual([
                    test.param,
                    test.param,
                ]);
                it("can clear query params", () => {
                    expect(grapher.queryStr).toBeTruthy();
                    grapher.clearQueryParams();
                    expect(grapher.queryStr).toBeFalsy();
                });
            });
            if (!test.irreversible) {
                it(`encode ${test.name}`, () => {
                    const grapher = getGrapher();
                    grapher.updateFromObject({
                        tab: GrapherConstants_1.GrapherTabOption.map,
                        map: { time: test.param },
                    });
                    const params = grapher.changedParams;
                    expect(params.time).toEqual(test.query);
                });
            }
        }
    });
});
// TODO migrate the database property
it("migrates map.targetYear correctly", () => {
    const grapher = new Grapher_1.Grapher({
        map: { targetYear: 2005 },
    });
    expect(grapher.map.time).toEqual(2005);
});
it("correctly identifies activeColumnSlugs", () => {
    const table = new OwidTable_1.OwidTable(`entityName,entityId,entityColor,year,gdp,gdp-annotations,child_mortality,population,continent,happiness
    Belgium,BEL,#f6f,2010,80000,pretty damn high,1.5,9000000,Europe,81.2
    `);
    const grapher = new Grapher_1.Grapher({
        table,
        type: GrapherConstants_1.ChartTypeName.ScatterPlot,
        xSlug: "gdp",
        ySlugs: "child_mortality",
        colorSlug: "continent",
        sizeSlug: "population",
    });
    expect(grapher.activeColumnSlugs.length).toEqual(4);
    expect(grapher.activeColumnSlugs.sort()).toEqual([
        "child_mortality",
        "continent",
        "gdp",
        "population",
    ]);
});
it("considers map tolerance before using column tolerance", () => {
    const table = new OwidTable_1.OwidTable([
        ["entityId", "entityCode", "entityName", "year", "gdp"],
        [1, "USA", "United States", 1999, 1],
        [1, "USA", "United States", 2000, 1],
        [1, "USA", "United States", 2001, 1],
        [1, "USA", "United States", 2002, 1],
        [2, "DEU", "Germany", 2000, 2],
    ], [
        {
            slug: "gdp",
            type: CoreColumnDef_1.ColumnTypeNames.Numeric,
            tolerance: 2,
        },
    ]);
    const grapher = new Grapher_1.Grapher({
        table,
        type: GrapherConstants_1.ChartTypeName.WorldMap,
        ySlugs: "gdp",
        tab: GrapherConstants_1.GrapherTabOption.map,
        map: new MapConfig_1.MapConfig({ timeTolerance: 1, columnSlug: "gdp", time: 2002 }),
    });
    expect(grapher.timelineHandleTimeBounds[1]).toEqual(2002);
    expect(grapher.transformedTable.filterByEntityNames(["Germany"]).get("gdp")
        .values).toEqual([]);
    grapher.map.time = 2001;
    expect(grapher.transformedTable.filterByEntityNames(["Germany"]).get("gdp")
        .values).toEqual([2]);
    grapher.map.time = 2002;
    grapher.map.timeTolerance = undefined;
    expect(grapher.transformedTable.filterByEntityNames(["Germany"]).get("gdp")
        .values).toEqual([2]);
});
describe("tableForSelection", () => {
    it("should include all available entities (LineChart)", () => {
        const table = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityNames: ["A", "B"] });
        const grapher = new Grapher_1.Grapher({ table });
        expect(grapher.tableForSelection.availableEntityNames).toEqual([
            "A",
            "B",
        ]);
    });
    it("should not include entities that cannot be displayed (ScatterPlot)", () => {
        const table = new OwidTable_1.OwidTable([
            [
                "entityId",
                "entityName",
                "entityCode",
                "year",
                "x",
                "y",
                "color",
                "size",
            ],
            [1, "UK", "", 2000, 1, 1, null, null],
            [1, "UK", "", 2001, null, 1, "Europe", 100],
            [1, "UK", "", 2002, 1, null, null, null],
            [1, "UK", "", 2003, null, null, null, null],
            [2, "Barbados", "", 2000, null, null, null, null],
            [3, "USA", "", 2001, 2, 1, null, null],
            [4, "France", "", 2000, 0, null, null, null], // y value missing
        ]);
        const grapher = new Grapher_1.Grapher({
            table,
            type: GrapherConstants_1.ChartTypeName.ScatterPlot,
            excludedEntities: [3],
            xSlug: "x",
            ySlugs: "y",
        });
        expect(grapher.tableForSelection.availableEntityNames).toEqual(["UK"]);
    });
});
it("handles tolerance when there are gaps in ScatterPlot data", () => {
    const table = new OwidTable_1.OwidTable([
        ["entityName", "year", "x", "y"],
        ["usa", 1998, 1, 1],
        ["uk", 1999, 0, 0],
        ["uk", 2000, 0, 0],
        ["uk", 2001, 0, 0],
        ["usa", 2002, 2, 2],
    ], [
        {
            slug: "x",
            type: CoreColumnDef_1.ColumnTypeNames.Numeric,
            tolerance: 1,
        },
        {
            slug: "y",
            type: CoreColumnDef_1.ColumnTypeNames.Numeric,
            tolerance: 1,
        },
    ]);
    const grapher = new Grapher_1.Grapher({
        table,
        type: GrapherConstants_1.ChartTypeName.ScatterPlot,
        xSlug: "x",
        ySlugs: "y",
        minTime: 1999,
        maxTime: 1999,
    });
    expect(grapher.transformedTable.filterByEntityNames(["usa"]).get("x").values).toEqual([1]);
    grapher.timelineHandleTimeBounds = [2000, 2000];
    expect(grapher.transformedTable.filterByEntityNames(["usa"]).get("x").values).toEqual([]);
    grapher.timelineHandleTimeBounds = [2001, 2001];
    expect(grapher.transformedTable.filterByEntityNames(["usa"]).get("x").values).toEqual([2]);
});
//# sourceMappingURL=Grapher.jsdom.test.js.map