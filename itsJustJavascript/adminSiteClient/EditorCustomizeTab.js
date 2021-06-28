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
exports.EditorCustomizeTab = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Forms_1 = require("./Forms");
const Util_1 = require("../clientUtils/Util");
const faPlus_1 = require("@fortawesome/free-solid-svg-icons/faPlus");
const faMinus_1 = require("@fortawesome/free-solid-svg-icons/faMinus");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const ColorSchemeDropdown_1 = require("./ColorSchemeDropdown");
const EditorColorScaleSection_1 = require("./EditorColorScaleSection");
const TimeBounds_1 = require("../clientUtils/TimeBounds");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
let ColorSchemeSelector = class ColorSchemeSelector extends React.Component {
    onChange(selected) {
        // The onChange method can return an array of values (when multiple
        // items can be selected) or a single value. Since we are certain that
        // we are not using the multi-option select we can force the type to be
        // a single value.
        var _a;
        this.props.grapher.baseColorScheme = (selected.value === "default"
            ? undefined
            : selected.value);
        // clear out saved, pre-computed colors so the color scheme change is immediately visible
        (_a = this.props.grapher.seriesColorMap) === null || _a === void 0 ? void 0 : _a.clear();
    }
    onInvertColorScheme(value) {
        var _a;
        this.props.grapher.invertColorScheme = value || undefined;
        (_a = this.props.grapher.seriesColorMap) === null || _a === void 0 ? void 0 : _a.clear();
    }
    render() {
        const { grapher } = this.props;
        return (React.createElement(React.Fragment, null,
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", null, "Color scheme"),
                    React.createElement(ColorSchemeDropdown_1.ColorSchemeDropdown, { value: grapher.baseColorScheme || "default", onChange: this.onChange, invertedColorScheme: !!grapher.invertColorScheme, additionalOptions: [
                            {
                                colorScheme: undefined,
                                gradient: undefined,
                                label: "Default",
                                value: "default",
                            },
                        ] }))),
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.Toggle, { label: "Invert colors", value: !!grapher.invertColorScheme, onValue: this.onInvertColorScheme }))));
    }
};
__decorate([
    mobx_1.action.bound
], ColorSchemeSelector.prototype, "onChange", null);
__decorate([
    mobx_1.action.bound
], ColorSchemeSelector.prototype, "onInvertColorScheme", null);
ColorSchemeSelector = __decorate([
    mobx_react_1.observer
], ColorSchemeSelector);
let TimelineSection = class TimelineSection extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
    }
    get grapher() {
        return this.props.editor.grapher;
    }
    get minTime() {
        return this.grapher.minTime;
    }
    get maxTime() {
        return this.grapher.maxTime;
    }
    get timelineMinTime() {
        return this.grapher.timelineMinTime;
    }
    get timelineMaxTime() {
        return this.grapher.timelineMaxTime;
    }
    onMinTime(value) {
        this.grapher.minTime = value !== null && value !== void 0 ? value : TimeBounds_1.TimeBoundValue.negativeInfinity;
    }
    onMaxTime(value) {
        this.grapher.maxTime = value !== null && value !== void 0 ? value : TimeBounds_1.TimeBoundValue.positiveInfinity;
    }
    onTimelineMinTime(value) {
        this.grapher.timelineMinTime = value;
    }
    onTimelineMaxTime(value) {
        this.grapher.timelineMaxTime = value;
    }
    onToggleHideTimeline(value) {
        this.grapher.hideTimeline = value || undefined;
    }
    onToggleShowYearLabels(value) {
        this.grapher.showYearLabels = value || undefined;
    }
    render() {
        const { features } = this.props.editor;
        const { grapher } = this;
        return (React.createElement(Forms_1.Section, { name: "Timeline selection" },
            React.createElement(Forms_1.FieldsRow, null,
                features.timeDomain && (React.createElement(Forms_1.NumberField, { label: "Selection start", value: this.minTime, onValue: Util_1.debounce(this.onMinTime), allowNegative: true })),
                React.createElement(Forms_1.NumberField, { label: features.timeDomain
                        ? "Selection end"
                        : "Selected year", value: this.maxTime, onValue: Util_1.debounce(this.onMaxTime), allowNegative: true })),
            features.timelineRange && (React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.NumberField, { label: "Timeline min", value: this.timelineMinTime, onValue: Util_1.debounce(this.onTimelineMinTime), allowNegative: true }),
                React.createElement(Forms_1.NumberField, { label: "Timeline max", value: this.timelineMaxTime, onValue: Util_1.debounce(this.onTimelineMaxTime), allowNegative: true }))),
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.Toggle, { label: "Hide timeline", value: !!grapher.hideTimeline, onValue: this.onToggleHideTimeline }),
                features.showYearLabels && (React.createElement(Forms_1.Toggle, { label: "Always show year labels", value: !!grapher.showYearLabels, onValue: this.onToggleShowYearLabels })))));
    }
};
__decorate([
    mobx_1.computed
], TimelineSection.prototype, "grapher", null);
__decorate([
    mobx_1.computed
], TimelineSection.prototype, "minTime", null);
__decorate([
    mobx_1.computed
], TimelineSection.prototype, "maxTime", null);
__decorate([
    mobx_1.computed
], TimelineSection.prototype, "timelineMinTime", null);
__decorate([
    mobx_1.computed
], TimelineSection.prototype, "timelineMaxTime", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onMinTime", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onMaxTime", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onTimelineMinTime", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onTimelineMaxTime", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onToggleHideTimeline", null);
__decorate([
    mobx_1.action.bound
], TimelineSection.prototype, "onToggleShowYearLabels", null);
TimelineSection = __decorate([
    mobx_react_1.observer
], TimelineSection);
let ComparisonLineSection = class ComparisonLineSection extends React.Component {
    constructor() {
        super(...arguments);
        this.comparisonLines = [];
    }
    onAddComparisonLine() {
        const { grapher } = this.props.editor;
        grapher.comparisonLines.push({});
    }
    onRemoveComparisonLine(index) {
        const { grapher } = this.props.editor;
        grapher.comparisonLines.splice(index, 1);
    }
    render() {
        const { comparisonLines } = this.props.editor.grapher;
        return (React.createElement(Forms_1.Section, { name: "Comparison line" },
            React.createElement("p", null,
                "Overlay a line onto the chart for comparison. Supports basic",
                " ",
                React.createElement("a", { href: "https://github.com/silentmatt/expr-eval#expression-syntax" }, "mathematical expressions"),
                "."),
            React.createElement(Forms_1.Button, { onClick: this.onAddComparisonLine },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlus_1.faPlus }),
                " Add comparison line"),
            comparisonLines.map((comparisonLine, i) => (React.createElement("div", { key: i },
                `Line ${i + 1}`,
                " ",
                React.createElement(Forms_1.Button, { onClick: () => this.onRemoveComparisonLine(i) },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faMinus_1.faMinus })),
                React.createElement(Forms_1.TextField, { label: `y=`, placeholder: "x", value: comparisonLine.yEquals, onValue: mobx_1.action((value) => {
                        comparisonLine.yEquals = value || undefined;
                    }) }),
                React.createElement(Forms_1.TextField, { label: "Label", value: comparisonLine.label, onValue: mobx_1.action((value) => {
                        comparisonLine.label = value || undefined;
                    }) }))))));
    }
};
__decorate([
    mobx_1.observable
], ComparisonLineSection.prototype, "comparisonLines", void 0);
__decorate([
    mobx_1.action.bound
], ComparisonLineSection.prototype, "onAddComparisonLine", null);
__decorate([
    mobx_1.action.bound
], ComparisonLineSection.prototype, "onRemoveComparisonLine", null);
ComparisonLineSection = __decorate([
    mobx_react_1.observer
], ComparisonLineSection);
let EditorCustomizeTab = class EditorCustomizeTab extends React.Component {
    render() {
        const xAxisConfig = this.props.editor.grapher.xAxis;
        const yAxisConfig = this.props.editor.grapher.yAxis;
        const { features } = this.props.editor;
        const { grapher } = this.props.editor;
        return (React.createElement("div", null,
            features.canCustomizeYAxis && (React.createElement(Forms_1.Section, { name: "Y Axis" },
                features.canCustomizeYAxisScale && (React.createElement(React.Fragment, null,
                    React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.NumberField, { label: `Min`, value: yAxisConfig.min, onValue: (value) => (yAxisConfig.min = value), allowDecimal: true, allowNegative: true }),
                        React.createElement(Forms_1.NumberField, { label: `Max`, value: yAxisConfig.max, onValue: (value) => (yAxisConfig.max = value), allowDecimal: true, allowNegative: true })),
                    features.canRemovePointsOutsideAxisDomain && (React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.Toggle, { label: `Remove points outside domain`, value: yAxisConfig.removePointsOutsideDomain ||
                                false, onValue: (value) => (yAxisConfig.removePointsOutsideDomain =
                                value || undefined) }))),
                    React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.Toggle, { label: `Enable log/linear selector`, value: yAxisConfig.canChangeScaleType ||
                                false, onValue: (value) => (yAxisConfig.canChangeScaleType =
                                value || undefined) })),
                    React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.Toggle, { label: `Facets have uniform y-axis`, value: yAxisConfig.facetAxisRange ===
                                GrapherConstants_1.FacetAxisRange.shared, onValue: (value) => {
                                yAxisConfig.facetAxisRange = value
                                    ? GrapherConstants_1.FacetAxisRange.shared
                                    : GrapherConstants_1.FacetAxisRange.independent;
                            } })))),
                features.canCustomizeYAxisLabel && (React.createElement(Forms_1.BindString, { label: "Label", field: "label", store: yAxisConfig })))),
            features.canCustomizeXAxis && (React.createElement(Forms_1.Section, { name: "X Axis" },
                features.canCustomizeXAxisScale && (React.createElement(React.Fragment, null,
                    React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.NumberField, { label: `Min`, value: xAxisConfig.min, onValue: (value) => (xAxisConfig.min = value), allowDecimal: true, allowNegative: true }),
                        React.createElement(Forms_1.NumberField, { label: `Max`, value: xAxisConfig.max, onValue: (value) => (xAxisConfig.max = value), allowDecimal: true, allowNegative: true })),
                    features.canRemovePointsOutsideAxisDomain && (React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.Toggle, { label: `Remove points outside domain`, value: xAxisConfig.removePointsOutsideDomain ||
                                false, onValue: (value) => (xAxisConfig.removePointsOutsideDomain =
                                value || undefined) }))),
                    React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.Toggle, { label: `Enable log/linear selector`, value: xAxisConfig.canChangeScaleType ||
                                false, onValue: (value) => (xAxisConfig.canChangeScaleType =
                                value || undefined) })))),
                features.canCustomizeXAxisLabel && (React.createElement(Forms_1.BindString, { label: "Label", field: "label", store: xAxisConfig })))),
            React.createElement(TimelineSection, { editor: this.props.editor }),
            React.createElement(Forms_1.Section, { name: "Color scheme" },
                React.createElement(ColorSchemeSelector, { grapher: grapher })),
            grapher.activeColorScaleExceptMap && (React.createElement(EditorColorScaleSection_1.EditorColorScaleSection, { scale: grapher.activeColorScaleExceptMap, features: {
                    visualScaling: false,
                    legendDescription: grapher.isScatter ||
                        grapher.isSlopeChart ||
                        grapher.isStackedBar,
                } })),
            (features.hideLegend || features.entityType) && (React.createElement(Forms_1.Section, { name: "Legend" },
                React.createElement(Forms_1.FieldsRow, null, features.hideLegend && (React.createElement(Forms_1.Toggle, { label: `Hide legend`, value: !!grapher.hideLegend, onValue: (value) => (grapher.hideLegend =
                        value || undefined) }))),
                features.entityType && (React.createElement(Forms_1.BindAutoString, { label: "Entity name", field: "entityType", store: grapher, auto: "country" })))),
            features.relativeModeToggle && (React.createElement(Forms_1.Section, { name: "Controls" },
                React.createElement(Forms_1.FieldsRow, null,
                    React.createElement(Forms_1.Toggle, { label: `Hide relative toggle`, value: !!grapher.hideRelativeToggle, onValue: (value) => (grapher.hideRelativeToggle =
                            value || false) })))),
            features.comparisonLine && (React.createElement(ComparisonLineSection, { editor: this.props.editor }))));
    }
};
EditorCustomizeTab = __decorate([
    mobx_react_1.observer
], EditorCustomizeTab);
exports.EditorCustomizeTab = EditorCustomizeTab;
//# sourceMappingURL=EditorCustomizeTab.js.map