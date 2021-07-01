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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.bakeEmbedSnippet = exports.webpackUrl = void 0;
const fs = __importStar(require("fs-extra")); // todo: this should not be here.
const url_join_1 = __importDefault(require("url-join"));
const path = __importStar(require("path"));
const serverSettings_1 = require("../settings/serverSettings");
const WEBPACK_DEV_URL = (_a = process.env.WEBPACK_DEV_URL) !== null && _a !== void 0 ? _a : "http://localhost:8090";
const WEBPACK_OUTPUT_PATH = (_b = process.env.WEBPACK_OUTPUT_PATH) !== null && _b !== void 0 ? _b : path.join(__dirname + "/../", "webpack");
// CORE-CHANGE-START
console.log('WEBPACK_OUTPUT_PATH', WEBPACK_OUTPUT_PATH);
// CORE-CHANGE-END
let manifest;
const webpackUrl = (assetName, baseUrl = "", isProduction = serverSettings_1.ENV === "production") => {
    if (isProduction) {
        // Read the real asset name from the manifest in case it has a hashed filename
        if (!manifest)
            manifest = JSON.parse(fs
                .readFileSync(path.join(WEBPACK_OUTPUT_PATH, "manifest.json"))
                .toString("utf8"));
        if (baseUrl)
            return url_join_1.default(baseUrl, "/assets", manifest[assetName]);
        else
            return url_join_1.default("/", "assets", manifest[assetName]);
    }
    return url_join_1.default(WEBPACK_DEV_URL, assetName);
};
exports.webpackUrl = webpackUrl;
const bakeEmbedSnippet = (baseUrl) => `const embedSnippet = () => {
const link = document.createElement('link')
link.type = 'text/css'
link.rel = 'stylesheet'
link.href = '${exports.webpackUrl("commons.css", baseUrl)}'
document.head.appendChild(link)

let loadedScripts = 0;
const checkReady = () => {
    loadedScripts++
    if (loadedScripts === 3)
        window.MultiEmbedderSingleton.embedAll()
}

const coreScripts = [
    'https://polyfill.io/v3/polyfill.min.js?features=es6,fetch,URL,IntersectionObserver,IntersectionObserverEntry',
    '${exports.webpackUrl("commons.js", baseUrl)}',
    '${exports.webpackUrl("owid.js", baseUrl)}'
]

coreScripts.forEach(url => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = checkReady
    script.src = url
    document.head.appendChild(script)
})
}
embedSnippet()
`;
exports.bakeEmbedSnippet = bakeEmbedSnippet;
//# sourceMappingURL=webpackUtils.js.map