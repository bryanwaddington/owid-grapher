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
exports.Head = void 0;
const React = __importStar(require("react"));
const webpackUtils_1 = require("../site/webpackUtils");
const Head = (props) => {
    const { canonicalUrl, baseUrl } = props;
    const pageTitle = props.pageTitle || `Our World in Data`;
    const fullPageTitle = props.pageTitle
        ? `${props.pageTitle} - Our World in Data`
        : `Our World in Data`;
    const pageDesc = props.pageDesc ||
        "Research and data to make progress against the world’s largest problems";
    const imageUrl = props.imageUrl || `${baseUrl}/default-thumbnail.jpg`;
    return (React.createElement("head", null,
        React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
        React.createElement("title", null, fullPageTitle),
        React.createElement("meta", { name: "description", content: pageDesc }),
        React.createElement("link", { rel: "canonical", href: canonicalUrl }),
        React.createElement("link", { rel: "alternate", type: "application/atom+xml", href: "/atom.xml" }),
        React.createElement("link", { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }),
        React.createElement("meta", { property: "fb:app_id", content: "1149943818390250" }),
        React.createElement("meta", { property: "og:url", content: canonicalUrl }),
        React.createElement("meta", { property: "og:title", content: pageTitle }),
        React.createElement("meta", { property: "og:description", content: pageDesc }),
        React.createElement("meta", { property: "og:image", content: imageUrl }),
        React.createElement("meta", { property: "og:site_name", content: "Our World in Data" }),
        React.createElement("meta", { name: "twitter:card", content: "summary_large_image" }),
        React.createElement("meta", { name: "twitter:site", content: "@OurWorldInData" }),
        React.createElement("meta", { name: "twitter:creator", content: "@OurWorldInData" }),
        React.createElement("meta", { name: "twitter:title", content: pageTitle }),
        React.createElement("meta", { name: "twitter:description", content: pageDesc }),
        React.createElement("meta", { name: "twitter:image", content: imageUrl }),
        React.createElement("link", { href: "https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i|Playfair+Display:400,700&display=swap", rel: "stylesheet" }),
        React.createElement("link", { rel: "stylesheet", href: webpackUtils_1.webpackUrl("commons.css", baseUrl) }),
        React.createElement("link", { rel: "stylesheet", href: webpackUtils_1.webpackUrl("owid.css", baseUrl) }),
        props.children));
};
exports.Head = Head;
//# sourceMappingURL=Head.js.map