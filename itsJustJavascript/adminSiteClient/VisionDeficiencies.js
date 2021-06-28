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
exports.VisionDeficiencyDropdown = exports.VisionDeficiencySvgFilters = void 0;
const react_1 = __importDefault(require("react"));
const react_select_1 = __importStar(require("react-select"));
const classnames_1 = __importDefault(require("classnames"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Util_1 = require("../clientUtils/Util");
const react_select_2 = require("../clientUtils/react-select");
const visionDeficiencies = [
    // Color blindnesses first
    {
        id: "protanopia",
        name: "Protanopia",
        group: "Color blindness",
        alternativeName: "red-blind",
        affected: "1.3% male, 0.02% female",
        transformationMatrix: `
                0.567, 0.433, 0,     0, 0
                0.558, 0.442, 0,     0, 0
                0,     0.242, 0.758, 0, 0
                0,     0,     0,     1, 0
                `,
    },
    {
        id: "deuteranopia",
        name: "Deuteranopia",
        group: "Color blindness",
        alternativeName: "green-blind",
        affected: "1.2% male, 0.01% female",
        transformationMatrix: `
                0.625, 0.375, 0,   0, 0
                0.7,   0.3,   0,   0, 0
                0,     0.3,   0.7, 0, 0
                0,     0,     0,   1, 0
                `,
    },
    {
        id: "tritanopia",
        name: "Tritanopia",
        group: "Color blindness",
        alternativeName: "blue-blind",
        affected: "0.001% male, 0.03% female",
        transformationMatrix: `
                0.95, 0.05,  0,     0, 0
                0,    0.433, 0.567, 0, 0
                0,    0.475, 0.525, 0, 0
                0,    0,     0,     1, 0
                `,
    },
    {
        id: "achromatopsia",
        name: "Achromatopsia",
        group: "Color blindness",
        alternativeName: "total color blindness",
        affected: "0.003%",
        transformationMatrix: `
                0.299, 0.587, 0.114, 0, 0
                0.299, 0.587, 0.114, 0, 0
                0.299, 0.587, 0.114, 0, 0
                0,     0,     0,     1, 0
                `,
    },
    // Then weaknesses
    {
        id: "protanomaly",
        name: "Protanomaly",
        group: "Reduced vision",
        alternativeName: "red-weak",
        affected: "1.3% male, 0.02% female",
        transformationMatrix: `
                0.817, 0.183, 0,     0, 0
                0.333, 0.667, 0,     0, 0
                0,     0.125, 0.875, 0, 0
                0,     0,     0,     1, 0
                `,
    },
    {
        id: "deuteranomaly",
        name: "Deuteranomaly",
        group: "Reduced vision",
        alternativeName: "green-weak",
        affected: "5.0% male, 0.35% female",
        transformationMatrix: `
                0.8,   0.2,   0,     0, 0
                0.258, 0.742, 0,     0, 0
                0,     0.142, 0.858, 0, 0
                0,     0,     0,     1, 0
                `,
    },
    {
        id: "tritanomaly",
        name: "Tritanomaly",
        group: "Reduced vision",
        alternativeName: "blue-weak",
        affected: "0.0001% male, 0.0001% female",
        transformationMatrix: `
                0.967, 0.033, 0,     0, 0
                0,     0.733, 0.267, 0, 0
                0,     0.183, 0.817, 0, 0
                0,     0,     0,     1, 0
                `,
    },
    {
        id: "achromatomaly",
        name: "Achromatomaly",
        group: "Reduced vision",
        alternativeName: "weak color visibility",
        affected: "",
        transformationMatrix: `
                0.618, 0.320, 0.062, 0, 0
                0.163, 0.775, 0.062, 0, 0
                0.163, 0.320, 0.516, 0, 0
                0,     0,     0,     1, 0
                `,
    },
];
const VisionDeficiencySvgFilters = () => (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", version: "1.1", height: "0" },
    react_1.default.createElement("defs", null, visionDeficiencies.map((deficiency) => (react_1.default.createElement("filter", { id: deficiency.id, key: deficiency.id },
        react_1.default.createElement("feColorMatrix", { in: "SourceGraphic", type: "matrix", values: deficiency.transformationMatrix })))))));
exports.VisionDeficiencySvgFilters = VisionDeficiencySvgFilters;
const VisionDeficiencyOption = (props) => {
    var _a;
    return (react_1.default.createElement("div", { style: { fontSize: ".9em", lineHeight: 1 } },
        react_1.default.createElement(react_select_1.components.Option, Object.assign({}, props),
            react_1.default.createElement("label", null, props.label),
            ((_a = props.data.deficiency) === null || _a === void 0 ? void 0 : _a.affected) && (react_1.default.createElement("div", { className: classnames_1.default({ "text-muted": !props.isSelected }) },
                react_1.default.createElement("small", null,
                    "Affected: ",
                    props.data.deficiency.affected))))));
};
let VisionDeficiencyDropdown = class VisionDeficiencyDropdown extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.noDeficiencyOption = {
            label: "No deficiencies",
            value: "none",
        };
    }
    get options() {
        const options = visionDeficiencies.map((deficiency) => ({
            label: `${deficiency.name} (${deficiency.alternativeName})`,
            value: deficiency.id,
            deficiency,
        }));
        const grouped = Util_1.groupBy(options, (option) => option.deficiency.group);
        const selectGroups = Object.entries(grouped).map(([label, options]) => ({ label, options }));
        return [
            {
                label: "No deficiencies",
                options: [this.noDeficiencyOption],
            },
            ...selectGroups,
        ];
    }
    onChange(selected) {
        const value = Util_1.first(react_select_2.asArray(selected));
        if (value)
            this.props.onChange(value);
    }
    render() {
        return (react_1.default.createElement(react_select_1.default, { options: this.options, onChange: this.onChange, defaultValue: this.noDeficiencyOption, menuPlacement: "top", components: {
                Option: VisionDeficiencyOption,
            }, styles: react_select_2.getStylesForTargetHeight(30) }));
    }
};
__decorate([
    mobx_1.computed
], VisionDeficiencyDropdown.prototype, "options", null);
__decorate([
    mobx_1.action.bound
], VisionDeficiencyDropdown.prototype, "onChange", null);
VisionDeficiencyDropdown = __decorate([
    mobx_react_1.observer
], VisionDeficiencyDropdown);
exports.VisionDeficiencyDropdown = VisionDeficiencyDropdown;
//# sourceMappingURL=VisionDeficiencies.js.map