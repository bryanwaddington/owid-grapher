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
exports.GrapherFigureView = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../clientUtils/Bounds");
const Grapher_1 = require("../grapher/core/Grapher");
// Wrapper for Grapher that uses css on figure element to determine the bounds
let GrapherFigureView = class GrapherFigureView extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    calcBounds() {
        this.bounds = Bounds_1.Bounds.fromRect(this.base.current.getBoundingClientRect());
    }
    componentDidMount() {
        window.addEventListener("resize", this.calcBounds);
        this.calcBounds();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.calcBounds);
    }
    render() {
        const props = Object.assign(Object.assign({}, this.props.grapher.toObject()), { bounds: this.bounds });
        return (
        // They key= in here makes it so that the chart is re-loaded when the slug changes.
        // This is especially important for SearchResults, where the preview chart can change as
        // the search query changes.
        React.createElement("figure", { "data-grapher-src": true, ref: this.base }, this.bounds && React.createElement(Grapher_1.Grapher, Object.assign({ key: props.slug }, props))));
    }
};
__decorate([
    mobx_1.observable.ref
], GrapherFigureView.prototype, "bounds", void 0);
__decorate([
    mobx_1.action.bound
], GrapherFigureView.prototype, "calcBounds", null);
GrapherFigureView = __decorate([
    mobx_react_1.observer
], GrapherFigureView);
exports.GrapherFigureView = GrapherFigureView;
//# sourceMappingURL=GrapherFigureView.js.map