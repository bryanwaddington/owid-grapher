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
exports.LineLegend = void 0;
// This implements the line labels that appear to the right of the lines/polygons in LineCharts/StackedAreas.
const React = __importStar(require("react"));
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const TextWrap_1 = require("../text/TextWrap");
const Bounds_1 = require("../../clientUtils/Bounds");
const GrapherConstants_1 = require("../core/GrapherConstants");
// Minimum vertical space between two legend items
const LEGEND_ITEM_MIN_SPACING = 2;
// Horizontal distance from the end of the chart to the start of the marker
const MARKER_MARGIN = 4;
// Need a constant button height which we can use in positioning calculations
const ADD_BUTTON_HEIGHT = 30;
function groupBounds(group) {
    const first = group[0];
    const last = group[group.length - 1];
    const height = last.bounds.bottom - first.bounds.top;
    const width = Math.max(first.bounds.width, last.bounds.width);
    return new Bounds_1.Bounds(first.bounds.x, first.bounds.y, width, height);
}
function stackGroupVertically(group, y) {
    let currentY = y;
    group.forEach((mark) => {
        mark.bounds = mark.bounds.extend({ y: currentY });
        mark.repositions += 1;
        currentY += mark.bounds.height + LEGEND_ITEM_MIN_SPACING;
    });
    return group;
}
let Label = class Label extends React.Component {
    render() {
        const { series, manager, isFocus, needsLines, onMouseOver, onMouseLeave, onClick, } = this.props;
        const x = series.origBounds.x;
        const markerX1 = x + MARKER_MARGIN;
        const markerX2 = x + manager.leftPadding - MARKER_MARGIN;
        const step = (markerX2 - markerX1) / (series.totalLevels + 1);
        const markerXMid = markerX1 + step + series.level * step;
        const lineColor = isFocus ? "#999" : "#eee";
        const textColor = isFocus ? series.color : "#ddd";
        const annotationColor = isFocus ? "#333" : "#ddd";
        return (React.createElement("g", { className: "legendMark", onMouseOver: onMouseOver, onMouseLeave: onMouseLeave, onClick: onClick },
            needsLines && (React.createElement("g", { className: "indicator" },
                React.createElement("path", { d: `M${markerX1},${series.origBounds.centerY} H${markerXMid} V${series.bounds.centerY} H${markerX2}`, stroke: lineColor, strokeWidth: 0.5, fill: "none" }))),
            React.createElement("rect", { x: x, y: series.bounds.y, width: series.bounds.width, height: series.bounds.height, fill: "#fff", opacity: 0 }),
            series.textWrap.render(needsLines ? markerX2 + MARKER_MARGIN : markerX1, series.bounds.y, { fill: textColor }),
            series.annotationTextWrap &&
                series.annotationTextWrap.render(needsLines ? markerX2 + MARKER_MARGIN : markerX1, series.bounds.y + series.textWrap.height, {
                    fill: annotationColor,
                    className: "textAnnotation",
                    style: { fontWeight: "lighter" },
                })));
    }
};
Label = __decorate([
    mobx_react_1.observer
], Label);
let LineLegend = class LineLegend extends React.Component {
    constructor() {
        super(...arguments);
        this.leftPadding = 35;
    }
    get fontSize() {
        var _a;
        return 0.75 * ((_a = this.manager.fontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE);
    }
    get maxWidth() {
        var _a;
        return (_a = this.manager.maxLegendWidth) !== null && _a !== void 0 ? _a : 300;
    }
    get sizedLabels() {
        const { fontSize, leftPadding, maxWidth } = this;
        const maxTextWidth = maxWidth - leftPadding;
        const maxAnnotationWidth = Math.min(maxTextWidth, 150);
        return this.manager.labelSeries.map((label) => {
            const annotationTextWrap = label.annotation
                ? new TextWrap_1.TextWrap({
                    text: label.annotation,
                    maxWidth: maxAnnotationWidth,
                    fontSize: fontSize * 0.9,
                })
                : undefined;
            const textWrap = new TextWrap_1.TextWrap({
                text: label.label,
                maxWidth: maxTextWidth,
                fontSize,
            });
            return Object.assign(Object.assign({}, label), { textWrap,
                annotationTextWrap, width: leftPadding +
                    Math.max(textWrap.width, annotationTextWrap ? annotationTextWrap.width : 0), height: textWrap.height +
                    (annotationTextWrap ? annotationTextWrap.height : 0) });
        });
    }
    get width() {
        var _a;
        if (this.sizedLabels.length === 0)
            return 0;
        return (_a = Util_1.max(this.sizedLabels.map((d) => d.width))) !== null && _a !== void 0 ? _a : 0;
    }
    get onMouseOver() {
        var _a;
        return (_a = this.manager.onLegendMouseOver) !== null && _a !== void 0 ? _a : Util_1.noop;
    }
    get onMouseLeave() {
        var _a;
        return (_a = this.manager.onLegendMouseLeave) !== null && _a !== void 0 ? _a : Util_1.noop;
    }
    get onClick() {
        var _a;
        return (_a = this.manager.onLegendClick) !== null && _a !== void 0 ? _a : Util_1.noop;
    }
    get isFocusMode() {
        return this.sizedLabels.some((label) => this.manager.focusedSeriesNames.includes(label.seriesName));
    }
    get legendX() {
        var _a;
        return (_a = this.manager.legendX) !== null && _a !== void 0 ? _a : 0;
    }
    // Naive initial placement of each mark at the target height, before collision detection
    get initialSeries() {
        const { verticalAxis } = this.manager;
        const { legendX } = this;
        return Util_1.sortBy(this.sizedLabels.map((label) => {
            // place vertically centered at Y value
            const initialY = verticalAxis.place(label.yValue) - label.height / 2;
            const origBounds = new Bounds_1.Bounds(legendX, initialY, label.width, label.height);
            // ensure label doesn't go beyond the top or bottom of the chart
            const y = Math.min(Math.max(initialY, verticalAxis.rangeMin), verticalAxis.rangeMax - label.height);
            const bounds = new Bounds_1.Bounds(legendX, y, label.width, label.height);
            return Object.assign(Object.assign({}, label), { y,
                origBounds,
                bounds, isOverlap: false, repositions: 0, level: 0, totalLevels: 0 });
            // Ensure list is sorted by the visual position in ascending order
        }), (label) => verticalAxis.place(label.yValue));
    }
    get standardPlacement() {
        const { verticalAxis } = this.manager;
        const groups = Util_1.cloneDeep(this.initialSeries).map((mark) => [mark]);
        let hasOverlap;
        do {
            hasOverlap = false;
            for (let i = 0; i < groups.length - 1; i++) {
                const topGroup = groups[i];
                const bottomGroup = groups[i + 1];
                const topBounds = groupBounds(topGroup);
                const bottomBounds = groupBounds(bottomGroup);
                if (topBounds.intersects(bottomBounds)) {
                    const overlapHeight = topBounds.bottom -
                        bottomBounds.top +
                        LEGEND_ITEM_MIN_SPACING;
                    const newHeight = topBounds.height +
                        LEGEND_ITEM_MIN_SPACING +
                        bottomBounds.height;
                    const targetY = topBounds.top -
                        overlapHeight *
                            (bottomGroup.length /
                                (topGroup.length + bottomGroup.length));
                    const overflowTop = Math.max(verticalAxis.rangeMin - targetY, 0);
                    const overflowBottom = Math.max(targetY + newHeight - verticalAxis.rangeMax, 0);
                    const newY = targetY + overflowTop - overflowBottom;
                    const newGroup = [...topGroup, ...bottomGroup];
                    stackGroupVertically(newGroup, newY);
                    groups.splice(i, 2, newGroup);
                    hasOverlap = true;
                    break;
                }
            }
        } while (hasOverlap && groups.length > 1);
        for (const group of groups) {
            let currentLevel = 0;
            let prevSign = 0;
            for (const series of group) {
                const currentSign = Math.sign(series.bounds.y - series.origBounds.y);
                if (prevSign === currentSign) {
                    currentLevel -= currentSign;
                }
                series.level = currentLevel;
                prevSign = currentSign;
            }
            const minLevel = Util_1.min(group.map((mark) => mark.level));
            const maxLevel = Util_1.max(group.map((mark) => mark.level));
            for (const mark of group) {
                mark.level -= minLevel;
                mark.totalLevels = maxLevel - minLevel + 1;
            }
        }
        return Util_1.flatten(groups);
    }
    // Overlapping placement, for when we really can't find a solution without overlaps.
    get overlappingPlacement() {
        const series = Util_1.cloneDeep(this.initialSeries);
        for (let i = 0; i < series.length; i++) {
            const m1 = series[i];
            for (let j = i + 1; j < series.length; j++) {
                const m2 = series[j];
                const isOverlap = !m1.isOverlap && m1.bounds.intersects(m2.bounds);
                if (isOverlap)
                    m2.isOverlap = true;
            }
        }
        return series;
    }
    get placedSeries() {
        const nonOverlappingMinHeight = Util_1.sumBy(this.initialSeries, (series) => series.bounds.height) +
            this.initialSeries.length * LEGEND_ITEM_MIN_SPACING;
        const availableHeight = this.manager.canAddData
            ? this.manager.verticalAxis.rangeSize - ADD_BUTTON_HEIGHT
            : this.manager.verticalAxis.rangeSize;
        // Need to be careful here – the controls overlay will automatically add padding if
        // needed to fit the floating 'Add country' button, therefore decreasing the space
        // available to render the legend.
        // At a certain height, this ends up infinitely toggling between the two placement
        // modes. The overlapping placement allows the button to float without additional
        // padding, which then frees up space, causing the legend to render with
        // standardPlacement.
        // This is why we need to take into account the height of the 'Add country' button.
        if (nonOverlappingMinHeight > availableHeight)
            return this.overlappingPlacement;
        return this.standardPlacement;
    }
    get backgroundSeries() {
        const { focusedSeriesNames } = this.manager;
        const { isFocusMode } = this;
        return this.placedSeries.filter((mark) => isFocusMode
            ? !focusedSeriesNames.includes(mark.seriesName)
            : mark.isOverlap);
    }
    get focusedSeries() {
        const { focusedSeriesNames } = this.manager;
        const { isFocusMode } = this;
        return this.placedSeries.filter((mark) => isFocusMode
            ? focusedSeriesNames.includes(mark.seriesName)
            : !mark.isOverlap);
    }
    // Does this placement need line markers or is the position of the labels already clear?
    get needsLines() {
        return this.placedSeries.some((series) => series.totalLevels > 1);
    }
    renderBackground() {
        return this.backgroundSeries.map((series, index) => (React.createElement(Label, { key: `background-${index}-` + series.seriesName, series: series, manager: this, needsLines: this.needsLines, onMouseOver: () => this.onMouseOver(series.seriesName), onClick: () => this.onClick(series.seriesName) })));
    }
    // All labels are focused by default, moved to background when mouseover of other label
    renderFocus() {
        return this.focusedSeries.map((series, index) => (React.createElement(Label, { key: `focus-${index}-` + series.seriesName, series: series, manager: this, isFocus: true, needsLines: this.needsLines, onMouseOver: () => this.onMouseOver(series.seriesName), onClick: () => this.onClick(series.seriesName), onMouseLeave: () => this.onMouseLeave(series.seriesName) })));
    }
    get manager() {
        return this.props.manager;
    }
    render() {
        return (React.createElement("g", { className: "LineLabels", style: {
                cursor: this.manager.startSelectingWhenLineClicked
                    ? "pointer"
                    : "default",
            } },
            this.renderBackground(),
            this.renderFocus()));
    }
};
__decorate([
    mobx_1.computed
], LineLegend.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "maxWidth", null);
__decorate([
    mobx_1.computed.struct
], LineLegend.prototype, "sizedLabels", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "width", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "onMouseOver", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "onMouseLeave", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "onClick", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "isFocusMode", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "initialSeries", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "standardPlacement", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "overlappingPlacement", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "placedSeries", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "backgroundSeries", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "focusedSeries", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "needsLines", null);
__decorate([
    mobx_1.computed
], LineLegend.prototype, "manager", null);
LineLegend = __decorate([
    mobx_react_1.observer
], LineLegend);
exports.LineLegend = LineLegend;
//# sourceMappingURL=LineLegend.js.map