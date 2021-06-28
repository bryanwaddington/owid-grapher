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
exports.ScatterPointsWithLabels = void 0;
const d3_scale_1 = require("d3-scale");
const d3_selection_1 = require("d3-selection");
const NoDataModal_1 = require("../noDataModal/NoDataModal");
const CoreTableConstants_1 = require("../../coreTable/CoreTableConstants");
const PointVector_1 = require("../../clientUtils/PointVector");
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_1 = __importDefault(require("react"));
const Halos_1 = require("./Halos");
const MultiColorPolyline_1 = require("./MultiColorPolyline");
const ScatterPlotChartConstants_1 = require("./ScatterPlotChartConstants");
const ScatterPoints_1 = require("./ScatterPoints");
const ScatterUtils_1 = require("./ScatterUtils");
const Triangle_1 = require("./Triangle");
// This is the component that actually renders the points. The higher level ScatterPlot class renders points, legends, comparison lines, etc.
let ScatterPointsWithLabels = class ScatterPointsWithLabels extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.base = react_1.default.createRef();
    }
    get seriesArray() {
        return this.props.seriesArray;
    }
    get isConnected() {
        return this.seriesArray.some((g) => g.points.length > 1);
    }
    get focusedSeriesNames() {
        return Util_1.intersection(this.props.focusedSeriesNames || [], this.seriesArray.map((g) => g.seriesName));
    }
    get hoveredSeriesNames() {
        return this.props.hoveredSeriesNames;
    }
    // Layered mode occurs when any entity on the chart is hovered or focused
    // Then, a special "foreground" set of entities is rendered over the background
    get isLayerMode() {
        return (this.focusedSeriesNames.length > 0 ||
            this.hoveredSeriesNames.length > 0);
    }
    get bounds() {
        return this.props.dualAxis.innerBounds;
    }
    // When focusing multiple entities, we hide some information to declutter
    get isSubtleForeground() {
        return (this.focusedSeriesNames.length > 1 &&
            this.props.seriesArray.some((series) => series.points.length > 2));
    }
    get colorScale() {
        return this.props.colorScale;
    }
    get sizeScale() {
        const sizeScale = d3_scale_1.scaleLinear()
            .range([10, 1000])
            .domain(this.props.sizeDomain);
        return sizeScale;
    }
    get fontScale() {
        return d3_scale_1.scaleLinear().range([10, 13]).domain(this.sizeScale.domain());
    }
    get hideConnectedScatterLines() {
        return this.props.hideConnectedScatterLines;
    }
    // Pre-transform data for rendering
    get initialRenderSeries() {
        const { seriesArray, sizeScale, fontScale, colorScale, bounds } = this;
        const xAxis = this.props.dualAxis.horizontalAxis.clone();
        xAxis.range = bounds.xRange();
        const yAxis = this.props.dualAxis.verticalAxis.clone();
        yAxis.range = this.bounds.yRange();
        return Util_1.sortNumeric(seriesArray.map((series) => {
            const points = series.points.map((point) => {
                const area = sizeScale(point.size || 4);
                const scaleColor = colorScale !== undefined
                    ? colorScale.getColor(point.color)
                    : undefined;
                return {
                    position: new PointVector_1.PointVector(Math.floor(xAxis.place(point.x)), Math.floor(yAxis.place(point.y))),
                    color: scaleColor !== null && scaleColor !== void 0 ? scaleColor : series.color,
                    size: Math.sqrt(area / Math.PI),
                    fontSize: fontScale(series.size || 1),
                    time: point.time,
                    label: point.label,
                };
            });
            return {
                seriesName: series.seriesName,
                displayKey: "key-" + Util_1.makeSafeForCSS(series.seriesName),
                color: series.color,
                size: Util_1.last(points).size,
                points,
                text: series.label,
                midLabels: [],
                allLabels: [],
                offsetVector: PointVector_1.PointVector.zero,
            };
        }), (d) => d.size, CoreTableConstants_1.SortOrder.desc);
    }
    get renderSeries() {
        // Draw the largest points first so that smaller ones can sit on top of them
        const renderData = this.initialRenderSeries;
        for (const series of renderData) {
            series.isHover = this.hoveredSeriesNames.includes(series.seriesName);
            series.isFocus = this.focusedSeriesNames.includes(series.seriesName);
            series.isForeground = series.isHover || series.isFocus;
            if (series.isHover)
                series.size += 1;
        }
        for (const series of renderData) {
            series.startLabel = ScatterUtils_1.makeStartLabel(series, this.isSubtleForeground, this.hideConnectedScatterLines);
            series.midLabels = ScatterUtils_1.makeMidLabels(series, this.isSubtleForeground, this.hideConnectedScatterLines);
            series.endLabel = ScatterUtils_1.makeEndLabel(series, this.isSubtleForeground, this.hideConnectedScatterLines);
            series.allLabels = [series.startLabel]
                .concat(series.midLabels)
                .concat([series.endLabel])
                .filter((x) => x);
        }
        const labels = Util_1.flatten(renderData.map((series) => series.allLabels));
        // Ensure labels fit inside bounds
        // Must do before collision detection since it'll change the positions
        this.moveLabelsInsideChartBounds(labels, this.bounds);
        const labelsByPriority = Util_1.sortNumeric(labels, (l) => ScatterUtils_1.labelPriority(l), CoreTableConstants_1.SortOrder.desc);
        if (this.focusedSeriesNames.length > 0)
            this.hideUnselectedLabels(labelsByPriority);
        this.hideCollidingLabelsByPriority(labelsByPriority);
        return renderData;
    }
    hideUnselectedLabels(labelsByPriority) {
        labelsByPriority
            .filter((label) => !label.series.isFocus && !label.series.isHover)
            .forEach((label) => (label.isHidden = true));
    }
    hideCollidingLabelsByPriority(labelsByPriority) {
        for (let i = 0; i < labelsByPriority.length; i++) {
            const higherPriorityLabel = labelsByPriority[i];
            if (higherPriorityLabel.isHidden)
                continue;
            for (let j = i + 1; j < labelsByPriority.length; j++) {
                const lowerPriorityLabel = labelsByPriority[j];
                if (lowerPriorityLabel.isHidden)
                    continue;
                const isHighlightedEndLabelOfEqualPriority = lowerPriorityLabel.isEnd &&
                    (lowerPriorityLabel.series.isHover ||
                        lowerPriorityLabel.series.isFocus) &&
                    higherPriorityLabel.series.isHover ===
                        lowerPriorityLabel.series.isHover &&
                    higherPriorityLabel.series.isFocus ===
                        lowerPriorityLabel.series.isFocus;
                if (isHighlightedEndLabelOfEqualPriority
                    ? // For highlighted end labels of equal priority, we want to allow some
                        // overlap – labels are still readable even if they overlap
                        higherPriorityLabel.bounds
                            .pad(6) // allow up to 6px of overlap
                            .intersects(lowerPriorityLabel.bounds)
                    : // For non-highlighted labels we want to leave more space between labels,
                        // partly to have a less noisy chart, and partly to prevent readers from
                        // thinking that "everything is labelled". In the past this has made
                        // readers think that if a label doesn't exist, it isn't plotted on the
                        // chart.
                        higherPriorityLabel.bounds
                            .pad(-6)
                            .intersects(lowerPriorityLabel.bounds)) {
                    lowerPriorityLabel.isHidden = true;
                }
            }
        }
    }
    // todo: move this to bounds class with a test
    moveLabelsInsideChartBounds(labels, bounds) {
        for (const label of labels) {
            if (label.bounds.left < bounds.left - 1)
                label.bounds = label.bounds.extend({
                    x: label.bounds.x + label.bounds.width,
                });
            else if (label.bounds.right > bounds.right + 1)
                label.bounds = label.bounds.extend({
                    x: label.bounds.x - label.bounds.width,
                });
            if (label.bounds.top < bounds.top - 1)
                label.bounds = label.bounds.extend({ y: bounds.top });
            else if (label.bounds.bottom > bounds.bottom + 1)
                label.bounds = label.bounds.extend({
                    y: bounds.bottom - label.bounds.height,
                });
        }
    }
    onMouseLeave() {
        if (this.mouseFrame !== undefined)
            cancelAnimationFrame(this.mouseFrame);
        if (this.props.onMouseLeave)
            this.props.onMouseLeave();
    }
    onMouseMove(ev) {
        if (this.mouseFrame !== undefined)
            cancelAnimationFrame(this.mouseFrame);
        const nativeEvent = ev.nativeEvent;
        this.mouseFrame = requestAnimationFrame(() => {
            const mouse = Util_1.getRelativeMouse(this.base.current, nativeEvent);
            const closestSeries = Util_1.minBy(this.renderSeries, (series) => {
                if (series.points.length > 1)
                    return Util_1.min(series.points.slice(0, -1).map((d, i) => {
                        return PointVector_1.PointVector.distanceFromPointToLineSq(mouse, d.position, series.points[i + 1].position);
                    }));
                return Util_1.min(series.points.map((v) => PointVector_1.PointVector.distanceSq(v.position, mouse)));
            });
            if (closestSeries && this.props.onMouseOver) {
                const series = this.seriesArray.find((series) => series.seriesName === closestSeries.seriesName);
                if (series)
                    this.props.onMouseOver(series);
            }
        });
    }
    onClick() {
        if (this.props.onClick)
            this.props.onClick();
    }
    get backgroundSeries() {
        return this.renderSeries.filter((series) => !series.isForeground);
    }
    get foregroundSeries() {
        return this.renderSeries.filter((series) => !!series.isForeground);
    }
    renderBackgroundSeries() {
        const { backgroundSeries, isLayerMode, isConnected, hideConnectedScatterLines, } = this;
        return hideConnectedScatterLines
            ? []
            : backgroundSeries.map((series) => (react_1.default.createElement(ScatterPoints_1.ScatterLine, { key: series.seriesName, series: series, isLayerMode: isLayerMode, isConnected: isConnected })));
    }
    renderBackgroundLabels() {
        const { isLayerMode } = this;
        return (react_1.default.createElement("g", { className: "backgroundLabels", fill: !isLayerMode ? "#333" : "#aaa" }, this.backgroundSeries.map((series) => {
            return series.allLabels
                .filter((label) => !label.isHidden)
                .map((label) => Halos_1.getElementWithHalo(series.displayKey + "-endLabel", react_1.default.createElement("text", { x: label.bounds.x.toFixed(2), y: (label.bounds.y + label.bounds.height).toFixed(2), fontSize: label.fontSize.toFixed(2), fontWeight: label.fontWeight, fill: isLayerMode ? "#aaa" : label.color }, label.text)));
        })));
    }
    get renderUid() {
        return Util_1.guid();
    }
    renderForegroundSeries() {
        const { isSubtleForeground, hideConnectedScatterLines } = this;
        return this.foregroundSeries.map((series) => {
            const lastValue = Util_1.last(series.points);
            const strokeWidth = (hideConnectedScatterLines
                ? 3
                : series.isHover
                    ? 3
                    : isSubtleForeground
                        ? 1.5
                        : 2) +
                lastValue.size * 0.05;
            if (series.points.length === 1)
                return react_1.default.createElement(ScatterPoints_1.ScatterPoint, { key: series.displayKey, series: series });
            const firstValue = Util_1.first(series.points);
            const opacity = isSubtleForeground ? 0.9 : 1;
            const radius = hideConnectedScatterLines
                ? strokeWidth
                : strokeWidth / 2 + 1;
            let rotation = PointVector_1.PointVector.angle(series.offsetVector, PointVector_1.PointVector.up);
            if (series.offsetVector.x < 0)
                rotation = -rotation;
            return (react_1.default.createElement("g", { key: series.displayKey, className: series.displayKey },
                !hideConnectedScatterLines && (react_1.default.createElement(MultiColorPolyline_1.MultiColorPolyline, { points: series.points.map((point) => ({
                        x: point.position.x,
                        y: point.position.y,
                        color: point.color,
                    })), strokeWidth: strokeWidth, opacity: opacity })),
                (series.isFocus || hideConnectedScatterLines) &&
                    firstValue && (react_1.default.createElement("circle", { cx: firstValue.position.x.toFixed(2), cy: firstValue.position.y.toFixed(2), r: radius, fill: firstValue.color, opacity: opacity, stroke: firstValue.color, strokeOpacity: 0.6 })),
                (series.isHover || hideConnectedScatterLines) &&
                    series.points
                        .slice(1, hideConnectedScatterLines ? undefined : -1)
                        .map((v, index) => (react_1.default.createElement("circle", { key: index, cx: v.position.x, cy: v.position.y, r: radius, fill: v.color, stroke: "none" }))),
                !hideConnectedScatterLines && (react_1.default.createElement(Triangle_1.Triangle, { transform: `rotate(${rotation}, ${lastValue.position.x.toFixed(2)}, ${lastValue.position.y.toFixed(2)})`, cx: lastValue.position.x, cy: lastValue.position.y, r: strokeWidth * 2, fill: lastValue.color, opacity: opacity }))));
        });
    }
    renderForegroundLabels() {
        return this.foregroundSeries.map((series) => {
            return series.allLabels
                .filter((label) => !label.isHidden)
                .map((label, index) => Halos_1.getElementWithHalo(`${series.displayKey}-label-${index}`, react_1.default.createElement("text", { x: label.bounds.x.toFixed(2), y: (label.bounds.y + label.bounds.height).toFixed(2), fontSize: label.fontSize, fontFamily: ScatterPlotChartConstants_1.ScatterLabelFontFamily, fontWeight: label.fontWeight, fill: label.color }, label.text)));
        });
    }
    runAnimation() {
        const radiuses = [];
        this.animSelection = d3_selection_1.select(this.base.current).selectAll("circle");
        this.animSelection
            .each(function () {
            const circle = this;
            radiuses.push(circle.getAttribute("r"));
            circle.setAttribute("r", "0");
        })
            .transition()
            .duration(500)
            .attr("r", (_, i) => radiuses[i])
            .on("end", () => this.forceUpdate());
    }
    componentDidMount() {
        this.runAnimation();
    }
    componentWillUnmount() {
        if (this.animSelection)
            this.animSelection.interrupt();
    }
    render() {
        const { bounds, renderSeries, renderUid } = this;
        const clipBounds = bounds.pad(-10);
        if (Util_1.isEmpty(renderSeries))
            return (react_1.default.createElement(NoDataModal_1.NoDataModal, { manager: this.props.noDataModalManager, bounds: bounds }));
        return (react_1.default.createElement("g", { ref: this.base, className: "PointsWithLabels clickable", clipPath: `url(#scatterBounds-${renderUid})`, onMouseMove: this.onMouseMove, onMouseLeave: this.onMouseLeave, onClick: this.onClick, fontFamily: ScatterPlotChartConstants_1.ScatterLabelFontFamily },
            react_1.default.createElement("rect", { key: "background", x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, fill: "rgba(255,255,255,0)" }),
            react_1.default.createElement("defs", null,
                react_1.default.createElement("clipPath", { id: `scatterBounds-${renderUid}` },
                    react_1.default.createElement("rect", { x: clipBounds.x, y: clipBounds.y, width: clipBounds.width, height: clipBounds.height }))),
            this.renderBackgroundSeries(),
            this.renderBackgroundLabels(),
            this.renderForegroundSeries(),
            this.renderForegroundLabels()));
    }
};
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "seriesArray", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "isConnected", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "focusedSeriesNames", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "hoveredSeriesNames", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "isLayerMode", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "bounds", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "isSubtleForeground", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "colorScale", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "sizeScale", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "fontScale", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "hideConnectedScatterLines", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "initialRenderSeries", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "renderSeries", null);
__decorate([
    mobx_1.action.bound
], ScatterPointsWithLabels.prototype, "onMouseLeave", null);
__decorate([
    mobx_1.action.bound
], ScatterPointsWithLabels.prototype, "onMouseMove", null);
__decorate([
    mobx_1.action.bound
], ScatterPointsWithLabels.prototype, "onClick", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "backgroundSeries", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "foregroundSeries", null);
__decorate([
    mobx_1.computed
], ScatterPointsWithLabels.prototype, "renderUid", null);
ScatterPointsWithLabels = __decorate([
    mobx_react_1.observer
], ScatterPointsWithLabels);
exports.ScatterPointsWithLabels = ScatterPointsWithLabels;
//# sourceMappingURL=ScatterPointsWithLabels.js.map