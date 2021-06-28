"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SampleInlineDataExplorer = exports.SampleExplorerOfGraphers = void 0;
const react_1 = __importDefault(require("react"));
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const Explorer_1 = require("./Explorer");
const SampleExplorerOfGraphersProgram = `explorerTitle	CO₂ Data Explorer
isPublished	false
explorerSubtitle	Download the complete <i>Our World in Data</i> <a href="https://github.com/owid/co2-data">CO₂ and GHG Emissions Dataset</a>.
subNavId	co2
time	earliest..latest
selection	China	United States	India	United Kingdom	World
Gas Radio	CO₂
Accounting Radio	Production-based
subNavCurrentId	co2-data-explorer
graphers
	grapherId	Gas Radio	Accounting Radio	Fuel Dropdown	Count Dropdown	Relative to world total Checkbox
	488	CO₂	Production-based	Total	Per country	false
	3219	CO₂	Production-based	Total	Per country	Share of global emissions
	486	CO₂	Production-based	Total	Per capita
	485	CO₂	Production-based	Total	Cumulative	false
	3218	CO₂	Production-based	Total	Cumulative	Share of global emissions
	4267	CO₂	Production-based	Total	Per MWh of energy
	530	CO₂	Production-based	Total	Per $ of GDP
	3621	CO₂	Consumption-based		Per country
	3488	CO₂	Consumption-based		Per capita
	4331	CO₂	Consumption-based		Per $ of GDP
	696	CO₂	Consumption-based		Share of emissions embedded in trade
	4250	CO₂	Production-based	Coal	Per country
	4251	CO₂	Production-based	Oil	Per country
	4253	CO₂	Production-based	Gas	Per country
	4255	CO₂	Production-based	Cement	Per country
	4332	CO₂	Production-based	Flaring	Per country
	4249	CO₂	Production-based	Coal	Per capita
	4252	CO₂	Production-based	Oil	Per capita
	4254	CO₂	Production-based	Gas	Per capita
	4256	CO₂	Production-based	Cement	Per capita
	4333	CO₂	Production-based	Flaring	Per capita
	4147	All GHGs (CO₂eq)	Production-based		Per country
	4239	All GHGs (CO₂eq)	Production-based		Per capita
	4222	Methane	Production-based		Per country
	4243	Methane	Production-based		Per capita
	4224	Nitrous oxide	Production-based		Per country
	4244	Nitrous oxide	Production-based		Per capita`;
const SampleExplorerOfGraphers = (props) => {
    const title = "AlphaBeta";
    const first = {
        id: 488,
        title,
        dimensions: [
            {
                variableId: 142609,
                property: GrapherConstants_1.DimensionProperty.y,
            },
        ],
        tab: GrapherConstants_1.GrapherTabOption.chart,
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
    };
    const grapherConfigs = [
        first,
        Object.assign(Object.assign({}, first), { id: 4147, title: "Switched to Something Else" }),
    ];
    return (react_1.default.createElement(Explorer_1.Explorer, Object.assign({ slug: "test-slug", program: SampleExplorerOfGraphersProgram, grapherConfigs: grapherConfigs }, props)));
};
exports.SampleExplorerOfGraphers = SampleExplorerOfGraphers;
const SampleInlineDataExplorerProgram = `explorerTitle	Sample Explorer
selection	Argentina
graphers
	Test Radio	xSlug	ySlugs	colorSlug	sizeSlug	type
	Scatter	x	y	color	size	ScatterPlot
	Line		y			LineChart

columns
	slug	type	name
	Country	EntityName	Country
	Quarter	Quarter	Quarter
	x	Numeric	x
	y	Numeric	y
	color	Numeric	color
	size	Numeric	size

table
	Country	Year	x	y	color	size
	Argentina	2020	1	1	1	1
	Argentina	2021	1	1	1	1`;
const SampleInlineDataExplorer = (props) => {
    return (react_1.default.createElement(Explorer_1.Explorer, Object.assign({ slug: "test-slug-inline-data", program: SampleInlineDataExplorerProgram }, props)));
};
exports.SampleInlineDataExplorer = SampleInlineDataExplorer;
//# sourceMappingURL=Explorer.sample.js.map