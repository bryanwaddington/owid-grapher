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
exports.ExplorerControlPanel = exports.ExplorerControlBar = void 0;
const react_1 = __importDefault(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const react_select_1 = __importDefault(require("react-select"));
const react_select_2 = require("../clientUtils/react-select");
const ExplorerConstants_1 = require("./ExplorerConstants");
const Util_1 = require("../clientUtils/Util");
const GridLangConstants_1 = require("../gridLang/GridLangConstants");
const classnames_1 = __importDefault(require("classnames"));
const AVAILABLE_OPTION_CLASS = "AvailableOption";
const UNAVAILABLE_OPTION_CLASS = "UnavailableOption";
const SELECTED_OPTION_CLASS = "SelectedOption";
const EXPLORER_DROPDOWN_CLASS = "ExplorerDropdown";
const HIDDEN_CONTROL_HEADER_CLASS = "HiddenControlHeader";
class ExplorerControlBar extends react_1.default.Component {
    render() {
        const { isMobile, showControls, closeControls } = this.props;
        const mobileCloseButton = isMobile ? (react_1.default.createElement("a", { className: "btn btn-primary mobile-button", onClick: closeControls }, "Done")) : undefined;
        const showMobileControls = isMobile && showControls;
        return (react_1.default.createElement("form", { className: classnames_1.default("ExplorerControlBar", showMobileControls
                ? `show-controls-popup`
                : isMobile
                    ? `hide-controls-popup`
                    : false) },
            this.props.children,
            mobileCloseButton));
    }
}
exports.ExplorerControlBar = ExplorerControlBar;
let ExplorerControlPanel = class ExplorerControlPanel extends react_1.default.Component {
    renderCheckboxOrRadio(option, index) {
        const { explorerSlug, choice } = this.props;
        const { title, type, value } = choice;
        const { available, label, checked } = option;
        const isCheckbox = type === ExplorerConstants_1.ExplorerControlType.Checkbox;
        const onChangeValue = isCheckbox
            ? checked
                ? GridLangConstants_1.GridBoolean.false
                : GridLangConstants_1.GridBoolean.true
            : option.value;
        const currentValue = isCheckbox
            ? checked
                ? GridLangConstants_1.GridBoolean.true
                : GridLangConstants_1.GridBoolean.false
            : value;
        return (react_1.default.createElement("div", { key: index, className: "ControlOption" },
            react_1.default.createElement("label", { className: classnames_1.default({
                    [SELECTED_OPTION_CLASS]: checked,
                }, available
                    ? AVAILABLE_OPTION_CLASS
                    : UNAVAILABLE_OPTION_CLASS) },
                react_1.default.createElement("input", { onChange: () => this.customOnChange(onChangeValue), type: isCheckbox ? "checkbox" : "radio", disabled: !available, name: title, checked: checked, value: currentValue, "data-track-note": `${explorerSlug !== null && explorerSlug !== void 0 ? explorerSlug : "explorer"}-click-${title.toLowerCase()}` }),
                " ",
                label)));
    }
    get options() {
        var _a;
        return (_a = this.props.choice.options) !== null && _a !== void 0 ? _a : [];
    }
    renderDropdown() {
        var _a;
        const options = this.options
            .filter((option) => option.available)
            .map((option) => {
            return {
                label: option.label,
                value: option.value,
            };
        });
        const value = (_a = options.find((option) => option.value === this.props.choice.value)) !== null && _a !== void 0 ? _a : { label: "-", value: "-" };
        const styles = react_select_2.getStylesForTargetHeight(30);
        return (react_1.default.createElement(react_select_1.default, { className: EXPLORER_DROPDOWN_CLASS, classNamePrefix: EXPLORER_DROPDOWN_CLASS, isDisabled: options.length < 2, 
            // menuPlacement="auto" doesn't work perfectly well on mobile, with fixed position
            menuPlacement: this.props.isMobile ? "top" : "auto", menuPosition: this.props.isMobile ? "fixed" : "absolute", options: options, value: value, onChange: (option) => this.customOnChange(option.value), components: {
                IndicatorSeparator: null,
            }, styles: styles, isSearchable: options.length > 20, maxMenuHeight: 350 }));
    }
    customOnChange(value) {
        if (this.props.onChange)
            this.props.onChange(value);
    }
    renderColumn(key, hideTitle, options) {
        const { title, type, displayTitle } = this.props.choice;
        return (react_1.default.createElement("div", { key: key, className: "ExplorerControl" },
            react_1.default.createElement("div", { className: classnames_1.default("ControlHeader", {
                    [HIDDEN_CONTROL_HEADER_CLASS]: hideTitle === true,
                }) }, displayTitle !== null && displayTitle !== void 0 ? displayTitle : title),
            type === ExplorerConstants_1.ExplorerControlType.Dropdown
                ? this.renderDropdown()
                : (options !== null && options !== void 0 ? options : this.options).map((option, index) => this.renderCheckboxOrRadio(option, index))));
    }
    render() {
        const { choice } = this.props;
        const { title, type } = choice;
        const { options } = this;
        if (type === ExplorerConstants_1.ExplorerControlType.Radio && options.length > 4)
            return Util_1.chunk(options, 3).map((optionsGroup, column) => this.renderColumn(`${title}${column}`, column > 0, optionsGroup));
        return this.renderColumn(title, type === ExplorerConstants_1.ExplorerControlType.Checkbox);
    }
};
__decorate([
    mobx_1.computed
], ExplorerControlPanel.prototype, "options", null);
__decorate([
    mobx_1.action.bound
], ExplorerControlPanel.prototype, "customOnChange", null);
ExplorerControlPanel = __decorate([
    mobx_react_1.observer
], ExplorerControlPanel);
exports.ExplorerControlPanel = ExplorerControlPanel;
//# sourceMappingURL=ExplorerControls.js.map