"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMissingValuesAsZeroes = exports.stackSeries = void 0;
const Util_1 = require("../../clientUtils/Util");
// This method shift up the Y Values of a Series with Points in place.
// Todo: use a lib?
const stackSeries = (seriesArr) => {
    seriesArr.forEach((series, seriesIndex) => {
        if (!seriesIndex)
            return; // The first series does not need to be shifted
        series.points.forEach((point, pointIndex) => {
            const pointBelowThisOne = seriesArr[seriesIndex - 1].points[pointIndex];
            point.valueOffset =
                pointBelowThisOne.value + pointBelowThisOne.valueOffset;
        });
    });
    return seriesArr;
};
exports.stackSeries = stackSeries;
// Adds a Y = 0 value for each missing x value (where X is usually Time)
const withMissingValuesAsZeroes = (seriesArr) => {
    const allXValuesSorted = Util_1.sortNumeric(Util_1.uniq(Util_1.flatten(seriesArr.map((series) => series.points)).map((point) => point.position)));
    return seriesArr.map((series) => {
        const pointsByPosition = Util_1.keyBy(series.points, "position");
        return Object.assign(Object.assign({}, series), { points: allXValuesSorted.map((position) => {
                var _a, _b;
                const point = pointsByPosition[position];
                const value = (_a = point === null || point === void 0 ? void 0 : point.value) !== null && _a !== void 0 ? _a : 0;
                const time = (_b = point === null || point === void 0 ? void 0 : point.time) !== null && _b !== void 0 ? _b : 0;
                return {
                    time,
                    position,
                    value,
                    valueOffset: 0,
                    fake: !point,
                };
            }) });
    });
};
exports.withMissingValuesAsZeroes = withMissingValuesAsZeroes;
//# sourceMappingURL=StackedUtils.js.map