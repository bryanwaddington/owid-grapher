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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bakeGlobalEntitySelector = void 0;
const React = __importStar(require("react"));
const ReactDOMServer = __importStar(require("react-dom/server"));
const serverSettings_1 = require("../settings/serverSettings");
const GlobalEntitySelector_1 = require("../grapher/controls/globalEntitySelector/GlobalEntitySelector");
const GlobalEntitySelectorConstants_1 = require("../grapher/controls/globalEntitySelector/GlobalEntitySelectorConstants");
const SelectionArray_1 = require("../grapher/selection/SelectionArray");
const bakeGlobalEntitySelector = (cheerioEl) => {
    // The data attr used to be `data-entity-select`, but later changed for consistency in the code.
    // But we should still support the old attribute.
    cheerioEl(`*[data-entity-select], ${GlobalEntitySelectorConstants_1.GLOBAL_ENTITY_SELECTOR_ELEMENT}`).each((_, el) => {
        const $el = cheerioEl(el);
        const $section = $el.closest("section");
        const rendered = ReactDOMServer.renderToString(React.createElement(GlobalEntitySelector_1.GlobalEntitySelector, { environment: serverSettings_1.ENV, selection: new SelectionArray_1.SelectionArray() }));
        // Move the element to top-level where <section>s are,
        // in order to make position:sticky work.
        $el.remove();
        $el.attr(GlobalEntitySelectorConstants_1.GLOBAL_ENTITY_SELECTOR_DATA_ATTR, "");
        $el.addClass("global-entity-control-container");
        $el.html(rendered).insertAfter($section);
    });
};
exports.bakeGlobalEntitySelector = bakeGlobalEntitySelector;
//# sourceMappingURL=bakeGlobalEntitySelector.js.map