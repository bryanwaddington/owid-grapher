"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackPage = void 0;
const react_1 = __importDefault(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const Feedback_1 = require("../site/Feedback");
class FeedbackPage extends react_1.default.Component {
    render() {
        const { baseUrl } = this.props;
        return (react_1.default.createElement("html", null,
            react_1.default.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/feedback`, pageTitle: "Feedback", pageDesc: "Do you have feedback or suggestions for improving Our World in Data? Let us know!", baseUrl: baseUrl }),
            react_1.default.createElement("body", { className: "FeedbackPage" },
                react_1.default.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
                react_1.default.createElement("main", null,
                    react_1.default.createElement(Feedback_1.FeedbackForm, null)),
                react_1.default.createElement(SiteFooter_1.SiteFooter, { hideDonate: true, baseUrl: baseUrl })),
            react_1.default.createElement("script", null, `window.runFeedbackPage()`)));
    }
}
exports.FeedbackPage = FeedbackPage;
//# sourceMappingURL=FeedbackPage.js.map