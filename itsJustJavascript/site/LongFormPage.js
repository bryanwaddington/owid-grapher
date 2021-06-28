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
exports.LongFormPage = void 0;
const serverSettings_1 = require("../settings/serverSettings");
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const CitationMeta_1 = require("./CitationMeta");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const formatting_1 = require("../site/formatting");
const SiteSubnavigation_1 = require("./SiteSubnavigation");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faBook_1 = require("@fortawesome/free-solid-svg-icons/faBook");
const faSync_1 = require("@fortawesome/free-solid-svg-icons/faSync");
const faCreativeCommons_1 = require("@fortawesome/free-brands-svg-icons/faCreativeCommons");
const TableOfContents_1 = require("../site/TableOfContents");
const owidTypes_1 = require("../clientUtils/owidTypes");
const Breadcrumb_1 = require("./Breadcrumb/Breadcrumb");
const LongFormPage = (props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const { pageType, post, overrides, formattingOptions, baseUrl } = props;
    const isPost = post.type === "post";
    const isEntry = pageType === owidTypes_1.PageType.Entry;
    const isSubEntry = pageType === owidTypes_1.PageType.SubEntry;
    const pageTitle = (_a = overrides === null || overrides === void 0 ? void 0 : overrides.pageTitle) !== null && _a !== void 0 ? _a : post.title;
    const pageTitleSEO = `${pageTitle}${post.supertitle ? ` - ${post.supertitle}` : ""}`;
    const pageDesc = (_b = overrides === null || overrides === void 0 ? void 0 : overrides.excerpt) !== null && _b !== void 0 ? _b : post.excerpt;
    const canonicalUrl = (_c = overrides === null || overrides === void 0 ? void 0 : overrides.canonicalUrl) !== null && _c !== void 0 ? _c : `${baseUrl}/${post.slug}`;
    const citationTitle = (_d = overrides === null || overrides === void 0 ? void 0 : overrides.citationTitle) !== null && _d !== void 0 ? _d : pageTitle;
    const citationSlug = (_e = overrides === null || overrides === void 0 ? void 0 : overrides.citationSlug) !== null && _e !== void 0 ? _e : post.slug;
    const citationCanonicalUrl = (_f = overrides === null || overrides === void 0 ? void 0 : overrides.citationCanonicalUrl) !== null && _f !== void 0 ? _f : canonicalUrl;
    const citationPublishedYear = ((_g = overrides === null || overrides === void 0 ? void 0 : overrides.publicationDate) !== null && _g !== void 0 ? _g : post.date).getFullYear();
    const citationAuthors = (_h = overrides === null || overrides === void 0 ? void 0 : overrides.citationAuthors) !== null && _h !== void 0 ? _h : post.authors;
    const citationAuthorsFormatted = formatting_1.formatAuthors(citationAuthors, isEntry || isSubEntry);
    let hasSidebar = false;
    const endNotes = { text: "Endnotes", slug: "endnotes" };
    const tocHeadings = [...post.tocHeadings];
    if (tocHeadings.some((tocHeading) => !tocHeading.isSubheading)) {
        hasSidebar = true;
        if (post.footnotes.length) {
            tocHeadings.push(Object.assign(Object.assign({}, endNotes), { isSubheading: false }));
        }
        if (isEntry || isSubEntry) {
            tocHeadings.push({
                text: "Licence",
                slug: "licence",
                isSubheading: false,
            }, {
                text: "Citation",
                slug: "citation",
                isSubheading: false,
            });
        }
    }
    const bodyClasses = [];
    if (formattingOptions.bodyClassName) {
        bodyClasses.push(formattingOptions.bodyClassName);
    }
    const bibtex = `@article{owid${citationSlug.replace(/-/g, "")},
    author = {${citationAuthorsFormatted}},
    title = {${citationTitle}},
    journal = {Our World in Data},
    year = {${citationPublishedYear}},
    note = {${citationCanonicalUrl}}
}`;
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { pageTitle: pageTitleSEO, pageDesc: pageDesc, canonicalUrl: canonicalUrl, imageUrl: post.imageUrl, baseUrl: baseUrl }, (isEntry || isSubEntry) && (React.createElement(CitationMeta_1.CitationMeta, { title: citationTitle, authors: citationAuthors, date: post.date, canonicalUrl: citationCanonicalUrl }))),
        React.createElement("body", { className: bodyClasses.join(" ") },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", null,
                React.createElement("article", { className: `page${hasSidebar ? " with-sidebar" : " no-sidebar"}${isPost ? " thin-banner" : " large-banner"}` },
                    React.createElement("div", { className: "offset-header" },
                        React.createElement("header", { className: "article-header" },
                            React.createElement("div", { className: "article-titles" },
                                post.supertitle && (React.createElement("div", { className: "supertitle" }, post.supertitle)),
                                React.createElement("h1", { className: "entry-title" }, pageTitle),
                                post.subtitle && (React.createElement("div", { className: "subtitle" }, post.subtitle)),
                                formattingOptions.subnavId && (React.createElement(Breadcrumb_1.Breadcrumb, { subnavId: formattingOptions.subnavId, subnavCurrentId: formattingOptions.subnavCurrentId }))),
                            !formattingOptions.hideAuthors && (React.createElement("div", { className: "authors-byline" }, post.byline ? (React.createElement("div", { dangerouslySetInnerHTML: {
                                    __html: post.byline,
                                } })) : (React.createElement("a", { href: "/team" }, `by ${formatting_1.formatAuthors(post.authors, isEntry || isSubEntry)}`)))),
                            isPost && React.createElement("time", null, formatting_1.formatDate(post.date)),
                            post.info && (React.createElement("div", { className: "blog-info", dangerouslySetInnerHTML: {
                                    __html: post.info,
                                } })),
                            (isPost ||
                                isEntry ||
                                isSubEntry ||
                                post.lastUpdated) && (React.createElement("div", { className: "tools" },
                                post.lastUpdated && (React.createElement("div", { className: "last-updated" },
                                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSync_1.faSync }),
                                    React.createElement("span", { dangerouslySetInnerHTML: {
                                            __html: post.lastUpdated,
                                        } }))),
                                (isPost || isEntry || isSubEntry) && (React.createElement("a", { href: "#licence" },
                                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCreativeCommons_1.faCreativeCommons }),
                                    "Reuse our work freely")),
                                (isEntry || isSubEntry) && (React.createElement("a", { href: "#citation" },
                                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faBook_1.faBook }),
                                    "Cite this research")))))),
                    formattingOptions.subnavId && (React.createElement(SiteSubnavigation_1.SiteSubnavigation, { subnavId: formattingOptions.subnavId, subnavCurrentId: formattingOptions.subnavCurrentId })),
                    React.createElement("div", { className: "content-wrapper" },
                        hasSidebar && (React.createElement(TableOfContents_1.TableOfContents, { headings: tocHeadings, pageTitle: pageTitle })),
                        React.createElement("div", { className: "offset-content" },
                            React.createElement("div", { className: "content-and-footnotes" },
                                React.createElement("div", { className: "article-content", dangerouslySetInnerHTML: {
                                        __html: post.html,
                                    } }),
                                React.createElement("footer", { className: "article-footer" },
                                    React.createElement("div", { className: "wp-block-columns" },
                                        React.createElement("div", { className: "wp-block-column" },
                                            post.footnotes.length ? (React.createElement(React.Fragment, null,
                                                React.createElement("h3", { id: endNotes.slug }, endNotes.text),
                                                React.createElement("ol", { className: "endnotes" }, post.footnotes.map((footnote, i) => (React.createElement("li", { key: i, id: `note-${i +
                                                        1}` },
                                                    React.createElement("p", { dangerouslySetInnerHTML: {
                                                            __html: footnote,
                                                        } }))))))) : undefined,
                                            (isPost ||
                                                isEntry ||
                                                isSubEntry) && (React.createElement(React.Fragment, null,
                                                React.createElement("h3", { id: "licence" }, "Reuse our work freely"),
                                                React.createElement("p", null,
                                                    "All visualizations, data, and code produced by Our World in Data are completely open access under the",
                                                    " ",
                                                    React.createElement("a", { href: "https://creativecommons.org/licenses/by/4.0/", target: "_blank", rel: "noopener noreferrer" }, "Creative Commons BY license"),
                                                    ". You have the permission to use, distribute, and reproduce these in any medium, provided the source and authors are credited."),
                                                React.createElement("p", null, "The data produced by third parties and made available by Our World in Data is subject to the license terms from the original third-party authors. We will always indicate the original source of the data in our documentation, so you should always check the license of any such third-party data before use and redistribution."),
                                                React.createElement("p", null,
                                                    "All of",
                                                    " ",
                                                    React.createElement("a", { href: "/how-to-use-our-world-in-data#how-to-embed-interactive-charts-in-your-article" }, "our charts can be embedded"),
                                                    " ",
                                                    "in any site."))),
                                            (isEntry || isSubEntry) && (React.createElement(React.Fragment, null,
                                                React.createElement("h3", { id: "citation" }, "Citation"),
                                                React.createElement("p", null, "Our articles and data visualizations rely on work from many different people and organizations. When citing this entry, please also cite the underlying data sources. This entry can be cited as:"),
                                                React.createElement("pre", { className: "citation" },
                                                    citationAuthorsFormatted,
                                                    " ",
                                                    "(",
                                                    citationPublishedYear,
                                                    ") - \"",
                                                    citationTitle,
                                                    "\".",
                                                    " ",
                                                    React.createElement("em", null, "Published online at OurWorldInData.org."),
                                                    " ",
                                                    "Retrieved from: '",
                                                    citationCanonicalUrl,
                                                    "' [Online Resource]"),
                                                React.createElement("p", null, "BibTeX citation"),
                                                React.createElement("pre", { className: "citation" }, bibtex)))),
                                        React.createElement("div", { className: "wp-block-column" })))))))),
            React.createElement("div", { id: "wpadminbar", style: { display: "none" } },
                React.createElement("div", { className: "quicklinks", id: "wp-toolbar", role: "navigation", "aria-label": "Toolbar" },
                    React.createElement("ul", { id: "wp-admin-bar-root-default", className: "ab-top-menu" },
                        React.createElement("li", { id: "wp-admin-bar-site-name", className: "menupop" },
                            React.createElement("a", { className: "ab-item", "aria-haspopup": "true", href: `${serverSettings_1.WORDPRESS_URL}/wp/wp-admin` }, "Wordpress")),
                        " ",
                        React.createElement("li", { id: "wp-admin-bar-edit" },
                            React.createElement("a", { className: "ab-item", href: `${serverSettings_1.WORDPRESS_URL}/wp/wp-admin/post.php?post=${post.id}&action=edit` }, "Edit Page"))))),
            React.createElement(SiteFooter_1.SiteFooter, { hideDonate: formattingOptions.hideDonateFooter, baseUrl: baseUrl }),
            React.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `
                        runTableOfContents(${JSON.stringify({
                        headings: tocHeadings,
                        pageTitle,
                        // hideSubheadings: true
                    })})
                        runRelatedCharts(${JSON.stringify(post.relatedCharts)})
                        `,
                } }))));
};
exports.LongFormPage = LongFormPage;
//# sourceMappingURL=LongFormPage.js.map