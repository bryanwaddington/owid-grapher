"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorerPage = void 0;
const react_1 = __importDefault(require("react"));
const Head_1 = require("../site/Head");
const SiteHeader_1 = require("../site/SiteHeader");
const SiteFooter_1 = require("../site/SiteFooter");
const LoadingIndicator_1 = require("../grapher/loadingIndicator/LoadingIndicator");
const IframeDetector_1 = require("../site/IframeDetector");
const SiteSubnavigation_1 = require("../site/SiteSubnavigation");
const formatting_1 = require("../site/formatting");
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
const serializers_1 = require("../clientUtils/serializers");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const ExplorerContent = ({ content }) => {
    return (react_1.default.createElement("div", { className: "explorerContentContainer" },
        react_1.default.createElement("div", { className: "sidebar" }),
        react_1.default.createElement("div", { className: "article-content" },
            react_1.default.createElement("section", null,
                react_1.default.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
                    react_1.default.createElement("div", { className: "wp-block-column", dangerouslySetInnerHTML: {
                            __html: formatting_1.formatReusableBlock(content),
                        } }),
                    react_1.default.createElement("div", { className: "wp-block-column" }))))));
};
const ExplorerPage = (props) => {
    const { wpContent, program, grapherConfigs, baseUrl, urlMigrationSpec, } = props;
    const { subNavId, subNavCurrentId, explorerTitle, slug, thumbnail, hideAlertBanner, } = program;
    const subNav = subNavId ? (react_1.default.createElement(SiteSubnavigation_1.SiteSubnavigation, { subnavId: subNavId, subnavCurrentId: subNavCurrentId })) : undefined;
    const inlineJs = `const explorerProgram = ${serializers_1.serializeJSONForHTML(program.toJson(), ExplorerConstants_1.EMBEDDED_EXPLORER_DELIMITER)};
const grapherConfigs = ${serializers_1.serializeJSONForHTML(grapherConfigs, ExplorerConstants_1.EMBEDDED_EXPLORER_GRAPHER_CONFIGS)};
const urlMigrationSpec = ${urlMigrationSpec ? JSON.stringify(urlMigrationSpec) : "undefined"};
window.Explorer.renderSingleExplorerOnExplorerPage(explorerProgram, grapherConfigs, urlMigrationSpec);`;
    return (react_1.default.createElement("html", null,
        react_1.default.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/${slug}`, pageTitle: explorerTitle, imageUrl: thumbnail, baseUrl: baseUrl },
            react_1.default.createElement(IframeDetector_1.IFrameDetector, null)),
        react_1.default.createElement("body", { className: GrapherConstants_1.GRAPHER_PAGE_BODY_CLASS },
            react_1.default.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl, hideAlertBanner: hideAlertBanner || false }),
            subNav,
            react_1.default.createElement("main", { id: ExplorerConstants_1.ExplorerContainerId },
                react_1.default.createElement(LoadingIndicator_1.LoadingIndicator, null)),
            wpContent && react_1.default.createElement(ExplorerContent, { content: wpContent }),
            react_1.default.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }),
            react_1.default.createElement("script", { dangerouslySetInnerHTML: { __html: inlineJs } }))));
};
exports.ExplorerPage = ExplorerPage;
//# sourceMappingURL=ExplorerPage.js.map