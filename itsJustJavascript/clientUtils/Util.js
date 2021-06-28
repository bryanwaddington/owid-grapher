"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelativeMouse = exports.d3Format = exports.pairs = exports.without = exports.upperFirst = exports.uniqWith = exports.uniqBy = exports.uniq = exports.union = exports.toString = exports.throttle = exports.takeWhile = exports.sumBy = exports.sum = exports.startCase = exports.sortBy = exports.sampleSize = exports.sample = exports.reverse = exports.range = exports.pick = exports.partition = exports.orderBy = exports.once = exports.omit = exports.noop = exports.minBy = exports.min = exports.memoize = exports.maxBy = exports.max = exports.keyBy = exports.isString = exports.isNumber = exports.isEqual = exports.isEmpty = exports.invert = exports.identity = exports.groupBy = exports.flatten = exports.findIndex = exports.extend = exports.difference = exports.debounce = exports.countBy = exports.compact = exports.cloneDeep = exports.clone = exports.chunk = exports.capitalize = void 0;
exports.anyToString = exports.parseIntOrUndefined = exports.retryPromise = exports.addDays = exports.diffDateISOStringInDays = exports.dateDiffInDays = exports.getStartEndValues = exports.valuesByEntityWithinTimes = exports.valuesByEntityAtTimes = exports.es6mapValues = exports.findClosestTime = exports.findClosestTimeIndex = exports.makeGrid = exports.sampleFrom = exports.getRandomNumberGenerator = exports.stripHTML = exports.getCountryCodeFromNetlifyRedirect = exports.fetchText = exports.trimObject = exports.urlToSlug = exports.arrToCsvRow = exports.csvEscape = exports.isTouchDevice = exports.isMobile = exports.sortedFindClosest = exports.sortedFindClosestIndex = exports.pointsToPath = exports.TESTING_ONLY_reset_guid = exports.guid = exports.slugifySameCase = exports.slugify = exports.isVisible = exports.relativeMinAndMax = exports.makeAnnotationsSlug = exports.cagr = exports.domainExtent = exports.previous = exports.next = exports.mapToObjectLiteral = exports.lastOfNonEmptyArray = exports.firstOfNonEmptyArray = exports.excludeUndefined = exports.last = exports.first = exports.roundSigFig = exports.numberMagnitude = exports.formatYear = exports.formatDay = exports.makeSafeForCSS = exports.exposeInstanceOnWindow = void 0;
exports.wrapInDiv = exports.findDOMParent = exports.differenceObj = exports.isInIFrame = exports.omitUndefinedValues = exports.getClosestTimePairs = exports.logMe = exports.findIndexFast = exports.mapBy = exports.sortNumeric = exports.lowerCaseFirstLetterUnlessAbbreviation = exports.mapNullToUndefined = exports.getAttributesOfHTMLElement = exports.sortByUndefinedLast = exports.intersection = exports.intersectionOfSets = exports.oneOf = exports.linkify = exports.keyMap = exports.groupMap = exports.rollingMap = exports.scrollIntoViewIfNeeded = void 0;
// We're importing every item on its own to enable webpack tree shaking
const capitalize_1 = __importDefault(require("lodash/capitalize"));
exports.capitalize = capitalize_1.default;
const chunk_1 = __importDefault(require("lodash/chunk"));
exports.chunk = chunk_1.default;
const clone_1 = __importDefault(require("lodash/clone"));
exports.clone = clone_1.default;
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
exports.cloneDeep = cloneDeep_1.default;
const compact_1 = __importDefault(require("lodash/compact"));
exports.compact = compact_1.default;
const countBy_1 = __importDefault(require("lodash/countBy"));
exports.countBy = countBy_1.default;
const debounce_1 = __importDefault(require("lodash/debounce"));
exports.debounce = debounce_1.default;
const difference_1 = __importDefault(require("lodash/difference"));
exports.difference = difference_1.default;
const extend_1 = __importDefault(require("lodash/extend"));
exports.extend = extend_1.default;
const findIndex_1 = __importDefault(require("lodash/findIndex"));
exports.findIndex = findIndex_1.default;
const flatten_1 = __importDefault(require("lodash/flatten"));
exports.flatten = flatten_1.default;
const groupBy_1 = __importDefault(require("lodash/groupBy"));
exports.groupBy = groupBy_1.default;
const identity_1 = __importDefault(require("lodash/identity"));
exports.identity = identity_1.default;
const invert_1 = __importDefault(require("lodash/invert"));
exports.invert = invert_1.default;
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
exports.isEmpty = isEmpty_1.default;
const isEqual_1 = __importDefault(require("lodash/isEqual"));
exports.isEqual = isEqual_1.default;
const isNumber_1 = __importDefault(require("lodash/isNumber"));
exports.isNumber = isNumber_1.default;
const isObject_1 = __importDefault(require("lodash/isObject"));
const isString_1 = __importDefault(require("lodash/isString"));
exports.isString = isString_1.default;
const keyBy_1 = __importDefault(require("lodash/keyBy"));
exports.keyBy = keyBy_1.default;
const max_1 = __importDefault(require("lodash/max"));
exports.max = max_1.default;
const maxBy_1 = __importDefault(require("lodash/maxBy"));
exports.maxBy = maxBy_1.default;
const memoize_1 = __importDefault(require("lodash/memoize"));
exports.memoize = memoize_1.default;
const min_1 = __importDefault(require("lodash/min"));
exports.min = min_1.default;
const minBy_1 = __importDefault(require("lodash/minBy"));
exports.minBy = minBy_1.default;
const noop_1 = __importDefault(require("lodash/noop"));
exports.noop = noop_1.default;
const omit_1 = __importDefault(require("lodash/omit"));
exports.omit = omit_1.default;
const once_1 = __importDefault(require("lodash/once"));
exports.once = once_1.default;
const orderBy_1 = __importDefault(require("lodash/orderBy"));
exports.orderBy = orderBy_1.default;
const partition_1 = __importDefault(require("lodash/partition"));
exports.partition = partition_1.default;
const pick_1 = __importDefault(require("lodash/pick"));
exports.pick = pick_1.default;
const range_1 = __importDefault(require("lodash/range"));
exports.range = range_1.default;
const reverse_1 = __importDefault(require("lodash/reverse"));
exports.reverse = reverse_1.default;
const round_1 = __importDefault(require("lodash/round"));
const sample_1 = __importDefault(require("lodash/sample"));
exports.sample = sample_1.default;
const sampleSize_1 = __importDefault(require("lodash/sampleSize"));
exports.sampleSize = sampleSize_1.default;
const sortBy_1 = __importDefault(require("lodash/sortBy"));
exports.sortBy = sortBy_1.default;
const startCase_1 = __importDefault(require("lodash/startCase"));
exports.startCase = startCase_1.default;
const sum_1 = __importDefault(require("lodash/sum"));
exports.sum = sum_1.default;
const sumBy_1 = __importDefault(require("lodash/sumBy"));
exports.sumBy = sumBy_1.default;
const takeWhile_1 = __importDefault(require("lodash/takeWhile"));
exports.takeWhile = takeWhile_1.default;
const throttle_1 = __importDefault(require("lodash/throttle"));
exports.throttle = throttle_1.default;
const toString_1 = __importDefault(require("lodash/toString"));
exports.toString = toString_1.default;
const union_1 = __importDefault(require("lodash/union"));
exports.union = union_1.default;
const uniq_1 = __importDefault(require("lodash/uniq"));
exports.uniq = uniq_1.default;
const uniqBy_1 = __importDefault(require("lodash/uniqBy"));
exports.uniqBy = uniqBy_1.default;
const uniqWith_1 = __importDefault(require("lodash/uniqWith"));
exports.uniqWith = uniqWith_1.default;
const upperFirst_1 = __importDefault(require("lodash/upperFirst"));
exports.upperFirst = upperFirst_1.default;
const without_1 = __importDefault(require("lodash/without"));
exports.without = without_1.default;
const d3_array_1 = require("d3-array");
Object.defineProperty(exports, "pairs", { enumerable: true, get: function () { return d3_array_1.pairs; } });
const moment_1 = __importDefault(require("moment"));
const d3_format_1 = require("d3-format");
const striptags_1 = __importDefault(require("striptags"));
const url_parse_1 = __importDefault(require("url-parse"));
const html_1 = __importDefault(require("linkifyjs/html"));
const owidTypes_1 = require("./owidTypes");
const PointVector_1 = require("./PointVector");
const TimeBounds_1 = require("./TimeBounds");
// d3 v6 changed the default minus sign used in d3-format to "−" (Unicode minus sign), which looks
// nicer but can cause issues when copy-pasting values into a spreadsheet or script.
// For that reason we change that back to a plain old hyphen.
// See https://observablehq.com/@d3/d3v6-migration-guide#minus
exports.d3Format = d3_format_1.formatLocale({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    minus: "-",
    currency: ["$", ""],
}).format;
const getRelativeMouse = (node, event) => {
    const isTouchEvent = !!event.targetTouches;
    const eventOwner = isTouchEvent
        ? event.targetTouches[0]
        : event;
    const { clientX, clientY } = eventOwner;
    const svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
        const svgPoint = svg.createSVGPoint();
        svgPoint.x = clientX;
        svgPoint.y = clientY;
        const point = svgPoint.matrixTransform(node.getScreenCTM().inverse());
        return new PointVector_1.PointVector(point.x, point.y);
    }
    const rect = node.getBoundingClientRect();
    return new PointVector_1.PointVector(clientX - rect.left - node.clientLeft, clientY - rect.top - node.clientTop);
};
exports.getRelativeMouse = getRelativeMouse;
// Purely for local development time
const isStorybook = () => window.location.host.startsWith("localhost:6006") &&
    document.title === "Storybook";
// Just a quick and dirty way to expose window.chart/explorer/etc for debugging. Last caller wins.
const exposeInstanceOnWindow = (component, name = "chart", alsoOnTopWindow) => {
    if (typeof window === "undefined")
        return;
    const win = window;
    win[name] = component;
    alsoOnTopWindow =
        alsoOnTopWindow === undefined ? isStorybook() : alsoOnTopWindow;
    if (alsoOnTopWindow && win !== win.top)
        win.top[name] = component;
};
exports.exposeInstanceOnWindow = exposeInstanceOnWindow;
// Make an arbitrary string workable as a css class name
const makeSafeForCSS = (name) => name.replace(/[^a-z0-9]/g, (str) => {
    const char = str.charCodeAt(0);
    if (char === 32)
        return "-";
    if (char === 95)
        return "_";
    if (char >= 65 && char <= 90)
        return str;
    return "__" + ("000" + char.toString(16)).slice(-4);
});
exports.makeSafeForCSS = makeSafeForCSS;
function formatDay(dayAsYear, options) {
    var _a;
    const format = (_a = options === null || options === void 0 ? void 0 : options.format) !== null && _a !== void 0 ? _a : "MMM D, YYYY";
    // Use moments' UTC mode https://momentjs.com/docs/#/parsing/utc/
    // This will force moment to format in UTC time instead of local time,
    // making dates consistent no matter what timezone the user is in.
    return moment_1.default.utc(owidTypes_1.EPOCH_DATE).add(dayAsYear, "days").format(format);
}
exports.formatDay = formatDay;
const formatYear = (year) => {
    if (isNaN(year)) {
        console.warn(`Invalid year '${year}'`);
        return "";
    }
    return year < 0
        ? `${exports.d3Format(",.0f")(Math.abs(year))} BCE`
        : year.toString();
};
exports.formatYear = formatYear;
const numberMagnitude = (num) => {
    if (num === 0)
        return 0;
    const magnitude = Math.floor(Math.log10(Math.abs(num))) + 1;
    return Number.isFinite(magnitude) ? magnitude : 0;
};
exports.numberMagnitude = numberMagnitude;
const roundSigFig = (num, sigfigs = 1) => {
    if (num === 0)
        return 0;
    const magnitude = exports.numberMagnitude(num);
    return round_1.default(num, -magnitude + sigfigs);
};
exports.roundSigFig = roundSigFig;
const first = (arr) => arr[0];
exports.first = first;
const last = (arr) => arr[arr.length - 1];
exports.last = last;
const excludeUndefined = (arr) => arr.filter((x) => x !== undefined);
exports.excludeUndefined = excludeUndefined;
const firstOfNonEmptyArray = (arr) => {
    if (arr.length < 1)
        throw new Error("array is empty");
    return exports.first(arr);
};
exports.firstOfNonEmptyArray = firstOfNonEmptyArray;
const lastOfNonEmptyArray = (arr) => {
    if (arr.length < 1)
        throw new Error("array is empty");
    return exports.last(arr);
};
exports.lastOfNonEmptyArray = lastOfNonEmptyArray;
const mapToObjectLiteral = (map) => Array.from(map).reduce((objLit, [key, value]) => {
    objLit[key.toString()] = value;
    return objLit;
}, {});
exports.mapToObjectLiteral = mapToObjectLiteral;
function next(set, current) {
    let nextIndex = set.indexOf(current) + 1;
    nextIndex = nextIndex === -1 ? 0 : nextIndex;
    return set[nextIndex === set.length ? 0 : nextIndex];
}
exports.next = next;
const previous = (set, current) => {
    const nextIndex = set.indexOf(current) - 1;
    return set[nextIndex < 0 ? set.length - 1 : nextIndex];
};
exports.previous = previous;
// Calculate the extents of a set of numbers, with safeguards for log scales
const domainExtent = (numValues, scaleType, maxValueMultiplierForPadding = 1) => {
    const filterValues = scaleType === owidTypes_1.ScaleType.log ? numValues.filter((v) => v > 0) : numValues;
    const [minValue, maxValue] = d3_array_1.extent(filterValues);
    if (minValue !== undefined &&
        maxValue !== undefined &&
        isFinite(minValue) &&
        isFinite(maxValue)) {
        if (minValue !== maxValue) {
            return [minValue, maxValue * maxValueMultiplierForPadding];
        }
        else {
            // Only one value, make up a reasonable default
            return scaleType === owidTypes_1.ScaleType.log
                ? [minValue / 10, minValue * 10]
                : [minValue - 1, maxValue + 1];
        }
    }
    else {
        return scaleType === owidTypes_1.ScaleType.log ? [1, 100] : [-1, 1];
    }
};
exports.domainExtent = domainExtent;
// Todo: add unit tests
const cagrFromPoints = (startPoint, endPoint, property) => {
    const elapsed = endPoint.timeValue - startPoint.timeValue;
    if (!elapsed)
        return 0;
    return exports.cagr(startPoint[property], endPoint[property], elapsed);
};
const cagr = (startValue, endValue, yearsElapsed) => {
    const ratio = endValue / startValue;
    return (Math.sign(ratio) *
        (Math.pow(Math.abs(ratio), 1 / yearsElapsed) - 1) *
        100);
};
exports.cagr = cagr;
const makeAnnotationsSlug = (columnSlug) => `${columnSlug}-annotations`;
exports.makeAnnotationsSlug = makeAnnotationsSlug;
// Todo: add unit tests
const relativeMinAndMax = (points, property) => {
    let minChange = 0;
    let maxChange = 0;
    const filteredPoints = points.filter((point) => point.x !== 0 && point.y !== 0);
    for (let i = 0; i < filteredPoints.length; i++) {
        const indexValue = filteredPoints[i];
        for (let j = i + 1; j < filteredPoints.length; j++) {
            const targetValue = filteredPoints[j];
            if (targetValue.entityName !== indexValue.entityName)
                continue;
            const change = cagrFromPoints(indexValue, targetValue, property);
            if (change < minChange)
                minChange = change;
            if (change > maxChange)
                maxChange = change;
        }
    }
    return [minChange, maxChange];
};
exports.relativeMinAndMax = relativeMinAndMax;
const isVisible = (elm) => {
    if (!elm || !elm.getBoundingClientRect)
        return false;
    const rect = elm.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
};
exports.isVisible = isVisible;
// Take an arbitrary string and turn it into a nice url slug
const slugify = (str) => exports.slugifySameCase(str.toLowerCase());
exports.slugify = slugify;
const slugifySameCase = (str) => str
    .replace(/\s*\*.+\*/, "")
    .replace(/[^\w- ]+/g, "")
    .trim()
    .replace(/ +/g, "-");
exports.slugifySameCase = slugifySameCase;
// Unique number for this execution context
// Useful for coordinating between embeds to avoid conflicts in their ids
let _guid = 0;
const guid = () => ++_guid;
exports.guid = guid;
const TESTING_ONLY_reset_guid = () => (_guid = 0);
exports.TESTING_ONLY_reset_guid = TESTING_ONLY_reset_guid;
// Take an array of points and make it into an SVG path specification string
const pointsToPath = (points) => {
    let path = "";
    for (let i = 0; i < points.length; i++) {
        if (i === 0)
            path += `M${points[i][0]} ${points[i][1]}`;
        else
            path += `L${points[i][0]} ${points[i][1]}`;
    }
    return path;
};
exports.pointsToPath = pointsToPath;
// Based on https://stackoverflow.com/a/30245398/1983739
// In case of tie returns higher value
// todo: add unit tests
const sortedFindClosestIndex = (array, value, startIndex = 0, 
// non-inclusive end
endIndex = array.length) => {
    if (startIndex >= endIndex)
        return -1;
    if (value < array[startIndex])
        return startIndex;
    if (value > array[endIndex - 1])
        return endIndex - 1;
    let lo = startIndex;
    let hi = endIndex - 1;
    while (lo <= hi) {
        const mid = Math.round((hi + lo) / 2);
        if (value < array[mid]) {
            hi = mid - 1;
        }
        else if (value > array[mid]) {
            lo = mid + 1;
        }
        else {
            return mid;
        }
    }
    // lo == hi + 1
    return array[lo] - value < value - array[hi] ? lo : hi;
};
exports.sortedFindClosestIndex = sortedFindClosestIndex;
const sortedFindClosest = (array, value, startIndex, endIndex) => {
    const index = exports.sortedFindClosestIndex(array, value, startIndex, endIndex);
    return index !== -1 ? array[index] : undefined;
};
exports.sortedFindClosest = sortedFindClosest;
const isMobile = () => {
    var _a;
    return typeof window === "undefined"
        ? false
        : !!((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent.toLowerCase().includes("mobi"));
};
exports.isMobile = isMobile;
const isTouchDevice = () => !!("ontouchstart" in window);
exports.isTouchDevice = isTouchDevice;
// Escape a function for storage in a csv cell
const csvEscape = (value) => {
    const valueStr = toString_1.default(value);
    return valueStr.includes(",") ? `"${value.replace(/\"/g, '""')}"` : value;
};
exports.csvEscape = csvEscape;
const arrToCsvRow = (arr) => arr.map((x) => exports.csvEscape(x)).join(",") + "\n";
exports.arrToCsvRow = arrToCsvRow;
const urlToSlug = (url) => exports.last(url_parse_1.default(url)
    .pathname.split("/")
    .filter((x) => x));
exports.urlToSlug = urlToSlug;
// Removes all undefineds from an object.
const trimObject = (obj, trimStringEmptyStrings = false) => {
    const clone = {};
    for (const key in obj) {
        const val = obj[key];
        if (isObject_1.default(val) && isEmpty_1.default(val)) {
            // Drop empty objects
        }
        else if (trimStringEmptyStrings && val === "") {
        }
        else if (val !== undefined)
            clone[key] = obj[key];
    }
    return clone;
};
exports.trimObject = trimObject;
// TODO use fetchText() in fetchJSON()
// decided not to do this while implementing our COVID-19 page in order to prevent breaking something.
const fetchText = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.addEventListener("load", function () {
            resolve(this.responseText);
        });
        req.addEventListener("readystatechange", () => {
            if (req.readyState === 4) {
                if (req.status !== 200) {
                    reject(new Error(`${req.status} ${req.statusText}`));
                }
            }
        });
        req.open("GET", url);
        req.send();
    });
});
exports.fetchText = fetchText;
// todo: can we ditch this in favor of a simple fetch?
const getCountryCodeFromNetlifyRedirect = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            resolve(req.responseURL.split("?")[1]);
        });
        req.addEventListener("error", () => reject(new Error("Couldn't retrieve country code")));
        req.open("GET", "/detect-country-redirect");
        req.send();
    });
});
exports.getCountryCodeFromNetlifyRedirect = getCountryCodeFromNetlifyRedirect;
const stripHTML = (html) => striptags_1.default(html);
exports.stripHTML = stripHTML;
// Math.rand doesn't have between nor seed. Lodash's Random doesn't take a seed, making it bad for testing.
// So we have our own *very* psuedo-RNG.
const getRandomNumberGenerator = (min = 0, max = 100, seed = Date.now()) => () => {
    const semiRand = Math.sin(seed++) * 10000;
    return Math.floor(min + (max - min) * (semiRand - Math.floor(semiRand)));
};
exports.getRandomNumberGenerator = getRandomNumberGenerator;
const sampleFrom = (collection, howMany, seed) => shuffleArray(collection, seed).slice(0, howMany);
exports.sampleFrom = sampleFrom;
// A seeded array shuffle
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffleArray = (array, seed = Date.now()) => {
    const rand = exports.getRandomNumberGenerator(0, 100, seed);
    const clonedArr = array.slice();
    for (let index = clonedArr.length - 1; index > 0; index--) {
        const replacerIndex = Math.floor((rand() / 100) * (index + 1));
        [clonedArr[index], clonedArr[replacerIndex]] = [
            clonedArr[replacerIndex],
            clonedArr[index],
        ];
    }
    return clonedArr;
};
const makeGrid = (pieces) => {
    const columns = Math.ceil(Math.sqrt(pieces));
    const rows = Math.ceil(pieces / columns);
    return {
        columns,
        rows,
    };
};
exports.makeGrid = makeGrid;
const findClosestTimeIndex = (times, targetTime, tolerance) => {
    let closest;
    let closestIndex;
    for (let index = 0; index < times.length; index++) {
        const time = times[index];
        const currentTimeDist = Math.abs(time - targetTime);
        if (!currentTimeDist)
            return index; // Found the winner, stop searching.
        if (tolerance !== undefined && currentTimeDist > tolerance)
            continue;
        const closestTimeDist = closest
            ? Math.abs(closest - targetTime)
            : Infinity;
        if (closest === undefined ||
            closestTimeDist > currentTimeDist ||
            // Prefer later times, e.g. if targetTime is 2010, prefer 2011 to 2009
            (closestTimeDist === currentTimeDist && time > closest)) {
            closest = time;
            closestIndex = index;
        }
    }
    return closestIndex;
};
exports.findClosestTimeIndex = findClosestTimeIndex;
const findClosestTime = (times, targetTime, tolerance) => {
    if (TimeBounds_1.isNegativeInfinity(targetTime))
        return min_1.default(times);
    if (TimeBounds_1.isPositiveInfinity(targetTime))
        return max_1.default(times);
    const index = exports.findClosestTimeIndex(times, targetTime, tolerance);
    return index !== undefined ? times[index] : undefined;
};
exports.findClosestTime = findClosestTime;
// _.mapValues() equivalent for ES6 Maps
const es6mapValues = (input, mapper) => new Map(Array.from(input, ([key, value]) => {
    return [key, mapper(value, key)];
}));
exports.es6mapValues = es6mapValues;
const valuesAtTimes = (valueByTime, targetTimes, tolerance = 0) => {
    const times = Array.from(valueByTime.keys());
    return targetTimes.map((targetTime) => {
        const time = exports.findClosestTime(times, targetTime, tolerance);
        const value = time === undefined ? undefined : valueByTime.get(time);
        return {
            time,
            value,
        };
    });
};
const valuesByEntityAtTimes = (valueByEntityAndTime, targetTimes, tolerance = 0) => exports.es6mapValues(valueByEntityAndTime, (valueByTime) => valuesAtTimes(valueByTime, targetTimes, tolerance));
exports.valuesByEntityAtTimes = valuesByEntityAtTimes;
const valuesByEntityWithinTimes = (valueByEntityAndTimes, range) => {
    const start = range[0] !== undefined ? range[0] : -Infinity;
    const end = range[1] !== undefined ? range[1] : Infinity;
    return exports.es6mapValues(valueByEntityAndTimes, (valueByTime) => Array.from(valueByTime.keys())
        .filter((time) => time >= start && time <= end)
        .map((time) => ({
        time,
        value: valueByTime.get(time),
    })));
};
exports.valuesByEntityWithinTimes = valuesByEntityWithinTimes;
const getStartEndValues = (values) => [
    minBy_1.default(values, (dv) => dv.time),
    maxBy_1.default(values, (dv) => dv.time),
];
exports.getStartEndValues = getStartEndValues;
const MS_PER_DAY = 1000 * 60 * 60 * 24;
// From https://stackoverflow.com/a/15289883
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utca = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utcb = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utca - utcb) / MS_PER_DAY);
}
exports.dateDiffInDays = dateDiffInDays;
const diffDateISOStringInDays = (a, b) => moment_1.default.utc(a).diff(moment_1.default.utc(b), "days");
exports.diffDateISOStringInDays = diffDateISOStringInDays;
const addDays = (date, days) => {
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};
exports.addDays = addDays;
function retryPromise(promiseGetter, maxRetries = 3) {
    return __awaiter(this, void 0, void 0, function* () {
        let retried = 0;
        let lastError;
        while (retried++ < maxRetries) {
            try {
                return yield promiseGetter();
            }
            catch (error) {
                lastError = error;
            }
        }
        throw lastError;
    });
}
exports.retryPromise = retryPromise;
function parseIntOrUndefined(s) {
    if (s === undefined)
        return undefined;
    const value = parseInt(s);
    return isNaN(value) ? undefined : value;
}
exports.parseIntOrUndefined = parseIntOrUndefined;
const anyToString = (value) => (value === null || value === void 0 ? void 0 : value.toString) ? value.toString() : "";
exports.anyToString = anyToString;
// Scroll Helpers
// Borrowed from: https://github.com/JedWatson/react-select/blob/32ad5c040b/packages/react-select/src/utils.js
function isDocumentElement(el) {
    return [document.documentElement, document.body].indexOf(el) > -1;
}
function scrollTo(el, top) {
    // with a scroll distance, we perform scroll on the element
    if (isDocumentElement(el)) {
        window.scrollTo(0, top);
        return;
    }
    el.scrollTop = top;
}
function scrollIntoViewIfNeeded(containerEl, focusedEl) {
    const menuRect = containerEl.getBoundingClientRect();
    const focusedRect = focusedEl.getBoundingClientRect();
    const overScroll = focusedEl.offsetHeight / 3;
    if (focusedRect.bottom + overScroll > menuRect.bottom) {
        scrollTo(containerEl, Math.min(focusedEl.offsetTop +
            focusedEl.clientHeight -
            containerEl.offsetHeight +
            overScroll, containerEl.scrollHeight));
    }
    else if (focusedRect.top - overScroll < menuRect.top) {
        scrollTo(containerEl, Math.max(focusedEl.offsetTop - overScroll, 0));
    }
}
exports.scrollIntoViewIfNeeded = scrollIntoViewIfNeeded;
function rollingMap(array, mapper) {
    const result = [];
    if (array.length <= 1)
        return result;
    for (let i = 0; i < array.length - 1; i++) {
        result.push(mapper(array[i], array[i + 1]));
    }
    return result;
}
exports.rollingMap = rollingMap;
function groupMap(array, accessor) {
    const result = new Map();
    array.forEach((item) => {
        var _a;
        const key = accessor(item);
        if (result.has(key)) {
            (_a = result.get(key)) === null || _a === void 0 ? void 0 : _a.push(item);
        }
        else {
            result.set(key, [item]);
        }
    });
    return result;
}
exports.groupMap = groupMap;
function keyMap(array, accessor) {
    const result = new Map();
    array.forEach((item) => {
        const key = accessor(item);
        if (!result.has(key)) {
            result.set(key, item);
        }
    });
    return result;
}
exports.keyMap = keyMap;
const linkify = (str) => html_1.default(str);
exports.linkify = linkify;
const oneOf = (value, options, defaultOption) => {
    for (const option of options) {
        if (value === option)
            return option;
    }
    return defaultOption;
};
exports.oneOf = oneOf;
const intersectionOfSets = (sets) => {
    if (!sets.length)
        return new Set();
    const intersection = new Set(sets[0]);
    sets.slice(1).forEach((set) => {
        for (const elem of intersection) {
            if (!set.has(elem)) {
                intersection.delete(elem);
            }
        }
    });
    return intersection;
};
exports.intersectionOfSets = intersectionOfSets;
// ES6 is now significantly faster than lodash's intersection
const intersection = (...arrs) => {
    if (arrs.length === 0)
        return [];
    if (arrs.length === 1)
        return arrs[0];
    if (arrs.length === 2) {
        const set = new Set(arrs[0]);
        return arrs[1].filter((value) => set.has(value));
    }
    return exports.intersection(arrs[0], exports.intersection(...arrs.slice(1)));
};
exports.intersection = intersection;
function sortByUndefinedLast(array, accessor, order = owidTypes_1.SortOrder.asc) {
    const sorted = sortBy_1.default(array, (value) => {
        const mapped = accessor(value);
        if (mapped === undefined) {
            return order === owidTypes_1.SortOrder.asc ? Infinity : -Infinity;
        }
        return mapped;
    });
    return order === owidTypes_1.SortOrder.asc ? sorted : sorted.reverse();
}
exports.sortByUndefinedLast = sortByUndefinedLast;
function getAttributesOfHTMLElement(el) {
    const attributes = {};
    for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes.item(i);
        if (attr)
            attributes[attr.name] = attr.value;
    }
    return attributes;
}
exports.getAttributesOfHTMLElement = getAttributesOfHTMLElement;
const mapNullToUndefined = (array) => array.map((v) => (v === null ? undefined : v));
exports.mapNullToUndefined = mapNullToUndefined;
const lowerCaseFirstLetterUnlessAbbreviation = (str) => str.charAt(1).match(/[A-Z]/)
    ? str
    : str.charAt(0).toLowerCase() + str.slice(1);
exports.lowerCaseFirstLetterUnlessAbbreviation = lowerCaseFirstLetterUnlessAbbreviation;
/**
 * Use with caution - please note that this sort function only sorts on numeric data, and that sorts
 * **in-place** and **not stable**.
 * If you need a more general sort function that is stable and leaves the original array untouched,
 * please use lodash's `sortBy` instead. This function is faster, though.
 */
const sortNumeric = (arr, sortByFn = identity_1.default, sortOrder = owidTypes_1.SortOrder.asc) => arr.sort(sortOrder === owidTypes_1.SortOrder.asc
    ? (a, b) => sortByFn(a) - sortByFn(b)
    : (a, b) => sortByFn(b) - sortByFn(a));
exports.sortNumeric = sortNumeric;
const mapBy = (arr, keyAccessor, valueAccessor) => {
    const map = new Map();
    arr.forEach((val) => {
        map.set(keyAccessor(val), valueAccessor(val));
    });
    return map;
};
exports.mapBy = mapBy;
// Adapted from lodash baseFindIndex which is ~2x as fast as the wrapped findIndex
const findIndexFast = (array, predicate, fromIndex = 0, toIndex = array.length) => {
    let index = fromIndex;
    while (index < toIndex) {
        if (predicate(array[index], index))
            return index;
        index++;
    }
    return -1;
};
exports.findIndexFast = findIndexFast;
const logMe = (target, propertyName, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Running ${propertyName} with '${args}'`);
        return originalMethod.apply(this, args);
    };
    return descriptor;
};
exports.logMe = logMe;
function getClosestTimePairs(sortedTimesA, sortedTimesB, maxDiff = Infinity) {
    if (sortedTimesA.length === 0 || sortedTimesB.length === 0)
        return [];
    const decidedPairs = [];
    const undecidedPairs = [];
    let indexB = 0;
    for (let indexA = 0; indexA < sortedTimesA.length; indexA++) {
        const timeA = sortedTimesA[indexA];
        const closestIndexInB = exports.sortedFindClosestIndex(sortedTimesB, timeA, indexB);
        /**
         * the index that holds the value that is definitely lower than timeA, the candidate time
         */
        const lowCandidateIndexB = sortedTimesB[closestIndexInB] < timeA
            ? closestIndexInB
            : closestIndexInB > indexB
                ? closestIndexInB - 1
                : undefined;
        /**
         * the index that holds the value that is definitely equal to or greater than timeA, the candidate time
         */
        const highCandidateIndexB = sortedTimesB[closestIndexInB] >= timeA ? closestIndexInB : undefined;
        if (lowCandidateIndexB !== undefined &&
            highCandidateIndexB !== undefined &&
            timeA - sortedTimesB[lowCandidateIndexB] <= maxDiff &&
            timeA - sortedTimesB[lowCandidateIndexB] <
                sortedTimesB[highCandidateIndexB] - timeA) {
            decidedPairs.push([timeA, sortedTimesB[lowCandidateIndexB]]);
        }
        else if (highCandidateIndexB !== undefined &&
            timeA === sortedTimesB[highCandidateIndexB]) {
            decidedPairs.push([timeA, sortedTimesB[highCandidateIndexB]]);
        }
        else {
            if (lowCandidateIndexB !== undefined &&
                timeA - sortedTimesB[lowCandidateIndexB] <= maxDiff) {
                undecidedPairs.push([timeA, sortedTimesB[lowCandidateIndexB]]);
            }
            if (highCandidateIndexB !== undefined &&
                sortedTimesB[highCandidateIndexB] - timeA <= maxDiff) {
                undecidedPairs.push([timeA, sortedTimesB[highCandidateIndexB]]);
            }
        }
        indexB = closestIndexInB;
    }
    const seenTimes = new Set(flatten_1.default(decidedPairs));
    sortBy_1.default(undecidedPairs, (pair) => Math.abs(pair[0] - pair[1])).forEach((pair) => {
        if (!seenTimes.has(pair[0]) && !seenTimes.has(pair[1])) {
            decidedPairs.push(pair);
            seenTimes.add(pair[0]);
            seenTimes.add(pair[1]);
        }
    });
    return decidedPairs;
}
exports.getClosestTimePairs = getClosestTimePairs;
const omitUndefinedValues = (object) => {
    const result = {};
    for (const key in object) {
        if (object[key] !== undefined)
            result[key] = object[key];
    }
    return result;
};
exports.omitUndefinedValues = omitUndefinedValues;
const isInIFrame = () => {
    try {
        return window.self !== window.top;
    }
    catch (e) {
        return false;
    }
};
exports.isInIFrame = isInIFrame;
const differenceObj = (obj, defaultObj) => {
    const result = {};
    for (const key in obj) {
        if (defaultObj[key] !== obj[key]) {
            result[key] = obj[key];
        }
    }
    return result;
};
exports.differenceObj = differenceObj;
const findDOMParent = (el, condition) => {
    let current = el;
    while (current) {
        if (condition(current))
            return current;
        current = current.parentElement;
    }
    return null;
};
exports.findDOMParent = findDOMParent;
const wrapInDiv = (el, classes) => {
    if (!el.parentNode)
        return el;
    const wrapper = document.createElement("div");
    if (classes)
        wrapper.classList.add(...classes);
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    return wrapper;
};
exports.wrapInDiv = wrapInDiv;
//# sourceMappingURL=Util.js.map