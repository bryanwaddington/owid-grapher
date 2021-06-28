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
exports.CovidPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
// IMPORTANT NOTE:
// This page is only used in development.
// It is not intended to be exposed to the public.
const CovidPage = (props) => (React.createElement("html", null,
    React.createElement(Head_1.Head, { canonicalUrl: `${props.baseUrl}/covid`, pageTitle: "COVID-19", baseUrl: props.baseUrl }),
    React.createElement("body", { className: "CovidPage" },
        React.createElement(SiteHeader_1.SiteHeader, { baseUrl: props.baseUrl }),
        React.createElement("main", null,
            React.createElement("article", { className: "page no-sidebar large-banner" },
                React.createElement("div", { className: "offset-header" },
                    React.createElement("header", { className: "article-header" },
                        React.createElement("div", { className: "article-titles" },
                            React.createElement("h1", { className: "entry-title" }, "COVID-19")))),
                React.createElement("div", { className: "content-wrapper" },
                    React.createElement("div", { className: "offset-content" },
                        React.createElement("div", { className: "content-and-footnotes" },
                            React.createElement("div", { className: "article-content" },
                                React.createElement("section", null,
                                    React.createElement("h2", { id: "cases-of-covid-19" },
                                        React.createElement("a", { className: "deep-link", href: "#cases-of-covid-19" }),
                                        "Cases of COVID-19"),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("h4", { id: "what-we-would-want-to-know" },
                                                React.createElement("a", { className: "deep-link", href: "#what-we-would-want-to-know" }),
                                                "What we would want to know")),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("p", null, "We would want to know how many cases of COVID-19 and where. We want to know the number of total cases."),
                                            React.createElement("p", null,
                                                "This however is not known.",
                                                " "),
                                            React.createElement("p", null,
                                                "What we know is the number of ",
                                                React.createElement("em", null, "confirmed"),
                                                " cases and the number of",
                                                " ",
                                                React.createElement("em", null, "suspected"),
                                                " cases. The number of known cases is lower than the number of",
                                                " ",
                                                React.createElement("em", null, "total"),
                                                " cases.")),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("div", { "data-covid-table": true, "data-measure": "deaths" })),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("div", { "data-covid-table": true, "data-measure": "cases" })),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("div", { "data-covid-table": true, "data-measure": "tests" })),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { "data-covid-table": true, "data-measure": "deathsAndCases" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("h4", { id: "what-we-do-know" },
                                                React.createElement("a", { className: "deep-link", href: "#what-we-do-know" }),
                                                "What we do know")),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("p", null,
                                                "The table and the chart show",
                                                " ",
                                                React.createElement("strong", null, "the number of confirmed cases"),
                                                "."),
                                            React.createElement("p", null, "This is the data published by the World Health Organization (WHO) in their daily Situation Reports. We brought this data together and make it accessible in a clean dataset here for everyone to use.")),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("h4", { id: "what-do-the-known-cases-tell-us-about-the-number-of-total-cases" },
                                                React.createElement("a", { className: "deep-link", href: "#what-do-the-known-cases-tell-us-about-the-number-of-total-cases" }),
                                                "What do the known cases tell us about the number of total cases?")),
                                        React.createElement("div", { className: "wp-block-column" })),
                                    React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            React.createElement("p", null, "Further down \u2013 here \u2013 we discuss that.")),
                                        React.createElement("div", { className: "wp-block-column" }))))))))),
        React.createElement(SiteFooter_1.SiteFooter, { baseUrl: props.baseUrl }))));
exports.CovidPage = CovidPage;
//# sourceMappingURL=CovidPage.js.map