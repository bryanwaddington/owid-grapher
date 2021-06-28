"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Breadcrumb = exports.getBreadcrumbItems = exports.getSubnavParent = exports.getSubnavItem = void 0;
const react_1 = __importDefault(require("react"));
const SiteSubnavigation_1 = require("../SiteSubnavigation");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faAngleRight_1 = require("@fortawesome/free-solid-svg-icons/faAngleRight");
const getSubnavItem = (id, subnavItems) => {
    // We want to avoid matching elements with potentially undefined id.
    // Static typing prevents id from being undefined but this might not be
    // the case in a future API powered version.
    return id ? subnavItems.find((item) => item.id === id) : undefined;
};
exports.getSubnavItem = getSubnavItem;
const getSubnavParent = (currentItem, subnavItems) => {
    const parentId = currentItem === null || currentItem === void 0 ? void 0 : currentItem.parentId;
    // We want to avoid matching elements with potentially undefined id.
    // Static typing prevents id from being undefined but this might not be
    // the case in a future API powered version.
    return parentId
        ? subnavItems.find((item) => item.id === parentId)
        : undefined;
};
exports.getSubnavParent = getSubnavParent;
const getBreadcrumbItems = (subnavCurrentId, subnavItems) => {
    const breadcrumb = [];
    let currentItem = exports.getSubnavItem(subnavCurrentId, subnavItems);
    if (!currentItem)
        return;
    breadcrumb.push(currentItem);
    while (currentItem && currentItem.parentId) {
        currentItem = exports.getSubnavParent(currentItem, subnavItems);
        if (currentItem)
            breadcrumb.push(currentItem);
    }
    if (currentItem !== subnavItems[0])
        breadcrumb.push(subnavItems[0]); // add topic as parent
    return breadcrumb.reverse();
};
exports.getBreadcrumbItems = getBreadcrumbItems;
const BreadcrumbSeparator = () => (react_1.default.createElement("span", { className: "separator" },
    react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faAngleRight_1.faAngleRight })));
const Breadcrumb = ({ subnavId, subnavCurrentId, }) => {
    const breadcrumbItems = subnavId
        ? exports.getBreadcrumbItems(subnavCurrentId, SiteSubnavigation_1.subnavs[subnavId])
        : null;
    return breadcrumbItems ? (react_1.default.createElement("div", { className: "breadcrumb" },
        react_1.default.createElement("a", { href: "/" }, "Home"),
        react_1.default.createElement(BreadcrumbSeparator, null),
        breadcrumbItems.map((item, idx) => (react_1.default.createElement(react_1.default.Fragment, { key: item.href }, idx !== breadcrumbItems.length - 1 ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("a", { "data-track-note": "breadcrumb", href: item.href }, item.label),
            react_1.default.createElement(BreadcrumbSeparator, null))) : (react_1.default.createElement("span", null, item.label))))))) : null;
};
exports.Breadcrumb = Breadcrumb;
//# sourceMappingURL=Breadcrumb.js.map