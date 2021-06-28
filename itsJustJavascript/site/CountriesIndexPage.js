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
exports.CountriesIndexPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const CountriesIndexPage = (props) => {
    const { countries, baseUrl } = props;
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/countries`, pageTitle: "Countries", pageDesc: "Data by individual country on Our World in Data.", baseUrl: baseUrl }),
        React.createElement("body", { className: "CountriesIndexPage" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", null,
                React.createElement("h1", null, "Data by country"),
                React.createElement("ul", null, countries.map((country) => (React.createElement("li", { key: country.code },
                    React.createElement("img", { className: "flag", src: `/images/flags/${country.code}.svg` }),
                    React.createElement("a", { href: `/country/${country.slug}` }, country.name)))))),
            React.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }))));
};
exports.CountriesIndexPage = CountriesIndexPage;
//# sourceMappingURL=CountriesIndexPage.js.map