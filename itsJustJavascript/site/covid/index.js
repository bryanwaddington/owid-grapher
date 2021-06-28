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
exports.runCovid = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const classnames_1 = __importDefault(require("classnames"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faCheckCircle_1 = require("@fortawesome/free-regular-svg-icons/faCheckCircle");
const faExclamationCircle_1 = require("@fortawesome/free-solid-svg-icons/faExclamationCircle");
const CovidTable_1 = require("./CovidTable");
const CovidTableColumns_1 = require("./CovidTableColumns");
const CovidTypes_1 = require("./CovidTypes");
const CovidFetch_1 = require("./CovidFetch");
const CovidUtils_1 = require("./CovidUtils");
const Tippy_1 = require("../../grapher/chart/Tippy");
const CoreTableConstants_1 = require("../../coreTable/CoreTableConstants");
const Util_1 = require("../../clientUtils/Util");
const CASE_THRESHOLD = 20;
const DEATH_THRESHOLD = 5;
const propsByMeasure = {
    cases: {
        loadData: CovidFetch_1.fetchJHUData,
        columns: [
            CovidTableColumns_1.CovidTableColumnKey.location,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleCases,
            CovidTableColumns_1.CovidTableColumnKey.totalCases,
            CovidTableColumns_1.CovidTableColumnKey.newCases,
        ],
        mobileColumns: [
            CovidTableColumns_1.CovidTableColumnKey.location,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleCases,
        ],
        defaultState: {
            sortKey: CovidTypes_1.CovidSortKey.daysToDoubleCases,
            sortOrder: CoreTableConstants_1.SortOrder.asc,
            truncate: true,
        },
        filter: (d) => d.location.indexOf("International") === -1 &&
            (d.latest && d.latest.totalCases !== undefined
                ? d.latest.totalCases >= CASE_THRESHOLD
                : false),
        footer: (React.createElement(React.Fragment, null,
            React.createElement("p", { className: "tiny" },
                "Countries with less than ",
                CASE_THRESHOLD,
                " confirmed cases are not shown. Cases from the Diamond Princess cruise ship are also not shown since these numbers are no longer changing over time."),
            React.createElement("p", null,
                "Data source:",
                " ",
                React.createElement("a", { href: "https://github.com/CSSEGISandData/COVID-19" }, "Johns Hopkins University CSSE"),
                ". Download the",
                " ",
                React.createElement("a", { href: "https://ourworldindata.org/coronavirus-source-data" }, "full dataset"),
                "."))),
    },
    deaths: {
        loadData: CovidFetch_1.fetchJHUData,
        columns: [
            CovidTableColumns_1.CovidTableColumnKey.location,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleDeaths,
            CovidTableColumns_1.CovidTableColumnKey.totalDeaths,
            CovidTableColumns_1.CovidTableColumnKey.newDeaths,
        ],
        mobileColumns: [
            CovidTableColumns_1.CovidTableColumnKey.location,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleDeaths,
        ],
        defaultState: {
            sortKey: CovidTypes_1.CovidSortKey.daysToDoubleDeaths,
            sortOrder: CoreTableConstants_1.SortOrder.asc,
            truncate: true,
        },
        filter: (d) => d.location.indexOf("International") === -1 &&
            (d.latest && d.latest.totalDeaths !== undefined
                ? d.latest.totalDeaths >= DEATH_THRESHOLD
                : false),
        footer: (React.createElement(React.Fragment, null,
            React.createElement("p", { className: "tiny" },
                "Countries with less than ",
                DEATH_THRESHOLD,
                " confirmed deaths are not shown. Deaths from the Diamond Princess cruise ship are also not shown since these numbers are no longer changing over time."),
            React.createElement("p", null,
                "Data source:",
                " ",
                React.createElement("a", { href: "https://github.com/CSSEGISandData/COVID-19" }, "Johns Hopkins University CSSE"),
                ". Download the",
                " ",
                React.createElement("a", { href: "https://ourworldindata.org/coronavirus-source-data" }, "full dataset"),
                "."))),
    },
    tests: {
        loadData: CovidFetch_1.fetchTestsData,
        columns: [
            CovidTableColumns_1.CovidTableColumnKey.locationTests,
            CovidTableColumns_1.CovidTableColumnKey.totalTests,
            CovidTableColumns_1.CovidTableColumnKey.testDate,
            // CovidTableColumnKey.testSource
        ],
        mobileColumns: [
            CovidTableColumns_1.CovidTableColumnKey.locationTests,
            CovidTableColumns_1.CovidTableColumnKey.totalTests,
        ],
        defaultState: {
            sortKey: CovidTypes_1.CovidSortKey.totalTests,
            sortOrder: CoreTableConstants_1.SortOrder.desc,
        },
        extraRow: (props) => {
            var _a;
            if (((_a = props.datum.latestWithTests) === null || _a === void 0 ? void 0 : _a.tests) === undefined)
                return undefined;
            const { date, tests } = props.datum.latestWithTests;
            const { sourceURL, sourceLabel, publicationDate, remarks, nonOfficial, } = tests;
            return (React.createElement("td", { colSpan: 3, className: "testing-notes" },
                React.createElement("span", { className: classnames_1.default("official", {
                        "is-official": !nonOfficial,
                    }) },
                    React.createElement(Tippy_1.Tippy, { content: React.createElement("div", { className: "covid-tooltip" },
                            "Refers to: ",
                            CovidUtils_1.formatDate(date),
                            React.createElement("br", null),
                            "Published: ",
                            CovidUtils_1.formatDate(publicationDate),
                            React.createElement("br", null),
                            "Remarks: ",
                            remarks) },
                        React.createElement("span", null, nonOfficial ? (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExclamationCircle_1.faExclamationCircle })) : (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCheckCircle_1.faCheckCircle }))))),
                React.createElement("span", { className: "source" },
                    React.createElement("a", { href: sourceURL }, sourceLabel)),
                React.createElement("br", null)));
        },
    },
    deathsAndCases: {
        loadData: CovidFetch_1.fetchJHUData,
        columns: [
            CovidTableColumns_1.CovidTableColumnKey.location,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleDeaths,
            CovidTableColumns_1.CovidTableColumnKey.totalDeaths,
            CovidTableColumns_1.CovidTableColumnKey.newDeaths,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleCases,
            CovidTableColumns_1.CovidTableColumnKey.totalCases,
            CovidTableColumns_1.CovidTableColumnKey.newCases,
        ],
        mobileColumns: [
            CovidTableColumns_1.CovidTableColumnKey.location,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleDeaths,
            CovidTableColumns_1.CovidTableColumnKey.daysToDoubleCases,
        ],
        defaultState: {
            sortKey: CovidTypes_1.CovidSortKey.totalDeaths,
            sortOrder: CoreTableConstants_1.SortOrder.desc,
            truncate: true,
        },
        filter: (d) => d.location.indexOf("International") === -1 &&
            (d.latest && d.latest.totalCases !== undefined
                ? d.latest.totalCases >= CASE_THRESHOLD
                : false),
        footer: (React.createElement(React.Fragment, null,
            React.createElement("p", { className: "tiny" },
                "Countries with less than ",
                CASE_THRESHOLD,
                " confirmed cases are not shown. Cases from the Diamond Princess cruise ship are also not shown since these numbers are no longer changing over time."),
            React.createElement("p", null,
                "Data source:",
                " ",
                React.createElement("a", { href: "https://github.com/CSSEGISandData/COVID-19" }, "Johns Hopkins University CSSE"),
                ". Download the",
                " ",
                React.createElement("a", { href: "https://ourworldindata.org/coronavirus-source-data" }, "full dataset"),
                "."))),
    },
};
function runCovid() {
    const elements = Array.from(document.querySelectorAll("*[data-covid-table], #covid-table-embed"));
    elements.forEach((element) => {
        const attr = element.getAttribute("data-measure");
        const measure = Util_1.oneOf(attr, ["tests", "deaths", "cases", "deathsAndCases"], "cases");
        ReactDOM.render(React.createElement(CovidTable_1.CovidTable, Object.assign({}, propsByMeasure[measure])), element);
    });
}
exports.runCovid = runCovid;
//# sourceMappingURL=index.js.map