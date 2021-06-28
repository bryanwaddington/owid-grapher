"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDarkColor = exports.getLeastUsedColor = exports.interpolateArray = void 0;
const d3_color_1 = require("d3-color");
const d3_interpolate_1 = require("d3-interpolate");
const Util_1 = require("../../clientUtils/Util");
const interpolateArray = (scaleArr) => {
    const N = scaleArr.length - 2; // -1 for spacings, -1 for number of interpolate fns
    const intervalWidth = 1 / N;
    const intervals = [];
    for (let i = 0; i <= N; i++) {
        intervals[i] = d3_interpolate_1.interpolate(d3_color_1.rgb(scaleArr[i]), d3_color_1.rgb(scaleArr[i + 1]));
    }
    return (t) => {
        if (t < 0 || t > 1)
            throw new Error("Outside the allowed range of [0, 1]");
        const i = Math.floor(t * N);
        const intervalOffset = i * intervalWidth;
        return intervals[i](t / intervalWidth - intervalOffset / intervalWidth);
    };
};
exports.interpolateArray = interpolateArray;
function getLeastUsedColor(availableColors, usedColors) {
    // If there are unused colors, return the first available
    const unusedColors = Util_1.difference(availableColors, usedColors);
    if (unusedColors.length > 0)
        return unusedColors[0];
    // If all colors are used, we want to count the times each color is used, and use the most
    // unused one.
    const colorCounts = Object.entries(Util_1.groupBy(usedColors)).map(([color, arr]) => [color, arr.length]);
    const mostUnusedColor = Util_1.minBy(colorCounts, ([, count]) => count);
    return mostUnusedColor[0];
}
exports.getLeastUsedColor = getLeastUsedColor;
// Taken from https://github.com/Qix-/color/blob/594a9af778f9a89541510bd1ae24061c82f24693/index.js#L287-L292
function isDarkColor(colorSpecifier) {
    var _a;
    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    const rgb = (_a = d3_color_1.color(colorSpecifier)) === null || _a === void 0 ? void 0 : _a.rgb();
    if (!rgb)
        return undefined;
    const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return yiq < 128;
}
exports.isDarkColor = isDarkColor;
//# sourceMappingURL=ColorUtils.js.map