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
exports.NewsletterSubscriptionForm = exports.NewsletterSubscription = exports.NewsletterSubscriptionContext = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const faEnvelopeOpenText_1 = require("@fortawesome/free-solid-svg-icons/faEnvelopeOpenText");
const faTimes_1 = require("@fortawesome/free-solid-svg-icons/faTimes");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const SiteAnalytics_1 = require("./SiteAnalytics");
const analytics = new SiteAnalytics_1.SiteAnalytics();
var NewsletterSubscriptionContext;
(function (NewsletterSubscriptionContext) {
    NewsletterSubscriptionContext["Homepage"] = "homepage";
    NewsletterSubscriptionContext["MobileMenu"] = "mobile-menu";
    NewsletterSubscriptionContext["Floating"] = "floating";
})(NewsletterSubscriptionContext = exports.NewsletterSubscriptionContext || (exports.NewsletterSubscriptionContext = {}));
const NewsletterSubscription = ({ context, }) => {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const subscribeText = "Subscribe";
    const closeText = "Close";
    return (React.createElement("div", { className: `newsletter-subscription${isOpen ? " active" : ""}` },
        isOpen && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "overlay", onClick: () => {
                    setIsOpen(false);
                } }),
            React.createElement("div", { className: "box" },
                React.createElement(exports.NewsletterSubscriptionForm, { context: context })))),
        React.createElement("button", { "aria-label": isOpen ? closeText : subscribeText, className: "prompt", "data-track-note": isOpen
                ? "dialog-close-newsletter"
                : "dialog-open-newsletter", onClick: () => {
                setIsOpen(!isOpen);
            } },
            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: isOpen ? faTimes_1.faTimes : faEnvelopeOpenText_1.faEnvelopeOpenText }),
            " ",
            isOpen ? closeText : subscribeText)));
};
exports.NewsletterSubscription = NewsletterSubscription;
const NewsletterSubscriptionForm = ({ context, }) => {
    const IMMEDIATE = "1";
    const BIWEEKLY = "2";
    const idImmediate = `mce-group[85302]-85302-0${context ? "-" + context : ""}`;
    const idBiweekly = `mce-group[85302]-85302-1${context ? "-" + context : ""}`;
    const [frequencies, setFrequencies] = react_1.useState([IMMEDIATE]);
    const isSubmittable = frequencies.length !== 0;
    const updateFrequencies = (e) => {
        if (e.target.checked) {
            setFrequencies([e.target.value, ...frequencies]);
        }
        else {
            setFrequencies(frequencies.filter((frequency) => frequency !== e.target.value));
        }
    };
    return (React.createElement("form", { action: "https://ourworldindata.us8.list-manage.com/subscribe/post?u=18058af086319ba6afad752ec&id=2e166c1fc1", method: "post", id: "mc-embedded-subscribe-form", name: "mc-embedded-subscribe-form", target: "_blank" },
        React.createElement("p", null, "Receive our latest publications by email."),
        React.createElement("fieldset", null,
            React.createElement("div", { className: "owid-checkboxes" },
                React.createElement("div", { className: "owid-checkbox-block" },
                    React.createElement("input", { type: "checkbox", value: IMMEDIATE, name: `group[85302][${IMMEDIATE}]`, id: idImmediate, checked: frequencies.includes(IMMEDIATE), onChange: updateFrequencies }),
                    React.createElement("label", { htmlFor: idImmediate },
                        React.createElement("div", { className: "label-title" }, "Immediate updates"),
                        React.createElement("div", { className: "label-text" }, "Receive an email from us whenever we publish new work (maximum 1 per day)."))),
                React.createElement("div", { className: "owid-checkbox-block" },
                    React.createElement("input", { type: "checkbox", value: BIWEEKLY, name: `group[85302][${BIWEEKLY}]`, id: idBiweekly, checked: frequencies.includes(BIWEEKLY), onChange: updateFrequencies }),
                    React.createElement("label", { htmlFor: idBiweekly },
                        React.createElement("div", { className: "label-title" }, "Biweekly digest"),
                        React.createElement("div", { className: "label-text" }, "Receive an overview of our recent work every two weeks."))),
                frequencies.length === 0 && (React.createElement("div", { className: "alert" }, "Please select at least one option.")))),
        React.createElement("input", { placeholder: "Your email address", type: "email", className: "owid-inline-input", name: "EMAIL" }),
        React.createElement("div", { className: "privacy-submit" },
            React.createElement("div", { className: "privacy-notice" },
                "By subscribing you are agreeing to ",
                React.createElement("br", null),
                "the terms of our",
                " ",
                React.createElement("a", { href: "/privacy-policy" }, "privacy policy"),
                "."),
            React.createElement("button", { type: "submit", className: "owid-inline-button", disabled: !isSubmittable, onClick: () => analytics.logSiteClick("newsletter-subscribe", `Subscribe [${context !== null && context !== void 0 ? context : "other-contexts"}]`) }, "Subscribe")),
        React.createElement("input", { type: "hidden", name: "b_18058af086319ba6afad752ec_2e166c1fc1", tabIndex: -1 })));
};
exports.NewsletterSubscriptionForm = NewsletterSubscriptionForm;
//# sourceMappingURL=NewsletterSubscription.js.map