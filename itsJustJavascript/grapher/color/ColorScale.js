"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorScale = exports.NO_DATA_LABEL = void 0;
const mobx_1 = require("mobx");
const d3_array_1 = require("d3-array");
const ColorScaleConfig_1 = require("./ColorScaleConfig");
const Util_1 = require("../../clientUtils/Util");
const ColorSchemes_1 = require("../color/ColorSchemes");
const ColorScaleBin_1 = require("./ColorScaleBin");
const ColorConstants_1 = require("./ColorConstants");
const BinningStrategies_1 = require("./BinningStrategies");
const BinningStrategy_1 = require("./BinningStrategy");
exports.NO_DATA_LABEL = "No data";
class ColorScale {
    constructor(manager = {}) {
        this.manager = manager;
    }
    // Config accessors
    get config() {
        var _a;
        return (_a = this.manager.colorScaleConfig) !== null && _a !== void 0 ? _a : new ColorScaleConfig_1.ColorScaleConfig();
    }
    get customNumericValues() {
        var _a;
        return (_a = this.config.customNumericValues) !== null && _a !== void 0 ? _a : [];
    }
    get customNumericColorsActive() {
        var _a;
        return (_a = this.config.customNumericColorsActive) !== null && _a !== void 0 ? _a : false;
    }
    get customNumericColors() {
        return this.customNumericColorsActive
            ? Util_1.mapNullToUndefined(this.config.customNumericColors)
            : [];
    }
    get customHiddenCategories() {
        var _a;
        return (_a = this.config.customHiddenCategories) !== null && _a !== void 0 ? _a : {};
    }
    get customNumericLabels() {
        if (!this.isManualBuckets)
            return [];
        const labels = Util_1.mapNullToUndefined(mobx_1.toJS(this.config.customNumericLabels)) || [];
        while (labels.length < this.numBins)
            labels.push(undefined);
        return labels;
    }
    get isColorSchemeInverted() {
        var _a;
        return (_a = this.config.colorSchemeInvert) !== null && _a !== void 0 ? _a : false;
    }
    get customCategoryLabels() {
        var _a;
        return (_a = this.config.customCategoryLabels) !== null && _a !== void 0 ? _a : {};
    }
    get baseColorScheme() {
        var _a, _b;
        return ((_b = (_a = this.config.baseColorScheme) !== null && _a !== void 0 ? _a : this.manager.defaultBaseColorScheme) !== null && _b !== void 0 ? _b : ColorConstants_1.ColorSchemeName.BuGn);
    }
    get defaultColorScheme() {
        return ColorSchemes_1.ColorSchemes[ColorConstants_1.ColorSchemeName.BuGn];
    }
    get defaultNoDataColor() {
        var _a;
        return (_a = this.manager.defaultNoDataColor) !== null && _a !== void 0 ? _a : "#eee";
    }
    get colorScaleColumn() {
        return this.manager.colorScaleColumn;
    }
    get legendDescription() {
        return this.config.legendDescription;
    }
    // Transforms
    get hasNoDataBin() {
        return this.manager.hasNoDataBin || false;
    }
    get sortedNumericValues() {
        var _a, _b, _c;
        return ((_c = (_b = (_a = this.colorScaleColumn) === null || _a === void 0 ? void 0 : _a.valuesAscending) === null || _b === void 0 ? void 0 : _b.filter((x) => typeof x === "number")) !== null && _c !== void 0 ? _c : []);
    }
    get minPossibleValue() {
        return Util_1.first(this.sortedNumericValues);
    }
    get maxPossibleValue() {
        return Util_1.last(this.sortedNumericValues);
    }
    get categoricalValues() {
        var _a, _b;
        return (_b = (_a = this.colorScaleColumn) === null || _a === void 0 ? void 0 : _a.sortedUniqNonEmptyStringVals) !== null && _b !== void 0 ? _b : [];
    }
    get colorScheme() {
        var _a;
        return (_a = ColorSchemes_1.ColorSchemes[this.baseColorScheme]) !== null && _a !== void 0 ? _a : this.defaultColorScheme;
    }
    get singleColorScale() {
        return this.colorScheme.singleColorScale;
    }
    get autoMinBinValue() {
        const minValue = Math.min(0, this.sortedNumericValuesWithoutOutliers[0]);
        return isNaN(minValue) ? 0 : Util_1.roundSigFig(minValue, 1);
    }
    get minBinValue() {
        var _a;
        return (_a = this.config.customNumericMinValue) !== null && _a !== void 0 ? _a : this.autoMinBinValue;
    }
    get manualBinMaximums() {
        if (!this.sortedNumericValues.length || this.numBins <= 0)
            return [];
        const { numBins, customNumericValues } = this;
        let values = [...customNumericValues];
        while (values.length < numBins)
            values.push(0);
        while (values.length > numBins)
            values = values.slice(0, numBins);
        return values;
    }
    // When automatic classification is turned on, this takes the numeric map data
    // and works out some discrete ranges to assign colors to
    get autoBinMaximums() {
        return BinningStrategies_1.getBinMaximums({
            binningStrategy: this.config.binningStrategy,
            sortedValues: this.sortedNumericBinningValues,
            binCount: this.numAutoBins,
            minBinValue: this.minBinValue,
        });
    }
    get bucketMaximums() {
        return this.isManualBuckets
            ? this.manualBinMaximums
            : this.autoBinMaximums;
    }
    // Ensure there's always a custom color for "No data"
    get customCategoryColors() {
        return Object.assign({ [exports.NO_DATA_LABEL]: this.defaultNoDataColor }, this.config.customCategoryColors);
    }
    get noDataColor() {
        return this.customCategoryColors[exports.NO_DATA_LABEL];
    }
    get baseColors() {
        const { categoricalValues, colorScheme, bucketMaximums, isColorSchemeInverted, } = this;
        const numColors = bucketMaximums.length + categoricalValues.length;
        const colors = colorScheme.getColors(numColors);
        if (isColorSchemeInverted)
            Util_1.reverse(colors);
        return colors;
    }
    get numAutoBins() {
        var _a;
        return (_a = this.config.binningStrategyBinCount) !== null && _a !== void 0 ? _a : 5;
    }
    get isManualBuckets() {
        return this.config.binningStrategy === BinningStrategy_1.BinningStrategy.manual;
    }
    get numBins() {
        return this.isManualBuckets
            ? this.customNumericValues.length
            : this.numAutoBins;
    }
    // Exclude any major outliers for legend calculation (they will be relegated to open-ended bins)
    get sortedNumericValuesWithoutOutliers() {
        var _a, _b;
        const { sortedNumericValues } = this;
        if (!sortedNumericValues.length)
            return [];
        const sampleMean = d3_array_1.mean(sortedNumericValues);
        const sampleDeviation = (_a = d3_array_1.deviation(sortedNumericValues)) !== null && _a !== void 0 ? _a : 0;
        const withoutOutliers = sortedNumericValues.filter((d) => Math.abs(d - sampleMean) <= sampleDeviation * 2);
        // d3-array returns a deviation of `undefined` for arrays of length <= 1, so set it to 0 in that case
        const deviationWithoutOutliers = (_b = d3_array_1.deviation(withoutOutliers)) !== null && _b !== void 0 ? _b : 0;
        if (deviationWithoutOutliers === 0) {
            // if after removing outliers we end up in a state where the std. dev. is 0, i.e. we only
            // have one distinct value, then we actually want to _keep_ the outliers in
            return sortedNumericValues;
        }
        else
            return withoutOutliers;
    }
    /** Sorted numeric values passed onto the binning algorithms */
    get sortedNumericBinningValues() {
        return this.sortedNumericValuesWithoutOutliers.filter((v) => v > this.minBinValue);
    }
    get numericLegendBins() {
        const { customNumericLabels, minBinValue, minPossibleValue, maxPossibleValue, customNumericColors, bucketMaximums, baseColors, } = this;
        if (minPossibleValue === undefined || maxPossibleValue === undefined)
            return [];
        let min = minBinValue;
        return bucketMaximums.map((max, index) => {
            var _a, _b, _c, _d, _e;
            const baseColor = baseColors[index];
            const color = (_a = customNumericColors[index]) !== null && _a !== void 0 ? _a : baseColor;
            const label = customNumericLabels[index];
            const displayMin = (_c = (_b = this.colorScaleColumn) === null || _b === void 0 ? void 0 : _b.formatValueShort(min)) !== null && _c !== void 0 ? _c : min.toString();
            const displayMax = (_e = (_d = this.colorScaleColumn) === null || _d === void 0 ? void 0 : _d.formatValueShort(max)) !== null && _e !== void 0 ? _e : max.toString();
            const currentMin = min;
            min = max;
            return new ColorScaleBin_1.NumericBin({
                isFirst: index === 0,
                isOpenLeft: index === 0 && currentMin > minPossibleValue,
                isOpenRight: index === bucketMaximums.length - 1 &&
                    max < maxPossibleValue,
                min: currentMin,
                max,
                color,
                label,
                displayMin,
                displayMax,
            });
        });
    }
    get legendBins() {
        // todo: turn comment into unit test
        // Will eventually produce something like this:
        // [{ min: 10, max: 20, minText: "10%", maxText: "20%", color: '#faeaef' },
        //  { min: 20, max: 30, minText: "20%", maxText: "30%", color: '#fefabc' },
        //  { value: 'Foobar', text: "Foobar Boop", color: '#bbbbbb'}]
        return [
            ...this.numericLegendBins,
            ...this.categoricalLegendBins,
        ];
    }
    get categoricalLegendBins() {
        const { bucketMaximums, baseColors, hasNoDataBin, categoricalValues, customCategoryColors, customCategoryLabels, customHiddenCategories, } = this;
        let allCategoricalValues = categoricalValues;
        // Inject "No data" bin
        if (hasNoDataBin && !allCategoricalValues.includes(exports.NO_DATA_LABEL)) {
            // The color scheme colors get applied in order, starting from first, and we only use
            // as many colors as there are categorical values (excluding "No data").
            // So in order to leave it colorless, we want to append the "No data" label last.
            // -@danielgavrilov, 2020-06-02
            allCategoricalValues = [...allCategoricalValues, exports.NO_DATA_LABEL];
        }
        return allCategoricalValues.map((value, index) => {
            var _a, _b;
            const boundingOffset = Util_1.isEmpty(bucketMaximums)
                ? 0
                : bucketMaximums.length - 1;
            const baseColor = baseColors[index + boundingOffset];
            const color = (_a = customCategoryColors[value]) !== null && _a !== void 0 ? _a : baseColor;
            const label = (_b = customCategoryLabels[value]) !== null && _b !== void 0 ? _b : value;
            return new ColorScaleBin_1.CategoricalBin({
                index,
                value,
                color,
                label,
                isHidden: !!customHiddenCategories[value],
            });
        });
    }
    getColor(value) {
        var _a;
        return value === undefined
            ? this.noDataColor
            : (_a = this.legendBins.find((bin) => bin.contains(value))) === null || _a === void 0 ? void 0 : _a.color;
    }
}
__decorate([
    mobx_1.computed
], ColorScale.prototype, "config", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "customNumericValues", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "customNumericColorsActive", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "customNumericColors", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "customHiddenCategories", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "customNumericLabels", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "isColorSchemeInverted", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "customCategoryLabels", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "baseColorScheme", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "defaultColorScheme", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "defaultNoDataColor", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "colorScaleColumn", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "legendDescription", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "hasNoDataBin", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "sortedNumericValues", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "minPossibleValue", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "maxPossibleValue", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "categoricalValues", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "colorScheme", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "singleColorScale", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "autoMinBinValue", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "minBinValue", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "manualBinMaximums", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "autoBinMaximums", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "bucketMaximums", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "customCategoryColors", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "noDataColor", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "baseColors", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "numAutoBins", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "isManualBuckets", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "numBins", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "sortedNumericValuesWithoutOutliers", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "sortedNumericBinningValues", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "numericLegendBins", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "legendBins", null);
__decorate([
    mobx_1.computed
], ColorScale.prototype, "categoricalLegendBins", null);
exports.ColorScale = ColorScale;
//# sourceMappingURL=ColorScale.js.map