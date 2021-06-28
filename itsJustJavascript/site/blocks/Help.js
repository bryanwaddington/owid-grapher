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
exports.renderHelp = void 0;
const React = __importStar(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faLightbulb_1 = require("@fortawesome/free-solid-svg-icons/faLightbulb");
const Help = ({ title, content, }) => {
    return (React.createElement("div", { className: "wp-block-help" },
        React.createElement("div", { className: "icon" },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faLightbulb_1.faLightbulb })),
        React.createElement("div", null,
            title ? React.createElement("h4", null, title) : null,
            React.createElement("div", { className: "content", dangerouslySetInnerHTML: { __html: content || "" } }))));
};
const renderHelp = (cheerioEl) => cheerioEl("block[type='help']").each(function () {
    const $block = cheerioEl(this);
    const title = $block.find("h4").remove().text() || null;
    const content = $block.find("content").html(); // the title has been removed so the rest of the block is content.
    // Side note: "content" refers here to the <content> tag output by the block on the PHP side, not
    // the ".content" class.
    const rendered = server_1.default.renderToStaticMarkup(React.createElement(Help, { title: title, content: content }));
    $block.after(rendered);
    $block.remove();
});
exports.renderHelp = renderHelp;
//# sourceMappingURL=Help.js.map