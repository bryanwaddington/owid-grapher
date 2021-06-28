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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiColorPolyline = exports.getSegmentsFromPoints = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Util_1 = require("../../clientUtils/Util");
function getMidpoint(a, b) {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}
function toPoint(point) {
    return {
        x: point.x,
        y: point.y,
    };
}
function getSegmentsFromPoints(points) {
    const segments = [];
    points.forEach((currentPoint) => {
        const currentSegment = segments[segments.length - 1];
        if (!currentSegment) {
            segments.push({
                points: [toPoint(currentPoint)],
                color: currentPoint.color,
            });
        }
        else if (currentSegment.color === currentPoint.color) {
            currentSegment.points.push(toPoint(currentPoint));
        }
        else {
            const midPoint = getMidpoint(Util_1.last(currentSegment.points), currentPoint);
            currentSegment.points.push(midPoint);
            segments.push({
                points: [midPoint, toPoint(currentPoint)],
                color: currentPoint.color,
            });
        }
    });
    return segments;
}
exports.getSegmentsFromPoints = getSegmentsFromPoints;
function toSvgPoints(points) {
    return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
}
let MultiColorPolyline = class MultiColorPolyline extends React.Component {
    get segments() {
        return getSegmentsFromPoints(this.props.points);
    }
    render() {
        const _a = this.props, { markerStart, markerMid, markerEnd } = _a, polylineProps = __rest(_a, ["markerStart", "markerMid", "markerEnd"]);
        return (React.createElement(React.Fragment, null, this.segments.map((group, index) => (React.createElement("polyline", Object.assign({}, polylineProps, { key: index, points: toSvgPoints(group.points), stroke: group.color, fill: "none", strokeLinecap: "butt" // `butt` allows us to have clean miter joints
            , markerStart: index === 0 ? markerStart : undefined, markerMid: markerMid, markerEnd: index === this.segments.length - 1
                ? markerEnd
                : undefined }))))));
    }
};
__decorate([
    mobx_1.computed
], MultiColorPolyline.prototype, "segments", null);
MultiColorPolyline = __decorate([
    mobx_react_1.observer
], MultiColorPolyline);
exports.MultiColorPolyline = MultiColorPolyline;
//# sourceMappingURL=MultiColorPolyline.js.map