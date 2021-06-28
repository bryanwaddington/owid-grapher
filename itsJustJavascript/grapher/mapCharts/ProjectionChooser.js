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
exports.ProjectionChooser = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_select_1 = __importDefault(require("react-select"));
const Util_1 = require("../../clientUtils/Util");
const MapProjections_1 = require("./MapProjections");
const react_select_2 = require("../../clientUtils/react-select");
let ProjectionChooser = class ProjectionChooser extends React.Component {
    onChange(selected) {
        var _a;
        const selectedValue = (_a = Util_1.first(react_select_2.asArray(selected))) === null || _a === void 0 ? void 0 : _a.value;
        if (selectedValue)
            this.props.onChange(selectedValue);
    }
    get options() {
        return Object.values(MapProjections_1.MapProjectionName).map((projectName) => {
            return {
                value: projectName,
                label: MapProjections_1.MapProjectionLabels[projectName],
            };
        });
    }
    render() {
        const { value } = this.props;
        const style = {
            fontSize: "0.75rem",
            pointerEvents: "auto",
        };
        return (React.createElement("div", { style: style },
            React.createElement(react_select_1.default, { options: this.options, onChange: this.onChange, value: this.options.find((opt) => opt.value === value), menuPlacement: "bottom", components: {
                    IndicatorSeparator: null,
                }, styles: react_select_2.getStylesForTargetHeight(22), isSearchable: false })));
    }
};
__decorate([
    mobx_1.action.bound
], ProjectionChooser.prototype, "onChange", null);
__decorate([
    mobx_1.computed
], ProjectionChooser.prototype, "options", null);
ProjectionChooser = __decorate([
    mobx_react_1.observer
], ProjectionChooser);
exports.ProjectionChooser = ProjectionChooser;
//# sourceMappingURL=ProjectionChooser.js.map