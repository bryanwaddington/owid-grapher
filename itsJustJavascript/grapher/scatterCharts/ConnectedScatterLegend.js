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
exports.ConnectedScatterLegend = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const Triangle_1 = require("./Triangle");
const TextWrap_1 = require("../text/TextWrap");
const GrapherConstants_1 = require("../core/GrapherConstants");
class ConnectedScatterLegend {
    constructor(manager) {
        this.manager = manager;
    }
    get fontSize() {
        var _a;
        return 0.7 * ((_a = this.manager.fontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE);
    }
    get fontColor() {
        return "#333";
    }
    get maxLabelWidth() {
        return this.manager.sidebarWidth / 3;
    }
    get startLabel() {
        const { manager, maxLabelWidth, fontSize } = this;
        return new TextWrap_1.TextWrap({
            text: manager.displayStartTime,
            fontSize,
            maxWidth: maxLabelWidth,
        });
    }
    get endLabel() {
        const { manager, maxLabelWidth, fontSize } = this;
        return new TextWrap_1.TextWrap({
            text: manager.displayEndTime,
            fontSize,
            maxWidth: maxLabelWidth,
        });
    }
    get width() {
        return this.manager.sidebarWidth;
    }
    get height() {
        return Math.max(this.startLabel.height, this.endLabel.height);
    }
    render(targetX, targetY, renderOptions = {}) {
        const { manager, startLabel, endLabel, fontColor } = this;
        const lineLeft = targetX + startLabel.width + 5;
        const lineRight = targetX + manager.sidebarWidth - endLabel.width - 5;
        const lineY = targetY + this.height / 2 - 0.5;
        return (React.createElement("g", Object.assign({ className: "ConnectedScatterLegend" }, renderOptions),
            React.createElement("rect", { x: targetX, y: targetY, width: this.width, height: this.height, fill: "#fff", opacity: 0 }),
            startLabel.render(targetX, targetY, { fill: fontColor }),
            endLabel.render(targetX + manager.sidebarWidth - endLabel.width, targetY, { fill: fontColor }),
            React.createElement("line", { x1: lineLeft, y1: lineY, x2: lineRight, y2: lineY, stroke: "#666", strokeWidth: 1 }),
            React.createElement("circle", { cx: lineLeft, cy: lineY, r: 2, fill: "#666", stroke: "#ccc", strokeWidth: 0.2 }),
            !manager.compareEndPointsOnly && (React.createElement(React.Fragment, null,
                React.createElement("circle", { cx: lineLeft + (lineRight - lineLeft) / 3, cy: lineY, r: 2, fill: "#666", stroke: "#ccc", strokeWidth: 0.2 }),
                React.createElement("circle", { cx: lineLeft + (2 * (lineRight - lineLeft)) / 3, cy: lineY, r: 2, fill: "#666", stroke: "#ccc", strokeWidth: 0.2 }))),
            React.createElement(Triangle_1.Triangle, { cx: lineRight, cy: lineY, r: 3, fill: "#666", stroke: "#ccc", strokeWidth: 0.2, transform: `rotate(${90}, ${lineRight}, ${lineY})` })));
    }
}
__decorate([
    mobx_1.computed
], ConnectedScatterLegend.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], ConnectedScatterLegend.prototype, "fontColor", null);
__decorate([
    mobx_1.computed
], ConnectedScatterLegend.prototype, "maxLabelWidth", null);
__decorate([
    mobx_1.computed
], ConnectedScatterLegend.prototype, "startLabel", null);
__decorate([
    mobx_1.computed
], ConnectedScatterLegend.prototype, "endLabel", null);
__decorate([
    mobx_1.computed
], ConnectedScatterLegend.prototype, "width", null);
__decorate([
    mobx_1.computed
], ConnectedScatterLegend.prototype, "height", null);
exports.ConnectedScatterLegend = ConnectedScatterLegend;
//# sourceMappingURL=ConnectedScatterLegend.js.map