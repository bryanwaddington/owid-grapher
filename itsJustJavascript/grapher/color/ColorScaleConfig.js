"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorScaleConfig = exports.ColorScaleConfigDefaults = void 0;
const mobx_1 = require("mobx");
const Persistable_1 = require("../persistable/Persistable");
const Util_1 = require("../../clientUtils/Util");
const BinningStrategy_1 = require("./BinningStrategy");
const ColorScale_1 = require("./ColorScale");
class ColorScaleConfigDefaults {
    constructor() {
        // Color scheme
        // ============
        /** Reverse the order of colors in the color scheme (defined by `baseColorScheme`) */
        this.colorSchemeInvert = undefined;
        // Numeric bins
        // ============
        /** The strategy for generating the bin boundaries */
        this.binningStrategy = BinningStrategy_1.BinningStrategy.ckmeans;
        /** Custom maximum brackets for each numeric bin. Only applied when strategy is `manual`. */
        this.customNumericValues = [];
        /**
         * Custom labels for each numeric bin. Only applied when strategy is `manual`.
         * `undefined` or `null` falls back to default label.
         * We need to handle `null` because JSON serializes `undefined` values
         * inside arrays into `null`.
         */
        this.customNumericLabels = [];
        /** Whether `customNumericColors` are used to override the color scheme. */
        this.customNumericColorsActive = undefined;
        /**
         * Override some or all colors for the numerical color legend.
         * `undefined` or `null` falls back the color scheme color.
         * We need to handle `null` because JSON serializes `undefined` values
         * inside arrays into `null`.
         */
        this.customNumericColors = [];
        /** Whether the visual scaling for the color legend is disabled. */
        this.equalSizeBins = undefined;
        // Categorical bins
        // ================
        this.customCategoryColors = {};
        this.customCategoryLabels = {};
        // Allow hiding categories from the legend
        this.customHiddenCategories = {};
        // Other
        // =====
        /** A custom legend description. Only used in ScatterPlot legend titles for now. */
        this.legendDescription = undefined;
    }
}
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "baseColorScheme", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "colorSchemeInvert", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "binningStrategy", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "binningStrategyBinCount", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "customNumericMinValue", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "customNumericValues", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "customNumericLabels", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "customNumericColorsActive", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "customNumericColors", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "equalSizeBins", void 0);
__decorate([
    mobx_1.observable.ref
], ColorScaleConfigDefaults.prototype, "customCategoryColors", void 0);
__decorate([
    mobx_1.observable.ref
], ColorScaleConfigDefaults.prototype, "customCategoryLabels", void 0);
__decorate([
    mobx_1.observable.ref
], ColorScaleConfigDefaults.prototype, "customHiddenCategories", void 0);
__decorate([
    mobx_1.observable
], ColorScaleConfigDefaults.prototype, "legendDescription", void 0);
exports.ColorScaleConfigDefaults = ColorScaleConfigDefaults;
class ColorScaleConfig extends ColorScaleConfigDefaults {
    updateFromObject(obj) {
        Util_1.extend(this, obj);
    }
    toObject() {
        const obj = Persistable_1.objectWithPersistablesToObject(this);
        Persistable_1.deleteRuntimeAndUnchangedProps(obj, new ColorScaleConfigDefaults());
        return Util_1.trimObject(obj);
    }
    constructor(obj) {
        super();
        Persistable_1.updatePersistables(this, obj);
    }
    static fromDSL(scale) {
        var _a, _b;
        const colorSchemeInvert = scale.colorScaleInvert;
        const baseColorScheme = scale.colorScaleScheme;
        const customNumericValues = [];
        const customNumericLabels = [];
        const customNumericColors = [];
        (_a = scale.colorScaleNumericBins) === null || _a === void 0 ? void 0 : _a.split(INTER_BIN_DELIMITER).forEach((bin) => {
            const [value, color, ...label] = bin.split(INTRA_BIN_DELIMITER);
            if (!value)
                return;
            customNumericValues.push(parseFloat(value));
            customNumericColors.push((color === null || color === void 0 ? void 0 : color.trim()) || undefined);
            customNumericLabels.push(label.join(INTRA_BIN_DELIMITER).trim() || undefined);
        });
        // TODO: once Grammar#parse() is called for all values, we can remove parseFloat() here
        // See issue: https://www.notion.so/owid/ColumnGrammar-parse-function-does-not-get-applied-67b578b8af7642c5859a1db79c8d5712
        const customNumericMinValue = scale.colorScaleNumericMinValue
            ? parseFloat(scale.colorScaleNumericMinValue)
            : undefined;
        const customNumericColorsActive = customNumericColors.length > 0 ? true : undefined;
        const customCategoryColors = {};
        const customCategoryLabels = {};
        (_b = scale.colorScaleCategoricalBins) === null || _b === void 0 ? void 0 : _b.split(INTER_BIN_DELIMITER).forEach((bin) => {
            const [value, color, ...label] = bin.split(INTRA_BIN_DELIMITER);
            if (!value)
                return;
            customCategoryColors[value] = (color === null || color === void 0 ? void 0 : color.trim()) || undefined;
            customCategoryLabels[value] =
                label.join(INTRA_BIN_DELIMITER).trim() || undefined;
        });
        if (scale.colorScaleNoDataLabel) {
            customCategoryLabels[ColorScale_1.NO_DATA_LABEL] = scale.colorScaleNoDataLabel;
        }
        // Use user-defined binning strategy, otherwise set to manual if user has
        // defined custom bins
        const binningStrategy = scale.colorScaleBinningStrategy
            ? scale.colorScaleBinningStrategy
            : scale.colorScaleNumericBins || scale.colorScaleCategoricalBins
                ? BinningStrategy_1.BinningStrategy.manual
                : undefined;
        const equalSizeBins = scale.colorScaleEqualSizeBins;
        const legendDescription = scale.colorScaleLegendDescription;
        const trimmed = Util_1.trimObject({
            colorSchemeInvert,
            baseColorScheme,
            binningStrategy,
            customNumericValues,
            customNumericColors,
            customNumericColorsActive,
            customNumericLabels,
            customNumericMinValue,
            customCategoryLabels,
            customCategoryColors,
            equalSizeBins,
            legendDescription,
        });
        return Util_1.isEmpty(trimmed) ? undefined : new ColorScaleConfig(trimmed);
    }
    toDSL() {
        const { colorSchemeInvert, baseColorScheme, binningStrategy, customNumericValues, customNumericColors, customNumericLabels, customNumericMinValue, customCategoryLabels, customCategoryColors, equalSizeBins, legendDescription, } = this.toObject();
        const columnColorScale = {
            colorScaleScheme: baseColorScheme,
            colorScaleInvert: colorSchemeInvert,
            colorScaleBinningStrategy: binningStrategy,
            colorScaleEqualSizeBins: equalSizeBins,
            colorScaleLegendDescription: legendDescription,
            colorScaleNumericMinValue: customNumericMinValue,
            colorScaleNumericBins: (customNumericValues !== null && customNumericValues !== void 0 ? customNumericValues : [])
                .map((value, index) => {
                var _a;
                return [
                    value,
                    (_a = customNumericColors[index]) !== null && _a !== void 0 ? _a : "",
                    customNumericLabels[index],
                ].join(INTRA_BIN_DELIMITER);
            })
                .join(INTER_BIN_DELIMITER),
            colorScaleNoDataLabel: customCategoryLabels[ColorScale_1.NO_DATA_LABEL],
            colorScaleCategoricalBins: Object.keys(customCategoryColors !== null && customCategoryColors !== void 0 ? customCategoryColors : {})
                .map((value) => [
                value,
                customCategoryColors[value],
                customCategoryLabels[value],
            ].join(INTRA_BIN_DELIMITER))
                .join(INTER_BIN_DELIMITER),
        };
        return Util_1.trimObject(columnColorScale);
    }
}
exports.ColorScaleConfig = ColorScaleConfig;
const INTER_BIN_DELIMITER = ";";
const INTRA_BIN_DELIMITER = ",";
//# sourceMappingURL=ColorScaleConfig.js.map