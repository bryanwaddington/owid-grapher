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
exports.EntitySelectorModal = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
const FuzzySearch_1 = require("./FuzzySearch");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
let EntitySelectorMulti = class EntitySelectorMulti extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        this.dismissable = true;
    }
    get availableEntities() {
        return this.props.selectionArray.availableEntityNames;
    }
    get fuzzy() {
        return new FuzzySearch_1.FuzzySearch(this.searchableEntities, "name");
    }
    get searchableEntities() {
        return this.availableEntities.map((name) => {
            return { name };
        });
    }
    get searchResults() {
        return this.searchInput
            ? this.fuzzy.search(this.searchInput)
            : Util_1.sortBy(this.searchableEntities, (result) => result.name);
    }
    onClickOutside(e) {
        if (this.dismissable)
            this.props.onDismiss();
    }
    componentDidMount() {
        // HACK (Mispy): The normal ways of doing this (stopPropagation etc) don't seem to work here
        this.base.current.addEventListener("click", () => {
            this.dismissable = false;
            setTimeout(() => (this.dismissable = true), 100);
        });
        setTimeout(() => document.addEventListener("click", this.onClickOutside), 1);
        if (!Util_1.isTouchDevice())
            this.searchField.focus();
    }
    componentWillUnmount() {
        document.removeEventListener("click", this.onClickOutside);
    }
    onSearchKeyDown(e) {
        if (e.key === "Enter" && this.searchResults.length > 0) {
            this.props.selectionArray.selectEntity(this.searchResults[0].name);
            this.searchInput = "";
        }
        else if (e.key === "Escape")
            this.props.onDismiss();
    }
    onClear() {
        this.props.selectionArray.clearSelection();
    }
    render() {
        const { selectionArray } = this.props;
        const { searchResults, searchInput } = this;
        const selectedEntityNames = selectionArray.selectedEntityNames;
        return (React.createElement("div", { className: "entitySelectorOverlay" },
            React.createElement("div", { ref: this.base, className: "EntitySelectorMulti" },
                React.createElement("header", { className: "wrapper" },
                    React.createElement("h2", null,
                        "Choose data to show",
                        " ",
                        React.createElement("button", { onClick: this.props.onDismiss },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes })))),
                React.createElement("div", { className: "entities wrapper" },
                    React.createElement("div", { className: "searchResults" },
                        React.createElement("input", { type: "search", placeholder: "Search...", value: searchInput, onInput: (e) => {
                                this.searchInput = e.currentTarget.value;
                            }, onKeyDown: this.onSearchKeyDown, ref: (e) => (this.searchField = e) }),
                        React.createElement("ul", null, searchResults.map((result) => {
                            return (React.createElement("li", { key: result.name },
                                React.createElement("label", { className: "clickable" },
                                    React.createElement("input", { type: "checkbox", checked: selectionArray.selectedSet.has(result.name), onChange: () => selectionArray.toggleSelection(result.name) }),
                                    " ",
                                    result.name)));
                        }))),
                    React.createElement("div", { className: "selectedData" },
                        React.createElement("ul", null, selectedEntityNames.map((name) => {
                            return (React.createElement("li", { key: name },
                                React.createElement("label", { className: "clickable" },
                                    React.createElement("input", { type: "checkbox", checked: true, onChange: () => {
                                            selectionArray.deselectEntity(name);
                                        } }),
                                    " ",
                                    name)));
                        })),
                        selectedEntityNames.length > 1 ? (React.createElement("button", { className: "clearSelection", onClick: this.onClear },
                            React.createElement("span", { className: "icon" },
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes })),
                            " ",
                            "Unselect all")) : undefined)))));
    }
};
__decorate([
    mobx_1.observable
], EntitySelectorMulti.prototype, "searchInput", void 0);
__decorate([
    mobx_1.computed
], EntitySelectorMulti.prototype, "availableEntities", null);
__decorate([
    mobx_1.computed
], EntitySelectorMulti.prototype, "fuzzy", null);
__decorate([
    mobx_1.computed
], EntitySelectorMulti.prototype, "searchableEntities", null);
__decorate([
    mobx_1.computed
], EntitySelectorMulti.prototype, "searchResults", null);
__decorate([
    mobx_1.action.bound
], EntitySelectorMulti.prototype, "onClickOutside", null);
__decorate([
    mobx_1.action.bound
], EntitySelectorMulti.prototype, "onSearchKeyDown", null);
__decorate([
    mobx_1.action.bound
], EntitySelectorMulti.prototype, "onClear", null);
EntitySelectorMulti = __decorate([
    mobx_react_1.observer
], EntitySelectorMulti);
let EntitySelectorSingle = class EntitySelectorSingle extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        this.dismissable = true;
    }
    get availableEntities() {
        const availableItems = [];
        this.props.selectionArray.availableEntityNames.forEach((name) => {
            availableItems.push({
                id: name,
                label: name,
            });
        });
        return Util_1.uniqBy(availableItems, (d) => d.label);
    }
    get fuzzy() {
        return new FuzzySearch_1.FuzzySearch(this.availableEntities, "label");
    }
    get searchResults() {
        return this.searchInput
            ? this.fuzzy.search(this.searchInput)
            : Util_1.sortBy(this.availableEntities, (result) => result.label);
    }
    onClickOutside(e) {
        if (this.base && !this.base.current.contains(e.target))
            this.props.onDismiss();
    }
    componentDidMount() {
        // HACK (Mispy): The normal ways of doing this (stopPropagation etc) don't seem to work here
        this.base.current.addEventListener("click", () => {
            this.dismissable = false;
            setTimeout(() => (this.dismissable = true), 100);
        });
        setTimeout(() => document.addEventListener("click", this.onClickOutside), 1);
        if (!this.props.isMobile)
            this.searchField.focus();
    }
    componentWillUnmount() {
        document.removeEventListener("click", this.onClickOutside);
    }
    onSearchKeyDown(e) {
        if (e.key === "Enter" && this.searchResults.length > 0) {
            this.onSelect(this.searchResults[0].label);
            this.searchInput = "";
        }
        else if (e.key === "Escape")
            this.props.onDismiss();
    }
    onSelect(entityName) {
        this.props.selectionArray.setSelectedEntities([entityName]);
        this.props.onDismiss();
    }
    render() {
        const { searchResults, searchInput } = this;
        return (React.createElement("div", { className: "entitySelectorOverlay" },
            React.createElement("div", { ref: this.base, className: "EntitySelectorSingle" },
                React.createElement("header", { className: "wrapper" },
                    React.createElement("h2", null,
                        "Choose data to show",
                        " ",
                        React.createElement("button", { onClick: this.props.onDismiss },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes })))),
                React.createElement("div", { className: "wrapper" },
                    React.createElement("input", { type: "search", placeholder: "Search...", value: searchInput, onInput: (e) => {
                            this.searchInput = e.currentTarget.value;
                        }, onKeyDown: this.onSearchKeyDown, ref: (e) => (this.searchField = e) }),
                    React.createElement("ul", null, searchResults.map((d) => {
                        return (React.createElement("li", { key: d.id, className: "clickable", onClick: () => this.onSelect(d.id) }, d.label));
                    }))))));
    }
};
__decorate([
    mobx_1.observable
], EntitySelectorSingle.prototype, "searchInput", void 0);
__decorate([
    mobx_1.computed
], EntitySelectorSingle.prototype, "availableEntities", null);
__decorate([
    mobx_1.computed
], EntitySelectorSingle.prototype, "fuzzy", null);
__decorate([
    mobx_1.computed
], EntitySelectorSingle.prototype, "searchResults", null);
__decorate([
    mobx_1.action.bound
], EntitySelectorSingle.prototype, "onClickOutside", null);
__decorate([
    mobx_1.action.bound
], EntitySelectorSingle.prototype, "onSearchKeyDown", null);
__decorate([
    mobx_1.action.bound
], EntitySelectorSingle.prototype, "onSelect", null);
EntitySelectorSingle = __decorate([
    mobx_react_1.observer
], EntitySelectorSingle);
let EntitySelectorModal = class EntitySelectorModal extends React.Component {
    render() {
        return this.props.canChangeEntity ? (React.createElement(EntitySelectorSingle, Object.assign({}, this.props))) : (React.createElement(EntitySelectorMulti, Object.assign({}, this.props)));
    }
};
EntitySelectorModal = __decorate([
    mobx_react_1.observer
], EntitySelectorModal);
exports.EntitySelectorModal = EntitySelectorModal;
//# sourceMappingURL=EntitySelectorModal.js.map