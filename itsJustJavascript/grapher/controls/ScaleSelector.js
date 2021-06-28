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
exports.ScaleSelector = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const GrapherConstants_1 = require("../core/GrapherConstants");
const classnames_1 = __importDefault(require("classnames"));
const Util_1 = require("../../clientUtils/Util");
let ScaleSelector = class ScaleSelector extends React.Component {
    onClick() {
        var _a, _b;
        const manager = (_a = this.props.manager) !== null && _a !== void 0 ? _a : {};
        manager.scaleType = Util_1.next([GrapherConstants_1.ScaleType.linear, GrapherConstants_1.ScaleType.log], (_b = manager.scaleType) !== null && _b !== void 0 ? _b : GrapherConstants_1.ScaleType.linear);
    }
    render() {
        const { manager, prefix } = this.props;
        const { scaleType } = manager !== null && manager !== void 0 ? manager : {};
        return (React.createElement("span", { onClick: this.onClick, className: classnames_1.default(["clickable", "toggleSwitch"]) },
            React.createElement("span", { "data-track-note": "chart-toggle-scale", className: "leftToggle " +
                    (scaleType === GrapherConstants_1.ScaleType.linear ? "activeToggle" : "") },
                prefix,
                "Linear"),
            React.createElement("span", { "data-track-note": "chart-toggle-scale", className: "rightToggle " +
                    (scaleType === GrapherConstants_1.ScaleType.log ? "activeToggle" : "") },
                prefix,
                "Log")));
    }
};
__decorate([
    mobx_1.action.bound
], ScaleSelector.prototype, "onClick", null);
ScaleSelector = __decorate([
    mobx_react_1.observer
], ScaleSelector);
exports.ScaleSelector = ScaleSelector;
//# sourceMappingURL=ScaleSelector.js.map