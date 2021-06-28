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
exports.SparkBars = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const d3_scale_1 = require("d3-scale");
const decko_1 = require("decko");
const Util_1 = require("../../clientUtils/Util");
var BarState;
(function (BarState) {
    BarState["highlighted"] = "highlighted";
    BarState["current"] = "current";
    BarState["normal"] = "normal";
    BarState["faint"] = "faint";
})(BarState || (BarState = {}));
let SparkBars = class SparkBars extends React.Component {
    get maxY() {
        return Util_1.max(this.bars.map((d) => { var _a; return (d ? (_a = this.props.y(d)) !== null && _a !== void 0 ? _a : 0 : 0); }));
    }
    get barHeightScale() {
        const maxY = this.maxY;
        return d3_scale_1.scaleLinear()
            .domain([0, maxY !== undefined && maxY > 0 ? maxY : 1])
            .range([0, 1]);
    }
    barHeight(d) {
        if (d !== undefined) {
            const value = this.props.y(d);
            if (value !== undefined) {
                const ratio = this.barHeightScale(value);
                return `${ratio * 100}%`;
            }
        }
        return "0%";
    }
    barState(d) {
        if (d === this.props.highlightedX)
            return BarState.highlighted;
        if (d === this.props.currentX)
            return BarState.current;
        if (this.props.highlightedX !== undefined)
            return BarState.faint;
        return BarState.normal;
    }
    get bars() {
        const indexed = Util_1.keyBy(this.props.data, this.props.x);
        const [start, end] = this.props.xDomain;
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(indexed[i]);
        }
        return result;
    }
    render() {
        return (React.createElement("div", { className: this.props.className, onMouseLeave: () => { var _a, _b; return (_b = (_a = this.props).onHover) === null || _b === void 0 ? void 0 : _b.call(_a, undefined, undefined); } }, this.bars.map((d, i) => (React.createElement("div", { key: i, className: "bar-wrapper", onMouseEnter: () => { var _a, _b; return (_b = (_a = this.props).onHover) === null || _b === void 0 ? void 0 : _b.call(_a, d, i); } },
            this.props.highlightedX === i &&
                d !== undefined &&
                this.props.renderValue && (React.createElement("div", { className: "hanging-value highlighted highlighted-color" }, this.props.renderValue(d))),
            React.createElement("div", { className: `bar ${d
                    ? this.barState(this.props.x(d))
                    : BarState.normal}`, style: {
                    height: this.barHeight(d),
                    backgroundColor: this.props.color,
                } }))))));
    }
};
SparkBars.defaultProps = {
    onHover: () => undefined,
    className: "spark-bars",
};
__decorate([
    mobx_1.computed
], SparkBars.prototype, "maxY", null);
__decorate([
    mobx_1.computed
], SparkBars.prototype, "barHeightScale", null);
__decorate([
    decko_1.bind
], SparkBars.prototype, "barHeight", null);
__decorate([
    decko_1.bind
], SparkBars.prototype, "barState", null);
__decorate([
    mobx_1.computed
], SparkBars.prototype, "bars", null);
SparkBars = __decorate([
    mobx_react_1.observer
], SparkBars);
exports.SparkBars = SparkBars;
//# sourceMappingURL=SparkBars.js.map