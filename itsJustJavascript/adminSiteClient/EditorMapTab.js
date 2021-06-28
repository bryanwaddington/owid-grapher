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
exports.EditorMapTab = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Util_1 = require("../clientUtils/Util");
const MapProjections_1 = require("../grapher/mapCharts/MapProjections");
const Forms_1 = require("./Forms");
const EditorColorScaleSection_1 = require("./EditorColorScaleSection");
const MapChart_1 = require("../grapher/mapCharts/MapChart");
let VariableSection = class VariableSection extends React.Component {
    onVariableId(variableId) {
        this.props.mapConfig.columnSlug = variableId.toString();
    }
    onProjection(projection) {
        this.props.mapConfig.projection = projection;
    }
    render() {
        const { mapConfig, filledDimensions } = this.props;
        if (Util_1.isEmpty(filledDimensions))
            return (React.createElement("section", null,
                React.createElement("h2", null, "Add some variables on data tab first")));
        const projections = Object.keys(MapProjections_1.MapProjectionLabels);
        const labels = Object.values(MapProjections_1.MapProjectionLabels);
        return (React.createElement(Forms_1.Section, { name: "Map" },
            React.createElement(Forms_1.NumericSelectField, { label: "Variable", value: mapConfig.columnSlug
                    ? parseInt(mapConfig.columnSlug)
                    : undefined, options: filledDimensions.map((d) => d.variableId), optionLabels: filledDimensions.map((d) => d.column.displayName), onValue: this.onVariableId }),
            React.createElement(Forms_1.SelectField, { label: "Region", value: mapConfig.projection, options: projections, optionLabels: labels, onValue: this.onProjection })));
    }
};
__decorate([
    mobx_1.action.bound
], VariableSection.prototype, "onVariableId", null);
__decorate([
    mobx_1.action.bound
], VariableSection.prototype, "onProjection", null);
VariableSection = __decorate([
    mobx_react_1.observer
], VariableSection);
let TimelineSection = class TimelineSection extends React.Component {
    onToggleHideTimeline(value) {
        this.props.mapConfig.hideTimeline = value || undefined;
    }
    setMapTime(time) {
        this.props.mapConfig.time = time;
    }
    onTolerance(tolerance) {
        this.props.mapConfig.timeTolerance = tolerance;
    }
    render() {
        const { mapConfig } = this.props;
        return (React.createElement(Forms_1.Section, { name: "Timeline" },
            React.createElement(Forms_1.NumberField, { label: "Target year", value: mapConfig.time, onValue: this.setMapTime, allowNegative: true }),
            React.createElement(Forms_1.Toggle, { label: "Hide timeline", value: !!mapConfig.hideTimeline, onValue: this.onToggleHideTimeline }),
            React.createElement(Forms_1.NumberField, { label: "Tolerance of data", value: mapConfig.timeTolerance, onValue: this.onTolerance, helpText: "Specify a range of years from which to pull data. For example, if the map shows 1990 and tolerance is set to 1, then data from 1989 or 1991 will be shown if no data is available for 1990." })));
    }
};
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onToggleHideTimeline", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "setMapTime", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onTolerance", null);
TimelineSection = __decorate([
    mobx_react_1.observer
], TimelineSection);
let TooltipSection = class TooltipSection extends React.Component {
    onTooltipUseCustomLabels(tooltipUseCustomLabels) {
        this.props.mapConfig.tooltipUseCustomLabels = tooltipUseCustomLabels
            ? true
            : undefined;
    }
    render() {
        const { mapConfig } = this.props;
        return (React.createElement(Forms_1.Section, { name: "Tooltip" },
            React.createElement(Forms_1.Toggle, { label: "Show custom label in the tooltip, instead of the numeric value", value: !!mapConfig.tooltipUseCustomLabels, onValue: this.onTooltipUseCustomLabels })));
    }
};
__decorate([
    mobx_1.action.bound
], TooltipSection.prototype, "onTooltipUseCustomLabels", null);
TooltipSection = __decorate([
    mobx_react_1.observer
], TooltipSection);
let EditorMapTab = class EditorMapTab extends React.Component {
    get grapher() {
        return this.props.editor.grapher;
    }
    render() {
        const { grapher } = this;
        const mapConfig = grapher.map;
        const { mapColumnSlug } = grapher;
        const mapChart = new MapChart_1.MapChart({ manager: this.grapher });
        const colorScale = mapChart.colorScale;
        const isReady = !!mapColumnSlug && grapher.table.has(mapColumnSlug);
        return (React.createElement("div", { className: "EditorMapTab tab-pane" },
            React.createElement(VariableSection, { mapConfig: mapConfig, filledDimensions: grapher.filledDimensions }),
            isReady && (React.createElement(React.Fragment, null,
                React.createElement(TimelineSection, { mapConfig: mapConfig }),
                React.createElement(EditorColorScaleSection_1.EditorColorScaleSection, { scale: colorScale, features: {
                        visualScaling: true,
                        legendDescription: false,
                    } }),
                React.createElement(TooltipSection, { mapConfig: mapConfig })))));
    }
};
__decorate([
    mobx_1.computed
], EditorMapTab.prototype, "grapher", null);
EditorMapTab = __decorate([
    mobx_react_1.observer
], EditorMapTab);
exports.EditorMapTab = EditorMapTab;
//# sourceMappingURL=EditorMapTab.js.map