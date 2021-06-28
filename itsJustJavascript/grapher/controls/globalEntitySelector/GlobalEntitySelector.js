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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateGlobalEntitySelectorIfAny = exports.GlobalEntitySelector = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_select_1 = __importStar(require("react-select"));
const classnames_1 = __importDefault(require("classnames"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const countries_1 = require("../../../clientUtils/countries");
const Util_1 = require("../../../clientUtils/Util");
const GrapherAnalytics_1 = require("../../core/GrapherAnalytics");
const GrapherConstants_1 = require("../../core/GrapherConstants");
const GlobalEntitySelectorConstants_1 = require("./GlobalEntitySelectorConstants");
const EntityUrlBuilder_1 = require("../../core/EntityUrlBuilder");
const Url_1 = require("../../../clientUtils/urls/Url");
var GlobalEntitySelectionModes;
(function (GlobalEntitySelectionModes) {
    GlobalEntitySelectionModes["none"] = "none";
    // Possibly might need the `add` state in the future to
    // add country from geolocation without clearing others.
    // One thing to figure out is what its behaviour should
    // be for single-entity charts.
    // add = "add",
    GlobalEntitySelectionModes["override"] = "override";
})(GlobalEntitySelectionModes || (GlobalEntitySelectionModes = {}));
const allEntities = Util_1.sortBy(countries_1.countries, (c) => c.name)
    // Add 'World'
    .concat([
    {
        name: GrapherConstants_1.WorldEntityName,
        code: "OWID_WRL",
        slug: "world",
    },
]);
const Option = (props) => {
    return (React.createElement("div", null,
        React.createElement(react_select_1.components.Option, Object.assign({}, props),
            React.createElement("input", { type: "checkbox", checked: props.isSelected, readOnly: true }),
            " ",
            React.createElement("label", null, props.label))));
};
const SelectOptions = {
    components: {
        IndicatorSeparator: null,
        Option,
    },
    menuPlacement: "bottom",
    isClearable: false,
    isMulti: true,
    backspaceRemovesValue: false,
    blurInputOnSelect: false,
    closeMenuOnSelect: false,
    controlShouldRenderValue: false,
    hideSelectedOptions: false,
    placeholder: "Add a country to all charts...",
    styles: {
        placeholder: (base) => (Object.assign(Object.assign({}, base), { whiteSpace: "nowrap" })),
        valueContainer: (base) => (Object.assign(Object.assign({}, base), { paddingTop: 0, paddingBottom: 0 })),
        control: (base) => (Object.assign(Object.assign({}, base), { minHeight: "initial" })),
        dropdownIndicator: (base) => (Object.assign(Object.assign({}, base), { padding: "0 5px" })),
    },
};
function SelectedItems(props) {
    var _a;
    const canRemove = ((_a = props.canRemove) !== null && _a !== void 0 ? _a : true) && props.onRemove !== undefined;
    const onRemove = props.onRemove || Util_1.noop;
    const isEmpty = props.selectedEntityNames.length === 0;
    return (React.createElement("div", { className: "selected-items-container" }, isEmpty ? (React.createElement("div", { className: "empty" }, props.emptyLabel)) : (React.createElement("div", { className: "selected-items" }, props.selectedEntityNames.map((entityName) => (React.createElement("div", { key: entityName, className: classnames_1.default("selected-item", {
            removable: canRemove,
        }) },
        React.createElement("div", { className: "label" }, entityName),
        canRemove && (React.createElement("div", { className: "remove-icon", onClick: () => onRemove(entityName) },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes }))))))))));
}
let GlobalEntitySelector = class GlobalEntitySelector extends React.Component {
    constructor() {
        var _a;
        super(...arguments);
        this.refContainer = React.createRef();
        this.disposers = [];
        this.mode = GlobalEntitySelectionModes.none;
        this.isNarrow = true;
        this.isOpen = false;
        this.selection = this.props.selection;
        this.optionGroups = [];
        this.onResizeThrottled = Util_1.throttle(this.onResize, 200);
        this.analytics = new GrapherAnalytics_1.GrapherAnalytics((_a = this.props.environment) !== null && _a !== void 0 ? _a : "development");
    }
    componentDidMount() {
        this.onResize();
        window.addEventListener("resize", this.onResizeThrottled);
        this.disposers.push(mobx_1.reaction(() => this.isOpen, () => this.prepareOptionGroups()));
        this.populateLocalEntity();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.onResizeThrottled);
        this.disposers.forEach((dispose) => dispose());
    }
    onResize() {
        const container = this.refContainer.current;
        if (container)
            this.isNarrow = container.offsetWidth <= 640;
    }
    populateLocalEntity() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const localCountryCode = yield Util_1.getCountryCodeFromNetlifyRedirect();
                if (!localCountryCode)
                    return;
                const country = allEntities.find((entity) => entity.code === localCountryCode);
                if (country)
                    this.localEntityName = country.name;
            }
            catch (err) { }
        });
    }
    prepareOptionGroups() {
        let optionGroups = [];
        // We want to include the local country, but not if it's already selected, it adds
        // unnecessary duplication.
        if (this.localEntityName &&
            !this.selection.selectedSet.has(this.localEntityName)) {
            optionGroups = optionGroups.concat([
                {
                    label: "Suggestions",
                    options: [entityNameToOption(this.localEntityName)],
                },
            ]);
        }
        if (this.selection.hasSelection) {
            optionGroups = optionGroups.concat([
                {
                    label: "Selected",
                    options: this.selection.selectedEntityNames.map(entityNameToOption),
                },
            ]);
        }
        optionGroups = optionGroups.concat([
            {
                label: "All countries",
                options: allEntities
                    .map((entity) => entity.name)
                    .map(entityNameToOption),
            },
        ]);
        this.optionGroups = optionGroups;
        return optionGroups;
    }
    updateURL() {
        Url_1.setWindowUrl(EntityUrlBuilder_1.setSelectedEntityNamesParam(Url_1.getWindowUrl(), this.selection.selectedEntityNames));
    }
    updateSelection(newSelectedEntities) {
        this.selection.setSelectedEntities(newSelectedEntities);
        this.updateAllGraphersAndExplorersOnPage();
        this.updateURL();
    }
    onChange(options) {
        this.updateSelection(options.map((option) => option.label));
        this.analytics.logGlobalEntitySelector("change", this.selection.selectedEntityNames.join(","));
    }
    updateAllGraphersAndExplorersOnPage() {
        if (!this.props.graphersAndExplorersToUpdate)
            return;
        Array.from(this.props.graphersAndExplorersToUpdate.values()).forEach((value) => {
            value.setSelectedEntities(this.selection.selectedEntityNames);
        });
    }
    onRemove(option) {
        this.selection.toggleSelection(option);
        this.updateAllGraphersAndExplorersOnPage();
        this.updateURL();
    }
    onMenuOpen() {
        this.isOpen = true;
    }
    onMenuClose() {
        this.isOpen = false;
    }
    onButtonOpen(event) {
        this.analytics.logGlobalEntitySelector("open", event.currentTarget.innerText);
        this.onMenuOpen();
    }
    onButtonClose(event) {
        this.analytics.logGlobalEntitySelector("close", event.currentTarget.innerText);
        this.onMenuClose();
    }
    get selectedOptions() {
        return this.selection.selectedEntityNames.map(entityNameToOption);
    }
    renderNarrow() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: classnames_1.default("narrow-summary", {
                    "narrow-summary-selected-items": !this.isOpen,
                }) }, this.isOpen ? (React.createElement(react_select_1.default, Object.assign({}, SelectOptions, { options: this.optionGroups, value: this.selectedOptions, onChange: this.onChange, menuIsOpen: this.isOpen, autoFocus: true }))) : (React.createElement(React.Fragment, null, !this.selection.hasSelection
                ? "None selected"
                : this.selection.selectedEntityNames
                    .map((entityName) => (React.createElement("span", { className: "narrow-summary-selected-item", key: entityName }, entityName)))
                    .reduce((acc, item) => acc.length === 0
                    ? [item]
                    : [...acc, ", ", item], [])))),
            React.createElement("div", { className: "narrow-actions" }, this.isOpen ? (React.createElement("button", { className: "button", onClick: this.onButtonClose }, "Done")) : (React.createElement("button", { className: "button", onClick: this.onButtonOpen }, !this.selection.hasSelection
                ? "Select countries"
                : "Edit")))));
    }
    renderWide() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "select-dropdown-container" },
                React.createElement(react_select_1.default, Object.assign({}, SelectOptions, { options: this.optionGroups, onChange: this.onChange, value: this.selectedOptions, onMenuOpen: this.onMenuOpen, onMenuClose: this.onMenuClose }))),
            React.createElement(SelectedItems, { selectedEntityNames: this.selection.selectedEntityNames, onRemove: this.onRemove, emptyLabel: "Select countries to show on all charts" })));
    }
    render() {
        return (React.createElement("div", { className: classnames_1.default("global-entity-control", {
                "is-narrow": this.isNarrow,
                "is-wide": !this.isNarrow,
            }), ref: this.refContainer, onClick: this.isNarrow && !this.isOpen ? this.onMenuOpen : undefined }, this.isNarrow ? this.renderNarrow() : this.renderWide()));
    }
};
__decorate([
    mobx_1.observable
], GlobalEntitySelector.prototype, "mode", void 0);
__decorate([
    mobx_1.observable
], GlobalEntitySelector.prototype, "isNarrow", void 0);
__decorate([
    mobx_1.observable
], GlobalEntitySelector.prototype, "isOpen", void 0);
__decorate([
    mobx_1.observable
], GlobalEntitySelector.prototype, "localEntityName", void 0);
__decorate([
    mobx_1.observable.ref
], GlobalEntitySelector.prototype, "optionGroups", void 0);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "onResize", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "populateLocalEntity", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "prepareOptionGroups", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "updateURL", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "updateSelection", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "onChange", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "updateAllGraphersAndExplorersOnPage", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "onRemove", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "onMenuOpen", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "onMenuClose", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "onButtonOpen", null);
__decorate([
    mobx_1.action.bound
], GlobalEntitySelector.prototype, "onButtonClose", null);
__decorate([
    mobx_1.computed
], GlobalEntitySelector.prototype, "selectedOptions", null);
GlobalEntitySelector = __decorate([
    mobx_react_1.observer
], GlobalEntitySelector);
exports.GlobalEntitySelector = GlobalEntitySelector;
const hydrateGlobalEntitySelectorIfAny = (selection, graphersAndExplorersToUpdate) => {
    const element = document.querySelector(GlobalEntitySelectorConstants_1.GLOBAL_ENTITY_SELECTOR_ELEMENT);
    if (!element)
        return;
    ReactDOM.hydrate(React.createElement(GlobalEntitySelector, { selection: selection, graphersAndExplorersToUpdate: graphersAndExplorersToUpdate }), element);
};
exports.hydrateGlobalEntitySelectorIfAny = hydrateGlobalEntitySelectorIfAny;
const entityNameToOption = (label) => ({
    label,
    value: label,
});
//# sourceMappingURL=GlobalEntitySelector.js.map