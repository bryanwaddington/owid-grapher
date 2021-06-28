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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runExpandableInlineBlock = exports.ExpandableInlineBlock = exports.ExpandableInlineBlock_name = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const GlossaryExcerpt_1 = require("../site/GlossaryExcerpt");
const availableComponents = { GlossaryExcerpt: GlossaryExcerpt_1.GlossaryExcerpt };
exports.ExpandableInlineBlock_name = "ExpandableInlineBlock";
const ExpandableInlineBlock = ({ label, type, children, }) => {
    const [isVisible, setVisible] = react_1.useState(false);
    const toggleVisibility = () => setVisible(!isVisible);
    return (react_1.default.createElement("span", { className: "expandable-inline-block" },
        react_1.default.createElement("button", { "data-track-note": `${type.toLowerCase()}-toggle`, onClick: toggleVisibility }, label),
        isVisible && react_1.default.createElement("span", null, children)));
};
exports.ExpandableInlineBlock = ExpandableInlineBlock;
const runExpandableInlineBlock = () => {
    const expandableInlineBlocks = document.querySelectorAll(`[data-type=${exports.ExpandableInlineBlock_name}]`);
    expandableInlineBlocks.forEach((expandableInlineBlock) => {
        const props = JSON.parse(expandableInlineBlock.innerHTML);
        const subComponent = expandableInlineBlock.getAttribute("data-block");
        const label = expandableInlineBlock.getAttribute("data-label");
        if (!subComponent || !label || !props)
            return;
        const Component = availableComponents[subComponent];
        react_dom_1.default.render(react_1.default.createElement(exports.ExpandableInlineBlock, { label: label, type: subComponent },
            react_1.default.createElement(Component, Object.assign({}, props, { label: label }))), expandableInlineBlock.parentElement);
    });
};
exports.runExpandableInlineBlock = runExpandableInlineBlock;
//# sourceMappingURL=ExpandableInlineBlock.js.map