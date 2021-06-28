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
exports.CitationMeta = void 0;
const React = __importStar(require("react"));
const moment_1 = __importDefault(require("moment"));
const CitationMeta = (props) => {
    const { title, date, canonicalUrl } = props;
    let { authors } = props;
    if (authors.indexOf("Max Roser") === -1)
        authors = authors.concat(["Max Roser"]);
    return (React.createElement(React.Fragment, null,
        React.createElement("meta", { name: "citation_title", content: title }),
        React.createElement("meta", { name: "citation_fulltext_html_url", content: canonicalUrl }),
        React.createElement("meta", { name: "citation_fulltext_world_readable", content: "" }),
        React.createElement("meta", { name: "citation_publication_date", content: moment_1.default(date).format("YYYY/MM/DD") }),
        React.createElement("meta", { name: "citation_journal_title", content: "Our World in Data" }),
        React.createElement("meta", { name: "citation_journal_abbrev", content: "Our World in Data" }),
        authors.map((author) => (React.createElement("meta", { key: author, name: "citation_author", content: author })))));
};
exports.CitationMeta = CitationMeta;
//# sourceMappingURL=CitationMeta.js.map