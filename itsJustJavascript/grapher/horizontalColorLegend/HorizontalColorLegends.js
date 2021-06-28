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
exports.HorizontalCategoricalColorLegend = exports.HorizontalNumericColorLegend = exports.LegendAlign = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Util_1 = require("../../clientUtils/Util");
const Bounds_1 = require("../../clientUtils/Bounds");
const ColorScaleBin_1 = require("../color/ColorScaleBin");
const GrapherConstants_1 = require("../core/GrapherConstants");
const FOCUS_BORDER_COLOR = "#111";
const SPACE_BETWEEN_CATEGORICAL_BINS = 7;
var LegendAlign;
(function (LegendAlign) {
    LegendAlign["left"] = "left";
    LegendAlign["center"] = "center";
    LegendAlign["right"] = "right";
})(LegendAlign = exports.LegendAlign || (exports.LegendAlign = {}));
let HorizontalColorLegend = class HorizontalColorLegend extends React.Component {
    get manager() {
        return this.props.manager;
    }
    get legendX() {
        var _a;
        return (_a = this.manager.legendX) !== null && _a !== void 0 ? _a : 0;
    }
    get categoryLegendY() {
        var _a;
        return (_a = this.manager.categoryLegendY) !== null && _a !== void 0 ? _a : 0;
    }
    get numericLegendY() {
        var _a;
        return (_a = this.manager.numericLegendY) !== null && _a !== void 0 ? _a : 0;
    }
    get legendWidth() {
        var _a;
        return (_a = this.manager.legendWidth) !== null && _a !== void 0 ? _a : 200;
    }
    get legendHeight() {
        var _a;
        return (_a = this.manager.legendHeight) !== null && _a !== void 0 ? _a : 200;
    }
    get legendAlign() {
        var _a;
        // Assume center alignment if none specified, for backwards-compatibility
        return (_a = this.manager.legendAlign) !== null && _a !== void 0 ? _a : LegendAlign.center;
    }
    get fontSize() {
        var _a;
        return (_a = this.manager.fontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
};
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "manager", null);
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "categoryLegendY", null);
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "numericLegendY", null);
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "legendWidth", null);
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "legendHeight", null);
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "legendAlign", null);
__decorate([
    mobx_1.computed
], HorizontalColorLegend.prototype, "fontSize", null);
HorizontalColorLegend = __decorate([
    mobx_react_1.observer
], HorizontalColorLegend);
let HorizontalNumericColorLegend = class HorizontalNumericColorLegend extends HorizontalColorLegend {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        this.rectHeight = 10;
    }
    get numericLegendData() {
        var _a;
        return (_a = this.manager.numericLegendData) !== null && _a !== void 0 ? _a : [];
    }
    get numericBins() {
        return this.numericLegendData.filter((bin) => bin instanceof ColorScaleBin_1.NumericBin);
    }
    get tickFontSize() {
        return 0.75 * this.fontSize;
    }
    // NumericColorLegend wants to map a range to a width. However, sometimes we are given
    // data without a clear min/max. So we must fit these scurrilous bins into the width somehow.
    get minValue() {
        return Util_1.min(this.numericBins.map((bin) => bin.min));
    }
    get maxValue() {
        return Util_1.max(this.numericBins.map((bin) => bin.max));
    }
    get rangeSize() {
        return this.maxValue - this.minValue;
    }
    get categoryBinWidth() {
        return Bounds_1.Bounds.forText("No data", { fontSize: this.tickFontSize }).width;
    }
    get categoryBinMargin() {
        return this.rectHeight * 1.5;
    }
    get totalCategoricalWidth() {
        const { numericLegendData } = this;
        const { categoryBinWidth, categoryBinMargin } = this;
        const widths = numericLegendData.map((bin) => bin instanceof ColorScaleBin_1.CategoricalBin
            ? categoryBinWidth + categoryBinMargin
            : 0);
        return Util_1.sum(widths);
    }
    get availableNumericWidth() {
        return this.legendWidth - this.totalCategoricalWidth;
    }
    get positionedBins() {
        const { manager, rangeSize, categoryBinWidth, categoryBinMargin, availableNumericWidth, numericLegendData, numericBins, } = this;
        let xOffset = 0;
        return numericLegendData.map((bin) => {
            let width = categoryBinWidth;
            let margin = categoryBinMargin;
            if (bin instanceof ColorScaleBin_1.NumericBin) {
                if (manager.equalSizeBins)
                    width = availableNumericWidth / numericBins.length;
                else
                    width =
                        ((bin.max - bin.min) / rangeSize) *
                            availableNumericWidth;
                margin = 0;
            }
            const x = xOffset;
            xOffset += width + margin;
            return {
                x,
                width,
                margin,
                bin: bin,
            };
        });
    }
    get numericLabels() {
        const { rectHeight, positionedBins, tickFontSize } = this;
        const makeBoundaryLabel = (bin, minOrMax, text) => {
            const labelBounds = Bounds_1.Bounds.forText(text, { fontSize: tickFontSize });
            const x = bin.x +
                (minOrMax === "min" ? 0 : bin.width) -
                labelBounds.width / 2;
            const y = -rectHeight - labelBounds.height - 3;
            return {
                text: text,
                fontSize: tickFontSize,
                bounds: labelBounds.extend({ x: x, y: y }),
                hidden: false,
            };
        };
        const makeRangeLabel = (bin) => {
            const labelBounds = Bounds_1.Bounds.forText(bin.bin.text, {
                fontSize: tickFontSize,
            });
            const x = bin.x + bin.width / 2 - labelBounds.width / 2;
            const y = -rectHeight - labelBounds.height - 3;
            return {
                text: bin.bin.text,
                fontSize: tickFontSize,
                bounds: labelBounds.extend({ x: x, y: y }),
                priority: true,
                hidden: false,
            };
        };
        let labels = [];
        for (const bin of positionedBins) {
            if (bin.bin.text)
                labels.push(makeRangeLabel(bin));
            else if (bin.bin instanceof ColorScaleBin_1.NumericBin) {
                labels.push(makeBoundaryLabel(bin, "min", bin.bin.minText));
                if (bin === Util_1.last(positionedBins))
                    labels.push(makeBoundaryLabel(bin, "max", bin.bin.maxText));
            }
        }
        for (let index = 0; index < labels.length; index++) {
            const l1 = labels[index];
            if (l1.hidden)
                continue;
            for (let j = index + 1; j < labels.length; j++) {
                const l2 = labels[j];
                if (l1.bounds.right + 5 >= l2.bounds.centerX ||
                    (l2.bounds.left - 5 <= l1.bounds.centerX && !l2.priority))
                    l2.hidden = true;
            }
        }
        labels = labels.filter((label) => !label.hidden);
        // If labels overlap, first we try alternating raised labels
        let raisedMode = false;
        for (let index = 1; index < labels.length; index++) {
            const l1 = labels[index - 1], l2 = labels[index];
            if (l1.bounds.right + 5 >= l2.bounds.left) {
                raisedMode = true;
                break;
            }
        }
        if (raisedMode) {
            for (let index = 1; index < labels.length; index++) {
                const label = labels[index];
                if (index % 2 !== 0) {
                    label.bounds = label.bounds.extend({
                        y: label.bounds.y - label.bounds.height - 1,
                    });
                }
            }
        }
        return labels;
    }
    get height() {
        var _a;
        return Math.abs((_a = Util_1.min(this.numericLabels.map((label) => label.bounds.y))) !== null && _a !== void 0 ? _a : 0);
    }
    get bounds() {
        return new Bounds_1.Bounds(this.legendX, this.numericLegendY, this.legendWidth, this.legendHeight);
    }
    onMouseMove(ev) {
        const { manager, base, positionedBins } = this;
        const { numericFocusBracket } = manager;
        const mouse = Util_1.getRelativeMouse(base.current, ev);
        // We implement onMouseMove and onMouseLeave in a custom way, without attaching them to
        // specific SVG elements, in order to allow continuous transition between bins as the user
        // moves their cursor across (even if their cursor is in the empty area above the
        // legend, where the labels are).
        // We could achieve the same by rendering invisible rectangles over the areas and attaching
        // event handlers to those.
        // If outside legend bounds, trigger onMouseLeave if there is an existing bin in focus.
        if (!this.bounds.contains(mouse)) {
            if (numericFocusBracket && manager.onLegendMouseLeave)
                return manager.onLegendMouseLeave();
            return;
        }
        // If inside legend bounds, trigger onMouseOver with the bin closest to the cursor.
        let newFocusBracket = null;
        positionedBins.forEach((bin) => {
            if (mouse.x >= this.legendX + bin.x &&
                mouse.x <= this.legendX + bin.x + bin.width)
                newFocusBracket = bin.bin;
        });
        if (newFocusBracket && manager.onLegendMouseOver)
            manager.onLegendMouseOver(newFocusBracket);
    }
    componentDidMount() {
        document.documentElement.addEventListener("mousemove", this.onMouseMove);
        document.documentElement.addEventListener("touchmove", this.onMouseMove);
    }
    componentWillUnmount() {
        document.documentElement.removeEventListener("mousemove", this.onMouseMove);
        document.documentElement.removeEventListener("touchmove", this.onMouseMove);
    }
    render() {
        const { manager, numericLabels, rectHeight, positionedBins, height, } = this;
        const { numericFocusBracket } = manager;
        //Bounds.debug([this.bounds])
        const borderColor = "#333";
        const bottomY = this.numericLegendY + height;
        return (React.createElement("g", { ref: this.base, className: "numericColorLegend" },
            numericLabels.map((label, index) => (React.createElement("line", { key: index, x1: this.legendX +
                    label.bounds.x +
                    label.bounds.width / 2, y1: bottomY - rectHeight, x2: this.legendX +
                    label.bounds.x +
                    label.bounds.width / 2, y2: bottomY + label.bounds.y + label.bounds.height, stroke: borderColor, strokeWidth: 0.3 }))),
            Util_1.sortBy(positionedBins.map((positionedBin, index) => {
                const isFocus = numericFocusBracket &&
                    positionedBin.bin.equals(numericFocusBracket);
                return (React.createElement("rect", { key: index, x: this.legendX + positionedBin.x, y: bottomY - rectHeight, width: positionedBin.width, height: rectHeight, fill: positionedBin.bin.color, stroke: isFocus ? FOCUS_BORDER_COLOR : borderColor, strokeWidth: isFocus ? 2 : 0.3 }));
            }), (rect) => rect.props["strokeWidth"]),
            numericLabels.map((label, index) => (React.createElement("text", { key: index, x: this.legendX + label.bounds.x, y: bottomY + label.bounds.y, 
                // we can't use dominant-baseline to do proper alignment since our svg-to-png library Sharp
                // doesn't support that (https://github.com/lovell/sharp/issues/1996), so we'll have to make
                // do with some rough positioning.
                dy: ".75em", fontSize: label.fontSize }, label.text)))));
    }
};
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "numericLegendData", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "numericBins", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "tickFontSize", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "minValue", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "maxValue", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "rangeSize", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "categoryBinWidth", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "categoryBinMargin", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "totalCategoricalWidth", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "availableNumericWidth", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "positionedBins", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "numericLabels", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "height", null);
__decorate([
    mobx_1.computed
], HorizontalNumericColorLegend.prototype, "bounds", null);
__decorate([
    mobx_1.action.bound
], HorizontalNumericColorLegend.prototype, "onMouseMove", null);
HorizontalNumericColorLegend = __decorate([
    mobx_react_1.observer
], HorizontalNumericColorLegend);
exports.HorizontalNumericColorLegend = HorizontalNumericColorLegend;
let HorizontalCategoricalColorLegend = class HorizontalCategoricalColorLegend extends HorizontalColorLegend {
    get categoricalLegendData() {
        var _a;
        return (_a = this.manager.categoricalLegendData) !== null && _a !== void 0 ? _a : [];
    }
    get markLines() {
        var _a;
        const manager = this.manager;
        const scale = (_a = manager.scale) !== null && _a !== void 0 ? _a : 1;
        const rectSize = 12 * scale;
        const rectPadding = 5;
        const markPadding = 5;
        const fontSize = 0.8 * scale * this.fontSize;
        const lines = [];
        let marks = [];
        let xOffset = 0;
        let yOffset = 0;
        this.categoricalLegendData.forEach((bin) => {
            const labelBounds = Bounds_1.Bounds.forText(bin.text, { fontSize });
            const markWidth = rectSize + rectPadding + labelBounds.width + markPadding;
            if (xOffset + markWidth > this.legendWidth && marks.length > 0) {
                lines.push({ totalWidth: xOffset - markPadding, marks: marks });
                marks = [];
                xOffset = 0;
                yOffset += rectSize + rectPadding;
            }
            const markX = xOffset;
            const markY = yOffset;
            const label = {
                text: bin.text,
                bounds: labelBounds.extend({
                    x: markX + rectSize + rectPadding,
                    y: markY + 1,
                }),
                fontSize,
            };
            marks.push({
                x: markX,
                y: markY,
                rectSize,
                label,
                bin,
            });
            xOffset += markWidth + SPACE_BETWEEN_CATEGORICAL_BINS;
        });
        if (marks.length > 0)
            lines.push({ totalWidth: xOffset - markPadding, marks: marks });
        return lines;
    }
    get width() {
        return Util_1.max(this.markLines.map((l) => l.totalWidth));
    }
    get marks() {
        const lines = this.markLines;
        const align = this.legendAlign;
        // Center each line
        lines.forEach((line) => {
            const xShift = align === LegendAlign.center
                ? (this.width - line.totalWidth) / 2
                : align === LegendAlign.right
                    ? this.width - line.totalWidth
                    : 0;
            line.marks.forEach((mark) => {
                mark.x += xShift;
                mark.label.bounds = mark.label.bounds.extend({
                    x: mark.label.bounds.x + xShift,
                });
            });
        });
        return Util_1.flatten(lines.map((l) => l.marks));
    }
    get height() {
        return Util_1.max(this.marks.map((mark) => mark.y + mark.rectSize));
    }
    render() {
        const { manager, marks } = this;
        return (React.createElement("g", null,
            React.createElement("g", { className: "categoricalColorLegend" }, marks.map((mark, index) => {
                return (React.createElement("g", { key: index, onMouseOver: () => manager.onLegendMouseOver
                        ? manager.onLegendMouseOver(mark.bin)
                        : undefined, onMouseLeave: () => manager.onLegendMouseLeave
                        ? manager.onLegendMouseLeave()
                        : undefined },
                    React.createElement("rect", { x: this.legendX + mark.x, y: this.categoryLegendY + mark.y, width: mark.rectSize, height: mark.rectSize, fill: mark.bin.color, stroke: manager.categoricalBinStroke, strokeWidth: 0.4 }),
                    ",",
                    React.createElement("text", { x: this.legendX + mark.label.bounds.x, y: this.categoryLegendY +
                            mark.label.bounds.y, 
                        // we can't use dominant-baseline to do proper alignment since our svg-to-png library Sharp
                        // doesn't support that (https://github.com/lovell/sharp/issues/1996), so we'll have to make
                        // do with some rough positioning.
                        dy: ".75em", fontSize: mark.label.fontSize }, mark.label.text)));
            }))));
    }
};
__decorate([
    mobx_1.computed
], HorizontalCategoricalColorLegend.prototype, "categoricalLegendData", null);
__decorate([
    mobx_1.computed
], HorizontalCategoricalColorLegend.prototype, "markLines", null);
__decorate([
    mobx_1.computed
], HorizontalCategoricalColorLegend.prototype, "width", null);
__decorate([
    mobx_1.computed
], HorizontalCategoricalColorLegend.prototype, "marks", null);
__decorate([
    mobx_1.computed
], HorizontalCategoricalColorLegend.prototype, "height", null);
HorizontalCategoricalColorLegend = __decorate([
    mobx_react_1.observer
], HorizontalCategoricalColorLegend);
exports.HorizontalCategoricalColorLegend = HorizontalCategoricalColorLegend;
//# sourceMappingURL=HorizontalColorLegends.js.map