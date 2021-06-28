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
exports.SearchPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faSearch_1 = require("@fortawesome/free-solid-svg-icons/faSearch");
const SearchPage = (props) => {
    const { baseUrl } = props;
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/search`, pageTitle: "Search", pageDesc: "Search articles and charts on Our World in Data.", baseUrl: baseUrl }),
        React.createElement("body", { className: "SearchPage" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", null,
                React.createElement("form", { action: "/search", method: "GET" },
                    React.createElement("div", { className: "inputWrapper" },
                        React.createElement("input", { type: "search", name: "q", placeholder: `Try "Poverty", "Population growth" or "Plastic pollution"`, autoFocus: true }),
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearch_1.faSearch })),
                    React.createElement("button", { type: "submit" }, "Search")),
                React.createElement("div", { className: "searchResults" })),
            React.createElement(SiteFooter_1.SiteFooter, { hideDonate: true, baseUrl: baseUrl }),
            React.createElement("script", null, `window.runSearchPage()`))));
};
exports.SearchPage = SearchPage;
//# sourceMappingURL=SearchPage.js.map