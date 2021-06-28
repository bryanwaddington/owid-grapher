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
exports.ScatterLine = exports.ScatterPoint = void 0;
const PointVector_1 = require("../../clientUtils/PointVector");
const Util_1 = require("../../clientUtils/Util");
const mobx_react_1 = require("mobx-react");
const react_1 = __importDefault(require("react"));
const MultiColorPolyline_1 = require("./MultiColorPolyline");
const Triangle_1 = require("./Triangle");
// When there's only a single point in a series (e.g. single year mode)
let ScatterPoint = class ScatterPoint extends react_1.default.Component {
    render() {
        const { series, isLayerMode, isConnected } = this.props;
        const value = Util_1.first(series.points);
        if (value === undefined)
            return null;
        const color = series.isFocus || !isLayerMode ? value.color : "#e2e2e2";
        const isLabelled = series.allLabels.some((label) => !label.isHidden);
        const size = !series.isFocus && isConnected ? 1 + value.size / 16 : value.size;
        const cx = value.position.x.toFixed(2);
        const cy = value.position.y.toFixed(2);
        const stroke = isLayerMode ? "#bbb" : isLabelled ? "#333" : "#666";
        return (react_1.default.createElement("g", { key: series.displayKey, className: series.displayKey },
            series.isFocus && (react_1.default.createElement("circle", { cx: cx, cy: cy, fill: "none", stroke: color, r: (size + 3).toFixed(2) })),
            react_1.default.createElement("circle", { cx: cx, cy: cy, r: size.toFixed(2), fill: color, opacity: 0.8, stroke: stroke, strokeWidth: 0.5 })));
    }
};
ScatterPoint = __decorate([
    mobx_react_1.observer
], ScatterPoint);
exports.ScatterPoint = ScatterPoint;
let ScatterLine = class ScatterLine extends react_1.default.Component {
    render() {
        const { series, isLayerMode, isConnected } = this.props;
        if (series.points.length === 1)
            return (react_1.default.createElement(ScatterPoint, { series: series, isLayerMode: isLayerMode, isConnected: isConnected }));
        const firstValue = Util_1.first(series.points);
        const lastValue = Util_1.last(series.points);
        if (firstValue === undefined || lastValue === undefined)
            return null;
        let rotation = PointVector_1.PointVector.angle(series.offsetVector, PointVector_1.PointVector.up);
        if (series.offsetVector.x < 0)
            rotation = -rotation;
        const opacity = 0.7;
        return (react_1.default.createElement("g", { key: series.displayKey, className: series.displayKey },
            react_1.default.createElement("circle", { cx: firstValue.position.x.toFixed(2), cy: firstValue.position.y.toFixed(2), r: (1 + firstValue.size / 25).toFixed(1), fill: isLayerMode ? "#e2e2e2" : firstValue.color, stroke: "none", opacity: opacity }),
            react_1.default.createElement(MultiColorPolyline_1.MultiColorPolyline, { points: series.points.map((v) => ({
                    x: v.position.x,
                    y: v.position.y,
                    color: isLayerMode ? "#ccc" : v.color,
                })), strokeWidth: (0.3 + series.size / 16).toFixed(2), opacity: opacity }),
            react_1.default.createElement(Triangle_1.Triangle, { transform: `rotate(${rotation}, ${lastValue.position.x.toFixed(2)}, ${lastValue.position.y.toFixed(2)})`, cx: lastValue.position.x, cy: lastValue.position.y, r: 1.5 + lastValue.size / 16, fill: isLayerMode ? "#e2e2e2" : lastValue.color, opacity: opacity })));
    }
};
ScatterLine = __decorate([
    mobx_react_1.observer
], ScatterLine);
exports.ScatterLine = ScatterLine;
//# sourceMappingURL=ScatterPoints.js.map