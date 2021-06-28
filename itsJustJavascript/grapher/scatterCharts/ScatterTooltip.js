"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterTooltip = void 0;
const react_1 = __importDefault(require("react"));
const TextWrap_1 = require("../text/TextWrap");
const Util_1 = require("../../clientUtils/Util");
const mobx_react_1 = require("mobx-react");
let ScatterTooltip = class ScatterTooltip extends react_1.default.Component {
    formatValueY(value) {
        return "Y Axis: " + this.props.yColumn.formatValueLong(value.y);
    }
    formatValueX(value) {
        let s = `X Axis: ${this.props.xColumn.formatValueLong(value.x)}`;
        if (!value.time.span && value.time.y !== value.time.x)
            s += ` (data from ${this.props.xColumn.originalTimeColumn.formatValue(value.time.x)})`;
        return s;
    }
    render() {
        const { x, y, maxWidth, fontSize, series } = this.props;
        const lineHeight = 5;
        const firstValue = Util_1.first(series.points);
        const lastValue = Util_1.last(series.points);
        const values = Util_1.compact(Util_1.uniq([firstValue, lastValue]));
        const elements = [];
        let offset = 0;
        const heading = {
            x: x,
            y: y + offset,
            wrap: new TextWrap_1.TextWrap({
                maxWidth: maxWidth,
                fontSize: 0.75 * fontSize,
                text: series.label,
            }),
        };
        elements.push(heading);
        offset += heading.wrap.height + lineHeight;
        const { yColumn } = this.props;
        values.forEach((v) => {
            const year = {
                x: x,
                y: y + offset,
                wrap: new TextWrap_1.TextWrap({
                    maxWidth: maxWidth,
                    fontSize: 0.65 * fontSize,
                    text: v.time.span
                        ? `${yColumn.table.formatTime(v.time.span[0])} to ${yColumn.originalTimeColumn.formatValue(v.time.span[1])}`
                        : yColumn.originalTimeColumn.formatValue(v.time.y),
                }),
            };
            offset += year.wrap.height;
            const line1 = {
                x: x,
                y: y + offset,
                wrap: new TextWrap_1.TextWrap({
                    maxWidth: maxWidth,
                    fontSize: 0.55 * fontSize,
                    text: this.formatValueY(v),
                }),
            };
            offset += line1.wrap.height;
            const line2 = {
                x: x,
                y: y + offset,
                wrap: new TextWrap_1.TextWrap({
                    maxWidth: maxWidth,
                    fontSize: 0.55 * fontSize,
                    text: this.formatValueX(v),
                }),
            };
            offset += line2.wrap.height + lineHeight;
            elements.push(...[year, line1, line2]);
        });
        return (react_1.default.createElement("g", { className: "scatterTooltip" }, elements.map((el, i) => el.wrap.render(el.x, el.y, { key: i }))));
    }
};
ScatterTooltip = __decorate([
    mobx_react_1.observer
], ScatterTooltip);
exports.ScatterTooltip = ScatterTooltip;
//# sourceMappingURL=ScatterTooltip.js.map