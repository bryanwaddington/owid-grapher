"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartPadding = exports.getFontSize = void 0;
const GrapherConstants_1 = require("../core/GrapherConstants");
// not sure if we want to do something more sophisticated
const getFontSize = (count, baseFontSize = GrapherConstants_1.BASE_FONT_SIZE, min = 8) => {
    if (count === 2)
        return baseFontSize;
    if (count < 5)
        return baseFontSize - 2;
    if (count < 10)
        return baseFontSize - 4;
    if (count < 17)
        return baseFontSize - 6;
    if (count < 36)
        return baseFontSize - 8;
    return min;
};
exports.getFontSize = getFontSize;
const getChartPadding = (count) => {
    if (count > 9) {
        return {
            rowPadding: 20,
            columnPadding: 20,
            outerPadding: 20,
        };
    }
    return {
        rowPadding: 40,
        columnPadding: 40,
        outerPadding: 20,
    };
};
exports.getChartPadding = getChartPadding;
//# sourceMappingURL=FacetChartUtils.js.map