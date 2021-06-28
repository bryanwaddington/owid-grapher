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
exports.StackedBarChart = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Util_1 = require("../../clientUtils/Util");
const Bounds_1 = require("../../clientUtils/Bounds");
const AxisViews_1 = require("../axis/AxisViews");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const Text_1 = require("../text/Text");
const VerticalColorLegend_1 = require("../verticalColorLegend/VerticalColorLegend");
const Tooltip_1 = require("../tooltip/Tooltip");
const GrapherConstants_1 = require("../core/GrapherConstants");
const AbstractStackedChart_1 = require("./AbstractStackedChart");
const ColorConstants_1 = require("../color/ColorConstants");
const StackedUtils_1 = require("./StackedUtils");
const ChartUtils_1 = require("../chart/ChartUtils");
let StackedBarSegment = class StackedBarSegment extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        this.mouseOver = false;
    }
    get yPos() {
        const { bar, yAxis } = this.props;
        return yAxis.place(bar.value + bar.valueOffset);
    }
    get barHeight() {
        const { bar, yAxis } = this.props;
        return yAxis.place(bar.valueOffset) - this.yPos;
    }
    get trueOpacity() {
        return this.mouseOver ? 1 : this.props.opacity;
    }
    onBarMouseOver() {
        this.mouseOver = true;
        this.props.onBarMouseOver(this.props.bar, this.props.series);
    }
    onBarMouseLeave() {
        this.mouseOver = false;
        this.props.onBarMouseLeave();
    }
    render() {
        const { color, xOffset, barWidth } = this.props;
        const { yPos, barHeight, trueOpacity } = this;
        return (React.createElement("rect", { ref: this.base, x: xOffset, y: yPos, width: barWidth, height: barHeight, fill: color, opacity: trueOpacity, onMouseOver: this.onBarMouseOver, onMouseLeave: this.onBarMouseLeave }));
    }
};
__decorate([
    mobx_1.observable
], StackedBarSegment.prototype, "mouseOver", void 0);
__decorate([
    mobx_1.computed
], StackedBarSegment.prototype, "yPos", null);
__decorate([
    mobx_1.computed
], StackedBarSegment.prototype, "barHeight", null);
__decorate([
    mobx_1.computed
], StackedBarSegment.prototype, "trueOpacity", null);
__decorate([
    mobx_1.action.bound
], StackedBarSegment.prototype, "onBarMouseOver", null);
__decorate([
    mobx_1.action.bound
], StackedBarSegment.prototype, "onBarMouseLeave", null);
StackedBarSegment = __decorate([
    mobx_react_1.observer
], StackedBarSegment);
let StackedBarChart = class StackedBarChart extends AbstractStackedChart_1.AbstactStackedChart {
    constructor(props) {
        super(props);
        this.minBarSpacing = 4;
        this.defaultBaseColorScheme = ColorConstants_1.ColorSchemeName.stackedAreaDefault;
    }
    get baseFontSize() {
        var _a;
        return (_a = this.manager.baseFontSize) !== null && _a !== void 0 ? _a : GrapherConstants_1.BASE_FONT_SIZE;
    }
    get tickFontSize() {
        return 0.9 * this.baseFontSize;
    }
    get barWidth() {
        const { dualAxis } = this;
        return (0.8 * dualAxis.innerBounds.width) / this.xValues.length;
    }
    get barSpacing() {
        return (this.dualAxis.innerBounds.width / this.xValues.length -
            this.barWidth);
    }
    get barFontSize() {
        return 0.75 * this.baseFontSize;
    }
    get paddingForLegend() {
        return this.sidebarWidth + 20;
    }
    // All currently hovered group keys, combining the legend and the main UI
    get hoverKeys() {
        const { hoverColor } = this;
        const hoverKeys = hoverColor === undefined
            ? []
            : Util_1.uniq(this.series
                .filter((g) => g.color === hoverColor)
                .map((g) => g.seriesName));
        return hoverKeys;
    }
    get activeColors() {
        const { hoverKeys } = this;
        const activeKeys = hoverKeys.length > 0 ? hoverKeys : [];
        if (!activeKeys.length)
            // No hover means they're all active by default
            return Util_1.uniq(this.series.map((g) => g.color));
        return Util_1.uniq(this.series
            .filter((g) => activeKeys.indexOf(g.seriesName) !== -1)
            .map((g) => g.color));
    }
    get legendItems() {
        return this.series
            .map((series) => {
            return {
                label: series.seriesName,
                color: series.color,
            };
        })
            .reverse(); // Vertical legend orders things in the opposite direction we want
    }
    get maxLegendWidth() {
        return this.sidebarMaxWidth;
    }
    get sidebarMaxWidth() {
        return this.bounds.width / 5;
    }
    get sidebarMinWidth() {
        return 100;
    }
    get sidebarWidth() {
        const { sidebarMinWidth, sidebarMaxWidth, legendDimensions } = this;
        return Math.max(Math.min(legendDimensions.width, sidebarMaxWidth), sidebarMinWidth);
    }
    get legendDimensions() {
        return new VerticalColorLegend_1.VerticalColorLegend({ manager: this });
    }
    get tooltip() {
        const { hoverBar, mapXValueToOffset, barWidth, dualAxis, yColumns, inputTable, hoverSeries, } = this;
        if (hoverBar === undefined)
            return;
        const xPos = mapXValueToOffset.get(hoverBar.position);
        if (xPos === undefined)
            return;
        const yPos = dualAxis.verticalAxis.place(hoverBar.valueOffset + hoverBar.value);
        const yColumn = yColumns[0]; // we can just use the first column for formatting, b/c we assume all columns have same type
        return (React.createElement(Tooltip_1.Tooltip, { tooltipManager: this.props.manager, x: xPos + barWidth, y: yPos, style: { textAlign: "center" } },
            React.createElement("h3", { style: {
                    padding: "0.3em 0.9em",
                    margin: 0,
                    backgroundColor: "#fcfcfc",
                    borderBottom: "1px solid #ebebeb",
                    fontWeight: "normal",
                    fontSize: "1em",
                } }, hoverSeries === null || hoverSeries === void 0 ? void 0 : hoverSeries.seriesName),
            React.createElement("p", { style: {
                    margin: 0,
                    padding: "0.3em 0.9em",
                    fontSize: "0.8em",
                } },
                React.createElement("span", null, yColumn.formatValueLong(hoverBar.value)),
                React.createElement("br", null),
                "in",
                React.createElement("br", null),
                React.createElement("span", null, inputTable.timeColumnFormatFunction(hoverBar.position)))));
    }
    get mapXValueToOffset() {
        const { dualAxis, barWidth, barSpacing } = this;
        const xValueToOffset = new Map();
        let xOffset = dualAxis.innerBounds.left + barSpacing;
        for (let i = 0; i < this.xValues.length; i++) {
            xValueToOffset.set(this.xValues[i], xOffset);
            xOffset += barWidth + barSpacing;
        }
        return xValueToOffset;
    }
    // Place ticks centered beneath the bars, before doing overlap detection
    get tickPlacements() {
        const { mapXValueToOffset, barWidth, dualAxis } = this;
        const { xValues } = this;
        const { horizontalAxis } = dualAxis;
        return xValues.map((x) => {
            const text = horizontalAxis.formatTick(x);
            const xPos = mapXValueToOffset.get(x);
            const bounds = Bounds_1.Bounds.forText(text, { fontSize: this.tickFontSize });
            return {
                text,
                bounds: bounds.extend({
                    x: xPos + barWidth / 2 - bounds.width / 2,
                    y: dualAxis.innerBounds.bottom + 5,
                }),
                isHidden: false,
            };
        });
    }
    get ticks() {
        const { tickPlacements } = this;
        for (let i = 0; i < tickPlacements.length; i++) {
            for (let j = 1; j < tickPlacements.length; j++) {
                const t1 = tickPlacements[i], t2 = tickPlacements[j];
                if (t1 === t2 || t1.isHidden || t2.isHidden)
                    continue;
                if (t1.bounds.intersects(t2.bounds.padWidth(-5))) {
                    if (i === 0)
                        t2.isHidden = true;
                    else if (j === tickPlacements.length - 1)
                        t1.isHidden = true;
                    else
                        t2.isHidden = true;
                }
            }
        }
        return tickPlacements.filter((t) => !t.isHidden);
    }
    onLegendMouseOver(color) {
        this.hoverColor = color;
    }
    onLegendMouseLeave() {
        this.hoverColor = undefined;
    }
    onLegendClick() { }
    onBarMouseOver(bar, series) {
        this.hoverBar = bar;
        this.hoverSeries = series;
    }
    onBarMouseLeave() {
        this.hoverBar = undefined;
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.bounds, message: this.failMessage }));
        const { dualAxis, renderUid, bounds, tooltip, barWidth, mapXValueToOffset, ticks, } = this;
        const { series } = this;
        const { innerBounds, verticalAxis } = dualAxis;
        const textColor = "#666";
        const clipPath = ChartUtils_1.makeClipPath(renderUid, innerBounds);
        return (React.createElement("g", { className: "StackedBarChart", width: bounds.width, height: bounds.height },
            clipPath.element,
            React.createElement("rect", { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height, opacity: 0, fill: "rgba(255,255,255,0)" }),
            React.createElement(AxisViews_1.VerticalAxisComponent, { bounds: bounds, verticalAxis: verticalAxis }),
            React.createElement(AxisViews_1.VerticalAxisGridLines, { verticalAxis: verticalAxis, bounds: innerBounds }),
            React.createElement(AxisViews_1.AxisTickMarks, { tickMarkTopPosition: innerBounds.bottom, tickMarkXPositions: ticks.map((tick) => tick.bounds.centerX), color: textColor }),
            React.createElement("g", null, ticks.map((tick, i) => {
                return (React.createElement(Text_1.Text, { key: i, x: tick.bounds.x, y: tick.bounds.y, fill: textColor, fontSize: this.tickFontSize }, tick.text));
            })),
            React.createElement("g", { clipPath: clipPath.id }, series.map((series, index) => {
                const isLegendHovered = this.hoverKeys.includes(series.seriesName);
                const opacity = isLegendHovered || this.hoverKeys.length === 0
                    ? 0.8
                    : 0.2;
                return (React.createElement("g", { key: index, className: Util_1.makeSafeForCSS(series.seriesName) +
                        "-segments" }, series.points.map((bar, index) => {
                    const xPos = mapXValueToOffset.get(bar.position);
                    const barOpacity = bar === this.hoverBar ? 1 : opacity;
                    return (React.createElement(StackedBarSegment, { key: index, bar: bar, color: series.color, xOffset: xPos, opacity: barOpacity, yAxis: verticalAxis, series: series, onBarMouseOver: this.onBarMouseOver, onBarMouseLeave: this.onBarMouseLeave, barWidth: barWidth }));
                })));
            })),
            React.createElement(VerticalColorLegend_1.VerticalColorLegend, { manager: this }),
            tooltip));
    }
    get legendY() {
        return this.bounds.top;
    }
    get legendX() {
        return this.bounds.right - this.sidebarWidth;
    }
    get xValues() {
        return Util_1.uniq(this.allStackedPoints.map((bar) => bar.position));
    }
    get colorScaleConfig() {
        return this.manager.colorScale;
    }
    get series() {
        return StackedUtils_1.stackSeries(StackedUtils_1.withMissingValuesAsZeroes(this.unstackedSeries));
    }
};
__decorate([
    mobx_1.observable
], StackedBarChart.prototype, "hoverColor", void 0);
__decorate([
    mobx_1.observable
], StackedBarChart.prototype, "hoverBar", void 0);
__decorate([
    mobx_1.observable
], StackedBarChart.prototype, "hoverSeries", void 0);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "baseFontSize", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "tickFontSize", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "barWidth", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "barSpacing", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "barFontSize", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "paddingForLegend", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "hoverKeys", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "activeColors", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "legendItems", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "maxLegendWidth", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "sidebarMaxWidth", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "sidebarMinWidth", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "sidebarWidth", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "legendDimensions", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "tooltip", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "mapXValueToOffset", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "tickPlacements", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "ticks", null);
__decorate([
    mobx_1.action.bound
], StackedBarChart.prototype, "onLegendMouseOver", null);
__decorate([
    mobx_1.action.bound
], StackedBarChart.prototype, "onLegendMouseLeave", null);
__decorate([
    mobx_1.action.bound
], StackedBarChart.prototype, "onLegendClick", null);
__decorate([
    mobx_1.action.bound
], StackedBarChart.prototype, "onBarMouseOver", null);
__decorate([
    mobx_1.action.bound
], StackedBarChart.prototype, "onBarMouseLeave", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "legendY", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "xValues", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "colorScaleConfig", null);
__decorate([
    mobx_1.computed
], StackedBarChart.prototype, "series", null);
StackedBarChart = __decorate([
    mobx_react_1.observer
], StackedBarChart);
exports.StackedBarChart = StackedBarChart;
//# sourceMappingURL=StackedBarChart.js.map