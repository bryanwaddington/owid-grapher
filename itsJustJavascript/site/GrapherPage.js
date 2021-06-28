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
exports.GrapherPage = void 0;
const React = __importStar(require("react"));
const url_join_1 = __importDefault(require("url-join"));
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const Head_1 = require("./Head");
const ChartListItemVariant_1 = require("./ChartListItemVariant");
const LoadingIndicator_1 = require("../grapher/loadingIndicator/LoadingIndicator");
const IframeDetector_1 = require("./IframeDetector");
const serializers_1 = require("../clientUtils/serializers");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const Util_1 = require("../clientUtils/Util");
const RelatedArticles_1 = require("./RelatedArticles/RelatedArticles");
const GrapherPage = (props) => {
    const { grapher, relatedCharts, relatedArticles, baseGrapherUrl, baseUrl, } = props;
    const pageTitle = grapher.title;
    const pageDesc = grapher.subtitle ||
        "An interactive visualization from Our World in Data.";
    const canonicalUrl = url_join_1.default(baseGrapherUrl, grapher.slug);
    const imageUrl = url_join_1.default(baseGrapherUrl, "exports", `${grapher.slug}.png?v=${grapher.version}`);
    const script = `const jsonConfig = ${serializers_1.serializeJSONForHTML(grapher)}
window.Grapher.renderSingleGrapherOnGrapherPage(jsonConfig)`;
    const variableIds = Util_1.uniq(grapher.dimensions.map((d) => d.variableId));
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: canonicalUrl, pageTitle: pageTitle, pageDesc: pageDesc, imageUrl: imageUrl, baseUrl: baseUrl },
            React.createElement("meta", { property: "og:image:width", content: "850" }),
            React.createElement("meta", { property: "og:image:height", content: "600" }),
            React.createElement(IframeDetector_1.IFrameDetector, null),
            React.createElement("noscript", null,
                React.createElement("style", null, `
                    figure { display: none !important; }
                `)),
            React.createElement("link", { rel: "preload", href: `/grapher/data/variables/${variableIds.join("+")}.json?v=${grapher.version}`, as: "fetch", crossOrigin: "anonymous" })),
        React.createElement("body", { className: GrapherConstants_1.GRAPHER_PAGE_BODY_CLASS },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", null,
                React.createElement("figure", { "data-grapher-src": `/grapher/${grapher.slug}` },
                    React.createElement(LoadingIndicator_1.LoadingIndicator, null)),
                React.createElement("noscript", { id: "fallback" },
                    React.createElement("img", { src: `${baseGrapherUrl}/exports/${grapher.slug}.svg` }),
                    React.createElement("p", null, "Interactive visualization requires JavaScript")),
                ((relatedArticles && relatedArticles.length != 0) ||
                    (relatedCharts && relatedCharts.length != 0)) && (React.createElement("div", { className: "related-research-data" },
                    React.createElement("h2", null, "All our related research and data"),
                    relatedArticles && relatedArticles.length != 0 && (React.createElement(RelatedArticles_1.RelatedArticles, { articles: relatedArticles })),
                    relatedCharts && relatedCharts.length !== 0 && (React.createElement(React.Fragment, null,
                        React.createElement("h3", null, "Charts"),
                        React.createElement("ul", null, relatedCharts
                            .filter((chartItem) => chartItem.slug !==
                            grapher.slug)
                            .map((c) => (React.createElement(ChartListItemVariant_1.ChartListItemVariant, { key: c.slug, chart: c }))))))))),
            React.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }),
            React.createElement("script", { dangerouslySetInnerHTML: { __html: script } }))));
};
exports.GrapherPage = GrapherPage;
//# sourceMappingURL=GrapherPage.js.map