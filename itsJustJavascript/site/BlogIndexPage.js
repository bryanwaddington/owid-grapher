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
exports.BlogIndexPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const Util_1 = require("../clientUtils/Util");
const PostCard_1 = __importDefault(require("./PostCard/PostCard"));
const BlogIndexPage = (props) => {
    const { posts, pageNum, numPages, baseUrl } = props;
    const pageNums = Util_1.range(1, numPages + 1);
    const pageTitle = "Latest publications";
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/blog` + (pageNum > 1 ? `/page/${pageNum}` : ""), pageTitle: pageTitle, baseUrl: baseUrl }),
        React.createElement("body", { className: "blog" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", { className: "wrapper" },
                React.createElement("div", { className: "site-content" },
                    React.createElement("h2", null, pageTitle),
                    React.createElement("ul", { className: "posts" }, posts.map((post) => (React.createElement("li", { key: post.slug, className: "post" },
                        React.createElement(PostCard_1.default, { post: post }))))),
                    React.createElement("nav", { className: "navigation pagination", role: "navigation" },
                        React.createElement("h2", { className: "screen-reader-text" }, "Posts navigation"),
                        React.createElement("div", { className: "nav-link" }, pageNums.map((num) => (React.createElement("a", { key: num, className: "page-numbers" +
                                (num === pageNum ? " current" : ""), href: num === 1
                                ? "/blog/"
                                : `/blog/page/${num}` }, num))))))),
            React.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }))));
};
exports.BlogIndexPage = BlogIndexPage;
//# sourceMappingURL=BlogIndexPage.js.map