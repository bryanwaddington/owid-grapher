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
exports.DimensionCard = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Forms_1 = require("./Forms");
const Link_1 = require("./Link");
const faChevronDown_1 = require("@fortawesome/free-solid-svg-icons/faChevronDown");
const faChevronUp_1 = require("@fortawesome/free-solid-svg-icons/faChevronUp");
const faExchangeAlt_1 = require("@fortawesome/free-solid-svg-icons/faExchangeAlt");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const faArrowsAltV_1 = require("@fortawesome/free-solid-svg-icons/faArrowsAltV");
let DimensionCard = class DimensionCard extends React.Component {
    constructor() {
        super(...arguments);
        this.isExpanded = false;
    }
    get table() {
        return this.props.editor.grapher.table;
    }
    get hasExpandedOptions() {
        return (this.props.dimension.property === GrapherConstants_1.DimensionProperty.y ||
            this.props.dimension.property === GrapherConstants_1.DimensionProperty.x ||
            this.props.dimension.property === GrapherConstants_1.DimensionProperty.color);
    }
    onToggleExpand() {
        this.isExpanded = !this.isExpanded;
    }
    onIsProjection(value) {
        this.props.dimension.display.isProjection = value;
        this.updateTables();
    }
    onColor(color) {
        this.props.dimension.display.color = color;
        this.updateTables();
    }
    get color() {
        return this.props.dimension.column.def.color;
    }
    get tableDisplaySettings() {
        const { tableDisplay } = this.props.dimension.display;
        if (!tableDisplay)
            return;
        return (React.createElement(React.Fragment, null,
            React.createElement("hr", { className: "ui divider" }),
            "Table:",
            React.createElement(Forms_1.Toggle, { label: "Hide absolute change column", value: !!tableDisplay.hideAbsoluteChange, onValue: (value) => {
                    tableDisplay.hideAbsoluteChange = value;
                    this.updateTables();
                } }),
            React.createElement(Forms_1.Toggle, { label: "Hide relative change column", value: !!tableDisplay.hideRelativeChange, onValue: (value) => {
                    tableDisplay.hideRelativeChange = value;
                    this.updateTables();
                } }),
            React.createElement("hr", { className: "ui divider" })));
    }
    updateTables() {
        const { grapher } = this.props.editor;
        grapher.updateAuthoredVersion({
            dimensions: grapher.filledDimensions.map((dim) => dim.toObject()),
        });
        grapher.rebuildInputOwidTable();
    }
    render() {
        var _a, _b;
        const { dimension, editor } = this.props;
        const { grapher } = editor;
        const { column } = dimension;
        return (React.createElement(Forms_1.EditableListItem, { className: "DimensionCard draggable", onMouseDown: () => { var _a, _b; return (_b = (_a = this.props).onMouseDown) === null || _b === void 0 ? void 0 : _b.call(_a); }, onMouseEnter: () => { var _a, _b; return (_b = (_a = this.props).onMouseEnter) === null || _b === void 0 ? void 0 : _b.call(_a); } },
            React.createElement("header", null,
                React.createElement("div", null, this.hasExpandedOptions && (React.createElement("span", { className: "clickable", onClick: this.onToggleExpand },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: this.isExpanded
                            ? faChevronUp_1.faChevronUp
                            : faChevronDown_1.faChevronDown })))),
                React.createElement("div", null,
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faArrowsAltV_1.faArrowsAltV })),
                React.createElement(Forms_1.ColorBox, { color: this.color, onColor: this.onColor }),
                React.createElement("div", null,
                    React.createElement(Link_1.Link, { to: `/variables/${dimension.variableId}`, className: "dimensionLink", target: "_blank" }, column.name)),
                React.createElement("div", null,
                    this.props.onEdit && (React.createElement("div", { className: "clickable", onClick: this.props.onEdit },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExchangeAlt_1.faExchangeAlt }))),
                    this.props.onRemove && (React.createElement("div", { className: "clickable", onClick: this.props.onRemove },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes }))))),
            this.isExpanded && (React.createElement("div", null,
                React.createElement(Forms_1.BindAutoString, { label: "Display name", field: "name", store: dimension.display, auto: column.displayName, onBlur: this.updateTables }),
                React.createElement(Forms_1.BindAutoString, { label: "Unit of measurement", field: "unit", store: dimension.display, auto: (_a = column.unit) !== null && _a !== void 0 ? _a : "", onBlur: this.updateTables }),
                React.createElement(Forms_1.BindAutoString, { label: "Short (axis) unit", field: "shortUnit", store: dimension.display, auto: (_b = column.shortUnit) !== null && _b !== void 0 ? _b : "", onBlur: this.updateTables }),
                React.createElement(Forms_1.BindAutoFloat, { label: "Number of decimal places", field: "numDecimalPlaces", store: dimension.display, auto: column.numDecimalPlaces, helpText: `A negative number here will round integers`, onBlur: this.updateTables }),
                React.createElement(Forms_1.BindAutoFloat, { label: "Unit conversion factor", field: "conversionFactor", store: dimension.display, auto: column.unitConversionFactor, helpText: `Multiply all values by this amount`, onBlur: this.updateTables }),
                this.tableDisplaySettings,
                React.createElement(Forms_1.BindAutoFloat, { field: "tolerance", store: dimension.display, auto: column.tolerance, onBlur: this.updateTables }),
                grapher.isLineChart && (React.createElement(Forms_1.Toggle, { label: "Is projection", value: column.isProjection, onValue: this.onIsProjection })),
                React.createElement("hr", { className: "ui divider" })))));
    }
};
__decorate([
    mobx_1.observable.ref
], DimensionCard.prototype, "isExpanded", void 0);
__decorate([
    mobx_1.computed
], DimensionCard.prototype, "table", null);
__decorate([
    mobx_1.computed
], DimensionCard.prototype, "hasExpandedOptions", null);
__decorate([
    mobx_1.action.bound
], DimensionCard.prototype, "onToggleExpand", null);
__decorate([
    mobx_1.action.bound
], DimensionCard.prototype, "onIsProjection", null);
__decorate([
    mobx_1.action.bound
], DimensionCard.prototype, "onColor", null);
__decorate([
    mobx_1.computed
], DimensionCard.prototype, "color", null);
__decorate([
    mobx_1.action.bound
], DimensionCard.prototype, "updateTables", null);
DimensionCard = __decorate([
    mobx_react_1.observer
], DimensionCard);
exports.DimensionCard = DimensionCard;
//# sourceMappingURL=DimensionCard.js.map