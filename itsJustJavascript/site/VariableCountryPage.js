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
exports.VariableCountryPage = void 0;
const React = __importStar(require("react"));
const Head_1 = require("./Head");
const SiteHeader_1 = require("./SiteHeader");
const SiteFooter_1 = require("./SiteFooter");
const VariableCountryPage = (props) => {
    const { variable, country, baseUrl } = props;
    const pageTitle = `${country.name} / ${variable.name}`;
    const script = `window.runVariableCountryPage(${JSON.stringify(props)})`;
    return (React.createElement("html", null,
        React.createElement(Head_1.Head, { canonicalUrl: `${baseUrl}/search`, pageTitle: pageTitle, pageDesc: "Search articles and charts on Our World in Data.", baseUrl: baseUrl }),
        React.createElement("body", { className: "VariableCountryPage" },
            React.createElement(SiteHeader_1.SiteHeader, { baseUrl: baseUrl }),
            React.createElement("main", null, variable.name),
            React.createElement(SiteFooter_1.SiteFooter, { baseUrl: baseUrl }),
            React.createElement("script", { dangerouslySetInnerHTML: { __html: script } }))));
};
exports.VariableCountryPage = VariableCountryPage;
//# sourceMappingURL=VariableCountryPage.js.map