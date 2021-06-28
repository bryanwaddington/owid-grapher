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
exports.WithExistingSelectionChoices = exports.WithPickerMetricsChoices = exports.WithChoices = exports.Empty = void 0;
const React = __importStar(require("react"));
const EntityPicker_1 = require("./EntityPicker");
const mobx_react_1 = require("mobx-react");
const OwidTableSynthesizers_1 = require("../../../coreTable/OwidTableSynthesizers");
const OwidTableConstants_1 = require("../../../coreTable/OwidTableConstants");
const mobx_1 = require("mobx");
const SelectionArray_1 = require("../../selection/SelectionArray");
class PickerHolder extends React.Component {
    render() {
        return (React.createElement("div", { style: {
                padding: "20px",
                height: "500px",
                width: "300px",
                display: "grid",
            } }, this.props.children));
    }
}
const defaultSlugs = [
    OwidTableConstants_1.OwidTableSlugs.entityName,
    OwidTableSynthesizers_1.SampleColumnSlugs.GDP,
    OwidTableSynthesizers_1.SampleColumnSlugs.Population,
];
// A stub class for testing
let SomeThingWithAPicker = class SomeThingWithAPicker extends React.Component {
    constructor() {
        var _a;
        super(...arguments);
        this.entityPickerTable = OwidTableSynthesizers_1.SynthesizeGDPTable({ entityCount: 30 }, 1);
        this.selection = new SelectionArray_1.SelectionArray((_a = this.props.selection) !== null && _a !== void 0 ? _a : [], this.entityPickerTable.availableEntities);
        this.requiredColumnSlugs = defaultSlugs;
    }
    get pickerColumnSlugs() {
        return this.props.pickerSlugs;
    }
    render() {
        return (React.createElement(PickerHolder, null,
            React.createElement(EntityPicker_1.EntityPicker, { manager: this })));
    }
};
__decorate([
    mobx_1.observable
], SomeThingWithAPicker.prototype, "entityPickerMetric", void 0);
__decorate([
    mobx_1.observable
], SomeThingWithAPicker.prototype, "entityPickerSort", void 0);
__decorate([
    mobx_1.computed
], SomeThingWithAPicker.prototype, "pickerColumnSlugs", null);
SomeThingWithAPicker = __decorate([
    mobx_react_1.observer
], SomeThingWithAPicker);
exports.default = {
    title: "EntityPicker",
    component: EntityPicker_1.EntityPicker,
};
const Empty = () => (React.createElement(PickerHolder, null,
    React.createElement(EntityPicker_1.EntityPicker, { manager: {
            selection: new SelectionArray_1.SelectionArray(),
        } })));
exports.Empty = Empty;
const WithChoices = () => React.createElement(SomeThingWithAPicker, null);
exports.WithChoices = WithChoices;
const WithPickerMetricsChoices = () => (React.createElement(SomeThingWithAPicker, { pickerSlugs: defaultSlugs }));
exports.WithPickerMetricsChoices = WithPickerMetricsChoices;
const WithExistingSelectionChoices = () => (React.createElement(SomeThingWithAPicker, { pickerSlugs: defaultSlugs, selection: ["Japan", "Samoa"] }));
exports.WithExistingSelectionChoices = WithExistingSelectionChoices;
//# sourceMappingURL=EntityPicker.stories.js.map