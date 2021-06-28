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
exports.SiteFooter = void 0;
const React = __importStar(require("react"));
const webpackUtils_1 = require("../site/webpackUtils");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faAngleRight_1 = require("@fortawesome/free-solid-svg-icons/faAngleRight");
const SiteFooter = (props) => (React.createElement(React.Fragment, null,
    !props.hideDonate && (React.createElement("section", { className: "donate-footer" },
        React.createElement("div", { className: "wrapper" },
            React.createElement("div", { className: "owid-row flex-align-center" },
                React.createElement("div", { className: "owid-col owid-col--lg-3 owid-padding-bottom--sm-3" },
                    React.createElement("p", null, "Our World in Data is free and accessible for everyone."),
                    React.createElement("p", null, "Help us do this work by making a donation.")),
                React.createElement("div", { className: "owid-col owid-col--lg-1" },
                    React.createElement("a", { href: "/donate", className: "owid-button donate-button", "data-track-note": "donate-footer" },
                        React.createElement("span", { className: "label" }, "Donate now"),
                        React.createElement("span", { className: "icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faAngleRight_1.faAngleRight })))))))),
    React.createElement("footer", { className: "site-footer" },
        React.createElement("div", { className: "wrapper" },
            React.createElement("div", { className: "owid-row" },
                React.createElement("div", { className: "owid-col owid-col--lg-1" },
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("a", { href: "/about", "data-track-note": "footer-navigation" }, "About")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/about#contact", "data-track-note": "footer-navigation" }, "Contact")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/feedback", "data-track-note": "footer-navigation" }, "Feedback")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/jobs", "data-track-note": "footer-navigation" }, "Jobs")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/funding", "data-track-note": "footer-navigation" }, "Funding")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/about/how-to-use-our-world-in-data", "data-track-note": "footer-navigation" }, "How to use")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/donate", "data-track-note": "footer-navigation" }, "Donate")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/privacy-policy", "data-track-note": "footer-navigation" }, "Privacy policy")))),
                React.createElement("div", { className: "owid-col owid-col--lg-1" },
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("a", { href: "/blog", "data-track-note": "footer-navigation" }, "Latest publications")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/charts", "data-track-note": "footer-navigation" }, "All charts"))),
                    React.createElement("ul", null,
                        React.createElement("li", null,
                            React.createElement("a", { href: "https://twitter.com/OurWorldInData", "data-track-note": "footer-navigation" }, "Twitter")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "https://www.facebook.com/OurWorldinData", "data-track-note": "footer-navigation" }, "Facebook")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "https://github.com/owid", "data-track-note": "footer-navigation" }, "GitHub")),
                        React.createElement("li", null,
                            React.createElement("a", { href: "/feed", "data-track-note": "footer-navigation" }, "RSS Feed")))),
                React.createElement("div", { className: "owid-col owid-col--lg-1" },
                    React.createElement("div", { className: "logos" },
                        React.createElement("a", { href: "https://www.oxfordmartin.ox.ac.uk/research/programmes/global-development", className: "partner-logo", "data-track-note": "footer-navigation" },
                            React.createElement("img", { src: `${props.baseUrl}/oms-logo.svg`, alt: "Oxford Martin School logo", loading: "lazy" })),
                        React.createElement("a", { href: "/owid-at-ycombinator", className: "partner-logo", "data-track-note": "footer-navigation" },
                            React.createElement("img", { src: `${props.baseUrl}/yc-logo.png`, alt: "Y Combinator logo", loading: "lazy" })))),
                React.createElement("div", { className: "owid-col flex-2" },
                    React.createElement("div", { className: "legal" },
                        React.createElement("p", null,
                            "License: All the material produced by Our World in Data, including interactive visualizations and code, are completely open access under the",
                            " ",
                            React.createElement("a", { href: "https://creativecommons.org/licenses/by/4.0/", target: "_blank", rel: "noopener noreferrer" }, "Creative Commons BY license"),
                            ". You have the permission to use, distribute, and reproduce these in any medium, provided the source and authors are credited. All other material, including data produced by third parties and made available by Our World in Data, is subject to the license terms from the original third-party authors."),
                        React.createElement("p", null,
                            "Please consult our full",
                            " ",
                            React.createElement("a", { href: "/about#legal" }, "legal disclaimer"),
                            "."),
                        React.createElement("p", null,
                            React.createElement("a", { href: "https://global-change-data-lab.org/", className: "partner-logo gcdl-logo", "data-track-note": "footer-navigation" },
                                React.createElement("img", { src: `${props.baseUrl}/gcdl-logo.svg`, alt: "Global Change Data Lab logo", loading: "lazy" })),
                            "Our World In Data is a project of the",
                            " ",
                            React.createElement("a", { href: "https://global-change-data-lab.org/" }, "Global Change Data Lab"),
                            ", a registered charity in England and Wales (Charity Number 1186433)."))))),
        React.createElement("div", { className: "site-tools" }),
        React.createElement("script", { src: "https://polyfill.io/v3/polyfill.min.js?features=es6,fetch,URL,IntersectionObserver,IntersectionObserverEntry" }),
        React.createElement("script", { src: webpackUtils_1.webpackUrl("commons.js", props.baseUrl) }),
        React.createElement("script", { src: webpackUtils_1.webpackUrl("owid.js", props.baseUrl) }),
        React.createElement("script", { dangerouslySetInnerHTML: {
                __html: `window.runSiteFooterScripts()`, // todo: gotta be a better way.
            } }))));
exports.SiteFooter = SiteFooter;
//# sourceMappingURL=SiteFooter.js.map