"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortAccessors = exports.getDoublingRange = exports.createNoun = exports.formatDate = exports.defaultTimeFormat = exports.formatInt = exports.inverseSortOrder = void 0;
const Util_1 = require("../../clientUtils/Util");
const d3_time_format_1 = require("d3-time-format");
const CoreTableConstants_1 = require("../../coreTable/CoreTableConstants");
const formatValue_1 = require("../../clientUtils/formatValue");
function inverseSortOrder(order) {
    return order === CoreTableConstants_1.SortOrder.asc ? CoreTableConstants_1.SortOrder.desc : CoreTableConstants_1.SortOrder.asc;
}
exports.inverseSortOrder = inverseSortOrder;
function formatInt(n, defaultValue = "", options = {}) {
    return n === undefined || isNaN(n)
        ? defaultValue
        : formatValue_1.formatValue(n, Object.assign({ numberPrefixes: false }, options));
}
exports.formatInt = formatInt;
exports.defaultTimeFormat = d3_time_format_1.utcFormat("%B %e");
function formatDate(date, defaultValue = "") {
    if (date === undefined)
        return defaultValue;
    return exports.defaultTimeFormat(date);
}
exports.formatDate = formatDate;
function createNoun(singular, plural) {
    return (num) => {
        if (num === 1)
            return singular;
        return plural;
    };
}
exports.createNoun = createNoun;
function getDoublingRange(series, accessor) {
    if (series.length > 1) {
        const latestDay = Util_1.maxBy(series, (d) => d.date);
        const latestValue = accessor(latestDay);
        if (latestValue === undefined)
            return undefined;
        const filteredSeries = series.filter((d) => {
            const value = accessor(d);
            return value && value <= latestValue / 2;
        });
        const halfDay = Util_1.maxBy(filteredSeries, (d) => d.date);
        if (halfDay === undefined)
            return undefined;
        const halfValue = accessor(halfDay);
        if (halfValue === undefined)
            return undefined;
        return {
            latestDay,
            halfDay,
            length: Util_1.dateDiffInDays(latestDay.date, halfDay.date),
            ratio: latestValue / halfValue,
        };
    }
    return undefined;
}
exports.getDoublingRange = getDoublingRange;
exports.sortAccessors = {
    location: (d) => d.location,
    totalCases: (d) => { var _a; return (_a = d.latest) === null || _a === void 0 ? void 0 : _a.totalCases; },
    newCases: (d) => { var _a; return (_a = d.latest) === null || _a === void 0 ? void 0 : _a.newCases; },
    totalDeaths: (d) => { var _a; return (_a = d.latest) === null || _a === void 0 ? void 0 : _a.totalDeaths; },
    newDeaths: (d) => { var _a; return (_a = d.latest) === null || _a === void 0 ? void 0 : _a.newDeaths; },
    daysToDoubleCases: (d) => d.caseDoublingRange
        ? d.caseDoublingRange.length - d.caseDoublingRange.ratio * 1e-4
        : undefined,
    daysToDoubleDeaths: (d) => d.deathDoublingRange
        ? d.deathDoublingRange.length - d.deathDoublingRange.ratio * 1e-4
        : undefined,
    totalTests: (d) => { var _a, _b; return (_b = (_a = d.latestWithTests) === null || _a === void 0 ? void 0 : _a.tests) === null || _b === void 0 ? void 0 : _b.totalTests; },
    testDate: (d) => { var _a; return (_a = d.latestWithTests) === null || _a === void 0 ? void 0 : _a.date; },
};
//# sourceMappingURL=CovidUtils.js.map