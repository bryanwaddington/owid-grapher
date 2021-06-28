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
exports.runRelatedCharts = exports.RelatedCharts = void 0;
const React = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_1 = require("react");
const MultiEmbedder_1 = require("../../site/multiembedder/MultiEmbedder");
const RELATED_CHARTS_CLASS_NAME = "related-charts";
const RelatedCharts = ({ charts }) => {
    const refChartContainer = react_1.useRef(null);
    const [currentChart, setCurrentChart] = react_1.useState(charts[0]);
    react_1.useEffect(() => {
        if (refChartContainer.current)
            // Track newly injected <figure> elements in embedder
            MultiEmbedder_1.MultiEmbedderSingleton.observeFigures(refChartContainer.current);
    }, [currentChart]);
    return (React.createElement("div", { className: RELATED_CHARTS_CLASS_NAME },
        React.createElement("div", { className: "wp-block-columns is-style-sticky-right" },
            React.createElement("div", { className: "wp-block-column" },
                React.createElement("ul", null, charts.map((chart) => (React.createElement("li", { className: currentChart &&
                        currentChart.slug === chart.slug
                        ? "active"
                        : "", key: chart.slug },
                    React.createElement("a", { href: `/grapher/${chart.slug}`, onClick: (event) => {
                            // Allow opening charts in new tab/window with ⌘+CLICK
                            if (!event.metaKey &&
                                !event.shiftKey &&
                                !event.ctrlKey) {
                                setCurrentChart({
                                    title: chart.title,
                                    slug: chart.slug,
                                });
                                event.preventDefault();
                            }
                        } }, chart.title),
                    chart.variantName ? (React.createElement("span", { className: "variantName" }, chart.variantName)) : null))))),
            React.createElement("div", { className: "wp-block-column", id: "all-charts-preview", ref: refChartContainer },
                React.createElement("figure", { 
                    // Use unique `key` to force React to re-render tree
                    key: currentChart.slug, "data-grapher-src": `/grapher/${currentChart.slug}` })))));
};
exports.RelatedCharts = RelatedCharts;
const runRelatedCharts = (charts) => {
    const relatedChartsEl = document.querySelector(`.${RELATED_CHARTS_CLASS_NAME}`);
    if (relatedChartsEl) {
        const relatedChartsWrapper = relatedChartsEl.parentElement;
        react_dom_1.default.hydrate(React.createElement(exports.RelatedCharts, { charts: charts }), relatedChartsWrapper);
    }
};
exports.runRelatedCharts = runRelatedCharts;
//# sourceMappingURL=RelatedCharts.js.map