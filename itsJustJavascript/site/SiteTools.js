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
exports.runSiteTools = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const Feedback_1 = require("./Feedback");
const hooks_1 = require("./hooks");
const NewsletterSubscription_1 = require("./NewsletterSubscription");
const SITE_TOOLS_CLASS = "site-tools";
const SiteTools = () => {
    const scrollDirection = hooks_1.useScrollDirection();
    return (React.createElement("div", { className: `hide-wrapper${(scrollDirection === hooks_1.ScrollDirection.Down && " hide") || ""}` },
        React.createElement(NewsletterSubscription_1.NewsletterSubscription, { context: NewsletterSubscription_1.NewsletterSubscriptionContext.Floating }),
        React.createElement(Feedback_1.FeedbackPrompt, null)));
};
const runSiteTools = () => {
    ReactDOM.render(React.createElement(SiteTools, null), document.querySelector(`.${SITE_TOOLS_CLASS}`));
    const newsletterSubscriptionFormRootHomepage = document.querySelector(".homepage-subscribe .newsletter-subscription .root");
    if (newsletterSubscriptionFormRootHomepage) {
        ReactDOM.hydrate(React.createElement(NewsletterSubscription_1.NewsletterSubscriptionForm, { context: NewsletterSubscription_1.NewsletterSubscriptionContext.Homepage }), newsletterSubscriptionFormRootHomepage);
    }
};
exports.runSiteTools = runSiteTools;
//# sourceMappingURL=SiteTools.js.map