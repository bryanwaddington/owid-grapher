"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityPicker = void 0;
const react_1 = __importDefault(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_flip_toolkit_1 = require("react-flip-toolkit");
const decko_1 = require("decko");
const classnames_1 = __importDefault(require("classnames"));
const d3_scale_1 = require("d3-scale");
const react_select_1 = __importDefault(require("react-select"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faSearch_1 = require("@fortawesome/free-solid-svg-icons/faSearch");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const FuzzySearch_1 = require("../../controls/FuzzySearch");
const Util_1 = require("../../../clientUtils/Util");
const VerticalScrollContainer_1 = require("../../controls/VerticalScrollContainer");
const SortIcon_1 = require("../../controls/SortIcon");
const CoreTableConstants_1 = require("../../../coreTable/CoreTableConstants");
const react_select_2 = require("../../../clientUtils/react-select");
const CoreTableColumns_1 = require("../../../coreTable/CoreTableColumns");
const OwidTableConstants_1 = require("../../../coreTable/OwidTableConstants");
const toggleSort = (order) => order === CoreTableConstants_1.SortOrder.desc ? CoreTableConstants_1.SortOrder.asc : CoreTableConstants_1.SortOrder.desc;
var FocusDirection;
(function (FocusDirection) {
    FocusDirection["first"] = "first";
    FocusDirection["last"] = "last";
    FocusDirection["up"] = "up";
    FocusDirection["down"] = "down";
})(FocusDirection || (FocusDirection = {}));
/** Modulo that wraps negative numbers too */
const mod = (n, m) => ((n % m) + m) % m;
let EntityPicker = class EntityPicker extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.searchInputRef = react_1.default.createRef();
        this.focusRef = react_1.default.createRef();
        this.scrollFocusedIntoViewOnUpdate = false;
        this.blockOptionHover = false;
        this.scrollContainerRef = react_1.default.createRef();
        this.isOpen = false;
    }
    get analyticsNamespace() {
        var _a;
        return (_a = this.manager.analyticsNamespace) !== null && _a !== void 0 ? _a : "";
    }
    get isDropdownMenu() {
        return !!this.props.isDropdownMenu;
    }
    selectEntity(name, checked) {
        var _a;
        this.manager.selection.toggleSelection(name);
        // Clear search input
        this.searchInput = "";
        (_a = this.manager.analytics) === null || _a === void 0 ? void 0 : _a.logEntityPickerEvent(this.analyticsNamespace, checked ? "select" : "deselect", name);
    }
    get manager() {
        return this.props.manager;
    }
    get metric() {
        return this.manager.entityPickerMetric;
    }
    get sortOrder() {
        var _a;
        // On mobile, only allow sorting by entityName (ascending)
        if (this.isDropdownMenu)
            return CoreTableConstants_1.SortOrder.asc;
        return (_a = this.manager.entityPickerSort) !== null && _a !== void 0 ? _a : CoreTableConstants_1.SortOrder.asc;
    }
    get pickerColumnDefs() {
        var _a;
        return (_a = this.manager.entityPickerColumnDefs) !== null && _a !== void 0 ? _a : [];
    }
    get metricOptions() {
        return this.pickerColumnDefs.map((col) => {
            return {
                label: col.name || col.slug,
                value: col.slug,
            };
        });
    }
    get activePickerMetricColumn() {
        var _a;
        if (!this.metric)
            return undefined;
        return (_a = this.manager.entityPickerTable) === null || _a === void 0 ? void 0 : _a.getColumns([this.metric])[0];
    }
    get availableEntitiesForCurrentView() {
        var _a;
        if (!((_a = this.manager.requiredColumnSlugs) === null || _a === void 0 ? void 0 : _a.length) || !this.grapherTable)
            return this.selection.availableEntityNameSet;
        return this.grapherTable.entitiesWith(this.manager.requiredColumnSlugs);
    }
    get entitiesWithMetricValue() {
        const { pickerTable, selection } = this;
        const col = this.activePickerMetricColumn;
        const entityNames = selection.availableEntityNames.slice().sort();
        return entityNames.map((entityName) => {
            const plotValue = col && pickerTable
                ? pickerTable.getLatestValueForEntity(entityName, col.slug)
                : undefined;
            const formattedValue = plotValue !== undefined
                ? col === null || col === void 0 ? void 0 : col.formatValueShortWithAbbreviations(plotValue)
                : undefined;
            return {
                entityName,
                plotValue,
                formattedValue,
            };
        });
    }
    get grapherTable() {
        return this.manager.grapherTable;
    }
    get pickerTable() {
        return this.manager.entityPickerTable;
    }
    get selection() {
        return this.manager.selection;
    }
    get selectionSet() {
        return new Set(this.selection.selectedEntityNames);
    }
    get fuzzy() {
        return new FuzzySearch_1.FuzzySearch(this.entitiesWithMetricValue, OwidTableConstants_1.OwidTableSlugs.entityName);
    }
    get searchResults() {
        if (this.searchInput)
            return this.fuzzy.search(this.searchInput);
        const { selectionSet } = this;
        // Show the selected up top and in order.
        const [selected, unselected] = Util_1.partition(Util_1.sortByUndefinedLast(this.entitiesWithMetricValue, (option) => option.plotValue, this.sortOrder), (option) => selectionSet.has(option.entityName));
        return [...selected, ...unselected];
    }
    normalizeFocusIndex(index) {
        if (this.searchResults.length === 0)
            return undefined;
        return mod(index, this.searchResults.length);
    }
    get focusedOption() {
        return this.focusIndex !== undefined
            ? this.searchResults[this.focusIndex].entityName
            : undefined;
    }
    get showDoneButton() {
        return this.isDropdownMenu && this.isOpen;
    }
    focusOptionDirection(direction) {
        if (direction === FocusDirection.first)
            this.focusIndex = this.normalizeFocusIndex(0);
        else if (direction === FocusDirection.last)
            this.focusIndex = this.normalizeFocusIndex(-1);
        else if (direction === FocusDirection.up) {
            const newIndex = this.focusIndex === undefined ? -1 : this.focusIndex - 1;
            this.focusIndex = this.normalizeFocusIndex(newIndex);
        }
        else if (direction === FocusDirection.down) {
            const newIndex = this.focusIndex === undefined ? 0 : this.focusIndex + 1;
            this.focusIndex = this.normalizeFocusIndex(newIndex);
        }
        else
            return; // Exit without updating scroll
        this.scrollFocusedIntoViewOnUpdate = true;
    }
    clearSearchInput() {
        if (this.searchInput)
            this.searchInput = "";
    }
    onKeyDown(event) {
        var _a;
        // We want to block hover if a key is pressed.
        // The hover will be unblocked iff the user moves the mouse (relative to the menu).
        this.blockHover();
        switch (event.key) {
            case "Enter":
                if (event.keyCode === 229) {
                    // ignore the keydown event from an Input Method Editor(IME)
                    // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
                    break;
                }
                if (!this.focusedOption)
                    return;
                const name = this.focusedOption;
                this.selectEntity(name);
                this.clearSearchInput();
                (_a = this.manager.analytics) === null || _a === void 0 ? void 0 : _a.logEntityPickerEvent(this.analyticsNamespace, "enter", name);
                break;
            case "ArrowUp":
                this.focusOptionDirection(FocusDirection.up);
                break;
            case "ArrowDown":
                this.focusOptionDirection(FocusDirection.down);
                break;
            default:
                return;
        }
        event.preventDefault();
    }
    focusSearch() {
        var _a;
        (_a = this.searchInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }
    onSearchFocus() {
        this.isOpen = true;
        if (this.focusIndex === undefined)
            this.focusOptionDirection(FocusDirection.first);
    }
    onSearchBlur() {
        // Do not allow focus on elements inside menu; shift focus back to search input.
        if (this.scrollContainerRef.current &&
            this.scrollContainerRef.current.contains(document.activeElement)) {
            this.focusSearch();
            return;
        }
        this.isOpen = false;
        this.focusIndex = undefined;
    }
    onHover(index) {
        if (!this.blockOptionHover)
            this.focusIndex = index;
    }
    blockHover() {
        this.blockOptionHover = true;
    }
    unblockHover() {
        this.blockOptionHover = false;
    }
    onMenuMouseDown(event) {
        event.stopPropagation();
        event.preventDefault();
        this.focusSearch();
    }
    highlightLabel(label) {
        if (!this.searchInput)
            return label;
        const result = this.fuzzy.single(this.searchInput, label);
        if (!result)
            return label;
        const tokens = [];
        for (let i = 0; i < result.target.length; i++) {
            const currentToken = Util_1.last(tokens);
            const match = result.indexes.includes(i);
            const char = result.target[i];
            if (!currentToken || currentToken.match !== match) {
                tokens.push({
                    match,
                    text: char,
                });
            }
            else
                currentToken.text += char;
        }
        return (react_1.default.createElement(react_1.default.Fragment, null, tokens.map((token, i) => token.match ? (react_1.default.createElement("mark", { key: i }, token.text)) : (react_1.default.createElement(react_1.default.Fragment, { key: i }, token.text)))));
    }
    get barScale() {
        const maxValue = Util_1.max(this.entitiesWithMetricValue
            .map((option) => option.plotValue)
            .filter(Util_1.isNumber));
        return d3_scale_1.scaleLinear()
            .domain([0, maxValue !== null && maxValue !== void 0 ? maxValue : 1])
            .range([0, 1]);
    }
    componentDidMount() {
        // Whenever the search term changes, shift focus to first option in the list
        mobx_1.reaction(() => this.searchInput, () => this.focusOptionDirection(FocusDirection.first));
    }
    componentDidUpdate() {
        if (this.focusIndex !== undefined &&
            this.scrollFocusedIntoViewOnUpdate &&
            this.scrollContainerRef.current &&
            this.focusRef.current) {
            Util_1.scrollIntoViewIfNeeded(this.scrollContainerRef.current, this.focusRef.current);
            mobx_1.runInAction(() => (this.scrollFocusedIntoViewOnUpdate = false));
        }
    }
    updateMetric(columnSlug) {
        var _a, _b, _c;
        (_b = (_a = this.manager).setEntityPicker) === null || _b === void 0 ? void 0 : _b.call(_a, {
            metric: columnSlug,
            sort: this.isActivePickerColumnTypeNumeric
                ? CoreTableConstants_1.SortOrder.desc
                : CoreTableConstants_1.SortOrder.asc,
        });
        (_c = this.manager.analytics) === null || _c === void 0 ? void 0 : _c.logEntityPickerEvent(this.analyticsNamespace, "sortBy", columnSlug);
    }
    get isActivePickerColumnTypeNumeric() {
        return this.activePickerMetricColumn instanceof CoreTableColumns_1.ColumnTypeMap.Numeric;
    }
    get pickerMenu() {
        if (this.isDropdownMenu ||
            !this.manager.entityPickerColumnDefs ||
            this.manager.entityPickerColumnDefs.length === 0)
            return null;
        return (react_1.default.createElement("div", { className: "MetricSettings" },
            react_1.default.createElement("span", { className: "mainLabel" }, "Sort by"),
            react_1.default.createElement(react_select_1.default, { className: "metricDropdown", options: this.metricOptions, value: this.metricOptions.find((option) => option.value === this.metric), onChange: (option) => {
                    var _a;
                    const value = (_a = Util_1.first(react_select_2.asArray(option))) === null || _a === void 0 ? void 0 : _a.value;
                    if (value)
                        this.updateMetric(value);
                }, menuPlacement: "bottom", components: {
                    IndicatorSeparator: null,
                }, styles: react_select_2.getStylesForTargetHeight(26), isSearchable: false, isLoading: this.manager.entityPickerTableIsLoading }),
            react_1.default.createElement("span", { className: "sort", onClick: () => {
                    var _a, _b, _c;
                    const sortOrder = toggleSort(this.sortOrder);
                    (_b = (_a = this.manager).setEntityPicker) === null || _b === void 0 ? void 0 : _b.call(_a, { sort: sortOrder });
                    (_c = this.manager.analytics) === null || _c === void 0 ? void 0 : _c.logEntityPickerEvent(this.analyticsNamespace, "sortOrder", sortOrder);
                } },
                react_1.default.createElement(SortIcon_1.SortIcon, { type: this.isActivePickerColumnTypeNumeric
                        ? "numeric"
                        : "text", order: this.sortOrder }))));
    }
    render() {
        var _a;
        const { selection } = this;
        const entities = this.searchResults;
        const selectedEntityNames = selection.selectedEntityNames;
        const availableEntities = this.availableEntitiesForCurrentView;
        const selectedDebugMessage = `${selectedEntityNames.length} selected. ${availableEntities.size} available. ${this.entitiesWithMetricValue.length} options total.`;
        const entityType = selection.entityType;
        return (react_1.default.createElement("div", { className: "EntityPicker", onKeyDown: this.onKeyDown },
            react_1.default.createElement("div", { className: "EntityPickerSearchInput" },
                react_1.default.createElement("input", { className: classnames_1.default("input-field", {
                        "with-done-button": this.showDoneButton,
                    }), type: "text", placeholder: `Type to add a ${entityType}...`, value: (_a = this.searchInput) !== null && _a !== void 0 ? _a : "", onChange: (e) => (this.searchInput = e.currentTarget.value), onFocus: this.onSearchFocus, onBlur: this.onSearchBlur, ref: this.searchInputRef, "data-track-note": `${this.analyticsNamespace}-picker-search-input` }),
                react_1.default.createElement("div", { className: "search-icon" },
                    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearch_1.faSearch })),
                this.showDoneButton && (react_1.default.createElement("div", { className: "done" },
                    react_1.default.createElement("button", null, "Done")))),
            this.pickerMenu,
            react_1.default.createElement("div", { className: "EntityListContainer" }, (!this.isDropdownMenu || this.isOpen) && (react_1.default.createElement("div", { className: classnames_1.default("EntityList", {
                    isDropdown: this.isDropdownMenu,
                }), onMouseDown: this.onMenuMouseDown },
                react_1.default.createElement(VerticalScrollContainer_1.VerticalScrollContainer, { scrollingShadows: true, scrollLock: true, className: "EntitySearchResults", contentsId: entities
                        .map((c) => c.entityName)
                        .join(","), onMouseMove: this.unblockHover, ref: this.scrollContainerRef },
                    react_1.default.createElement(react_flip_toolkit_1.Flipper, { spring: {
                            stiffness: 300,
                            damping: 33,
                        }, 
                        // We only want to animate when the selection changes, but not on changes due to
                        // searching
                        flipKey: selectedEntityNames.join(",") }, entities.map((option, index) => (react_1.default.createElement(PickerOption, { key: index, hasDataForActiveMetric: availableEntities.has(option.entityName), optionWithMetricValue: option, highlight: this.highlightLabel, barScale: this.barScale, onChange: this.selectEntity, onHover: () => this.onHover(index), isSelected: this.selectionSet.has(option.entityName), isFocused: this.focusIndex === index, innerRef: this.focusIndex === index
                            ? this.focusRef
                            : undefined }))))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { title: selectedDebugMessage, className: "ClearSelectionButton", "data-track-note": `${this.analyticsNamespace}-clear-selection`, onClick: () => selection.clearSelection() },
                        react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTimes_1.faTimes }),
                        " Clear selection")))))));
    }
};
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "analyticsNamespace", null);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "searchInput", void 0);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "searchInputRef", void 0);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "focusIndex", void 0);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "focusRef", void 0);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "scrollFocusedIntoViewOnUpdate", void 0);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "blockOptionHover", void 0);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "scrollContainerRef", void 0);
__decorate([
    mobx_1.observable
], EntityPicker.prototype, "isOpen", void 0);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "isDropdownMenu", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "selectEntity", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "manager", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "metric", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "sortOrder", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "pickerColumnDefs", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "metricOptions", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "activePickerMetricColumn", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "availableEntitiesForCurrentView", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "entitiesWithMetricValue", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "grapherTable", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "pickerTable", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "selection", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "selectionSet", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "fuzzy", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "searchResults", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "focusedOption", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "showDoneButton", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "focusOptionDirection", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "clearSearchInput", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "onKeyDown", null);
__decorate([
    decko_1.bind
], EntityPicker.prototype, "focusSearch", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "onSearchFocus", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "onSearchBlur", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "onHover", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "blockHover", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "unblockHover", null);
__decorate([
    mobx_1.action.bound
], EntityPicker.prototype, "onMenuMouseDown", null);
__decorate([
    decko_1.bind
], EntityPicker.prototype, "highlightLabel", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "barScale", null);
__decorate([
    mobx_1.action
], EntityPicker.prototype, "updateMetric", null);
__decorate([
    mobx_1.computed
], EntityPicker.prototype, "isActivePickerColumnTypeNumeric", null);
EntityPicker = __decorate([
    mobx_react_1.observer
], EntityPicker);
exports.EntityPicker = EntityPicker;
class PickerOption extends react_1.default.Component {
    onClick(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.onChange(this.props.optionWithMetricValue.entityName, !this.props.isSelected);
    }
    render() {
        const { barScale, optionWithMetricValue, innerRef, isSelected, isFocused, hasDataForActiveMetric, highlight, } = this.props;
        const { entityName, plotValue, formattedValue } = optionWithMetricValue;
        const metricValue = formattedValue === entityName ? "" : formattedValue; // If the user has this entity selected, don't show the name twice.
        return (react_1.default.createElement(react_flip_toolkit_1.Flipped, { flipId: entityName, translate: true, opacity: true },
            react_1.default.createElement("label", { className: classnames_1.default("EntityPickerOption", {
                    selected: isSelected,
                    focused: isFocused,
                }, hasDataForActiveMetric ? undefined : "MissingData"), onMouseMove: this.props.onHover, onMouseOver: this.props.onHover, onClick: this.onClick, ref: innerRef },
                react_1.default.createElement("div", { className: "input-container" },
                    react_1.default.createElement("input", { type: "checkbox", checked: isSelected, value: entityName, tabIndex: -1, readOnly: true })),
                react_1.default.createElement("div", { className: "info-container" },
                    react_1.default.createElement("div", { className: "labels-container" },
                        react_1.default.createElement("div", { className: "name" }, highlight(entityName)),
                        plotValue !== undefined && (react_1.default.createElement("div", { className: "metric" }, metricValue))),
                    barScale && Util_1.isNumber(plotValue) ? (react_1.default.createElement("div", { className: "plot" },
                        react_1.default.createElement("div", { className: "bar", style: {
                                width: `${barScale(plotValue) * 100}%`,
                            } }))) : (react_1.default.createElement("div", { className: "plot" }))))));
    }
}
__decorate([
    decko_1.bind
], PickerOption.prototype, "onClick", null);
//# sourceMappingURL=EntityPicker.js.map