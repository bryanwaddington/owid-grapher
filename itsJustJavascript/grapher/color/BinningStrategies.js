"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinMaximums = exports.binningStrategyLabels = void 0;
const simple_statistics_1 = require("simple-statistics");
const d3_array_1 = require("d3-array");
const Util_1 = require("../../clientUtils/Util");
const BinningStrategy_1 = require("./BinningStrategy");
/** Human-readable labels for the binning strategies */
exports.binningStrategyLabels = {
    equalInterval: "Equal-interval",
    quantiles: "Quantiles",
    ckmeans: "Ckmeans",
    manual: "Manual",
};
function calcEqualIntervalStepSize(sortedValues, binCount, minBinValue) {
    if (!sortedValues.length)
        return 10;
    const stepSizeInitial = (Util_1.last(sortedValues) - minBinValue) / binCount;
    return Util_1.roundSigFig(stepSizeInitial, 1);
}
// Some algorithms can create bins that start & end at the same value.
// This also means the first bin can both start and end at the same value – the minimum
// value. This is why we uniq() and why we remove any values <= minimum value.
function normalizeBinValues(binValues, minBinValue) {
    const values = Util_1.uniq(Util_1.excludeUndefined(binValues));
    return minBinValue !== undefined
        ? values.filter((v) => v > minBinValue)
        : values;
}
function getBinMaximums(args) {
    var _a;
    const { binningStrategy, sortedValues, binCount, minBinValue } = args;
    const valueCount = sortedValues.length;
    if (valueCount < 1 || binCount < 1)
        return [];
    if (binningStrategy === BinningStrategy_1.BinningStrategy.ckmeans) {
        const clusters = simple_statistics_1.ckmeans(sortedValues, binCount > valueCount ? valueCount : binCount);
        return normalizeBinValues(clusters.map(Util_1.last), minBinValue);
    }
    else if (binningStrategy === BinningStrategy_1.BinningStrategy.quantiles) {
        return normalizeBinValues(d3_array_1.range(1, binCount + 1).map((v) => d3_array_1.quantile(sortedValues, v / binCount)), minBinValue);
    }
    else {
        // Equal-interval strategy by default
        const minValue = (_a = minBinValue !== null && minBinValue !== void 0 ? minBinValue : Util_1.first(sortedValues)) !== null && _a !== void 0 ? _a : 0;
        const binStepSize = calcEqualIntervalStepSize(sortedValues, binCount, minValue);
        return normalizeBinValues(d3_array_1.range(1, binCount + 1).map((n) => minValue + n * binStepSize), minBinValue);
    }
}
exports.getBinMaximums = getBinMaximums;
//# sourceMappingURL=BinningStrategies.js.map