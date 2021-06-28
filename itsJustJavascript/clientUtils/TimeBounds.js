"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeDomainFromQueryString = exports.timeBoundToTimeBoundString = exports.maxTimeToJSON = exports.minTimeToJSON = exports.maxTimeBoundFromJSONOrPositiveInfinity = exports.minTimeBoundFromJSONOrNegativeInfinity = exports.isPositiveInfinity = exports.isNegativeInfinity = exports.timeFromTimebounds = exports.TimeBoundValue = void 0;
const Util_1 = require("./Util");
const owidTypes_1 = require("./owidTypes");
/**
 * The two special TimeBound values: unbounded left & unbounded right.
 */
var TimeBoundValue;
(function (TimeBoundValue) {
    TimeBoundValue[TimeBoundValue["negativeInfinity"] = -Infinity] = "negativeInfinity";
    TimeBoundValue[TimeBoundValue["positiveInfinity"] = Infinity] = "positiveInfinity";
})(TimeBoundValue = exports.TimeBoundValue || (exports.TimeBoundValue = {}));
var TimeBoundValueStr;
(function (TimeBoundValueStr) {
    TimeBoundValueStr["unboundedLeft"] = "earliest";
    TimeBoundValueStr["unboundedRight"] = "latest";
})(TimeBoundValueStr || (TimeBoundValueStr = {}));
const timeFromTimebounds = (timeBound, fallbackTime) => (Math.abs(timeBound) !== Infinity ? timeBound : fallbackTime);
exports.timeFromTimebounds = timeFromTimebounds;
const hasAnInfinity = (timeBound) => exports.isNegativeInfinity(timeBound) || exports.isPositiveInfinity(timeBound);
const isNegativeInfinity = (timeBound) => timeBound === TimeBoundValue.negativeInfinity;
exports.isNegativeInfinity = isNegativeInfinity;
const isPositiveInfinity = (timeBound) => timeBound === TimeBoundValue.positiveInfinity;
exports.isPositiveInfinity = isPositiveInfinity;
const formatTimeBound = (timeBound) => {
    if (exports.isNegativeInfinity(timeBound))
        return TimeBoundValueStr.unboundedLeft;
    if (exports.isPositiveInfinity(timeBound))
        return TimeBoundValueStr.unboundedRight;
    return `${timeBound}`;
};
const parseTimeBound = (str) => {
    if (str === TimeBoundValueStr.unboundedLeft)
        return TimeBoundValue.negativeInfinity;
    if (str === TimeBoundValueStr.unboundedRight)
        return TimeBoundValue.positiveInfinity;
    return Util_1.parseIntOrUndefined(str);
};
// Use this to not repeat logic
const fromJSON = (value) => Util_1.isString(value) ? parseTimeBound(value) : value;
const toJSON = (bound) => {
    if (bound === undefined)
        return undefined;
    if (exports.isNegativeInfinity(bound))
        return TimeBoundValueStr.unboundedLeft;
    if (exports.isPositiveInfinity(bound))
        return TimeBoundValueStr.unboundedRight;
    return bound;
};
const minTimeBoundFromJSONOrNegativeInfinity = (minTime) => { var _a; return (_a = fromJSON(minTime)) !== null && _a !== void 0 ? _a : TimeBoundValue.negativeInfinity; };
exports.minTimeBoundFromJSONOrNegativeInfinity = minTimeBoundFromJSONOrNegativeInfinity;
const maxTimeBoundFromJSONOrPositiveInfinity = (maxTime) => { var _a; return (_a = fromJSON(maxTime)) !== null && _a !== void 0 ? _a : TimeBoundValue.positiveInfinity; };
exports.maxTimeBoundFromJSONOrPositiveInfinity = maxTimeBoundFromJSONOrPositiveInfinity;
exports.minTimeToJSON = toJSON;
exports.maxTimeToJSON = toJSON;
const reISODateComponent = new RegExp("\\d{4}-[01]\\d-[0-3]\\d");
const reISODate = new RegExp(`^(${reISODateComponent.source})$`);
const timeBoundToTimeBoundString = (timeBound, isDate) => {
    if (hasAnInfinity(timeBound))
        return formatTimeBound(timeBound);
    return isDate
        ? Util_1.formatDay(timeBound, { format: "YYYY-MM-DD" })
        : `${timeBound}`;
};
exports.timeBoundToTimeBoundString = timeBoundToTimeBoundString;
const parseTimeURIComponent = (param) => reISODate.test(param)
    ? Util_1.diffDateISOStringInDays(param, owidTypes_1.EPOCH_DATE)
    : parseTimeBound(param);
const upgradeLegacyTimeString = (time) => {
    // In the past we supported unbounded time parameters like time=2015.. which would be
    // equivalent to time=2015..latest. We don't actively generate these kinds of URL any
    // more because URLs ending with dots are not interpreted correctly by many services
    // (Twitter, Facebook and others) - but we still want to recognize incoming requests
    // for these "legacy" URLs!
    if (time === "..")
        return "earliest..latest";
    return time.endsWith("..")
        ? time + "latest"
        : time.startsWith("..")
            ? "earliest" + time
            : time;
};
const getTimeDomainFromQueryString = (time) => {
    var _a, _b, _c;
    time = upgradeLegacyTimeString(time);
    const reIntComponent = new RegExp("\\-?\\d+");
    const reIntRange = new RegExp(`^(${reIntComponent.source}|earliest)\\.\\.(${reIntComponent.source}|latest)$`);
    const reDateRange = new RegExp(`^(${reISODateComponent.source}|earliest)\\.\\.(${reISODateComponent.source}|latest)$`);
    if (reIntRange.test(time) || reDateRange.test(time)) {
        const [start, end] = time.split("..");
        return [
            (_a = parseTimeURIComponent(start)) !== null && _a !== void 0 ? _a : TimeBoundValue.negativeInfinity,
            (_b = parseTimeURIComponent(end)) !== null && _b !== void 0 ? _b : TimeBoundValue.positiveInfinity,
        ];
    }
    const timebound = (_c = parseTimeURIComponent(time)) !== null && _c !== void 0 ? _c : TimeBoundValue.positiveInfinity;
    return [timebound, timebound];
};
exports.getTimeDomainFromQueryString = getTimeDomainFromQueryString;
//# sourceMappingURL=TimeBounds.js.map