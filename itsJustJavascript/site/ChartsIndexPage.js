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
exports.ChartsIndexPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const ChartListItemVariant_1 = require("./ChartListItemVariant");
const lodash = __importStar(require("lodash"));
const TableOfContents_1 = require("./TableOfContents");
const Util_1 = require("../clientUtils/Util");
const ChartsIndexPage = (props) => {
    const { chartItems, baseUrl } = props;
    const allTags = lodash.sortBy(lodash.uniqBy(lodash.flatten(chartItems.map((item) => item.tags)), (tag) => tag.id), (tag) => tag.name);
    for (const chartItem of chartItems) {
        for (const tag of allTags) {
            if (tag.charts === undefined)
                tag.charts = [];
            if (chartItem.tags.some((t) => t.id === tag.id))
                tag.charts.push(chartItem);
        }
    }
    // Sort the charts in each tag
    for (const tag of allTags) {
        tag.charts = lodash.sortBy(tag.charts, (c) => c.title.trim());
    }
    const pageTitle = "Charts";
    const tocEntries = allTags.map((t) => {
        return {
            isSubheading: true,
            slug: Util_1.slugify(t.name),
            text: t.name,
        };
    });
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/charts`, pageTitle: "Charts", pageDesc: "All of the interactive charts on Our World in Data.", baseUrl: baseUrl }),
        React.createElement("body", { className: "ChartsIndexPage" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", null,
                React.createElement("div", { className: "page with-sidebar" },
                    React.createElement("div", { className: "content-wrapper" },
                        React.createElement(TableOfContents_1.TableOfContents, { headings: tocEntries, pageTitle: pageTitle }),
                        React.createElement("div", { className: "offset-content" },
                            React.createElement("div", { className: "content" },
                                React.createElement("header", { className: "chartsHeader" },
                                    React.createElement("input", { type: "search", className: "chartsSearchInput", placeholder: "Filter interactive charts by title", autoFocus: true })),
                                allTags.map((t) => (React.createElement("section", { key: t.id },
                                    React.createElement("h2", { id: Util_1.slugify(t.name) }, t.name),
                                    React.createElement("ul", null, t.charts.map((c) => (React.createElement(ChartListItemVariant_1.ChartListItemVariant, { key: c.slug, chart: c })))))))))))),
            React.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }),
            React.createElement("script", { dangerouslySetInnerHTML: {
                    __html: `
                        window.runChartsIndexPage()
                        runTableOfContents(${JSON.stringify({
                        headings: tocEntries,
                        pageTitle,
                    })})`,
                } }))));
};
exports.ChartsIndexPage = ChartsIndexPage;
//# sourceMappingURL=ChartsIndexPage.js.map