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
exports.absoluteUrl = exports.isValidSlug = exports.renderToHtmlPage = exports.tryInt = exports.expectInt = void 0;
const ReactDOMServer = __importStar(require("react-dom/server"));
const lodash = __importStar(require("lodash"));
const url_join_1 = __importDefault(require("url-join"));
const serverSettings_1 = require("../settings/serverSettings");
const owidTypes_1 = require("../clientUtils/owidTypes");
// Fail-fast integer conversion, for e.g. ids in url params
const expectInt = (value) => {
    const num = parseInt(value);
    if (isNaN(num))
        throw new owidTypes_1.JsonError(`Expected integer value, not '${value}'`, 400);
    return num;
};
exports.expectInt = expectInt;
const tryInt = (value, defaultNum) => {
    const num = parseInt(value);
    if (isNaN(num))
        return defaultNum;
    return num;
};
exports.tryInt = tryInt;
// Generate a static html page string from a given JSX element
const renderToHtmlPage = (element) => `<!doctype html>${ReactDOMServer.renderToStaticMarkup(element)}`;
exports.renderToHtmlPage = renderToHtmlPage;
// Determine if input is suitable for use as a url slug
const isValidSlug = (slug) => lodash.isString(slug) && slug.length > 1 && slug.match(/^[\w-]+$/);
exports.isValidSlug = isValidSlug;
const absoluteUrl = (path) => url_join_1.default(serverSettings_1.ADMIN_BASE_URL, path);
exports.absoluteUrl = absoluteUrl;
//# sourceMappingURL=serverUtil.js.map