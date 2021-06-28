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
exports.ComparisonLine = void 0;
const d3_shape_1 = require("d3-shape");
const Util_1 = require("../../clientUtils/Util");
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const ComparisonLineGenerator_1 = require("./ComparisonLineGenerator");
const Bounds_1 = require("../../clientUtils/Bounds");
const PointVector_1 = require("../../clientUtils/PointVector");
const Halos_1 = require("./Halos");
let ComparisonLine = class ComparisonLine extends React.Component {
    constructor() {
        super(...arguments);
        this.renderUid = Util_1.guid();
    }
    get controlData() {
        const { comparisonLine, dualAxis } = this.props;
        const { horizontalAxis, verticalAxis } = dualAxis;
        return ComparisonLineGenerator_1.generateComparisonLinePoints(comparisonLine.yEquals, horizontalAxis.domain, verticalAxis.domain, horizontalAxis.scaleType, verticalAxis.scaleType);
    }
    get linePath() {
        const { controlData } = this;
        const { horizontalAxis, verticalAxis } = this.props.dualAxis;
        const line = d3_shape_1.line()
            .curve(d3_shape_1.curveLinear)
            .x((d) => horizontalAxis.place(d[0]))
            .y((d) => verticalAxis.place(d[1]));
        return line(controlData);
    }
    get placedLabel() {
        const { label } = this.props.comparisonLine;
        if (!label)
            return;
        const { controlData } = this;
        const { horizontalAxis, verticalAxis, innerBounds, } = this.props.dualAxis;
        // Find the points of the line that are actually placeable on the chart
        const linePoints = controlData
            .map((d) => new PointVector_1.PointVector(horizontalAxis.place(d[0]), verticalAxis.place(d[1])))
            .filter((p) => innerBounds.contains(p));
        if (!linePoints.length)
            return;
        const midPoint = linePoints[Math.floor(linePoints.length / 2)];
        const p1 = linePoints[0];
        const p2 = linePoints[linePoints.length - 1];
        const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
        const bounds = Bounds_1.Bounds.forText(label);
        return {
            x: midPoint.x,
            y: midPoint.y,
            bounds: bounds,
            angle: angle,
            text: label,
        };
    }
    render() {
        const { innerBounds } = this.props.dualAxis;
        const { linePath, renderUid, placedLabel } = this;
        return (React.createElement("g", { className: "comparisonLine" },
            React.createElement("defs", null,
                React.createElement("clipPath", { id: `axisBounds-${renderUid}` },
                    React.createElement("rect", { x: innerBounds.x, y: innerBounds.y, width: innerBounds.width, height: innerBounds.height }))),
            React.createElement("path", { style: {
                    opacity: 0.9,
                    fill: "none",
                    stroke: "#ccc",
                    strokeDasharray: "2 2",
                }, id: `path-${renderUid}`, d: linePath || undefined, clipPath: `url(#axisBounds-${renderUid})` }),
            placedLabel && (React.createElement("text", { style: {
                    fontSize: "80%",
                    opacity: 0.9,
                    textAnchor: "end",
                    fill: "#999",
                }, clipPath: `url(#axisBounds-${renderUid})` }, Halos_1.getElementWithHalo(`path-${renderUid}`, React.createElement("textPath", { baselineShift: "-0.2rem", href: `#path-${renderUid}`, startOffset: "90%" }, placedLabel.text))))));
    }
};
__decorate([
    mobx_1.computed
], ComparisonLine.prototype, "controlData", null);
__decorate([
    mobx_1.computed
], ComparisonLine.prototype, "linePath", null);
__decorate([
    mobx_1.computed
], ComparisonLine.prototype, "placedLabel", null);
ComparisonLine = __decorate([
    mobx_react_1.observer
], ComparisonLine);
exports.ComparisonLine = ComparisonLine;
//# sourceMappingURL=ComparisonLine.js.map