"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntriesForYearPage = exports.EntriesByYearPage = void 0;
const react_1 = __importDefault(require("react"));
const moment_1 = __importDefault(require("moment"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const TableOfContents_1 = require("../site/TableOfContents");
const Util_1 = require("../clientUtils/Util");
const EntriesByYearPage = (props) => {
    const { baseUrl } = props;
    const entriesByYear = Util_1.groupBy(props.entries, (entry) => moment_1.default(entry.published_at).year());
    const years = Object.keys(entriesByYear).sort().reverse();
    const pageTitle = "Entries by Year";
    const tocEntries = years.map((year) => {
        return {
            isSubheading: false,
            slug: year,
            text: year,
        };
    });
    return (react_1.default.createElement("html", null,
        react_1.default.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/entries-by-year`, pageTitle: "Entries by Year", pageDesc: "An index of Our World in Data entries by year of first publication.", baseUrl: baseUrl }),
        react_1.default.createElement("body", { className: "EntriesByYearPage" },
            react_1.default.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            react_1.default.createElement("main", null,
                react_1.default.createElement("div", { className: "page with-sidebar" },
                    react_1.default.createElement("div", { className: "content-wrapper" },
                        react_1.default.createElement(TableOfContents_1.TableOfContents, { headings: tocEntries, pageTitle: pageTitle }),
                        react_1.default.createElement("div", { className: "offset-content" },
                            react_1.default.createElement("div", { className: "content" },
                                react_1.default.createElement("p", null, "Entries by year of first publication. Note that older entries are often updated with new content."),
                                years.map((year) => (react_1.default.createElement("section", { key: year },
                                    react_1.default.createElement("h2", { id: year },
                                        react_1.default.createElement("a", { href: `${baseUrl}/entries-by-year/${year}` }, year)),
                                    react_1.default.createElement("ul", null, entriesByYear[year].map((entry) => (react_1.default.createElement("li", { key: entry.slug },
                                        react_1.default.createElement("a", { href: `${baseUrl}/${entry.slug}` }, entry.title))))))))))))),
            react_1.default.createElement(SiteFooter_1.SiteFooter, { hideDonate: true, baseUrl: baseUrl }),
            react_1.default.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `
                        runTableOfContents(${JSON.stringify({
                        headings: tocEntries,
                        pageTitle,
                    })})`,
                } }))));
};
exports.EntriesByYearPage = EntriesByYearPage;
const EntriesForYearPage = (props) => {
    const { baseUrl, year } = props;
    const entriesByYear = Util_1.groupBy(props.entries, (entry) => moment_1.default(entry.published_at).year());
    const years = Object.keys(entriesByYear)
        .sort()
        .reverse()
        .filter((y) => parseInt(y) === year);
    return (react_1.default.createElement("html", null,
        react_1.default.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/entries-by-year/${year}`, pageTitle: `${year} Entries`, pageDesc: `Our World in Data entries first published in ${year}.`, baseUrl: baseUrl }),
        react_1.default.createElement("body", { className: "EntriesByYearPage" },
            react_1.default.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            react_1.default.createElement("main", null,
                react_1.default.createElement("div", { className: "page" },
                    react_1.default.createElement("div", { className: "content-wrapper" },
                        react_1.default.createElement("div", { className: "offset-content" },
                            react_1.default.createElement("div", { className: "content" }, years.map((year) => (react_1.default.createElement("section", { key: year },
                                react_1.default.createElement("h2", null, year),
                                react_1.default.createElement("ul", null, entriesByYear[year].map((entry) => (react_1.default.createElement("li", { key: entry.slug },
                                    react_1.default.createElement("a", { href: `${baseUrl}/${entry.slug}` }, entry.title))))))))))))),
            react_1.default.createElement(SiteFooter_1.SiteFooter, { hideDonate: true, baseUrl: baseUrl }))));
};
exports.EntriesForYearPage = EntriesForYearPage;
//# sourceMappingURL=EntriesByYearPage.js.map