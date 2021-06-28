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
exports.numItemsVisible = exports.MoreButton = exports.CollapsibleList = void 0;
const react_1 = __importDefault(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const Util_1 = require("../../../clientUtils/Util");
const Tippy_1 = require("../../chart/Tippy");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faCog_1 = require("@fortawesome/free-solid-svg-icons/faCog");
/** A UI component inspired by the "Priority+ Navbar" or "Progressively Collapsing Navbar"*/
let CollapsibleList = class CollapsibleList extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.outerContainerRef = react_1.default.createRef();
        this.moreButtonRef = react_1.default.createRef();
        this.outerContainerWidth = 0;
        this.moreButtonWidth = 0;
        this.itemsWidths = [];
        this.onResize = Util_1.throttle(() => {
            this.updateItemVisibility();
        }, 100);
    }
    get children() {
        var _a;
        return ((_a = react_1.default.Children.map(this.props.children, (child, i) => {
            return {
                index: i,
                child,
            };
        })) !== null && _a !== void 0 ? _a : []);
    }
    updateOuterContainerWidth() {
        var _a, _b;
        this.outerContainerWidth =
            (_b = (_a = this.outerContainerRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0;
    }
    calculateItemWidths() {
        var _a;
        (_a = this.outerContainerRef.current) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".list-item.visible").forEach((item) => this.itemsWidths.push(item.clientWidth));
    }
    updateNumItemsVisible() {
        const numItemsVisibleWithoutMoreButton = numItemsVisible(this.itemsWidths, this.outerContainerWidth);
        this.numItemsVisible =
            numItemsVisibleWithoutMoreButton >= this.children.length
                ? numItemsVisibleWithoutMoreButton
                : numItemsVisible(this.itemsWidths, this.outerContainerWidth, this.moreButtonWidth);
    }
    get visibleItems() {
        return this.children.slice(0, this.numItemsVisible);
    }
    get dropdownItems() {
        return this.numItemsVisible
            ? this.children.slice(this.numItemsVisible)
            : [];
    }
    updateItemVisibility() {
        this.updateOuterContainerWidth();
        this.updateNumItemsVisible();
    }
    componentDidUpdate() {
        // react to children being added or removed, for example
        this.calculateItemWidths();
        this.updateItemVisibility();
    }
    componentDidMount() {
        var _a, _b;
        window.addEventListener("resize", this.onResize);
        this.moreButtonWidth = (_b = (_a = this.moreButtonRef.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : 0;
        this.calculateItemWidths();
        this.updateItemVisibility();
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }
    render() {
        return (react_1.default.createElement("div", { className: "collapsibleList", ref: this.outerContainerRef },
            react_1.default.createElement("ul", null,
                this.visibleItems.map((item) => (react_1.default.createElement("li", { key: item.index, className: "list-item visible" }, item.child))),
                react_1.default.createElement("li", { className: "list-item moreButton", ref: this.moreButtonRef, style: {
                        visibility: this.dropdownItems.length
                            ? "visible"
                            : "hidden",
                    } },
                    react_1.default.createElement(MoreButton, { options: this.dropdownItems.map((item) => (react_1.default.createElement("li", { key: item.index, className: "list-item dropdown" }, item.child))) })))));
    }
};
__decorate([
    mobx_1.observable
], CollapsibleList.prototype, "numItemsVisible", void 0);
__decorate([
    mobx_1.action
], CollapsibleList.prototype, "updateNumItemsVisible", null);
__decorate([
    mobx_1.action
], CollapsibleList.prototype, "onResize", void 0);
__decorate([
    mobx_1.action
], CollapsibleList.prototype, "updateItemVisibility", null);
CollapsibleList = __decorate([
    mobx_react_1.observer
], CollapsibleList);
exports.CollapsibleList = CollapsibleList;
class MoreButton extends react_1.default.Component {
    render() {
        const { options } = this.props;
        return (react_1.default.createElement(Tippy_1.Tippy, { content: options, interactive: true, trigger: "click", placement: "bottom" },
            react_1.default.createElement("span", null,
                react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCog_1.faCog }),
                "\u00A0More")));
    }
}
exports.MoreButton = MoreButton;
/**
 * Given: an array of item widths, a container width, and a starting width
 * Returns the number of items that can fit in the container
 */
function numItemsVisible(itemWidths, containerWidth, startingWidth = 0) {
    let total = startingWidth;
    for (let i = 0; i < itemWidths.length; i++) {
        if (total + itemWidths[i] > containerWidth)
            return i;
        else
            total += itemWidths[i];
    }
    return itemWidths.length;
}
exports.numItemsVisible = numItemsVisible;
//# sourceMappingURL=CollapsibleList.js.map