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
exports.IndexPage = void 0;
const React = __importStar(require("react"));
const serverSettings_1 = require("../settings/serverSettings");
const webpackUtils_1 = require("../site/webpackUtils");
const IndexPage = (props) => {
    const script = `
        window.isEditor = true
        window.admin = new Admin({ username: "${props.username}", isSuperuser: ${props.isSuperuser.toString()}, settings: ${JSON.stringify({ ENV: serverSettings_1.ENV, GITHUB_USERNAME: serverSettings_1.GITHUB_USERNAME })}})
        admin.start(document.querySelector("#app"), '${props.gitCmsBranchName}')
`;
    return (React.createElement("html", { lang: "en" },
        React.createElement("head", null,
            React.createElement("title", null, "owid-admin"),
            React.createElement("meta", { name: "description", content: "" }),
            React.createElement("link", { href: "https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,700i|Playfair+Display:400,700&display=swap", rel: "stylesheet" }),
            React.createElement("link", { href: webpackUtils_1.webpackUrl("commons.css", "/admin"), rel: "stylesheet", type: "text/css" }),
            React.createElement("link", { href: webpackUtils_1.webpackUrl("admin.css", "/admin"), rel: "stylesheet", type: "text/css" })),
        React.createElement("body", null,
            React.createElement("div", { id: "app" }),
            React.createElement("script", { src: webpackUtils_1.webpackUrl("commons.js", "/admin") }),
            React.createElement("script", { src: webpackUtils_1.webpackUrl("admin.js", "/admin") }),
            React.createElement("script", { type: "text/javascript", dangerouslySetInnerHTML: { __html: script } }),
            React.createElement("iframe", { src: "https://ourworldindata.org/identifyadmin", style: { display: "none" } }))));
};
exports.IndexPage = IndexPage;
//# sourceMappingURL=IndexPage.js.map