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
exports.SiteHeader = void 0;
const React = __importStar(require("react"));
const faSearch_1 = require("@fortawesome/free-solid-svg-icons/faSearch");
const faBars_1 = require("@fortawesome/free-solid-svg-icons/faBars");
const faEnvelopeOpenText_1 = require("@fortawesome/free-solid-svg-icons/faEnvelopeOpenText");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const AlertBanner_1 = require("./AlertBanner");
const SiteHeader = (props) => (React.createElement(React.Fragment, null,
    React.createElement("header", { className: "site-header" },
        React.createElement("div", { className: "wrapper site-navigation-bar" },
            React.createElement("div", { className: "site-logo" },
                React.createElement("a", { href: "/" },
                    "Our World",
                    React.createElement("br", null),
                    " in Data")),
            React.createElement("nav", { className: "site-navigation" },
                React.createElement("div", { className: "topics-button-wrapper" },
                    React.createElement("a", { href: "/#entries", className: "topics-button" },
                        React.createElement("div", { className: "label" },
                            "Articles ",
                            React.createElement("br", null),
                            React.createElement("strong", null, "by topic")),
                        React.createElement("div", { className: "icon" },
                            React.createElement("svg", { width: "12", height: "6" },
                                React.createElement("path", { d: "M0,0 L12,0 L6,6 Z", fill: "currentColor" }))))),
                React.createElement("div", null,
                    React.createElement("div", { className: "site-primary-navigation" },
                        React.createElement("form", { className: "HeaderSearch", action: "/search", method: "GET" },
                            React.createElement("input", { type: "search", name: "q", placeholder: "Search..." }),
                            React.createElement("div", { className: "icon" },
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearch_1.faSearch }))),
                        React.createElement("ul", { className: "site-primary-links" },
                            React.createElement("li", null,
                                React.createElement("a", { href: "/blog", "data-track-note": "header-navigation" }, "Latest")),
                            React.createElement("li", null,
                                React.createElement("a", { href: "/about", "data-track-note": "header-navigation" }, "About")),
                            React.createElement("li", null,
                                React.createElement("a", { href: "/donate", "data-track-note": "header-navigation" }, "Donate")))),
                    React.createElement("div", { className: "site-secondary-navigation" },
                        React.createElement("ul", { className: "site-secondary-links" },
                            React.createElement("li", null,
                                React.createElement("a", { href: "/charts", "data-track-note": "header-navigation" }, "All charts")),
                            React.createElement("li", null,
                                React.createElement("a", { href: "https://sdg-tracker.org", "data-track-note": "header-navigation" }, "Sustainable Development Goals Tracker")))))),
            React.createElement("div", { className: "header-logos-wrapper" },
                React.createElement("a", { href: "https://www.oxfordmartin.ox.ac.uk/global-development", className: "oxford-logo" },
                    React.createElement("img", { src: `${props.baseUrl}/oms-logo.svg`, alt: "Oxford Martin School logo" })),
                React.createElement("a", { href: "https://global-change-data-lab.org/", className: "gcdl-logo" },
                    React.createElement("img", { src: `${props.baseUrl}/gcdl-logo.svg`, alt: "Global Change Data Lab logo" }))),
            React.createElement("div", { className: "mobile-site-navigation" },
                React.createElement("button", { "data-track-note": "mobile-search-button" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearch_1.faSearch })),
                React.createElement("button", { "data-track-note": "mobile-newsletter-button" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faEnvelopeOpenText_1.faEnvelopeOpenText })),
                React.createElement("button", { "data-track-note": "mobile-hamburger-button" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faBars_1.faBars }))))),
    props.hideAlertBanner !== true && React.createElement(AlertBanner_1.AlertBanner, null)));
exports.SiteHeader = SiteHeader;
//# sourceMappingURL=SiteHeader.js.map