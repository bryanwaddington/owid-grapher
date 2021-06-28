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
exports.StackedAreaChart = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const AxisViews_1 = require("../axis/AxisViews");
const LineLegend_1 = require("../lineLegend/LineLegend");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const Tooltip_1 = require("../tooltip/Tooltip");
const d3_color_1 = require("d3-color");
const AbstractStackedChart_1 = require("../stackedCharts/AbstractStackedChart");
const StackedUtils_1 = require("./StackedUtils");
const ChartUtils_1 = require("../chart/ChartUtils");
const BLUR_COLOR = "#ddd";
let Areas = class Areas extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    onCursorMove(ev) {
        const { dualAxis, seriesArr } = this.props;
        const mouse = Util_1.getRelativeMouse(this.base.current, ev.nativeEvent);
        if (dualAxis.innerBounds.contains(mouse)) {
            const closestPoint = Util_1.minBy(seriesArr[0].points, (d) => Math.abs(dualAxis.horizontalAxis.place(d.position) - mouse.x));
            if (closestPoint) {
                const index = seriesArr[0].points.indexOf(closestPoint);
                this.hoverIndex = index;
            }
            else {
                this.hoverIndex = undefined;
            }
        }
        else {
            this.hoverIndex = undefined;
        }
        this.props.onHover(this.hoverIndex);
    }
    onCursorLeave() {
        this.hoverIndex = undefined;
        this.props.onHover(this.hoverIndex);
    }
    seriesIsBlur(series) {
        return (this.props.focusedSeriesNames.length > 0 &&
            !this.props.focusedSeriesNames.includes(series.seriesName));
    }
    get areas() {
        const { dualAxis, seriesArr } = this.props;
        const { horizontalAxis, verticalAxis } = dualAxis;
        const xBottomLeft = [horizontalAxis.range[0], verticalAxis.range[0]];
        const xBottomRight = [horizontalAxis.range[1], verticalAxis.range[0]];
        // Stacked area chart stacks each series upon the previous series, so we must keep track of the last point set we used
        let prevPoints = [xBottomLeft, xBottomRight];
        return seriesArr.map((series) => {
            const mainPoints = series.points.map((point) => [
                horizontalAxis.place(point.position),
                verticalAxis.place(point.value + point.valueOffset),
            ]);
            const points = mainPoints.concat(Util_1.reverse(Util_1.clone(prevPoints)));
            prevPoints = mainPoints;
            return (React.createElement("path", { className: Util_1.makeSafeForCSS(series.seriesName) + "-area", key: series.seriesName + "-area", strokeLinecap: "round", d: Util_1.pointsToPath(points), fill: this.seriesIsBlur(series) ? BLUR_COLOR : series.color, fillOpacity: 0.7, clipPath: this.props.clipPath }));
        });
    }
    get borders() {
        const { dualAxis, seriesArr } = this.props;
        const { horizontalAxis, verticalAxis } = dualAxis;
        // Stacked area chart stacks each series upon the previous series, so we must keep track of the last point set we used
        return seriesArr.map((series) => {
            const points = series.points.map((point) => [
                horizontalAxis.place(point.position),
                verticalAxis.place(point.value + point.valueOffset),
            ]);
            return (React.createElement("path", { className: Util_1.makeSafeForCSS(series.seriesName) + "-border", key: series.seriesName + "-border", strokeLinecap: "round", d: Util_1.pointsToPath(points), stroke: d3_color_1.rgb(this.seriesIsBlur(series) ? BLUR_COLOR : series.color)
                    .darker(0.5)
                    .toString(), strokeOpacity: 0.7, strokeWidth: 0.5, fill: "none", clipPath: this.props.clipPath }));
        });
    }
    render() {
        const { dualAxis, seriesArr } = this.props;
        const { horizontalAxis, verticalAxis } = dualAxis;
        const { hoverIndex } = this;
        return (React.createElement("g", { ref: this.base, className: "Areas", onMouseMove: this.onCursorMove, onMouseLeave: this.onCursorLeave, onTouchStart: this.onCursorMove, onTouchMove: this.onCursorMove, onTouchEnd: this.onCursorLeave, onTouchCancel: this.onCursorLeave },
            React.createElement("rect", { x: horizontalAxis.range[0], y: verticalAxis.range[1], width: horizontalAxis.range[1] - horizontalAxis.range[0], height: verticalAxis.range[0] - verticalAxis.range[1], opacity: 0, fill: "rgba(255,255,255,0)" }),
            this.areas,
            this.borders,
            hoverIndex !== undefined && (React.createElement("g", { className: "hoverIndicator" },
                seriesArr.map((series) => {
                    const point = series.points[hoverIndex];
                    return this.seriesIsBlur(series) ||
                        point.fake ? null : (React.createElement("circle", { key: series.seriesName, cx: horizontalAxis.place(point.position), cy: verticalAxis.place(point.value + point.valueOffset), r: 2, fill: series.color }));
                }),
                React.createElement("line", { x1: horizontalAxis.place(seriesArr[0].points[hoverIndex].position), y1: verticalAxis.range[0], x2: horizontalAxis.place(seriesArr[0].points[hoverIndex].position), y2: verticalAxis.range[1], stroke: "rgba(180,180,180,.4)" })))));
    }
};
__decorate([
    mobx_1.observable
], Areas.prototype, "hoverIndex", void 0);
__decorate([
    mobx_1.action.bound
], Areas.prototype, "onCursorMove", null);
__decorate([
    mobx_1.action.bound
], Areas.prototype, "onCursorLeave", null);
__decorate([
    mobx_1.computed
], Areas.prototype, "areas", null);
__decorate([
    mobx_1.computed
], Areas.prototype, "borders", null);
Areas = __decorate([
    mobx_react_1.observer
], Areas);
let StackedAreaChart = class StackedAreaChart extends AbstractStackedChart_1.AbstactStackedChart {
    constructor(props) {
        super(props);
    }
    get verticalAxis() {
        return this.dualAxis.verticalAxis;
    }
    get midpoints() {
        let prevY = 0;
        return this.series.map((series) => {
            const lastValue = Util_1.last(series.points);
            if (!lastValue)
                return 0;
            const y = lastValue.value + lastValue.valueOffset;
            const middleY = prevY + (y - prevY) / 2;
            prevY = y;
            return middleY;
        });
    }
    get labelSeries() {
        const { midpoints } = this;
        return this.series
            .map((series, index) => ({
            color: series.color,
            seriesName: series.seriesName,
            label: series.seriesName,
            yValue: midpoints[index],
        }))
            .reverse();
    }
    get maxLegendWidth() {
        return Math.min(150, this.bounds.width / 3);
    }
    get legendDimensions() {
        if (this.manager.hideLegend)
            return undefined;
        return new LineLegend_1.LineLegend({ manager: this });
    }
    onHover(hoverIndex) {
        this.hoveredPointIndex = hoverIndex;
    }
    onLegendClick() {
        if (this.manager.startSelectingWhenLineClicked)
            this.manager.isSelectingData = true;
    }
    get paddingForLegend() {
        const { legendDimensions } = this;
        return legendDimensions ? legendDimensions.width : 20;
    }
    onLegendMouseOver(seriesName) {
        this.hoverSeriesName = seriesName;
    }
    onLegendMouseLeave() {
        this.hoverSeriesName = undefined;
    }
    get focusedSeriesNames() {
        return this.hoverSeriesName ? [this.hoverSeriesName] : [];
    }
    get isFocusMode() {
        return this.focusedSeriesNames.length > 0;
    }
    seriesIsBlur(series) {
        return (this.focusedSeriesNames.length > 0 &&
            !this.focusedSeriesNames.includes(series.seriesName));
    }
    get tooltip() {
        if (this.hoveredPointIndex === undefined)
            return undefined;
        const { hoveredPointIndex, dualAxis, series } = this;
        // Grab the first value to get the year from
        const bottomSeriesPoint = series[0].points[hoveredPointIndex];
        // If some data is missing, don't calculate a total
        const somePointsMissingForHoveredTime = series.some((series) => series.points[hoveredPointIndex].fake);
        const legendBlockStyle = {
            width: "10px",
            height: "10px",
            display: "inline-block",
            marginRight: "2px",
        };
        const lastStackedPoint = Util_1.last(series).points[hoveredPointIndex];
        const totalValue = lastStackedPoint.value + lastStackedPoint.valueOffset;
        const yColumn = this.yColumns[0]; // Assumes same type for all columns.
        return (React.createElement(Tooltip_1.Tooltip, { tooltipManager: this.props.manager, x: dualAxis.horizontalAxis.place(bottomSeriesPoint.position), y: dualAxis.verticalAxis.rangeMin +
                dualAxis.verticalAxis.rangeSize / 2, style: { padding: "0.3em" }, offsetX: 5 },
            React.createElement("table", { style: { fontSize: "0.9em", lineHeight: "1.4em" } },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("strong", null, this.inputTable.timeColumnFormatFunction(bottomSeriesPoint.position))),
                        React.createElement("td", null)),
                    series
                        .slice()
                        .reverse()
                        .map((series) => {
                        const point = series.points[hoveredPointIndex];
                        const isBlur = this.seriesIsBlur(series);
                        const textColor = isBlur ? "#ddd" : "#333";
                        const blockColor = isBlur
                            ? BLUR_COLOR
                            : series.color;
                        return (React.createElement("tr", { key: series.seriesName, style: { color: textColor } },
                            React.createElement("td", { style: {
                                    paddingRight: "0.8em",
                                    fontSize: "0.9em",
                                } },
                                React.createElement("div", { style: Object.assign(Object.assign({}, legendBlockStyle), { backgroundColor: blockColor }) }),
                                " ",
                                series.seriesName),
                            React.createElement("td", { style: { textAlign: "right" } }, point.fake
                                ? "No data"
                                : yColumn.formatValueLong(point.value))));
                    }),
                    !somePointsMissingForHoveredTime && (React.createElement("tr", null,
                        React.createElement("td", { style: { fontSize: "0.9em" } },
                            React.createElement("div", { style: Object.assign(Object.assign({}, legendBlockStyle), { backgroundColor: "transparent" }) }),
                            " ",
                            React.createElement("strong", null, "Total")),
                        React.createElement("td", { style: { textAlign: "right" } },
                            React.createElement("span", null,
                                React.createElement("strong", null, yColumn.formatValueLong(totalValue))))))))));
    }
    render() {
        if (this.failMessage)
            return (React.createElement(NoDataModal_1.NoDataModal, { manager: this.manager, bounds: this.props.bounds, message: this.failMessage }));
        const { bounds, dualAxis, renderUid, series } = this;
        const showLegend = !this.manager.hideLegend;
        const clipPath = ChartUtils_1.makeClipPath(renderUid, Object.assign(Object.assign({}, bounds), { height: bounds.height * 2, x: dualAxis.innerBounds.x }));
        return (React.createElement("g", { ref: this.base, className: "StackedArea" },
            clipPath.element,
            React.createElement(AxisViews_1.DualAxisComponent, { dualAxis: dualAxis, showTickMarks: true }),
            React.createElement("g", { clipPath: clipPath.id },
                showLegend && React.createElement(LineLegend_1.LineLegend, { manager: this }),
                React.createElement(Areas, { dualAxis: dualAxis, seriesArr: series, focusedSeriesNames: this.focusedSeriesNames, onHover: this.onHover })),
            this.tooltip));
    }
    /** Whether we want to display series with only zeroes (inherited). False for this class, true for others */
    get showAllZeroSeries() {
        return false;
    }
    get legendX() {
        return this.legendDimensions
            ? this.bounds.right - this.legendDimensions.width
            : 0;
    }
    get series() {
        return StackedUtils_1.stackSeries(StackedUtils_1.withMissingValuesAsZeroes(this.unstackedSeries));
    }
};
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "verticalAxis", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "midpoints", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "labelSeries", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "maxLegendWidth", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "legendDimensions", null);
__decorate([
    mobx_1.observable
], StackedAreaChart.prototype, "hoveredPointIndex", void 0);
__decorate([
    mobx_1.action.bound
], StackedAreaChart.prototype, "onHover", null);
__decorate([
    mobx_1.observable
], StackedAreaChart.prototype, "hoverSeriesName", void 0);
__decorate([
    mobx_1.action.bound
], StackedAreaChart.prototype, "onLegendClick", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "paddingForLegend", null);
__decorate([
    mobx_1.action.bound
], StackedAreaChart.prototype, "onLegendMouseOver", null);
__decorate([
    mobx_1.action.bound
], StackedAreaChart.prototype, "onLegendMouseLeave", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "focusedSeriesNames", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "isFocusMode", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "tooltip", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "legendX", null);
__decorate([
    mobx_1.computed
], StackedAreaChart.prototype, "series", null);
StackedAreaChart = __decorate([
    mobx_react_1.observer
], StackedAreaChart);
exports.StackedAreaChart = StackedAreaChart;
//# sourceMappingURL=StackedAreaChart.js.map