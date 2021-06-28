"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFootnotes = exports.Footnote = void 0;
const Tippy_1 = require("../grapher/chart/Tippy");
const Util_1 = require("../clientUtils/Util");
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const Footnote = ({ index, htmlContent, triggerTarget, }) => {
    const onEvent = (instance, event) => {
        if (event.type === "click")
            event.preventDefault();
    };
    return (react_1.default.createElement(Tippy_1.Tippy, { appendTo: () => document.body, content: htmlContent && (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { dangerouslySetInnerHTML: {
                    __html: htmlContent,
                } }))), interactive: true, placement: "auto", theme: "owid-footnote", trigger: "mouseenter focus click", triggerTarget: triggerTarget, onTrigger: onEvent, onUntrigger: onEvent },
        react_1.default.createElement("sup", null, index)));
};
exports.Footnote = Footnote;
function getFootnoteContent(element) {
    var _a;
    const href = (_a = element.closest("a.ref")) === null || _a === void 0 ? void 0 : _a.getAttribute("href");
    if (!href)
        return null;
    const index = Util_1.parseIntOrUndefined(href.split("-")[1]);
    if (index === undefined)
        return null;
    const referencedEl = document.querySelector(href);
    if (!(referencedEl === null || referencedEl === void 0 ? void 0 : referencedEl.innerHTML))
        return null;
    return { index, href, htmlContent: referencedEl.innerHTML };
}
function runFootnotes() {
    const footnotes = document.querySelectorAll("a.ref");
    footnotes.forEach((f) => {
        const footnoteContent = getFootnoteContent(f);
        if (footnoteContent == null)
            return;
        react_dom_1.default.hydrate(react_1.default.createElement(exports.Footnote, { index: footnoteContent.index, htmlContent: footnoteContent.htmlContent, triggerTarget: f }), f);
    });
}
exports.runFootnotes = runFootnotes;
//# sourceMappingURL=Footnote.js.map