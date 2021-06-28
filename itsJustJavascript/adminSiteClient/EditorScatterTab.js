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
exports.EditorScatterTab = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Forms_1 = require("./Forms");
const faMinus_1 = require("@fortawesome/free-solid-svg-icons/faMinus");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
let EditorScatterTab = class EditorScatterTab extends React.Component {
    constructor(props) {
        super(props);
        this.comparisonLine = { yEquals: undefined };
        this.highlightToggle = {
            description: "",
            paramStr: "",
        };
        this.highlightToggle = Object.assign(Object.assign({}, this.highlightToggle), props.grapher.highlightToggle);
    }
    get hasHighlightToggle() {
        return !!this.props.grapher.highlightToggle;
    }
    onToggleHideTimeline(value) {
        this.props.grapher.hideTimeline = value || undefined;
    }
    onToggleHideLinesOutsideTolerance(value) {
        this.props.grapher.hideLinesOutsideTolerance = value || undefined;
    }
    onXOverrideYear(value) {
        this.props.grapher.xOverrideTime = value;
    }
    onToggleHighlightToggle(value) {
        if (value)
            this.props.grapher.highlightToggle = this.highlightToggle;
        else
            this.props.grapher.highlightToggle = undefined;
    }
    save() {
        if (this.hasHighlightToggle)
            this.props.grapher.highlightToggle = mobx_1.toJS(this.highlightToggle);
    }
    get excludedEntityNames() {
        const { excludedEntities, inputTable } = this.props.grapher;
        const { entityIdToNameMap } = inputTable;
        const excludedEntityIds = excludedEntities !== null && excludedEntities !== void 0 ? excludedEntities : [];
        return Util_1.excludeUndefined(excludedEntityIds.map((entityId) => entityIdToNameMap.get(entityId)));
    }
    get excludedEntityChoices() {
        const { inputTable } = this.props.grapher;
        return inputTable.availableEntityNames
            .filter((entityName) => !this.excludedEntityNames.includes(entityName))
            .sort();
    }
    onExcludeEntity(entity) {
        const { grapher } = this.props;
        if (grapher.excludedEntities === undefined) {
            grapher.excludedEntities = [];
        }
        const entityId = grapher.table.entityNameToIdMap.get(entity);
        if (grapher.excludedEntities.indexOf(entityId) === -1)
            grapher.excludedEntities.push(entityId);
    }
    onUnexcludeEntity(entity) {
        const { grapher } = this.props;
        if (!grapher.excludedEntities)
            return;
        const entityId = grapher.table.entityNameToIdMap.get(entity);
        grapher.excludedEntities = grapher.excludedEntities.filter((e) => e !== entityId);
    }
    onToggleConnection(value) {
        const { grapher } = this.props;
        grapher.hideConnectedScatterLines = value;
    }
    onChangeScatterPointLabelStrategy(value) {
        this.props.grapher.scatterPointLabelStrategy = value;
    }
    render() {
        const { hasHighlightToggle, highlightToggle, excludedEntityChoices, } = this;
        const { grapher } = this.props;
        return (React.createElement("div", { className: "EditorScatterTab" },
            React.createElement(Forms_1.Section, { name: "Timeline" },
                React.createElement(Forms_1.Toggle, { label: "Hide timeline", value: !!grapher.hideTimeline, onValue: this.onToggleHideTimeline }),
                React.createElement(Forms_1.Toggle, { label: "Hide entities without data for full time span (within tolerance)", value: !!grapher.hideLinesOutsideTolerance, onValue: this.onToggleHideLinesOutsideTolerance }),
                React.createElement(Forms_1.Toggle, { label: "Hide connected scatter lines", value: !!grapher.hideConnectedScatterLines, onValue: this.onToggleConnection }),
                React.createElement(Forms_1.NumberField, { label: "Override X axis target year", value: grapher.xOverrideTime, onValue: Util_1.debounce(this.onXOverrideYear, 300), allowNegative: true })),
            React.createElement(Forms_1.Section, { name: "Point Labels" },
                React.createElement(Forms_1.SelectField, { value: grapher.scatterPointLabelStrategy, onValue: this.onChangeScatterPointLabelStrategy, options: Object.keys(GrapherConstants_1.ScatterPointLabelStrategy) })),
            React.createElement(Forms_1.Section, { name: "Filtering" },
                React.createElement(Forms_1.Toggle, { label: "Exclude entities that do not belong in any color group", value: !!grapher.matchingEntitiesOnly, onValue: mobx_1.action((value) => (grapher.matchingEntitiesOnly =
                        value || undefined)) }),
                React.createElement(Forms_1.SelectField, { label: "Exclude individual entities", placeholder: "Select an entity to exclude", value: undefined, onValue: (v) => v && this.onExcludeEntity(v), options: excludedEntityChoices }),
                this.excludedEntityNames && (React.createElement("ul", { className: "excludedEntities" }, this.excludedEntityNames.map((entity) => (React.createElement("li", { key: entity },
                    React.createElement("div", { className: "clickable", onClick: () => this.onUnexcludeEntity(entity) },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faMinus_1.faMinus })),
                    entity)))))),
            React.createElement(Forms_1.Section, { name: "Highlight toggle" },
                React.createElement("p", null, "Allow users to toggle a particular chart selection state to highlight certain entities."),
                React.createElement(Forms_1.Toggle, { label: "Enable highlight toggle", value: !!hasHighlightToggle, onValue: this.onToggleHighlightToggle }),
                hasHighlightToggle && (React.createElement("div", null,
                    React.createElement(Forms_1.TextField, { label: "Description", value: highlightToggle.description, onValue: mobx_1.action((value) => {
                            this.highlightToggle.description = value;
                            this.save();
                        }) }),
                    React.createElement(Forms_1.TextField, { label: "URL Params", placeholder: "e.g. ?country=AFG", value: highlightToggle.paramStr, onValue: mobx_1.action((value) => {
                            this.highlightToggle.paramStr = value;
                            this.save();
                        }) }))))));
    }
};
__decorate([
    mobx_1.observable
], EditorScatterTab.prototype, "comparisonLine", void 0);
__decorate([
    mobx_1.observable
], EditorScatterTab.prototype, "highlightToggle", void 0);
__decorate([
    mobx_1.computed
], EditorScatterTab.prototype, "hasHighlightToggle", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onToggleHideTimeline", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onToggleHideLinesOutsideTolerance", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onXOverrideYear", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onToggleHighlightToggle", null);
__decorate([
    mobx_1.computed
], EditorScatterTab.prototype, "excludedEntityNames", null);
__decorate([
    mobx_1.computed
], EditorScatterTab.prototype, "excludedEntityChoices", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onExcludeEntity", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onUnexcludeEntity", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onToggleConnection", null);
__decorate([
    mobx_1.action.bound
], EditorScatterTab.prototype, "onChangeScatterPointLabelStrategy", null);
EditorScatterTab = __decorate([
    mobx_react_1.observer
], EditorScatterTab);
exports.EditorScatterTab = EditorScatterTab;
//# sourceMappingURL=EditorScatterTab.js.map