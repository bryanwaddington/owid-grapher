"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.columns = exports.CovidTableColumnKey = void 0;
const React = __importStar(require("react"));
const d3_scale_1 = require("d3-scale");
const d3_interpolate_1 = require("d3-interpolate");
const classnames_1 = __importDefault(require("classnames"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faInfoCircle_1 = require("@fortawesome/free-solid-svg-icons/faInfoCircle");
const faExclamationCircle_1 = require("@fortawesome/free-solid-svg-icons/faExclamationCircle");
const faCheckCircle_1 = require("@fortawesome/free-regular-svg-icons/faCheckCircle");
const Tippy_1 = require("../../grapher/chart/Tippy");
const CovidTableHeaderCell_1 = require("./CovidTableHeaderCell");
const CovidTypes_1 = require("./CovidTypes");
const CovidUtils_1 = require("./CovidUtils");
const CovidConstants_1 = require("./CovidConstants");
const CovidDoublingTooltip_1 = require("./CovidDoublingTooltip");
const SparkBarTimeSeriesValue_1 = require("../../grapher/sparkBars/SparkBarTimeSeriesValue");
const SparkBars_1 = require("../../grapher/sparkBars/SparkBars");
var CovidTableColumnKey;
(function (CovidTableColumnKey) {
    CovidTableColumnKey["location"] = "location";
    CovidTableColumnKey["locationTests"] = "locationTests";
    CovidTableColumnKey["totalCases"] = "totalCases";
    CovidTableColumnKey["newCases"] = "newCases";
    CovidTableColumnKey["totalDeaths"] = "totalDeaths";
    CovidTableColumnKey["newDeaths"] = "newDeaths";
    CovidTableColumnKey["daysToDoubleCases"] = "daysToDoubleCases";
    CovidTableColumnKey["daysToDoubleDeaths"] = "daysToDoubleDeaths";
    CovidTableColumnKey["totalTests"] = "totalTests";
    CovidTableColumnKey["testDate"] = "testDate";
    CovidTableColumnKey["testSource"] = "testSource";
})(CovidTableColumnKey = exports.CovidTableColumnKey || (exports.CovidTableColumnKey = {}));
// Deaths color scales
const deathsDoubingTextColorScale = d3_scale_1.scaleThreshold()
    .domain([12])
    .range(["white", "rgba(0,0,0,0.5)"]);
const deathsDoubingBackgColorScale = d3_scale_1.scaleLinear()
    .domain([1, 3, 13])
    .range(["#8a0000", "#bf0000", "#eee"])
    .interpolate(d3_interpolate_1.interpolateLab)
    .clamp(true);
// Cases color scales
const casesDoubingTextColorScale = d3_scale_1.scaleThreshold()
    .domain([12])
    .range(["white", "rgba(0,0,0,0.5)"]);
const casesDoubingBackgColorScale = d3_scale_1.scaleLinear()
    .domain([1, 3, 13])
    .range(["#b11c5b", "#CA3A77", "#eee"])
    .interpolate(d3_interpolate_1.interpolateLab)
    .clamp(true);
const daysToDoubleGenerator = (accessorDatum, accessorRange, noun, doubingBackgColorScale, doubingTextColorScale) => (props) => {
    const { datum, bars, isMobile } = props;
    const range = accessorRange(datum);
    return (React.createElement(React.Fragment, null,
        React.createElement("td", { className: "doubling-days", rowSpan: props.baseRowSpan }, range !== undefined ? (React.createElement(React.Fragment, null,
            React.createElement("span", null,
                React.createElement("span", { className: "label" }, "doubled in"),
                " ",
                React.createElement("br", null),
                React.createElement("span", { className: "days", style: {
                        backgroundColor: doubingBackgColorScale(range.length),
                        color: doubingTextColorScale(range.length),
                    } },
                    range.length,
                    "\u00A0",
                    CovidConstants_1.nouns.days(range.length),
                    "\u00A0",
                    React.createElement(Tippy_1.Tippy, { content: React.createElement(CovidDoublingTooltip_1.CovidDoublingTooltip, { doublingRange: range, noun: noun, accessor: accessorDatum }), maxWidth: 260 },
                        React.createElement("span", { className: "info-icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faInfoCircle_1.faInfoCircle }))))))) : (React.createElement("span", { className: "no-data" }, "Not enough data available"))),
        isMobile && (React.createElement("td", { className: `plot-cell measure--${noun()}`, rowSpan: props.baseRowSpan },
            React.createElement("div", { className: "trend" },
                React.createElement("div", { className: "plot" },
                    React.createElement(SparkBars_1.SparkBars, Object.assign({ className: "spark-bars covid-bars" }, bars, { y: accessorDatum, highlightedX: range !== undefined
                            ? bars.x(range.halfDay)
                            : undefined }))))))));
};
const totalGenerator = (accessor, noun) => (props) => {
    const { bars, datum } = props;
    return (React.createElement("td", { className: `plot-cell measure--${noun()}`, rowSpan: props.baseRowSpan },
        React.createElement("div", { className: "trend" },
            React.createElement("div", { className: "plot" },
                React.createElement(SparkBars_1.SparkBars, Object.assign({ className: "spark-bars covid-bars" }, bars, { y: accessor, renderValue: (d) => d && accessor(d) !== undefined ? (React.createElement(SparkBarTimeSeriesValue_1.SparkBarTimeSeriesValue, { className: "highlighted", value: CovidUtils_1.formatInt(accessor(d)), displayDate: CovidUtils_1.formatDate(d.date) })) : undefined }))),
            React.createElement("div", { className: "value" }, datum.latest && accessor(datum.latest) !== undefined && (React.createElement(SparkBarTimeSeriesValue_1.SparkBarTimeSeriesValue, { className: "current", value: `${CovidUtils_1.formatInt(accessor(datum.latest))} total`, displayDate: CovidUtils_1.formatDate(datum.latest.date), latest: true }))))));
};
const newGenerator = (accessor, noun) => (props) => {
    const { bars, datum } = props;
    return (React.createElement("td", { className: `plot-cell measure--${noun()}`, rowSpan: props.baseRowSpan },
        React.createElement("div", { className: "trend" },
            React.createElement("div", { className: "plot" },
                React.createElement(SparkBars_1.SparkBars, Object.assign({ className: "spark-bars covid-bars" }, bars, { y: accessor, renderValue: (d) => d && accessor(d) !== undefined ? (React.createElement(SparkBarTimeSeriesValue_1.SparkBarTimeSeriesValue, { className: "highlighted", value: CovidUtils_1.formatInt(accessor(d), "", {
                            showPlus: true,
                        }), displayDate: d && CovidUtils_1.formatDate(d.date) })) : undefined }))),
            React.createElement("div", { className: "value" }, datum.latest && accessor(datum.latest) !== undefined && (React.createElement(SparkBarTimeSeriesValue_1.SparkBarTimeSeriesValue, { className: "current", value: `${CovidUtils_1.formatInt(accessor(datum.latest), "", {
                    showPlus: true,
                })} new`, displayDate: CovidUtils_1.formatDate(datum.latest.date), latest: true }))))));
};
// TODO
// There can be columns you cannot sort by, therefore don't have accessors (accessors return undefined is best to implement)
// There can be sorting that doesn't have a column
exports.columns = {
    location: {
        sortKey: CovidTypes_1.CovidSortKey.location,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: "location", sortKey: CovidTypes_1.CovidSortKey.location }),
            React.createElement("strong", null, "Location"))),
        cell: (props) => (React.createElement("td", { className: "location", rowSpan: props.baseRowSpan }, props.datum.location)),
    },
    locationTests: {
        sortKey: CovidTypes_1.CovidSortKey.location,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: "location-tests", sortKey: CovidTypes_1.CovidSortKey.location }),
            React.createElement("strong", null, "Location"))),
        cell: (props) => (React.createElement("td", { className: "location-tests", rowSpan: props.baseRowSpan }, props.datum.location)),
    },
    daysToDoubleCases: {
        sortKey: CovidTypes_1.CovidSortKey.daysToDoubleCases,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.cases()}`, sortKey: CovidTypes_1.CovidSortKey.daysToDoubleCases, colSpan: props.isMobile ? 2 : 1 }),
            "How long did it take for the number of",
            " ",
            React.createElement("strong", null,
                "total confirmed ",
                React.createElement("span", { className: "measure" }, "cases"),
                " to double"),
            "?")),
        cell: daysToDoubleGenerator((d) => d.totalCases, (d) => d.caseDoublingRange, CovidConstants_1.nouns.cases, casesDoubingBackgColorScale, casesDoubingTextColorScale),
    },
    daysToDoubleDeaths: {
        sortKey: CovidTypes_1.CovidSortKey.daysToDoubleDeaths,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.deaths()}`, sortKey: CovidTypes_1.CovidSortKey.daysToDoubleDeaths, colSpan: props.isMobile ? 2 : 1 }),
            "How long did it take for the number of",
            " ",
            React.createElement("strong", null,
                "total confirmed ",
                React.createElement("span", { className: "measure" }, "deaths"),
                " to double"),
            "?")),
        cell: daysToDoubleGenerator((d) => d.totalDeaths, (d) => d.deathDoublingRange, CovidConstants_1.nouns.deaths, deathsDoubingBackgColorScale, deathsDoubingTextColorScale),
    },
    totalCases: {
        sortKey: CovidTypes_1.CovidSortKey.totalCases,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.cases()}`, sortKey: CovidTypes_1.CovidSortKey.totalCases }),
            React.createElement("strong", null,
                "Total confirmed ",
                React.createElement("span", { className: "measure" }, "cases")),
            " ",
            React.createElement("br", null),
            React.createElement("span", { className: "note" },
                "JHU data.",
                " ",
                props.lastUpdated !== undefined ? (React.createElement(React.Fragment, null,
                    "Up to date for 10\u00A0AM (CET) on",
                    " ",
                    CovidUtils_1.formatDate(props.lastUpdated),
                    ".")) : undefined))),
        cell: totalGenerator((d) => d.totalCases, CovidConstants_1.nouns.cases),
    },
    totalDeaths: {
        sortKey: CovidTypes_1.CovidSortKey.totalDeaths,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.deaths()}`, sortKey: CovidTypes_1.CovidSortKey.totalDeaths }),
            React.createElement("strong", null,
                "Total confirmed ",
                React.createElement("span", { className: "measure" }, "deaths")),
            " ",
            React.createElement("br", null),
            React.createElement("span", { className: "note" },
                "JHU data.",
                " ",
                props.lastUpdated !== undefined ? (React.createElement(React.Fragment, null,
                    "Up to date for 10\u00A0AM (CET) on",
                    " ",
                    CovidUtils_1.formatDate(props.lastUpdated),
                    ".")) : undefined))),
        cell: totalGenerator((d) => d.totalDeaths, CovidConstants_1.nouns.deaths),
    },
    newCases: {
        sortKey: CovidTypes_1.CovidSortKey.newCases,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.cases()}`, sortKey: CovidTypes_1.CovidSortKey.newCases }),
            React.createElement("strong", null,
                "Daily new confirmed ",
                React.createElement("span", { className: "measure" }, "cases")),
            " ",
            React.createElement("br", null),
            React.createElement("span", { className: "note" },
                "JHU data.",
                " ",
                props.lastUpdated !== undefined ? (React.createElement(React.Fragment, null,
                    "Up to date for 10\u00A0AM (CET) on",
                    " ",
                    CovidUtils_1.formatDate(props.lastUpdated),
                    ".")) : undefined))),
        cell: newGenerator((d) => d.newCases, CovidConstants_1.nouns.cases),
    },
    newDeaths: {
        sortKey: CovidTypes_1.CovidSortKey.newDeaths,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.deaths()}`, sortKey: CovidTypes_1.CovidSortKey.newDeaths }),
            React.createElement("strong", null,
                "Daily new confirmed ",
                React.createElement("span", { className: "measure" }, "deaths")),
            " ",
            React.createElement("br", null),
            React.createElement("span", { className: "note" },
                "JHU data.",
                " ",
                props.lastUpdated !== undefined ? (React.createElement(React.Fragment, null,
                    "Up to date for 10\u00A0AM (CET) on",
                    " ",
                    CovidUtils_1.formatDate(props.lastUpdated),
                    ".")) : undefined))),
        cell: newGenerator((d) => d.newDeaths, CovidConstants_1.nouns.deaths),
    },
    totalTests: {
        sortKey: CovidTypes_1.CovidSortKey.totalTests,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.tests()}`, sortKey: CovidTypes_1.CovidSortKey.totalTests, colSpan: 2 }),
            React.createElement("strong", null,
                "Total ",
                React.createElement("span", { className: "measure" }, "tests")))),
        cell: (props) => {
            var _a, _b, _c, _d;
            return (React.createElement(React.Fragment, null,
                React.createElement("td", { className: `measure--${CovidConstants_1.nouns.tests()} total-tests`, rowSpan: 1 }, CovidUtils_1.formatInt((_b = (_a = props.datum.latestWithTests) === null || _a === void 0 ? void 0 : _a.tests) === null || _b === void 0 ? void 0 : _b.totalTests, "")),
                React.createElement("td", { className: `measure--${CovidConstants_1.nouns.tests()} total-tests-bar`, rowSpan: 1 }, ((_d = (_c = props.datum.latestWithTests) === null || _c === void 0 ? void 0 : _c.tests) === null || _d === void 0 ? void 0 : _d.totalTests) !==
                    undefined && (React.createElement("div", { className: "bar", style: {
                        backgroundColor: props.countryColors[props.datum.location],
                        width: `${props.totalTestsBarScale(props.datum.latestWithTests.tests
                            .totalTests) * 100}%`,
                    } })))));
        },
    },
    testDate: {
        sortKey: CovidTypes_1.CovidSortKey.testDate,
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.tests()}`, sortKey: CovidTypes_1.CovidSortKey.testDate }),
            React.createElement("strong", null, "Date"))),
        cell: (props) => {
            var _a;
            return (React.createElement("td", { className: "date", rowSpan: 1 }, CovidUtils_1.formatDate((_a = props.datum.latestWithTests) === null || _a === void 0 ? void 0 : _a.date, "")));
        },
    },
    testSource: {
        header: (props) => (React.createElement(CovidTableHeaderCell_1.CovidTableHeaderCell, Object.assign({}, props, { className: `measure--${CovidConstants_1.nouns.tests()}` }),
            React.createElement("strong", null, "Source"))),
        cell: (props) => {
            var _a;
            if (((_a = props.datum.latestWithTests) === null || _a === void 0 ? void 0 : _a.tests) === undefined)
                return React.createElement("td", null);
            const { date, tests } = props.datum.latestWithTests;
            const { sourceURL, sourceLabel, publicationDate, remarks, nonOfficial, } = tests;
            return (React.createElement("td", { className: "testing-notes" },
                React.createElement("span", { className: classnames_1.default("official", {
                        "is-official": !nonOfficial,
                    }) },
                    React.createElement(Tippy_1.Tippy, { content: React.createElement("div", { className: "covid-tooltip" },
                            React.createElement("a", { href: sourceURL }, sourceLabel),
                            React.createElement("br", null),
                            "Refers to: ",
                            CovidUtils_1.formatDate(date),
                            React.createElement("br", null),
                            "Published: ",
                            CovidUtils_1.formatDate(publicationDate),
                            React.createElement("br", null),
                            "Remarks: ",
                            remarks) },
                        React.createElement("span", null, nonOfficial ? (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExclamationCircle_1.faExclamationCircle })) : (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCheckCircle_1.faCheckCircle })))))));
        },
    },
};
//# sourceMappingURL=CovidTableColumns.js.map