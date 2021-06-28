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
exports.DonatePage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const DonatePage = (props) => (React.createElement("html", null,
    React.createElement(Head_1.Head, { canonicalUrl: `${props.baseUrl}/donate`, pageTitle: "Donate", baseUrl: props.baseUrl },
        React.createElement("script", { src: "https://js.stripe.com/v3/" }),
        React.createElement("script", { src: `https://www.google.com/recaptcha/api.js?render=${props.recaptchaKey}` })),
    React.createElement("body", null,
        React.createElement(SiteHeader_1.SiteHeader, { baseUrl: props.baseUrl }),
        React.createElement("main", null,
            React.createElement("article", { className: "donate-page" },
                React.createElement("div", { className: "page-header" },
                    React.createElement("div", { className: "wrapper" },
                        React.createElement("h1", { className: "page-heading" }, "Help us do more"))),
                React.createElement("div", { className: "wrapper" },
                    React.createElement("div", { className: "columns" },
                        React.createElement("div", { className: "column" },
                            React.createElement("p", null, "To bring about a better future, we need data and research to understand the big problems the world is facing and how to make progress against them. That\u2019s why we make all our work free and accessible for everyone."),
                            React.createElement("p", null, "We are a nonprofit. This means we rely on donations and grants to keep us going. Reader donations are essential to our work, providing us with the stability and independence we need, so we can focus on showing the data and evidence we think everyone needs to know."),
                            React.createElement("p", null, "Donating is also one way to show us that you find our work helpful and valuable. Knowing this is a huge source of inspiration for our team."),
                            React.createElement("p", null, "If you want to help us do more, please donate today \u2013 it will make a real difference."),
                            React.createElement("p", null,
                                "Thank you, ",
                                React.createElement("br", null),
                                "Global Change Data Lab and the Our World in Data team"),
                            React.createElement("hr", null),
                            React.createElement("p", null,
                                React.createElement("a", { href: "/about" }, "About us"),
                                " \u2013",
                                " ",
                                React.createElement("a", { href: "https://ourworldindata.org/uploads/2019/02/Donations-Policy-Global-Change-Data-Lab.pdf" }, "Donations Policy"),
                                " ",
                                "\u2013",
                                " ",
                                React.createElement("a", { href: "/donate/faq" }, "Donations FAQ"))),
                        React.createElement("div", { className: "column" },
                            React.createElement("div", { className: "donate-form-container shaded-box" }, "Loading donate form\u2026"))),
                    React.createElement("div", { className: "columns" },
                        React.createElement("div", { className: "column" }))))),
        React.createElement(SiteFooter_1.SiteFooter, { hideDonate: true, baseUrl: props.baseUrl }),
        React.createElement("script", { dangerouslySetInnerHTML: {
                __html: `runDonateForm()`,
            } }))));
exports.DonatePage = DonatePage;
//# sourceMappingURL=DonatePage.js.map