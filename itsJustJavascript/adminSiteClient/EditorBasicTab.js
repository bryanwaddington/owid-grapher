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
exports.EditorBasicTab = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Util_1 = require("../clientUtils/Util");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const Forms_1 = require("./Forms");
const VariableSelector_1 = require("./VariableSelector");
const DimensionCard_1 = require("./DimensionCard");
let DimensionSlotView = class DimensionSlotView extends React.Component {
    constructor() {
        super(...arguments);
        this.isSelectingVariables = false;
        this.dimensionsOrderedAsDisplayed = [];
    }
    get grapher() {
        return this.props.editor.grapher;
    }
    onAddVariables(variableIds) {
        const { slot } = this.props;
        const { grapher } = this.props.editor;
        const dimensionConfigs = variableIds.map((id) => {
            const existingDimension = slot.dimensions.find((d) => d.variableId === id);
            return (existingDimension || {
                property: slot.property,
                variableId: id,
            });
        });
        grapher.setDimensionsForProperty(slot.property, dimensionConfigs);
        grapher.updateAuthoredVersion({
            dimensions: grapher.dimensions.map((dim) => dim.toObject()),
        });
        this.isSelectingVariables = false;
        this.updateDefaults();
    }
    onRemoveDimension(variableId) {
        const { slot } = this.props;
        const { grapher } = this.props.editor;
        this.grapher.setDimensionsForProperty(slot.property, this.props.slot.dimensions.filter((d) => d.variableId !== variableId));
        grapher.updateAuthoredVersion({
            dimensions: grapher.dimensions.map((dim) => dim.toObject()),
        });
        grapher.rebuildInputOwidTable();
        this.updateDefaults();
    }
    updateDefaults() {
        const { grapher } = this.props.editor;
        const { selection } = grapher;
        const { availableEntityNames, availableEntityNameSet } = selection;
        if (this.dispose)
            this.dispose();
        this.dispose = mobx_1.reaction(() => grapher.type && grapher.yColumns, () => {
            if (grapher.isScatter || grapher.isSlopeChart) {
                selection.clearSelection();
            }
            else if (grapher.yColumns.length > 1) {
                const entity = availableEntityNameSet.has(GrapherConstants_1.WorldEntityName)
                    ? GrapherConstants_1.WorldEntityName
                    : Util_1.sample(availableEntityNames);
                selection.selectEntity(entity);
                grapher.addCountryMode = GrapherConstants_1.EntitySelectionMode.SingleEntity;
            }
            else {
                selection.setSelectedEntities(availableEntityNames.length > 10
                    ? Util_1.sampleSize(availableEntityNames, 3)
                    : availableEntityNames);
                grapher.addCountryMode =
                    GrapherConstants_1.EntitySelectionMode.MultipleEntities;
            }
        });
    }
    componentWillUnmount() {
        if (this.dispose)
            this.dispose();
    }
    updateLegacySelectionAndRebuildTable() {
        this.grapher.updateAuthoredVersion({
            selectedData: this.legacySelectionOrderedAsDisplayed,
        });
        this.grapher.rebuildInputOwidTable();
    }
    onMouseUp() {
        this.draggingColumnSlug = undefined;
        window.removeEventListener("mouseup", this.onMouseUp);
        this.updateLegacySelectionAndRebuildTable();
    }
    onStartDrag(targetSlug) {
        this.draggingColumnSlug = targetSlug;
        window.addEventListener("mouseup", this.onMouseUp);
    }
    get legacySelectionOrderedAsDisplayed() {
        return Util_1.sortBy(this.grapher.legacyConfigAsAuthored.selectedData || [], (selectedDatum) => Util_1.findIndex(this.dimensionsOrderedAsDisplayed, (dim) => {
            var _a;
            return dim.columnSlug ===
                ((_a = this.grapher.dimensions[selectedDatum.index]) === null || _a === void 0 ? void 0 : _a.columnSlug);
        }));
    }
    onMouseEnter(targetSlug) {
        if (!this.draggingColumnSlug || targetSlug === this.draggingColumnSlug)
            return;
        const dimensionsClone = Util_1.clone(this.props.slot.dimensionsOrderedAsInPersistedSelection);
        const dragIndex = dimensionsClone.findIndex((dim) => dim.slug === this.draggingColumnSlug);
        const targetIndex = dimensionsClone.findIndex((dim) => dim.slug === targetSlug);
        dimensionsClone.splice(dragIndex, 1);
        dimensionsClone.splice(targetIndex, 0, this.props.slot.dimensionsOrderedAsInPersistedSelection[dragIndex]);
        this.dimensionsOrderedAsDisplayed = dimensionsClone;
    }
    get dimensionsInSelectionOrder() {
        return this.dimensionsOrderedAsDisplayed.length
            ? this.dimensionsOrderedAsDisplayed
            : this.props.slot.dimensionsOrderedAsInPersistedSelection;
    }
    render() {
        const { isSelectingVariables } = this;
        const { slot, editor } = this.props;
        const canAddMore = slot.allowMultiple || slot.dimensions.length === 0;
        return (React.createElement("div", null,
            React.createElement("h5", null, slot.name),
            React.createElement(Forms_1.EditableList, null, this.dimensionsInSelectionOrder.map((dim) => {
                return (dim.property === slot.property && (React.createElement(DimensionCard_1.DimensionCard, { key: dim.columnSlug, dimension: dim, editor: editor, onEdit: slot.allowMultiple
                        ? undefined
                        : mobx_1.action(() => (this.isSelectingVariables = true)), onMouseDown: () => dim.property === "y" &&
                        this.onStartDrag(dim.columnSlug), onMouseEnter: () => dim.property === "y" &&
                        this.onMouseEnter(dim.columnSlug), onRemove: slot.isOptional
                        ? () => this.onRemoveDimension(dim.variableId)
                        : undefined })));
            })),
            canAddMore && (React.createElement("div", { className: "dimensionSlot", onClick: mobx_1.action(() => (this.isSelectingVariables = true)) },
                "Add variable",
                slot.allowMultiple && "s")),
            isSelectingVariables && (React.createElement(VariableSelector_1.VariableSelector, { editor: editor, slot: slot, onDismiss: mobx_1.action(() => (this.isSelectingVariables = false)), onComplete: this.onAddVariables }))));
    }
};
__decorate([
    mobx_1.observable.ref
], DimensionSlotView.prototype, "isSelectingVariables", void 0);
__decorate([
    mobx_1.action.bound
], DimensionSlotView.prototype, "onAddVariables", null);
__decorate([
    mobx_1.action.bound
], DimensionSlotView.prototype, "onRemoveDimension", null);
__decorate([
    mobx_1.observable
], DimensionSlotView.prototype, "draggingColumnSlug", void 0);
__decorate([
    mobx_1.observable
], DimensionSlotView.prototype, "dimensionsOrderedAsDisplayed", void 0);
__decorate([
    mobx_1.action.bound
], DimensionSlotView.prototype, "updateLegacySelectionAndRebuildTable", null);
__decorate([
    mobx_1.action.bound
], DimensionSlotView.prototype, "onMouseUp", null);
__decorate([
    mobx_1.action.bound
], DimensionSlotView.prototype, "onStartDrag", null);
__decorate([
    mobx_1.action.bound
], DimensionSlotView.prototype, "onMouseEnter", null);
__decorate([
    mobx_1.computed
], DimensionSlotView.prototype, "dimensionsInSelectionOrder", null);
DimensionSlotView = __decorate([
    mobx_react_1.observer
], DimensionSlotView);
let VariablesSection = class VariablesSection extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        this.isAddingVariable = false;
    }
    render() {
        const { props } = this;
        const { dimensionSlots } = props.editor.grapher;
        return (React.createElement(Forms_1.Section, { name: "Add variables" }, dimensionSlots.map((slot) => (React.createElement(DimensionSlotView, { key: slot.name, slot: slot, editor: props.editor })))));
    }
};
__decorate([
    mobx_1.observable.ref
], VariablesSection.prototype, "isAddingVariable", void 0);
VariablesSection = __decorate([
    mobx_react_1.observer
], VariablesSection);
let EditorBasicTab = class EditorBasicTab extends React.Component {
    onChartTypeChange(value) {
        const { grapher } = this.props.editor;
        grapher.type = value;
        if (!grapher.isScatter && !grapher.isSlopeChart)
            return;
        // Give scatterplots and slope charts a default color and size dimension if they don't have one
        const hasColor = grapher.dimensions.find((d) => d.property === GrapherConstants_1.DimensionProperty.color);
        const hasSize = grapher.dimensions.find((d) => d.property === GrapherConstants_1.DimensionProperty.size);
        if (!hasColor)
            grapher.addDimension({
                variableId: 123,
                property: GrapherConstants_1.DimensionProperty.color,
            });
        if (!hasSize)
            grapher.addDimension({
                variableId: 72,
                property: GrapherConstants_1.DimensionProperty.size,
            });
    }
    render() {
        const { editor } = this.props;
        const { grapher } = editor;
        const chartTypes = Object.keys(GrapherConstants_1.ChartTypeName);
        return (React.createElement("div", { className: "EditorBasicTab" },
            React.createElement(Forms_1.Section, { name: "Type of chart" },
                React.createElement(Forms_1.SelectField, { value: grapher.type, onValue: this.onChartTypeChange, options: chartTypes, optionLabels: chartTypes.map((key) => Util_1.startCase(key)) }),
                React.createElement(Forms_1.FieldsRow, null,
                    React.createElement(Forms_1.Toggle, { label: "Chart tab", value: grapher.hasChartTab, onValue: (value) => (grapher.hasChartTab = value) }),
                    React.createElement(Forms_1.Toggle, { label: "Map tab", value: grapher.hasMapTab, onValue: (value) => (grapher.hasMapTab = value) }))),
            React.createElement(VariablesSection, { editor: editor })));
    }
};
__decorate([
    mobx_1.action.bound
], EditorBasicTab.prototype, "onChartTypeChange", null);
EditorBasicTab = __decorate([
    mobx_react_1.observer
], EditorBasicTab);
exports.EditorBasicTab = EditorBasicTab;
//# sourceMappingURL=EditorBasicTab.js.map