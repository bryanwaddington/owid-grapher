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
exports._linkGlossaryTermsInText = exports.formatGlossaryTerms = exports.GlossaryLink = exports.FORBIDDEN_TAGS = void 0;
const React = __importStar(require("react"));
const ReactDOMServer = __importStar(require("react-dom/server"));
const ExpandableInlineBlock_1 = require("./ExpandableInlineBlock");
const GlossaryExcerpt_1 = require("./GlossaryExcerpt");
// Do not replace glossary terms within these tags
exports.FORBIDDEN_TAGS = ["a", "h2", "h3", "h4", "h5", "h6"];
const GlossaryLink = ({ slug, excerpt, match, }) => (React.createElement("span", null,
    React.createElement("script", { "data-type": ExpandableInlineBlock_1.ExpandableInlineBlock_name, "data-block": GlossaryExcerpt_1.GlossaryExcerpt_name, "data-label": match, type: "component/props", dangerouslySetInnerHTML: {
            __html: JSON.stringify({ slug, excerpt }),
        } }),
    React.createElement("a", { className: "expandable-block-button", href: `/glossary#${slug}` }, match)));
exports.GlossaryLink = GlossaryLink;
const formatGlossaryTerms = ($, $contents, mutableGlossary) => {
    $contents.each((i, el) => {
        if (exports.FORBIDDEN_TAGS.includes(el.tagName))
            return;
        if (el.type === "text") {
            $(el).replaceWith(exports._linkGlossaryTermsInText(el.data, mutableGlossary));
        }
        else {
            exports.formatGlossaryTerms($, $(el).contents(), mutableGlossary);
        }
    });
};
exports.formatGlossaryTerms = formatGlossaryTerms;
const _linkGlossaryTermsInText = (srcText = "", glossary) => {
    let textWithGlossaryLinks = srcText;
    // Include periods in matched text to prevent inelegant next line wrapping
    const regex = new RegExp(`\\b(${glossary.map((item) => item.term).join("|")})\\b\\.?`, "ig");
    const trimLastCharIfPeriod = (text) => {
        return text.replace(/\.$/, "");
    };
    const _getGlossaryLink = (match) => {
        const idx = glossary.findIndex((item) => item.term.toLowerCase() ===
            trimLastCharIfPeriod(match.toLowerCase()));
        if (idx === -1)
            return match;
        const slug = glossary[idx].slug;
        const excerpt = glossary[idx].excerpt;
        // Remove element in-place so that glossary items are only matched and
        // linked once per recursive traversal (at the moment, this is set to
        // once per page section)
        glossary.splice(idx, 1);
        return ReactDOMServer.renderToStaticMarkup(React.createElement(exports.GlossaryLink, { slug: slug, excerpt: excerpt, match: match }));
    };
    textWithGlossaryLinks = textWithGlossaryLinks.replace(regex, _getGlossaryLink);
    return textWithGlossaryLinks;
};
exports._linkGlossaryTermsInText = _linkGlossaryTermsInText;
//# sourceMappingURL=formatGlossary.js.map