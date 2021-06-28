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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEntityButton = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
let AddEntityButton = class AddEntityButton extends React.Component {
    render() {
        return (React.createElement("button", { className: "addEntityButton clickable", onClick: () => mobx_1.runInAction(() => (this.props.manager.isSelectingData = true)), "data-track-note": "chart-add-entity" },
            React.createElement("span", { className: "icon" },
                React.createElement("svg", { width: 16, height: 16 },
                    React.createElement("path", { d: "M3,8 h10 m-5,-5 v10" }))),
            React.createElement("span", { className: "label" }, `Add ${this.props.manager.entityType || "data"}`)));
    }
};
AddEntityButton = __decorate([
    mobx_react_1.observer
], AddEntityButton);
exports.AddEntityButton = AddEntityButton;
//# sourceMappingURL=AddEntityButton.js.map