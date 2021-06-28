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
exports.VerticalColorLegend = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const TextWrap_1 = require("../text/TextWrap");
const GrapherConstants_1 = require("../core/GrapherConstants");
let VerticalColorLegend = class VerticalColorLegend extends React.Component {
    constructor() {
        super(...arguments);
        this.rectPadding = 5;
        this.lineHeight = 5;
    }
    get manager() {
        return this.props.manager;
    }
    get maxLegendWidth() {
        var _a;
        return (_a = this.manager.maxLegendWidth) !== null && _a !== void 0 ? _a : 100;
    }
    get fontSize() {
        var _a;
        return 0.7 * ((_a = this.manager.fontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE);
    }
    get rectSize() {
        return Math.round(this.fontSize / 1.4);
    }
    get title() {
        if (!this.manager.title)
            return undefined;
        return new TextWrap_1.TextWrap({
            maxWidth: this.maxLegendWidth,
            fontSize: this.fontSize,
            fontWeight: 700,
            text: this.manager.title,
        });
    }
    get titleHeight() {
        if (!this.title)
            return 0;
        return this.title.height + 5;
    }
    get series() {
        const { manager, fontSize, rectSize, rectPadding } = this;
        return manager.legendItems
            .map((series) => {
            let label = series.label;
            // infer label for numeric bins
            if (!label && series.minText && series.maxText) {
                label = `${series.minText} – ${series.maxText}`;
            }
            const textWrap = new TextWrap_1.TextWrap({
                maxWidth: this.maxLegendWidth,
                fontSize,
                text: label !== null && label !== void 0 ? label : "",
            });
            return {
                textWrap,
                color: series.color,
                width: rectSize + rectPadding + textWrap.width,
                height: Math.max(textWrap.height, rectSize),
            };
        })
            .filter((v) => !!v);
    }
    get width() {
        var _a;
        const widths = this.series.map((series) => series.width);
        if (this.title)
            widths.push(this.title.width);
        return (_a = Util_1.max(widths)) !== null && _a !== void 0 ? _a : 0;
    }
    get height() {
        return (this.titleHeight +
            Util_1.sum(this.series.map((series) => series.height)) +
            this.lineHeight * this.series.length);
    }
    render() {
        var _a, _b;
        const { title, titleHeight, series, rectSize, rectPadding, lineHeight, manager, } = this;
        const { focusColors, activeColors, onLegendMouseOver, onLegendMouseLeave, onLegendClick, } = manager;
        const x = (_a = manager.legendX) !== null && _a !== void 0 ? _a : 0;
        const y = (_b = manager.legendY) !== null && _b !== void 0 ? _b : 0;
        let markOffset = titleHeight;
        return (React.createElement(React.Fragment, null,
            title && title.render(x, y, { fontWeight: 700 }),
            React.createElement("g", { className: "ScatterColorLegend clickable", style: { cursor: "pointer" } }, series.map((series, index) => {
                var _a;
                const isActive = activeColors.includes(series.color);
                const isFocus = (_a = focusColors === null || focusColors === void 0 ? void 0 : focusColors.includes(series.color)) !== null && _a !== void 0 ? _a : false;
                const mouseOver = onLegendMouseOver
                    ? () => onLegendMouseOver(series.color)
                    : undefined;
                const mouseLeave = onLegendMouseLeave || undefined;
                const click = onLegendClick
                    ? () => onLegendClick(series.color)
                    : undefined;
                const result = (React.createElement("g", { key: index, className: "legendMark", onMouseOver: mouseOver, onMouseLeave: mouseLeave, onClick: click, fill: !isActive ? "#ccc" : undefined },
                    React.createElement("rect", { x: x, y: y + markOffset - lineHeight / 2, width: series.width, height: series.height + lineHeight, fill: "#fff", opacity: 0 }),
                    React.createElement("rect", { x: x, y: y +
                            markOffset +
                            (series.height - rectSize) / 2, width: rectSize, height: rectSize, fill: isActive ? series.color : undefined }),
                    series.textWrap.render(x + rectSize + rectPadding, y + markOffset, isFocus
                        ? { style: { fontWeight: "bold" } }
                        : undefined)));
                markOffset += series.height + lineHeight;
                return result;
            }))));
    }
};
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "manager", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "maxLegendWidth", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "rectSize", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "title", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "titleHeight", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "series", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "width", null);
__decorate([
    mobx_1.computed
], VerticalColorLegend.prototype, "height", null);
VerticalColorLegend = __decorate([
    mobx_react_1.observer
], VerticalColorLegend);
exports.VerticalColorLegend = VerticalColorLegend;
//# sourceMappingURL=VerticalColorLegend.js.map