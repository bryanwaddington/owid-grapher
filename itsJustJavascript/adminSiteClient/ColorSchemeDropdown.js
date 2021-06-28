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
exports.ColorSchemeDropdown = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const react_select_1 = __importDefault(require("react-select"));
const ColorSchemes_1 = require("../grapher/color/ColorSchemes");
const mobx_react_1 = require("mobx-react");
const decko_1 = require("decko");
const react_select_2 = require("../clientUtils/react-select");
const Util_1 = require("../clientUtils/Util");
let ColorSchemeDropdown = class ColorSchemeDropdown extends React.Component {
    get additionalOptions() {
        return this.props.additionalOptions;
    }
    get gradientColorCount() {
        return this.props.gradientColorCount;
    }
    get colorSchemeOptions() {
        return Object.entries(ColorSchemes_1.ColorSchemes)
            .filter(([, v]) => v !== undefined)
            .map(([key, scheme]) => {
            return {
                colorScheme: scheme,
                gradient: this.createLinearGradient(scheme, this.gradientColorCount),
                label: scheme.name,
                value: key,
            };
        });
    }
    get allOptions() {
        const { additionalOptions } = this;
        return additionalOptions.concat(this.colorSchemeOptions);
    }
    createLinearGradient(colorScheme, count) {
        const colors = colorScheme.getColors(count);
        const step = 100 / count;
        const gradientEntries = colors.map((color, i) => `${color} ${i * step}%, ${color} ${(i + 1) * step}%`);
        return `linear-gradient(90deg, ${gradientEntries.join(", ")})`;
    }
    onChange(selected) {
        const value = Util_1.first(react_select_2.asArray(selected));
        if (value)
            this.props.onChange(value);
    }
    formatOptionLabel(option) {
        const { invertedColorScheme } = this.props;
        return (React.createElement("div", { style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            } },
            React.createElement("div", null, option.label),
            option.gradient && (React.createElement("span", { style: {
                    backgroundImage: option.gradient,
                    width: "6rem",
                    height: "1.25rem",
                    border: "1px solid #aaa",
                    // Mirror the element if color schemes are inverted
                    transform: invertedColorScheme
                        ? "scaleX(-1)"
                        : undefined,
                } }))));
    }
    render() {
        return (React.createElement(react_select_1.default, { options: this.allOptions, formatOptionLabel: this.formatOptionLabel, onChange: this.onChange, value: this.allOptions.find((scheme) => scheme.value === this.props.value), components: {
                IndicatorSeparator: null,
            }, styles: {
                singleValue: (provided) => {
                    return Object.assign(Object.assign({}, provided), { width: "calc(100% - 10px)" });
                },
            }, menuPlacement: "auto" }));
    }
};
ColorSchemeDropdown.defaultProps = {
    additionalOptions: [],
    gradientColorCount: 6,
    invertedColorScheme: false,
};
__decorate([
    mobx_1.computed
], ColorSchemeDropdown.prototype, "additionalOptions", null);
__decorate([
    mobx_1.computed
], ColorSchemeDropdown.prototype, "gradientColorCount", null);
__decorate([
    mobx_1.computed
], ColorSchemeDropdown.prototype, "colorSchemeOptions", null);
__decorate([
    mobx_1.computed
], ColorSchemeDropdown.prototype, "allOptions", null);
__decorate([
    mobx_1.action.bound
], ColorSchemeDropdown.prototype, "onChange", null);
__decorate([
    decko_1.bind
], ColorSchemeDropdown.prototype, "formatOptionLabel", null);
ColorSchemeDropdown = __decorate([
    mobx_react_1.observer
], ColorSchemeDropdown);
exports.ColorSchemeDropdown = ColorSchemeDropdown;
//# sourceMappingURL=ColorSchemeDropdown.js.map