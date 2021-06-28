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
exports.FrontPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const faRss_1 = require("@fortawesome/free-solid-svg-icons/faRss");
const faAngleRight_1 = require("@fortawesome/free-solid-svg-icons/faAngleRight");
const faExternalLinkAlt_1 = require("@fortawesome/free-solid-svg-icons/faExternalLinkAlt");
const faAngleDoubleDown_1 = require("@fortawesome/free-solid-svg-icons/faAngleDoubleDown");
const faTwitter_1 = require("@fortawesome/free-brands-svg-icons/faTwitter");
const faFacebookSquare_1 = require("@fortawesome/free-brands-svg-icons/faFacebookSquare");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faArrowRight_1 = require("@fortawesome/free-solid-svg-icons/faArrowRight");
const NewsletterSubscription_1 = require("../site/NewsletterSubscription");
const PostCard_1 = __importDefault(require("./PostCard/PostCard"));
const splitOnLastWord = (str) => {
    const endIndex = str.lastIndexOf(" ") + 1;
    return {
        start: endIndex === 0 ? "" : str.substring(0, endIndex),
        end: str.substring(endIndex),
    };
};
const FrontPage = (props) => {
    const { entries, posts, totalCharts, baseUrl } = props;
    // Structured data for google
    const structuredMarkup = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: baseUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };
    const renderEntry = (entry, categorySlug) => {
        const { start: titleStart, end: titleEnd } = splitOnLastWord(entry.title);
        return (React.createElement("a", { key: entry.slug, href: `/${entry.slug}`, className: `entry-item-container ${categorySlug}-color`, "data-track-note": "homepage-entries" },
            React.createElement("div", { className: "entry-item" },
                React.createElement("div", { className: "top" },
                    entry.kpi && (React.createElement("div", { className: "kpi", dangerouslySetInnerHTML: {
                            __html: entry.kpi,
                        } })),
                    React.createElement("p", { className: "excerpt" }, entry.excerpt)),
                React.createElement("div", { className: "bottom" },
                    React.createElement("h5", null,
                        titleStart,
                        React.createElement("span", null,
                            titleEnd,
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faArrowRight_1.faArrowRight })))))));
    };
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: baseUrl, baseUrl: baseUrl },
            React.createElement("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
                    __html: JSON.stringify(structuredMarkup),
                } })),
        React.createElement("body", { className: "FrontPage" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("section", { className: "homepage-masthead" },
                React.createElement("div", { className: "wrapper" },
                    React.createElement("h1", null, "Research and data to make progress against the world\u2019s largest problems"),
                    React.createElement("a", { href: "#entries", className: "see-all", "data-smooth-scroll": true, "data-track-note": "homepage-scroll" },
                        "Scroll to all our articles",
                        React.createElement("span", { className: "icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faAngleDoubleDown_1.faAngleDoubleDown }))),
                    React.createElement("p", null,
                        totalCharts,
                        " charts across 297 topics"),
                    React.createElement("p", null, "All free: open access and open source"))),
            React.createElement("section", { className: "homepage-coverage" },
                React.createElement("div", { className: "wrapper" },
                    React.createElement("div", { className: "inner-wrapper" },
                        React.createElement("div", { className: "owid-row owid-spacing--4" },
                            React.createElement("div", { className: "owid-col owid-col--lg-2" },
                                React.createElement("section", null,
                                    React.createElement("h3", { className: "align-center" },
                                        "Trusted in",
                                        " ",
                                        React.createElement("strong", null, "research and media")),
                                    React.createElement("a", { href: "/about/coverage#coverage", className: "coverage-link", "data-track-note": "homepage-trust" },
                                        React.createElement("img", { src: `${baseUrl}/media-logos-wide.png`, alt: "Logos of the publications that have used our content" }),
                                        React.createElement("div", { className: "hover-note" },
                                            React.createElement("p", null, "Find out how our work is used by journalists and researchers")))),
                                React.createElement("section", null,
                                    React.createElement("h3", { className: "align-center" },
                                        "Used in ",
                                        React.createElement("strong", null, "teaching")),
                                    React.createElement("a", { href: "/about/coverage#teaching", className: "coverage-link", "data-track-note": "homepage-trust" },
                                        React.createElement("img", { src: `${baseUrl}/university-logos-wide.png`, alt: "Logos of the universities that have used our content" }),
                                        React.createElement("div", { className: "hover-note" },
                                            React.createElement("p", null, "Find out how our work is used in teaching"))))))))),
            React.createElement("section", { className: "homepage-posts" },
                React.createElement("div", { className: "wrapper" },
                    React.createElement("div", { className: "owid-row" },
                        React.createElement("div", { className: "owid-col flex-row" },
                            React.createElement("div", { className: "homepage-posts--explainers" },
                                React.createElement("div", { className: "header" },
                                    React.createElement("h2", null, "Latest publications")),
                                React.createElement("ul", null, posts.slice(0, 6).map((post) => (React.createElement("li", { key: post.slug },
                                    React.createElement(PostCard_1.default, { post: post }))))),
                                React.createElement("div", { className: "see-all" },
                                    React.createElement("a", { href: "/blog", "data-track-note": "homepage-see-all-explainers" },
                                        React.createElement("div", { className: "label" }, "See all posts"),
                                        React.createElement("div", { className: "icon" },
                                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faAngleRight_1.faAngleRight }))))))))),
            React.createElement("section", { className: "homepage-subscribe" },
                React.createElement("div", { className: "wrapper" },
                    React.createElement("div", { className: "owid-row" },
                        React.createElement("div", { className: "owid-col owid-col--lg-2 flex-row owid-padding-bottom--sm-3" },
                            React.createElement("div", { className: "newsletter-subscription" },
                                React.createElement("div", { className: "box" },
                                    React.createElement("h2", null, "Subscribe to our newsletter"),
                                    React.createElement("div", { className: "root" },
                                        React.createElement(NewsletterSubscription_1.NewsletterSubscriptionForm, { context: NewsletterSubscription_1.NewsletterSubscriptionContext.Homepage }))))),
                        React.createElement("div", { className: "owid-col owid-col--lg-1" },
                            React.createElement("div", { className: "homepage-subscribe--social-media" },
                                React.createElement("div", { className: "shaded-box" },
                                    React.createElement("h2", null, "Follow us"),
                                    React.createElement("div", { className: "list" },
                                        React.createElement("a", { href: "https://twitter.com/ourworldindata", className: "list-item", title: "Twitter", target: "_blank", rel: "noopener noreferrer", "data-track-note": "homepage-follow-us" },
                                            React.createElement("div", { className: "icon" },
                                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faTwitter_1.faTwitter })),
                                            React.createElement("div", { className: "label" }, "Twitter")),
                                        React.createElement("a", { href: "https://facebook.com/ourworldindata", className: "list-item", title: "Facebook", target: "_blank", rel: "noopener noreferrer", "data-track-note": "homepage-follow-us" },
                                            React.createElement("div", { className: "icon" },
                                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faFacebookSquare_1.faFacebookSquare })),
                                            React.createElement("div", { className: "label" }, "Facebook")),
                                        React.createElement("a", { href: "/feed", className: "list-item", title: "RSS", target: "_blank", "data-track-note": "homepage-follow-us" },
                                            React.createElement("div", { className: "icon" },
                                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faRss_1.faRss })),
                                            React.createElement("div", { className: "label" }, "RSS Feed"))))))))),
            React.createElement("section", { className: "homepage-projects" },
                React.createElement("div", { className: "wrapper" },
                    React.createElement("div", { className: "list" },
                        React.createElement("a", { href: "https://sdg-tracker.org", className: "list-item", "data-track-note": "homepage-projects" },
                            React.createElement("div", { className: "icon-left" },
                                React.createElement("img", { src: `${baseUrl}/sdg-wheel.png`, alt: "SDG Tracker logo", loading: "lazy" })),
                            React.createElement("div", { className: "content" },
                                React.createElement("h3", null, "Sustainable Development Goals Tracker"),
                                React.createElement("p", null, "Is the world on track to reach the Sustainable Development Goals?")),
                            React.createElement("div", { className: "icon-right" },
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExternalLinkAlt_1.faExternalLinkAlt }))),
                        React.createElement("a", { href: "/teaching", className: "list-item", "data-track-note": "homepage-projects" },
                            React.createElement("div", { className: "icon-left" },
                                React.createElement("img", { src: `${baseUrl}/teaching-hub.svg`, alt: "Teaching Hub logo", loading: "lazy" })),
                            React.createElement("div", { className: "content" },
                                React.createElement("h3", null, "Teaching Hub"),
                                React.createElement("p", null, "Slides, research, and visualizations for teaching and learning about global development")),
                            React.createElement("div", { className: "icon-right" },
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExternalLinkAlt_1.faExternalLinkAlt })))))),
            React.createElement("section", { id: "entries", className: "homepage-entries" },
                React.createElement("div", { className: "wrapper" },
                    React.createElement("h2", null, "All our articles on global problems and global changes"),
                    entries.map((category) => (React.createElement("div", { key: category.slug, className: "category-wrapper" },
                        React.createElement("h3", { className: `${category.slug}-color`, id: category.slug }, category.name),
                        !!category.entries.length && (React.createElement("div", { className: "category-entries" }, category.entries.map((entry) => renderEntry(entry, category.slug)))),
                        category.subcategories.map((subcategory) => (React.createElement("div", { key: subcategory.slug },
                            React.createElement("h4", { className: `${category.slug}-color` }, subcategory.name),
                            React.createElement("div", { className: "category-entries" }, subcategory.entries.map((entry) => renderEntry(entry, category.slug))))))))))),
            React.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }))));
};
exports.FrontPage = FrontPage;
//# sourceMappingURL=FrontPage.js.map