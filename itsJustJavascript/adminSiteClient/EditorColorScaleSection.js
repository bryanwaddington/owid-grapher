"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorColorScaleSection = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_select_1 = __importDefault(require("react-select"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faPlus_1 = require("@fortawesome/free-solid-svg-icons/faPlus");
const faMinus_1 = require("@fortawesome/free-solid-svg-icons/faMinus");
const ColorScaleBin_1 = require("../grapher/color/ColorScaleBin");
const Util_1 = require("../clientUtils/Util");
const react_select_2 = require("../clientUtils/react-select");
const Forms_1 = require("./Forms");
const ColorSchemeDropdown_1 = require("./ColorSchemeDropdown");
const BinningStrategies_1 = require("../grapher/color/BinningStrategies");
const BinningStrategy_1 = require("../grapher/color/BinningStrategy");
let EditorColorScaleSection = class EditorColorScaleSection extends React.Component {
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(ColorsSection, { scale: this.props.scale }),
            React.createElement(ColorLegendSection, { scale: this.props.scale, features: this.props.features })));
    }
};
EditorColorScaleSection = __decorate([
    mobx_react_1.observer
], EditorColorScaleSection);
exports.EditorColorScaleSection = EditorColorScaleSection;
let ColorLegendSection = class ColorLegendSection extends React.Component {
    onEqualSizeBins(isEqual) {
        this.props.scale.config.equalSizeBins = isEqual ? true : undefined;
    }
    onManualBins() {
        populateManualBinValuesIfAutomatic(this.props.scale);
    }
    render() {
        const { scale, features } = this.props;
        return (React.createElement(Forms_1.Section, { name: "Legend" },
            features.visualScaling && (React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.Toggle, { label: "Disable visual scaling of legend bins", value: !!scale.config.equalSizeBins, onValue: this.onEqualSizeBins }))),
            features.legendDescription && (React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.BindString, { label: "Legend description", field: "legendDescription", store: scale.config }))),
            scale.isManualBuckets ? (React.createElement(Forms_1.EditableList, null, scale.legendBins.map((bin, index) => (React.createElement(BinLabelView, { key: index, scale: scale, bin: bin, index: index }))))) : (React.createElement("button", { className: "btn btn-primary", onClick: this.onManualBins }, "Assign custom labels"))));
    }
};
__decorate([
    mobx_1.action.bound
], ColorLegendSection.prototype, "onEqualSizeBins", null);
__decorate([
    mobx_1.action.bound
], ColorLegendSection.prototype, "onManualBins", null);
ColorLegendSection = __decorate([
    mobx_react_1.observer
], ColorLegendSection);
let ColorsSection = class ColorsSection extends React.Component {
    onColorScheme(selected) {
        const { config } = this;
        if (selected.value === "custom")
            config.customNumericColorsActive = true;
        else {
            config.baseColorScheme = selected.value;
            config.customNumericColorsActive = undefined;
        }
    }
    onInvert(invert) {
        this.config.colorSchemeInvert = invert || undefined;
    }
    get scale() {
        return this.props.scale;
    }
    get config() {
        return this.scale.config;
    }
    onBinningStrategy(binningStrategy) {
        this.config.binningStrategy = react_select_2.asArray(binningStrategy)[0].value;
    }
    get currentColorScheme() {
        const { scale } = this;
        return scale.customNumericColorsActive
            ? "custom"
            : scale.baseColorScheme;
    }
    get binningStrategyOptions() {
        const options = Object.entries(BinningStrategies_1.binningStrategyLabels).map(([value, label]) => ({
            label: label,
            value: value,
        }));
        // Remove the manual binning strategy from the options if
        // no custom bin values are specified in the config.
        // Authors can still get into manual mode by selecting an
        // automatic binning strategy and editing the bins.
        if (!this.config.customNumericValues.length) {
            return options.filter(({ value }) => value !== BinningStrategy_1.BinningStrategy.manual);
        }
        return options;
    }
    get currentBinningStrategyOption() {
        return this.binningStrategyOptions.find((option) => option.value === this.config.binningStrategy);
    }
    render() {
        const { scale, config } = this;
        return (React.createElement(Forms_1.Section, { name: "Color scale" },
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Color scheme"),
                    React.createElement(ColorSchemeDropdown_1.ColorSchemeDropdown, { value: this.currentColorScheme, onChange: this.onColorScheme, invertedColorScheme: !!config.colorSchemeInvert, additionalOptions: [
                            {
                                colorScheme: undefined,
                                gradient: undefined,
                                label: "Custom",
                                value: "custom",
                            },
                        ] }))),
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.Toggle, { label: "Invert colors", value: config.colorSchemeInvert || false, onValue: this.onInvert })),
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Binning strategy"),
                    React.createElement(react_select_1.default, { options: this.binningStrategyOptions, onChange: this.onBinningStrategy, value: this.currentBinningStrategyOption, components: {
                            IndicatorSeparator: null,
                        }, menuPlacement: "auto", isSearchable: false }))),
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.BindAutoFloat, { field: "customNumericMinValue", store: config, label: "Minimum value", auto: scale.autoMinBinValue }),
                !scale.isManualBuckets && (React.createElement(Forms_1.BindAutoFloat, { field: "binningStrategyBinCount", store: config, label: "Target number of bins", auto: scale.numAutoBins }))),
            React.createElement(ColorSchemeEditor, { scale: scale })));
    }
};
__decorate([
    mobx_1.action.bound
], ColorsSection.prototype, "onColorScheme", null);
__decorate([
    mobx_1.action.bound
], ColorsSection.prototype, "onInvert", null);
__decorate([
    mobx_1.computed
], ColorsSection.prototype, "scale", null);
__decorate([
    mobx_1.computed
], ColorsSection.prototype, "config", null);
__decorate([
    mobx_1.action.bound
], ColorsSection.prototype, "onBinningStrategy", null);
__decorate([
    mobx_1.computed
], ColorsSection.prototype, "currentColorScheme", null);
__decorate([
    mobx_1.computed
], ColorsSection.prototype, "binningStrategyOptions", null);
__decorate([
    mobx_1.computed
], ColorsSection.prototype, "currentBinningStrategyOption", null);
ColorsSection = __decorate([
    mobx_react_1.observer
], ColorsSection);
let ColorSchemeEditor = class ColorSchemeEditor extends React.Component {
    render() {
        const { scale } = this.props;
        return (React.createElement("div", null,
            React.createElement(Forms_1.EditableList, { className: "ColorSchemeEditor" }, scale.legendBins.map((bin, index) => {
                if (bin instanceof ColorScaleBin_1.NumericBin)
                    return (React.createElement(NumericBinView, { key: index, scale: scale, bin: bin, index: index }));
                return (React.createElement(CategoricalBinView, { key: index, scale: scale, bin: bin }));
            }))));
    }
};
ColorSchemeEditor = __decorate([
    mobx_react_1.observer
], ColorSchemeEditor);
let BinLabelView = class BinLabelView extends React.Component {
    onLabel(value) {
        if (this.props.bin instanceof ColorScaleBin_1.NumericBin) {
            const { scale, index } = this.props;
            while (scale.config.customNumericLabels.length < scale.numBins)
                scale.config.customNumericLabels.push(undefined);
            scale.config.customNumericLabels[index] = value;
        }
        else {
            const { scale, bin } = this.props;
            const customCategoryLabels = Util_1.clone(scale.config.customCategoryLabels);
            customCategoryLabels[bin.value] = value;
            scale.config.customCategoryLabels = customCategoryLabels;
        }
    }
    render() {
        const { bin } = this.props;
        return (React.createElement(Forms_1.EditableListItem, { className: "BinLabelView" },
            React.createElement(Forms_1.FieldsRow, null,
                bin instanceof ColorScaleBin_1.NumericBin ? (React.createElement(Forms_1.NumberField, { value: bin.max, onValue: () => null, allowDecimal: true, allowNegative: true, disabled: true })) : (React.createElement(Forms_1.TextField, { value: bin.value, onValue: () => null, disabled: true })),
                React.createElement(Forms_1.TextField, { placeholder: "Custom label", value: bin.label, onValue: this.onLabel }))));
    }
};
__decorate([
    mobx_1.action.bound
], BinLabelView.prototype, "onLabel", null);
BinLabelView = __decorate([
    mobx_react_1.observer
], BinLabelView);
function populateManualBinValuesIfAutomatic(scale) {
    mobx_1.runInAction(() => {
        if (scale.config.binningStrategy !== BinningStrategy_1.BinningStrategy.manual) {
            scale.config.customNumericValues = scale.autoBinMaximums;
            scale.config.customNumericLabels = [];
            scale.config.binningStrategy = BinningStrategy_1.BinningStrategy.manual;
        }
    });
}
let NumericBinView = class NumericBinView extends React.Component {
    onColor(color) {
        const { scale, index } = this.props;
        if (!scale.customNumericColorsActive) {
            // Creating a new custom color scheme
            scale.config.customCategoryColors = {};
            scale.config.customNumericColors = [];
            scale.config.customNumericColorsActive = true;
        }
        while (scale.config.customNumericColors.length < scale.numBins)
            scale.config.customNumericColors.push(undefined);
        scale.config.customNumericColors[index] = color;
    }
    onMaximumValue(value) {
        const { scale, index } = this.props;
        populateManualBinValuesIfAutomatic(scale);
        if (value !== undefined)
            scale.config.customNumericValues[index] = value;
    }
    onLabel(value) {
        const { scale, index } = this.props;
        while (scale.config.customNumericLabels.length < scale.numBins)
            scale.config.customNumericLabels.push(undefined);
        scale.config.customNumericLabels[index] = value;
    }
    onRemove() {
        const { scale, index } = this.props;
        populateManualBinValuesIfAutomatic(scale);
        scale.config.customNumericValues.splice(index, 1);
        scale.config.customNumericColors.splice(index, 1);
    }
    onAddAfter() {
        var _a;
        const { scale, index } = this.props;
        const { customNumericValues, customNumericColors } = scale.config;
        const currentValue = customNumericValues[index];
        populateManualBinValuesIfAutomatic(scale);
        if (index === customNumericValues.length - 1)
            customNumericValues.push((_a = Util_1.last(scale.sortedNumericValues)) !== null && _a !== void 0 ? _a : currentValue);
        else {
            const newValue = (currentValue + customNumericValues[index + 1]) / 2;
            customNumericValues.splice(index + 1, 0, newValue);
            customNumericColors.splice(index + 1, 0, undefined);
        }
    }
    render() {
        const { scale, bin } = this.props;
        return (React.createElement(Forms_1.EditableListItem, { className: "numeric" },
            React.createElement("div", { className: "clickable", onClick: this.onAddAfter },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlus_1.faPlus })),
            React.createElement(Forms_1.ColorBox, { color: bin.color, onColor: this.onColor }),
            React.createElement("div", { className: "range" },
                React.createElement("span", null,
                    bin.props.isOpenLeft
                        ? "≤"
                        : bin.props.isFirst
                            ? "≥"
                            : ">",
                    bin.min,
                    " \u2060\u2013\u2060 ",
                    "≤"),
                React.createElement(Forms_1.NumberField, { value: bin.max, onValue: this.onMaximumValue, allowNegative: true, allowDecimal: true }),
                bin.props.isOpenRight && React.createElement("span", null, "and above")),
            scale.customNumericValues.length > 2 && (React.createElement("div", { className: "clickable", onClick: this.onRemove },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faMinus_1.faMinus })))));
    }
};
__decorate([
    mobx_1.action.bound
], NumericBinView.prototype, "onColor", null);
__decorate([
    mobx_1.action.bound
], NumericBinView.prototype, "onMaximumValue", null);
__decorate([
    mobx_1.action.bound
], NumericBinView.prototype, "onLabel", null);
__decorate([
    mobx_1.action.bound
], NumericBinView.prototype, "onRemove", null);
__decorate([
    mobx_1.action.bound
], NumericBinView.prototype, "onAddAfter", null);
NumericBinView = __decorate([
    mobx_react_1.observer
], NumericBinView);
let CategoricalBinView = class CategoricalBinView extends React.Component {
    onColor(color) {
        const { scale, bin } = this.props;
        if (!scale.customNumericColorsActive) {
            // Creating a new custom color scheme
            scale.config.customCategoryColors = {};
            scale.config.customNumericColors = [];
            scale.config.customNumericColorsActive = true;
        }
        const customCategoryColors = Util_1.clone(scale.config.customCategoryColors);
        if (color === undefined)
            delete customCategoryColors[bin.value];
        else
            customCategoryColors[bin.value] = color;
        scale.config.customCategoryColors = customCategoryColors;
    }
    onLabel(value) {
        const { scale, bin } = this.props;
        const customCategoryLabels = Util_1.clone(scale.config.customCategoryLabels);
        customCategoryLabels[bin.value] = value;
        scale.config.customCategoryLabels = customCategoryLabels;
    }
    onToggleHidden() {
        const { scale, bin } = this.props;
        const customHiddenCategories = Util_1.clone(scale.config.customHiddenCategories);
        if (bin.isHidden)
            delete customHiddenCategories[bin.value];
        else
            customHiddenCategories[bin.value] = true;
        scale.config.customHiddenCategories = customHiddenCategories;
    }
    render() {
        const { bin } = this.props;
        return (React.createElement(Forms_1.EditableListItem, { className: "categorical" },
            React.createElement(Forms_1.ColorBox, { color: bin.color, onColor: this.onColor }),
            React.createElement(Forms_1.TextField, { value: bin.value, disabled: true, onValue: Util_1.noop }),
            React.createElement(Forms_1.Toggle, { label: "Hide", value: !!bin.isHidden, onValue: this.onToggleHidden })));
    }
};
__decorate([
    mobx_1.action.bound
], CategoricalBinView.prototype, "onColor", null);
__decorate([
    mobx_1.action.bound
], CategoricalBinView.prototype, "onLabel", null);
__decorate([
    mobx_1.action.bound
], CategoricalBinView.prototype, "onToggleHidden", null);
CategoricalBinView = __decorate([
    mobx_react_1.observer
], CategoricalBinView);
//# sourceMappingURL=EditorColorScaleSection.js.map