#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ColorScaleBin_1 = require("../color/ColorScaleBin");
const HorizontalColorLegends_1 = require("./HorizontalColorLegends");
describe(HorizontalColorLegends_1.HorizontalNumericColorLegend, () => {
    test("can create one", () => {
        const bin = new ColorScaleBin_1.NumericBin({
            isFirst: false,
            isOpenLeft: false,
            isOpenRight: true,
            min: 0,
            max: 100,
            displayMin: "Zero",
            displayMax: "One hundred",
            color: "blue",
        });
        const legend = new HorizontalColorLegends_1.HorizontalNumericColorLegend({
            manager: { numericLegendData: [bin] },
        });
        expect(legend.height).toBeGreaterThan(0);
    });
});
describe(HorizontalColorLegends_1.HorizontalCategoricalColorLegend, () => {
    test("can create one", () => {
        const bin = new ColorScaleBin_1.CategoricalBin({
            index: 1,
            value: "North America",
            label: "100",
            color: "red",
        });
        const legend = new HorizontalColorLegends_1.HorizontalCategoricalColorLegend({
            manager: { categoricalLegendData: [bin] },
        });
        expect(legend.height).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=HorizontalColorLegends.test.js.map