"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlossaryExcerpt = exports.GlossaryExcerpt_name = void 0;
const react_1 = __importDefault(require("react"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faExternalLinkAlt_1 = require("@fortawesome/free-solid-svg-icons/faExternalLinkAlt");
exports.GlossaryExcerpt_name = "GlossaryExcerpt";
const GlossaryExcerpt = ({ excerpt, slug, label, }) => {
    return (react_1.default.createElement("span", { className: "glossary-excerpt" },
        react_1.default.createElement("span", { className: "title" }, "Definition"),
        excerpt,
        react_1.default.createElement("a", { target: "_blank", rel: "noopener", href: `/glossary#${slug}` },
            "Read more about ",
            label.toLowerCase(),
            react_1.default.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExternalLinkAlt_1.faExternalLinkAlt }))));
};
exports.GlossaryExcerpt = GlossaryExcerpt;
//# sourceMappingURL=GlossaryExcerpt.js.map