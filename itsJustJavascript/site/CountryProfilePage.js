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
exports.CountryProfilePage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const url_join_1 = __importDefault(require("url-join"));
const CountryProfilePage = (props) => {
    const { country, indicators, baseUrl } = props;
    // const displayName = defaultTo(variable.display.name, variable.name)
    const script = `window.runCountryProfilePage()`;
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/country/${country.slug}`, pageTitle: `${country.name}`, pageDesc: `Population, GDP, life expectancy, birth rate and other key metrics for ${country.name}.`, baseUrl: baseUrl }),
        React.createElement("body", { className: "CountryProfilePage" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", null,
                React.createElement("header", null,
                    React.createElement("img", { className: "flag", src: `/images/flags/${country.code}.svg` }),
                    React.createElement("h1", null, country.name)),
                React.createElement("div", null,
                    React.createElement("input", { type: "search", className: "chartsSearchInput", placeholder: `Filter ${indicators.length} indicators for ${country.name}` })),
                React.createElement("section", null,
                    React.createElement("ul", { className: "indicators" }, indicators.map((indicator) => (React.createElement("li", { key: indicator.slug },
                        React.createElement("div", { className: "indicatorName" },
                            React.createElement("a", { href: url_join_1.default(baseUrl, indicator.slug) },
                                indicator.name,
                                indicator.variantName
                                    ? " (" +
                                        indicator.variantName +
                                        ")"
                                    : "")),
                        React.createElement("div", { className: "indicatorValue" },
                            indicator.value,
                            " (",
                            indicator.year,
                            ")"))))))),
            React.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }),
            React.createElement("script", { dangerouslySetInnerHTML: { __html: script } }))));
};
exports.CountryProfilePage = CountryProfilePage;
//# sourceMappingURL=CountryProfilePage.js.map