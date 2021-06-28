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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisTickMarks = exports.HorizontalAxisComponent = exports.VerticalAxisComponent = exports.DualAxisComponent = exports.HorizontalAxisGridLines = exports.VerticalAxisGridLines = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const classnames_1 = __importDefault(require("classnames"));
let VerticalAxisGridLines = class VerticalAxisGridLines extends React.Component {
    render() {
        const { bounds, verticalAxis } = this.props;
        const axis = verticalAxis.clone();
        axis.range = bounds.yRange();
        return (React.createElement("g", { className: classnames_1.default("AxisGridLines", "horizontalLines") }, axis.getTickValues().map((t, i) => {
            const color = t.faint
                ? "#eee"
                : t.value === 0
                    ? "#ccc"
                    : "#d3d3d3";
            return (React.createElement("line", { key: i, x1: bounds.left.toFixed(2), y1: axis.place(t.value), x2: bounds.right.toFixed(2), y2: axis.place(t.value), stroke: color, strokeDasharray: t.value !== 0 ? "3,2" : undefined }));
        })));
    }
};
VerticalAxisGridLines = __decorate([
    mobx_react_1.observer
], VerticalAxisGridLines);
exports.VerticalAxisGridLines = VerticalAxisGridLines;
let HorizontalAxisGridLines = class HorizontalAxisGridLines extends React.Component {
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    render() {
        const { horizontalAxis } = this.props;
        const { bounds } = this;
        const axis = horizontalAxis.clone();
        axis.range = bounds.xRange();
        return (React.createElement("g", { className: classnames_1.default("AxisGridLines", "verticalLines") }, axis.getTickValues().map((t, i) => {
            const color = t.faint
                ? "#eee"
                : t.value === 0
                    ? "#ccc"
                    : "#d3d3d3";
            return (React.createElement("line", { key: i, x1: axis.place(t.value), y1: bounds.bottom.toFixed(2), x2: axis.place(t.value), y2: bounds.top.toFixed(2), stroke: color, strokeDasharray: t.value !== 0 ? "3,2" : undefined }));
        })));
    }
};
__decorate([
    mobx_1.computed
], HorizontalAxisGridLines.prototype, "bounds", null);
HorizontalAxisGridLines = __decorate([
    mobx_react_1.observer
], HorizontalAxisGridLines);
exports.HorizontalAxisGridLines = HorizontalAxisGridLines;
let DualAxisComponent = class DualAxisComponent extends React.Component {
    render() {
        const { dualAxis, showTickMarks } = this.props;
        const { bounds, horizontalAxis, verticalAxis, innerBounds } = dualAxis;
        const verticalGridlines = verticalAxis.hideGridlines ? null : (React.createElement(VerticalAxisGridLines, { verticalAxis: verticalAxis, bounds: innerBounds }));
        const horizontalGridlines = horizontalAxis.hideGridlines ? null : (React.createElement(HorizontalAxisGridLines, { horizontalAxis: horizontalAxis, bounds: innerBounds }));
        const verticalAxisComponent = verticalAxis.hideAxis ? null : (React.createElement(VerticalAxisComponent, { bounds: bounds, verticalAxis: verticalAxis }));
        const horizontalAxisComponent = horizontalAxis.hideAxis ? null : (React.createElement(HorizontalAxisComponent, { bounds: bounds, axisPosition: innerBounds.bottom, axis: horizontalAxis, showTickMarks: showTickMarks }));
        return (React.createElement("g", { className: "DualAxisView" },
            horizontalAxisComponent,
            verticalAxisComponent,
            verticalGridlines,
            horizontalGridlines));
    }
};
DualAxisComponent = __decorate([
    mobx_react_1.observer
], DualAxisComponent);
exports.DualAxisComponent = DualAxisComponent;
let VerticalAxisComponent = class VerticalAxisComponent extends React.Component {
    render() {
        const { bounds, verticalAxis } = this.props;
        const { ticks, labelTextWrap } = verticalAxis;
        const textColor = "#666";
        return (React.createElement("g", { className: "VerticalAxis" },
            labelTextWrap &&
                labelTextWrap.render(-bounds.centerY - labelTextWrap.width / 2, bounds.left, { transform: "rotate(-90)" }),
            ticks.map((tick, i) => (React.createElement("text", { key: i, x: (bounds.left + verticalAxis.width - 5).toFixed(2), y: verticalAxis.place(tick), fill: textColor, dominantBaseline: "middle", textAnchor: "end", fontSize: verticalAxis.tickFontSize }, verticalAxis.formatTick(tick))))));
    }
};
VerticalAxisComponent = __decorate([
    mobx_react_1.observer
], VerticalAxisComponent);
exports.VerticalAxisComponent = VerticalAxisComponent;
class HorizontalAxisComponent extends React.Component {
    get scaleType() {
        return this.props.axis.scaleType;
    }
    set scaleType(scaleType) {
        this.props.axis.config.scaleType = scaleType;
    }
    // for scale selector. todo: cleanup
    get bounds() {
        const { bounds } = this.props;
        return new Bounds_1.Bounds(bounds.right, bounds.bottom - 30, 100, 100);
    }
    render() {
        const { bounds, axis, axisPosition, showTickMarks } = this.props;
        const { ticks, labelTextWrap: label, labelOffset } = axis;
        const textColor = "#666";
        const tickMarks = showTickMarks ? (React.createElement(AxisTickMarks, { tickMarkTopPosition: axisPosition, tickMarkXPositions: ticks.map((tick) => axis.place(tick)), color: "#ccc" })) : undefined;
        return (React.createElement("g", { className: "HorizontalAxis" },
            label &&
                label.render(bounds.centerX - label.width / 2, bounds.bottom - label.height),
            tickMarks,
            ticks.map((tick, i) => {
                const label = axis.formatTick(tick, {
                    isFirstOrLastTick: i === 0 || i === ticks.length - 1,
                });
                const rawXPosition = axis.place(tick);
                // Ensure the first label does not exceed the chart viewing area
                const xPosition = i === 0
                    ? Bounds_1.Bounds.getRightShiftForMiddleAlignedTextIfNeeded(label, axis.tickFontSize, rawXPosition) + rawXPosition
                    : rawXPosition;
                const element = (React.createElement("text", { key: i, x: xPosition, y: bounds.bottom - labelOffset, fill: textColor, textAnchor: "middle", fontSize: axis.tickFontSize }, label));
                return element;
            })));
    }
}
__decorate([
    mobx_1.computed
], HorizontalAxisComponent.prototype, "scaleType", null);
__decorate([
    mobx_1.computed
], HorizontalAxisComponent.prototype, "bounds", null);
exports.HorizontalAxisComponent = HorizontalAxisComponent;
class AxisTickMarks extends React.Component {
    render() {
        const { tickMarkTopPosition, tickMarkXPositions, color } = this.props;
        const tickSize = 4;
        const tickBottom = tickMarkTopPosition + tickSize;
        return tickMarkXPositions.map((tickMarkPosition, index) => {
            return (React.createElement("line", { key: index, x1: tickMarkPosition, y1: tickMarkTopPosition, x2: tickMarkPosition, y2: tickBottom, stroke: color }));
        });
    }
}
exports.AxisTickMarks = AxisTickMarks;
//# sourceMappingURL=AxisViews.js.map