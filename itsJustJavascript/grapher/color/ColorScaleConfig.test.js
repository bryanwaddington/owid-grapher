#! yarn testJest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinningStrategy_1 = require("./BinningStrategy");
const ColorConstants_1 = require("./ColorConstants");
const ColorScale_1 = require("./ColorScale");
const ColorScaleConfig_1 = require("./ColorScaleConfig");
it("can serialize for saving", () => {
    expect(new ColorScaleConfig_1.ColorScaleConfig().toObject()).toEqual({});
});
describe("fromDSL", () => {
    const colorScale = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
        colorScaleScheme: ColorConstants_1.ColorSchemeName.Magma,
        colorScaleInvert: true,
        // colorScaleBinningStrategy: undefined,
        colorScaleEqualSizeBins: true,
        colorScaleNumericMinValue: 0.5,
        colorScaleNumericBins: "1,#ddd,One;2,#eee,Two",
        colorScaleCategoricalBins: "one,#ddd,uno;two,#eee,dos",
        colorScaleNoDataLabel: "Datas missing",
        colorScaleLegendDescription: "Legend",
    });
    it("handles comprehensive test case", () => {
        expect(colorScale.baseColorScheme).toEqual(ColorConstants_1.ColorSchemeName.Magma);
        expect(colorScale.colorSchemeInvert).toBeTruthy();
        expect(colorScale.equalSizeBins).toBeTruthy();
        expect(colorScale.customNumericMinValue).toEqual(0.5);
        expect(colorScale.customCategoryLabels).toEqual({
            one: "uno",
            two: "dos",
            [ColorScale_1.NO_DATA_LABEL]: "Datas missing",
        });
        expect(colorScale.customCategoryColors).toEqual({
            one: "#ddd",
            two: "#eee",
        });
        expect(colorScale.legendDescription).toEqual("Legend");
    });
    it("returns undefined when called with empty object", () => {
        expect(ColorScaleConfig_1.ColorScaleConfig.fromDSL({})).toBeUndefined();
    });
    it("handles a custom binning strategy", () => {
        const colorScale = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleBinningStrategy: BinningStrategy_1.BinningStrategy.quantiles,
        });
        expect(colorScale === null || colorScale === void 0 ? void 0 : colorScale.binningStrategy).toEqual(BinningStrategy_1.BinningStrategy.quantiles);
    });
    it("automatically infers binningStrategy if custom colors (numeric)", () => {
        const numericScale = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleNumericBins: "1;2;3",
        });
        expect(numericScale.binningStrategy).toEqual(BinningStrategy_1.BinningStrategy.manual);
        expect(numericScale.customNumericValues).toEqual([1, 2, 3]);
        expect(numericScale.customNumericColorsActive).toBeTruthy();
    });
    it("automatically infers binningStrategy if custom colors (categorical)", () => {
        const categoricalScale = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleCategoricalBins: "1,,One;2,,Two;3,,Three",
        });
        expect(categoricalScale.binningStrategy).toEqual(BinningStrategy_1.BinningStrategy.manual);
        expect(categoricalScale.customCategoryLabels).toEqual({
            1: "One",
            2: "Two",
            3: "Three",
        });
    });
    it("handles omitting color and/or label from custom numeric bins", () => {
        const colorScale = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleNumericBins: "1;2;3",
        });
        expect(colorScale.customNumericValues).toEqual([1, 2, 3]);
        expect(colorScale.customNumericLabels).toEqual([
            undefined,
            undefined,
            undefined,
        ]);
        expect(colorScale.customNumericColors).toEqual([
            undefined,
            undefined,
            undefined,
        ]);
        const colorScale2 = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleNumericBins: "1,#ddd;2,#eee;3,#fff",
        });
        expect(colorScale2.customNumericValues).toEqual([1, 2, 3]);
        expect(colorScale2.customNumericColors).toEqual([
            "#ddd",
            "#eee",
            "#fff",
        ]);
        expect(colorScale2.customNumericLabels).toEqual([
            undefined,
            undefined,
            undefined,
        ]);
        const colorScale3 = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleNumericBins: "1,,One;2,,Two;3,,Three",
        });
        expect(colorScale3.customNumericValues).toEqual([1, 2, 3]);
        expect(colorScale3.customNumericColors).toEqual([
            undefined,
            undefined,
            undefined,
        ]);
        expect(colorScale3.customNumericLabels).toEqual(["One", "Two", "Three"]);
    });
    it("handles commas in labels", () => {
        const colorScale = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleNumericBins: "1,#ccc,a,label,with,commas",
        });
        expect(colorScale.customNumericLabels).toEqual(["a,label,with,commas"]);
    });
    it("trims whitespace in bin definitions", () => {
        const colorScale = ColorScaleConfig_1.ColorScaleConfig.fromDSL({
            colorScaleNumericBins: "1, #ccc, a label that may, have spaces  ",
            colorScaleCategoricalBins: "one, , a label that may, have spaces  ",
        });
        expect(colorScale.customNumericLabels).toEqual([
            "a label that may, have spaces",
        ]);
        expect(colorScale.customNumericColors).toEqual(["#ccc"]);
        expect(colorScale.customCategoryLabels).toEqual({
            one: "a label that may, have spaces",
        });
        expect(colorScale.customCategoryColors).toEqual({
            one: undefined,
        });
    });
});
//# sourceMappingURL=ColorScaleConfig.test.js.map