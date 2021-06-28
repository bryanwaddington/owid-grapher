"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiEmbedderTestPage = void 0;
const ExplorerConstants_1 = require("../../explorer/ExplorerConstants");
const GlobalEntitySelectorConstants_1 = require("../../grapher/controls/globalEntitySelector/GlobalEntitySelectorConstants");
const GrapherConstants_1 = require("../../grapher/core/GrapherConstants");
const react_1 = __importDefault(require("react"));
const Head_1 = require("../../site/Head");
const SiteFooter_1 = require("../../site/SiteFooter");
const SiteHeader_1 = require("../../site/SiteHeader");
const MultiEmbedderTestPage = (globalEntitySelector = false, slug = "embed-test-page", title = "MultiEmbedderTestPage") => {
    const style = {
        width: "600px",
        height: "400px",
        border: "1px solid blue",
    };
    const styleExplorer = Object.assign(Object.assign({}, style), { width: "1200px", height: "600px" });
    return (react_1.default.createElement("html", null,
        react_1.default.createElement(Head_1.Head, { canonicalUrl: slug, pageTitle: title, baseUrl: "/" }),
        react_1.default.createElement("body", null,
            react_1.default.createElement(SiteHeader_1.SiteHeader, { baseUrl: "" }),
            react_1.default.createElement("main", { style: { padding: "1rem" } },
                globalEntitySelector ? (react_1.default.createElement("div", Object.assign({}, { [GlobalEntitySelectorConstants_1.GLOBAL_ENTITY_SELECTOR_DATA_ATTR]: true }))) : null,
                react_1.default.createElement("p", null,
                    react_1.default.createElement("a", { href: "?globalEntitySelector=true" }, "With Global Entity Control")),
                react_1.default.createElement("h1", null, "A grapher about sharks"),
                react_1.default.createElement("figure", Object.assign({ "data-test": "within-bounds", style: style }, {
                    [GrapherConstants_1.GRAPHER_EMBEDDED_FIGURE_ATTR]: "http://localhost:3030/grapher/total-shark-attacks-per-year",
                })),
                react_1.default.createElement("h1", null, "A grapher about sharks with different params (time=latest)"),
                react_1.default.createElement("figure", Object.assign({ "data-test": "within-bounds", style: style }, {
                    [GrapherConstants_1.GRAPHER_EMBEDDED_FIGURE_ATTR]: "http://localhost:3030/grapher/total-shark-attacks-per-year?time=latest",
                })),
                react_1.default.createElement("h1", null, "The same grapher loaded through an iframe (embed on external sites)"),
                "Note: the MultiEmbedder is not being called in this context. The rendering paths of external embeds and charts on content pages do converge at some point, but later. So any change on the MultiEmbedder has no effect on the charts embedded on external sites (and the grapher pages they rely on).",
                react_1.default.createElement("pre", null, `
        Chart on   ─────► MultiEmbedder  ───────────────────────────►  renderGrapherIntoContainer()
        OWID page                                                                   ▲
                                                                                    │
                                                                                    │
     Grapher page  ─────► renderSingleGrapherOnGrapherPage() ───────────────────────┘

          ▲
          │
          │
          │

Chart embedded on
    external site
                        `),
                react_1.default.createElement("iframe", { src: "http://localhost:3030/grapher/total-shark-attacks-per-year?time=latest", loading: "lazy", style: Object.assign(Object.assign({}, style), { marginLeft: "40px" }) }),
                react_1.default.createElement("h1", null, "An explorer about co2"),
                react_1.default.createElement("figure", Object.assign({ "data-test": "within-bounds", style: styleExplorer }, {
                    [ExplorerConstants_1.EXPLORER_EMBEDDED_FIGURE_SELECTOR]: "http://localhost:3030/explorers/co2",
                })),
                react_1.default.createElement("h1", { "data-test": "heading-before-spacer" }, "When you see this, the explorer located 2 viewports below will start loading."),
                "200vh matches MultiEmbedder's IntersectionObserver rootMargin parameter of 200%. You can manually test this by adding a console.log() to renderInteractiveFigure(), or look into the DOM and check whether the figure element below is populated (it shouldn't be until you reveal this text).",
                react_1.default.createElement("div", { style: { height: "200vh" } }),
                react_1.default.createElement("figure", Object.assign({ "data-test": "out-of-bounds", style: styleExplorer }, {
                    [ExplorerConstants_1.EXPLORER_EMBEDDED_FIGURE_SELECTOR]: "http://localhost:3030/explorers/co2",
                }))),
            react_1.default.createElement(SiteFooter_1.SiteFooter, { baseUrl: "" }))));
};
exports.MultiEmbedderTestPage = MultiEmbedderTestPage;
//# sourceMappingURL=MultiEmbedderTestPage.js.map