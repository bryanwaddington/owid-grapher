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
exports.NoDataModal = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Bounds_1 = require("../../clientUtils/Bounds");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faPlus_1 = require("@fortawesome/free-solid-svg-icons/faPlus");
const faExchangeAlt_1 = require("@fortawesome/free-solid-svg-icons/faExchangeAlt");
let NoDataModal = class NoDataModal extends React.Component {
    onDataSelect() {
        this.props.manager.isSelectingData = true;
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
    render() {
        const { message, manager } = this.props;
        const entityType = manager.entityType;
        const { bounds } = this;
        return (React.createElement("foreignObject", { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height },
            React.createElement("div", { className: "NoData" },
                React.createElement("p", { className: "message" }, message || "No available data"),
                React.createElement("div", { className: "actions" },
                    manager.canAddData && (React.createElement("button", { className: "action", onClick: this.onDataSelect },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlus_1.faPlus }),
                        " Add",
                        " ",
                        entityType)),
                    manager.canChangeEntity && (React.createElement("button", { className: "action", onClick: this.onDataSelect },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExchangeAlt_1.faExchangeAlt }),
                        " Change",
                        " ",
                        entityType))))));
    }
};
__decorate([
    mobx_1.action.bound
], NoDataModal.prototype, "onDataSelect", null);
__decorate([
    mobx_1.computed
], NoDataModal.prototype, "bounds", null);
NoDataModal = __decorate([
    mobx_react_1.observer
], NoDataModal);
exports.NoDataModal = NoDataModal;
//# sourceMappingURL=NoDataModal.js.map