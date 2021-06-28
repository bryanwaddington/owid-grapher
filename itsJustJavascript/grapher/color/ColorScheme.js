"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorScheme = void 0;
const d3_color_1 = require("d3-color");
const d3_interpolate_1 = require("d3-interpolate");
const Util_1 = require("../../clientUtils/Util");
const isPresent_1 = require("../../clientUtils/isPresent");
const ColorUtils_1 = require("./ColorUtils");
class ColorScheme {
    constructor(name, colorSets, singleColorScale, isDistinct) {
        this.name = name;
        this.colorSets = [];
        this.singleColorScale = !!singleColorScale;
        this.isDistinct = !!isDistinct;
        colorSets.forEach((set) => (this.colorSets[set.length] = set));
    }
    improviseGradientFromShorter(shortColors, numColors) {
        const newColors = Util_1.clone(shortColors);
        while (newColors.length < numColors) {
            for (let index = newColors.length - 1; index > 0; index -= 1) {
                const startColor = d3_color_1.rgb(newColors[index - 1]);
                const endColor = d3_color_1.rgb(newColors[index]);
                const newColor = d3_interpolate_1.interpolate(startColor, endColor)(0.5);
                newColors.splice(index, 0, newColor);
                if (newColors.length >= numColors)
                    break;
            }
        }
        return newColors;
    }
    improviseGradientFromLonger(knownColors, numColors) {
        const newColors = [];
        const scale = ColorUtils_1.interpolateArray(knownColors);
        for (let index = 0; index < numColors; index++) {
            newColors.push(scale(index / numColors));
        }
        return newColors;
    }
    getGradientColors(numColors) {
        const { colorSets } = this;
        if (colorSets[numColors])
            return Util_1.clone(colorSets[numColors]);
        const prevColors = Util_1.clone(colorSets)
            .reverse()
            .find((set) => set && set.length < numColors);
        if (prevColors)
            return this.improviseGradientFromShorter(prevColors, numColors);
        else
            return this.improviseGradientFromLonger(colorSets.find((set) => !!set), numColors);
    }
    getDistinctColors(numColors) {
        const { colorSets } = this;
        if (colorSets.length === 0)
            return [];
        if (colorSets[numColors])
            return Util_1.clone(colorSets[numColors]);
        if (numColors > colorSets.length - 1) {
            // If more colors are wanted than we have defined, have to improvise
            const colorSet = Util_1.lastOfNonEmptyArray(colorSets);
            return this.improviseGradientFromShorter(colorSet, numColors);
        }
        // We have enough colors but not a specific set for this number-- improvise from the closest longer set
        for (let i = numColors; i < colorSets.length; i++) {
            if (colorSets[i]) {
                return colorSets[i].slice(0, numColors);
            }
        }
        return [];
    }
    getColors(numColors) {
        return this.isDistinct
            ? this.getDistinctColors(numColors)
            : this.getGradientColors(numColors);
    }
    getUniqValueColorMap(uniqValues, inverseOrder) {
        const colors = this.getColors(uniqValues.length) || [];
        if (inverseOrder)
            colors.reverse();
        // We want to display same values using the same color, e.g. two values of 100 get the same shade of green
        // Therefore, we create a map from all possible (unique) values to the corresponding color
        const colorByValue = new Map();
        uniqValues.forEach((value, index) => colorByValue.set(value, colors[index]));
        return colorByValue;
    }
    assignColors(seriesArr, invertColorScheme = false, customColorMap = new Map(), seriesColorMap = new Map()) {
        seriesArr.forEach((series) => {
            const customColor = customColorMap.get(series.seriesName);
            if (customColor)
                seriesColorMap.set(series.seriesName, customColor);
        });
        this.updateColorMap(seriesArr, seriesColorMap, invertColorScheme);
        seriesArr.forEach((series) => {
            series.color = seriesColorMap.get(series.seriesName);
        });
    }
    updateColorMap(seriesArr, seriesColorMap, invertColorScheme = false) {
        // For names that don't have a color, assign one.
        seriesArr
            .map((series) => series.seriesName)
            .filter((name) => !seriesColorMap.has(name))
            .forEach((name) => {
            const availableColors = Util_1.lastOfNonEmptyArray(this.colorSets).slice();
            if (invertColorScheme)
                availableColors.reverse();
            const usedColors = Array.from(seriesColorMap.values()).filter(isPresent_1.isPresent);
            seriesColorMap.set(name, ColorUtils_1.getLeastUsedColor(availableColors, usedColors));
        });
    }
    static fromObject(name, colorSets, singleColorScale) {
        const colorSetsArray = [];
        Object.keys(colorSets).forEach((numColors) => (colorSetsArray[+numColors] = colorSets[numColors]));
        return new ColorScheme(name, colorSetsArray, singleColorScale);
    }
}
exports.ColorScheme = ColorScheme;
//# sourceMappingURL=ColorScheme.js.map