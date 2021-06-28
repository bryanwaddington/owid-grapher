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
exports.Tooltip = exports.TooltipView = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
let TooltipView = class TooltipView extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    get rendered() {
        var _a, _b, _c;
        const { bounds } = this;
        const tooltipProvider = this.props.tooltipProvider;
        if (!tooltipProvider.tooltip)
            return null;
        const tooltip = tooltipProvider.tooltip;
        const offsetX = (_a = tooltip.offsetX) !== null && _a !== void 0 ? _a : 0;
        let offsetY = (_b = tooltip.offsetY) !== null && _b !== void 0 ? _b : 0;
        if (tooltip.offsetYDirection === "upward") {
            offsetY = -offsetY - ((_c = bounds === null || bounds === void 0 ? void 0 : bounds.height) !== null && _c !== void 0 ? _c : 0);
        }
        let x = tooltip.x + offsetX;
        let y = tooltip.y + offsetY;
        // Ensure tooltip remains inside chart
        if (bounds) {
            if (x + bounds.width > this.props.width)
                x -= bounds.width + 2 * offsetX;
            if (y + bounds.height > this.props.height)
                y -= bounds.height + 2 * offsetY;
            if (x < 0)
                x = 0;
            if (y < 0)
                y = 0;
        }
        const tooltipStyle = {
            position: "absolute",
            pointerEvents: "none",
            left: `${x}px`,
            top: `${y}px`,
            whiteSpace: "nowrap",
            backgroundColor: "rgba(255,255,255,0.92)",
            boxShadow: "0 2px 2px rgba(0,0,0,.12), 0 0 1px rgba(0,0,0,.35)",
            borderRadius: "2px",
            textAlign: "left",
            fontSize: "0.9em",
        };
        return (React.createElement("div", { ref: this.base, className: "Tooltip", style: Object.assign(Object.assign({}, tooltipStyle), tooltip.style) }, tooltip.children));
    }
    updateBounds() {
        if (this.base.current)
            this.bounds = Bounds_1.Bounds.fromElement(this.base.current);
    }
    componentDidMount() {
        this.updateBounds();
    }
    componentDidUpdate() {
        this.updateBounds();
    }
    render() {
        return this.rendered;
    }
};
__decorate([
    mobx_1.computed
], TooltipView.prototype, "rendered", null);
__decorate([
    mobx_1.observable.struct
], TooltipView.prototype, "bounds", void 0);
__decorate([
    mobx_1.action.bound
], TooltipView.prototype, "updateBounds", null);
TooltipView = __decorate([
    mobx_react_1.observer
], TooltipView);
exports.TooltipView = TooltipView;
let Tooltip = class Tooltip extends React.Component {
    componentDidMount() {
        this.connectTooltipToContainer();
    }
    connectTooltipToContainer() {
        this.props.tooltipManager.tooltip = this.props;
    }
    removeToolTipFromContainer() {
        this.props.tooltipManager.tooltip = undefined;
    }
    componentDidUpdate() {
        this.connectTooltipToContainer();
    }
    componentWillUnmount() {
        this.removeToolTipFromContainer();
    }
    render() {
        return null;
    }
};
__decorate([
    mobx_1.action.bound
], Tooltip.prototype, "connectTooltipToContainer", null);
__decorate([
    mobx_1.action.bound
], Tooltip.prototype, "removeToolTipFromContainer", null);
Tooltip = __decorate([
    mobx_react_1.observer
], Tooltip);
exports.Tooltip = Tooltip;
//# sourceMappingURL=Tooltip.js.map