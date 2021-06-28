"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValue = void 0;
const Util_1 = require("./Util");
// todo: Should this be numberSuffixes instead of Prefixes?
// todo: we should have unit tests for this one. lot's of great features but hard to see how to use all of them.
function formatValue(value, options) {
    var _a, _b, _c, _d, _e, _f, _g;
    const noTrailingZeroes = (_a = options.noTrailingZeroes) !== null && _a !== void 0 ? _a : true;
    const numberPrefixes = (_b = (options.numberPrefixes || options.shortNumberPrefixes)) !== null && _b !== void 0 ? _b : true;
    const shortNumberPrefixes = (_c = options.shortNumberPrefixes) !== null && _c !== void 0 ? _c : false;
    const showPlus = (_d = options.showPlus) !== null && _d !== void 0 ? _d : false;
    const numDecimalPlaces = (_e = options.numDecimalPlaces) !== null && _e !== void 0 ? _e : 2;
    const unit = (_f = options.unit) !== null && _f !== void 0 ? _f : "";
    const isNoSpaceUnit = (_g = options.noSpaceUnit) !== null && _g !== void 0 ? _g : unit[0] === "%";
    let output = value.toString();
    const absValue = Math.abs(value);
    if (!isNoSpaceUnit && numberPrefixes && absValue >= 1e6) {
        if (!isFinite(absValue))
            output = "Infinity";
        else if (absValue >= 1e12)
            output = formatValue(value / 1e12, Object.assign(Object.assign({}, options), { unit: shortNumberPrefixes ? "T" : "trillion", noSpaceUnit: shortNumberPrefixes, numDecimalPlaces: 2 }));
        else if (absValue >= 1e9)
            output = formatValue(value / 1e9, Object.assign(Object.assign({}, options), { unit: shortNumberPrefixes ? "B" : "billion", noSpaceUnit: shortNumberPrefixes, numDecimalPlaces: 2 }));
        else if (absValue >= 1e6)
            output = formatValue(value / 1e6, Object.assign(Object.assign({}, options), { unit: shortNumberPrefixes ? "M" : "million", noSpaceUnit: shortNumberPrefixes, numDecimalPlaces: 2 }));
    }
    else {
        const targetDigits = Math.pow(10, -numDecimalPlaces);
        if (value !== 0 && Math.abs(value) < targetDigits) {
            if (value < 0)
                output = `>-${targetDigits}`;
            else
                output = `<${targetDigits}`;
        }
        else
            output = Util_1.d3Format(`${showPlus ? "+" : ""},.${numDecimalPlaces}f`)(value);
        if (noTrailingZeroes) {
            // Convert e.g. 2.200 to 2.2
            const m = output.match(/(.*?[0-9,-]+.[0-9,]*?)0*$/);
            if (m)
                output = m[1];
            if (output[output.length - 1] === ".")
                output = output.slice(0, output.length - 1);
        }
    }
    if (unit === "$" || unit === "£")
        output = unit + output;
    else if (isNoSpaceUnit)
        output = output + unit;
    else if (unit.length > 0)
        output = output + " " + unit;
    return output;
}
exports.formatValue = formatValue;
//# sourceMappingURL=formatValue.js.map