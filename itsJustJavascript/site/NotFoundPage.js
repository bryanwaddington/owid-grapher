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
exports.NotFoundPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faSearch_1 = require("@fortawesome/free-solid-svg-icons/faSearch");
const NotFoundPage = (props) => {
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: `${props.baseUrl}/search`, pageTitle: "404 Not Found", pageDesc: "Search articles and charts on Our World in Data.", baseUrl: props.baseUrl }),
        React.createElement("body", { className: "NotFoundPage" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: props.baseUrl }),
            React.createElement("main", null,
                React.createElement("h1", null, "Sorry, that page doesn\u2019t exist!"),
                React.createElement("p", null,
                    "You can search below or",
                    " ",
                    React.createElement("a", { href: "/" }, "return to the homepage"),
                    "."),
                React.createElement("form", { action: "/search", method: "GET" },
                    React.createElement("div", { className: "inputWrapper" },
                        React.createElement("input", { id: "search_q", type: "search", name: "q", autoFocus: true }),
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearch_1.faSearch })),
                    React.createElement("button", { className: "btn", type: "submit" }, "Search"))),
            React.createElement(SiteFooter_1.SiteFooter, { hideDonate: true, baseUrl: props.baseUrl }),
            React.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `
                window.runNotFoundPage()
            `,
                } }))));
};
exports.NotFoundPage = NotFoundPage;
//# sourceMappingURL=NotFoundPage.js.map