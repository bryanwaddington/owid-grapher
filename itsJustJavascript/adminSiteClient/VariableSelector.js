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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableSelector = void 0;
const React = __importStar(require("react"));
const lodash = __importStar(require("lodash"));
const Util_1 = require("../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_select_1 = __importDefault(require("react-select"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faArchive_1 = require("@fortawesome/free-solid-svg-icons/faArchive");
const react_select_2 = require("../clientUtils/react-select");
const Forms_1 = require("./Forms");
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const FuzzySearch_1 = require("../grapher/controls/FuzzySearch");
let VariableSelector = class VariableSelector extends React.Component {
    constructor() {
        super(...arguments);
        this.chosenVariables = [];
        this.rowOffset = 0;
        this.numVisibleRows = 15;
        this.rowHeight = 32;
        this.base = React.createRef();
    }
    get database() {
        return this.props.editor.database;
    }
    get currentNamespace() {
        var _a;
        return ((_a = this.chosenNamespace) !== null && _a !== void 0 ? _a : this.database.namespaces.find((n) => n.name === "owid"));
    }
    get editorData() {
        return this.database.dataByNamespace.get(this.currentNamespace.name);
    }
    get datasets() {
        if (!this.editorData)
            return [];
        const datasets = this.editorData.datasets;
        if (this.currentNamespace.name !== "owid") {
            // The default temporal ordering has no real use for bulk imports
            return Util_1.sortBy(datasets, (d) => d.name);
        }
        else {
            return datasets;
        }
    }
    get datasetsByName() {
        return lodash.keyBy(this.datasets, (d) => d.name);
    }
    get availableVariables() {
        const variables = [];
        this.datasets.forEach((dataset) => {
            const sorted = Util_1.sortBy(dataset.variables, (v) => v.name);
            sorted.forEach((variable) => {
                variables.push({
                    id: variable.id,
                    name: variable.name,
                    datasetName: dataset.name,
                    searchKey: fuzzysort_1.default.prepare(dataset.name + " - " + variable.name),
                    //name: variable.name.includes(dataset.name) ? variable.name : dataset.name + " - " + variable.name
                });
            });
        });
        return variables;
    }
    get searchResults() {
        const results = this.searchInput &&
            fuzzysort_1.default.go(this.searchInput, this.availableVariables, {
                key: "searchKey",
            });
        return results && results.length
            ? results.map((result) => result.obj)
            : this.availableVariables;
    }
    get resultsByDataset() {
        return Util_1.groupBy(this.searchResults, (d) => d.datasetName);
    }
    get searchResultRows() {
        const { resultsByDataset } = this;
        const rows = [];
        Object.entries(resultsByDataset).forEach(([datasetName, variables]) => {
            rows.push(datasetName);
            for (let i = 0; i < variables.length; i += 2) {
                rows.push(variables.slice(i, i + 2));
            }
        });
        return rows;
    }
    get numTotalRows() {
        return this.searchResultRows.length;
    }
    formatNamespaceLabel(namespace) {
        const { name, description, isArchived } = namespace;
        return (React.createElement("span", { className: isArchived ? "muted-option" : "" },
            isArchived && (React.createElement("span", { className: "icon" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faArchive_1.faArchive }))),
            description ? `${description} — ` : null,
            name,
            isArchived && React.createElement("span", { className: "badge" }, "Archived")));
    }
    filterNamespace(option, input) {
        return input
            .split(" ")
            .map((word) => word.toLowerCase())
            .map((word) => {
            var _a;
            const namespace = option.data;
            return (namespace.name.toLowerCase().includes(word) ||
                ((_a = namespace.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(word)));
        })
            .every((v) => v);
    }
    render() {
        const { slot } = this.props;
        const { database } = this.props.editor;
        const { currentNamespace, searchInput, chosenVariables, datasetsByName, rowHeight, rowOffset, numVisibleRows, numTotalRows, searchResultRows, } = this;
        const highlight = (text) => {
            var _a;
            if (this.searchInput) {
                const html = (_a = FuzzySearch_1.highlight(fuzzysort_1.default.single(this.searchInput, text))) !== null && _a !== void 0 ? _a : text;
                return React.createElement("span", { dangerouslySetInnerHTML: { __html: html } });
            }
            else
                return text;
        };
        return (React.createElement(Forms_1.Modal, { onClose: this.onDismiss, className: "VariableSelector" },
            React.createElement("div", { className: "modal-header" },
                React.createElement("h5", { className: "modal-title" },
                    "Set variable",
                    slot.allowMultiple && "s",
                    " for ",
                    slot.name)),
            React.createElement("div", { className: "modal-body" },
                React.createElement("div", null,
                    React.createElement("div", { className: "searchResults" },
                        React.createElement(Forms_1.FieldsRow, null,
                            React.createElement("div", { className: "form-group" },
                                React.createElement("label", null, "Database"),
                                React.createElement(react_select_1.default, { options: database.namespaces, formatOptionLabel: this.formatNamespaceLabel, getOptionValue: (v) => v.name, onChange: this.onNamespace, value: currentNamespace, filterOption: this.filterNamespace, components: {
                                        IndicatorSeparator: null,
                                    }, menuPlacement: "bottom" })),
                            React.createElement(Forms_1.TextField, { placeholder: "Search...", value: searchInput, onValue: this.onSearchInput, onEnter: this.onSearchEnter, onEscape: this.onDismiss, autofocus: true })),
                        React.createElement("div", { style: {
                                height: numVisibleRows * rowHeight,
                                overflowY: "scroll",
                            }, onScroll: this.onScroll, ref: (e) => (this.scrollElement = e) },
                            React.createElement("div", { style: {
                                    height: numTotalRows * rowHeight,
                                    paddingTop: rowHeight * rowOffset,
                                } },
                                React.createElement("ul", null, searchResultRows
                                    .slice(rowOffset, rowOffset + numVisibleRows)
                                    .map((d) => {
                                    if (Util_1.isString(d)) {
                                        const dataset = datasetsByName[d];
                                        return (React.createElement("li", { key: dataset.name, style: {
                                                minWidth: "100%",
                                            } },
                                            React.createElement("h5", null,
                                                highlight(dataset.name),
                                                dataset.isPrivate ? (React.createElement("span", { className: "text-danger" },
                                                    " ",
                                                    "(unpublished)")) : (""))));
                                    }
                                    else {
                                        return d.map((v) => (React.createElement("li", { key: `${v.id}-${v.name}`, style: {
                                                minWidth: "50%",
                                            } },
                                            React.createElement(Forms_1.Toggle, { value: this.chosenVariables
                                                    .map((cv) => cv.id)
                                                    .includes(v.id), onValue: () => this.toggleVariable(v), label: highlight(v.name) }))));
                                    }
                                }))))),
                    React.createElement("div", { className: "selectedData" },
                        React.createElement("ul", null, chosenVariables.map((d) => {
                            return (React.createElement("li", { key: d.id },
                                React.createElement(Forms_1.Toggle, { value: true, onValue: () => this.unselectVariable(d), label: d.name })));
                        }))))),
            React.createElement("div", { className: "modal-footer" },
                React.createElement("button", { className: "btn", onClick: this.onDismiss }, "Close"),
                React.createElement("button", { className: "btn btn-success", onClick: this.onComplete },
                    "Set variable",
                    slot.allowMultiple && "s"))));
    }
    onScroll(ev) {
        const { scrollTop, scrollHeight } = ev.currentTarget;
        const { numTotalRows } = this;
        const rowOffset = Math.round((scrollTop / scrollHeight) * numTotalRows);
        ev.currentTarget.scrollTop = Math.round((rowOffset / numTotalRows) * scrollHeight);
        this.rowOffset = rowOffset;
    }
    onNamespace(selected) {
        const value = Util_1.first(react_select_2.asArray(selected));
        if (value)
            this.chosenNamespace = value;
    }
    onSearchInput(input) {
        this.searchInput = input;
        this.rowOffset = 0;
        this.scrollElement.scrollTop = 0;
    }
    selectVariable(variable) {
        if (this.props.slot.allowMultiple)
            this.chosenVariables = this.chosenVariables.concat(variable);
        else
            this.chosenVariables = [variable];
    }
    unselectVariable(variable) {
        this.chosenVariables = this.chosenVariables.filter((v) => v.id !== variable.id);
    }
    toggleVariable(variable) {
        if (this.chosenVariables.includes(variable)) {
            this.unselectVariable(variable);
        }
        else {
            this.selectVariable(variable);
        }
    }
    onSearchEnter() {
        if (this.searchResults.length > 0) {
            this.selectVariable(this.searchResults[0]);
        }
    }
    onDismiss() {
        this.props.onDismiss();
    }
    componentDidMount() {
        this.dispose = mobx_1.autorun(() => {
            if (!this.editorData)
                mobx_1.runInAction(() => this.props.editor.loadNamespace(this.currentNamespace.name));
        });
        this.initChosenVariables();
    }
    initChosenVariables() {
        this.chosenVariables = this.props.slot.dimensionsOrderedAsInPersistedSelection.map((d) => ({
            name: d.column.displayName,
            id: d.variableId,
            datasetName: "",
        }));
    }
    componentWillUnmount() {
        this.dispose();
    }
    onComplete() {
        this.props.onComplete(this.chosenVariables.map((v) => v.id));
    }
};
__decorate([
    mobx_1.observable.ref
], VariableSelector.prototype, "chosenNamespace", void 0);
__decorate([
    mobx_1.observable.ref
], VariableSelector.prototype, "searchInput", void 0);
__decorate([
    mobx_1.observable.ref
], VariableSelector.prototype, "isProjection", void 0);
__decorate([
    mobx_1.observable.ref
], VariableSelector.prototype, "tolerance", void 0);
__decorate([
    mobx_1.observable.ref
], VariableSelector.prototype, "chosenVariables", void 0);
__decorate([
    mobx_1.observable
], VariableSelector.prototype, "rowOffset", void 0);
__decorate([
    mobx_1.observable
], VariableSelector.prototype, "numVisibleRows", void 0);
__decorate([
    mobx_1.observable
], VariableSelector.prototype, "rowHeight", void 0);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "database", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "currentNamespace", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "editorData", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "datasets", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "datasetsByName", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "availableVariables", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "searchResults", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "resultsByDataset", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "searchResultRows", null);
__decorate([
    mobx_1.computed
], VariableSelector.prototype, "numTotalRows", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "onScroll", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "onNamespace", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "onSearchInput", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "selectVariable", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "unselectVariable", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "toggleVariable", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "onSearchEnter", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "onDismiss", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "initChosenVariables", null);
__decorate([
    mobx_1.action.bound
], VariableSelector.prototype, "onComplete", null);
VariableSelector = __decorate([
    mobx_react_1.observer
], VariableSelector);
exports.VariableSelector = VariableSelector;
//# sourceMappingURL=VariableSelector.js.map