"use strict";
// This is where server-side only, potentially sensitive settings enter from the environment
// DO NOT store sensitive strings in this file itself, as it is checked in to git!
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDFLARE_AUD = exports.DEPLOY_PENDING_FILE_PATH = exports.DEPLOY_QUEUE_FILE_PATH = exports.BAKE_ON_CHANGE = exports.UNCATEGORIZED_TAG_ID = exports.TMP_DIR = exports.GIT_DATASETS_DIR = exports.SLACK_ERRORS_WEBHOOK_URL = exports.HTTPS_ONLY = exports.WORDPRESS_DIR = exports.EMAIL_USE_TLS = exports.EMAIL_HOST_PASSWORD = exports.EMAIL_HOST_USER = exports.EMAIL_PORT = exports.EMAIL_HOST = exports.STRIPE_SECRET_KEY = exports.ALGOLIA_SECRET_KEY = exports.SESSION_COOKIE_AGE = exports.WORDPRESS_API_PASS = exports.WORDPRESS_API_USER = exports.WORDPRESS_DB_PORT = exports.WORDPRESS_DB_HOST = exports.WORDPRESS_DB_PASS = exports.WORDPRESS_DB_USER = exports.WORDPRESS_DB_NAME = exports.SECRET_KEY = exports.BAKED_SITE_DIR = exports.DB_PORT = exports.DB_HOST = exports.DB_PASS = exports.DB_USER = exports.DB_NAME = exports.BLOG_SLUG = exports.BLOG_POSTS_PER_PAGE = exports.GIT_DEFAULT_EMAIL = exports.GIT_DEFAULT_USERNAME = exports.GITHUB_USERNAME = exports.OPTIMIZE_SVG_EXPORTS = exports.BAKED_GRAPHER_URL = exports.WORDPRESS_URL = exports.ADMIN_BASE_URL = exports.BAKED_BASE_URL = exports.ADMIN_SERVER_HOST = exports.ADMIN_SERVER_PORT = exports.ENV = exports.BASE_DIR = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const findBaseDir_1 = __importDefault(require("./findBaseDir"));
const baseDir = findBaseDir_1.default(__dirname);
if (baseDir === undefined)
    throw new Error("could not locate base package.json");
dotenv_1.default.config({ path: `${baseDir}/.env` });
const clientSettings = __importStar(require("./clientSettings"));
const Util_1 = require("../clientUtils/Util");
const serverSettings = (_a = process.env) !== null && _a !== void 0 ? _a : {};

console.log('DB_NAME', serverSettings.DB_NAME);
console.log('DB_HOST', serverSettings.DB_HOST);
console.log('DB_USER', serverSettings.DB_USER);
console.log('DB_PASS', serverSettings.DB_PASS);
console.log('DB_PORT', serverSettings.DB_PORT);

exports.BASE_DIR = baseDir;
exports.ENV = clientSettings.ENV;
exports.ADMIN_SERVER_PORT = clientSettings.ADMIN_SERVER_PORT;
exports.ADMIN_SERVER_HOST = clientSettings.ADMIN_SERVER_HOST;
exports.BAKED_BASE_URL = clientSettings.BAKED_BASE_URL;
exports.ADMIN_BASE_URL = clientSettings.ADMIN_BASE_URL;
exports.WORDPRESS_URL = clientSettings.WORDPRESS_URL;
exports.BAKED_GRAPHER_URL = (_b = serverSettings.BAKED_GRAPHER_URL) !== null && _b !== void 0 ? _b : `${exports.BAKED_BASE_URL}/grapher`;
exports.OPTIMIZE_SVG_EXPORTS = (_c = serverSettings.OPTIMIZE_SVG_EXPORTS === "true") !== null && _c !== void 0 ? _c : false;
exports.GITHUB_USERNAME = (_d = serverSettings.GITHUB_USERNAME) !== null && _d !== void 0 ? _d : "owid-test";
exports.GIT_DEFAULT_USERNAME = (_e = serverSettings.GIT_DEFAULT_USERNAME) !== null && _e !== void 0 ? _e : "Our World in Data";
exports.GIT_DEFAULT_EMAIL = (_f = serverSettings.GIT_DEFAULT_EMAIL) !== null && _f !== void 0 ? _f : "info@ourworldindata.org";
exports.BLOG_POSTS_PER_PAGE = (_g = Util_1.parseIntOrUndefined(serverSettings.BLOG_POSTS_PER_PAGE)) !== null && _g !== void 0 ? _g : 21;
exports.BLOG_SLUG = (_h = serverSettings.BLOG_SLUG) !== null && _h !== void 0 ? _h : "blog";
exports.DB_NAME = (_j = serverSettings.DB_NAME) !== null && _j !== void 0 ? _j : "owid";
exports.DB_USER = (_k = serverSettings.DB_USER) !== null && _k !== void 0 ? _k : "root";
exports.DB_PASS = (_l = serverSettings.DB_PASS) !== null && _l !== void 0 ? _l : "";
exports.DB_HOST = (_m = serverSettings.DB_HOST) !== null && _m !== void 0 ? _m : "localhost";
exports.DB_PORT = (_o = Util_1.parseIntOrUndefined(serverSettings.DB_PORT)) !== null && _o !== void 0 ? _o : 3306;
exports.BAKED_SITE_DIR = (_p = serverSettings.BAKED_SITE_DIR) !== null && _p !== void 0 ? _p : path_1.default.resolve(exports.BASE_DIR, "bakedSite"); // Where the static build output goes
exports.SECRET_KEY = (_q = serverSettings.SECRET_KEY) !== null && _q !== void 0 ? _q : "fejwiaof jewiafo jeioa fjieowajf isa fjidosajfgj";
exports.WORDPRESS_DB_NAME = (_r = serverSettings.WORDPRESS_DB_NAME) !== null && _r !== void 0 ? _r : "";
exports.WORDPRESS_DB_USER = (_s = serverSettings.WORDPRESS_DB_USER) !== null && _s !== void 0 ? _s : exports.DB_USER;
exports.WORDPRESS_DB_PASS = (_t = serverSettings.WORDPRESS_DB_PASS) !== null && _t !== void 0 ? _t : exports.DB_PASS;
exports.WORDPRESS_DB_HOST = (_u = serverSettings.WORDPRESS_DB_HOST) !== null && _u !== void 0 ? _u : exports.DB_HOST;
exports.WORDPRESS_DB_PORT = (_v = Util_1.parseIntOrUndefined(serverSettings.WORDPRESS_DB_PORT)) !== null && _v !== void 0 ? _v : exports.DB_PORT;
exports.WORDPRESS_API_USER = (_w = serverSettings.WORDPRESS_API_USER) !== null && _w !== void 0 ? _w : "";
exports.WORDPRESS_API_PASS = (_x = serverSettings.WORDPRESS_API_PASS) !== null && _x !== void 0 ? _x : "";
exports.SESSION_COOKIE_AGE = (_y = Util_1.parseIntOrUndefined(serverSettings.SESSION_COOKIE_AGE)) !== null && _y !== void 0 ? _y : 1209600;
exports.ALGOLIA_SECRET_KEY = (_z = serverSettings.ALGOLIA_SECRET_KEY) !== null && _z !== void 0 ? _z : "";
exports.STRIPE_SECRET_KEY = (_0 = serverSettings.STRIPE_SECRET_KEY) !== null && _0 !== void 0 ? _0 : "";
// Settings for automated email sending, e.g. for admin invite
exports.EMAIL_HOST = (_1 = serverSettings.EMAIL_HOST) !== null && _1 !== void 0 ? _1 : "smtp.mail.com";
exports.EMAIL_PORT = (_2 = Util_1.parseIntOrUndefined(serverSettings.EMAIL_PORT)) !== null && _2 !== void 0 ? _2 : 443;
exports.EMAIL_HOST_USER = (_3 = serverSettings.EMAIL_HOST_USER) !== null && _3 !== void 0 ? _3 : "user";
exports.EMAIL_HOST_PASSWORD = (_4 = serverSettings.EMAIL_HOST_PASSWORD) !== null && _4 !== void 0 ? _4 : "password";
exports.EMAIL_USE_TLS = (_5 = serverSettings.EMAIL_USE_TLS !== "false") !== null && _5 !== void 0 ? _5 : true;
// Wordpress target setting
exports.WORDPRESS_DIR = (_6 = serverSettings.WORDPRESS_DIR) !== null && _6 !== void 0 ? _6 : "wordpress";
exports.HTTPS_ONLY = (_7 = serverSettings.HTTPS_ONLY !== "false") !== null && _7 !== void 0 ? _7 : true;
// Node slack webhook to report errors to using express-error-slac
exports.SLACK_ERRORS_WEBHOOK_URL = (_8 = serverSettings.SLACK_ERRORS_WEBHOOK_URL) !== null && _8 !== void 0 ? _8 : "";
exports.GIT_DATASETS_DIR = (_9 = serverSettings.GIT_DATASETS_DIR) !== null && _9 !== void 0 ? _9 : `${exports.BASE_DIR}/datasetsExport`; //  Where the git exports go
exports.TMP_DIR = (_10 = serverSettings.TMP_DIR) !== null && _10 !== void 0 ? _10 : "/tmp";
exports.UNCATEGORIZED_TAG_ID = (_11 = Util_1.parseIntOrUndefined(serverSettings.UNCATEGORIZED_TAG_ID)) !== null && _11 !== void 0 ? _11 : 375;
// Should the static site output be baked when relevant database items change
exports.BAKE_ON_CHANGE = (_12 = serverSettings.BAKE_ON_CHANGE === "true") !== null && _12 !== void 0 ? _12 : false;
exports.DEPLOY_QUEUE_FILE_PATH = (_13 = serverSettings.DEPLOY_QUEUE_FILE_PATH) !== null && _13 !== void 0 ? _13 : `${exports.BASE_DIR}/.queue`;
exports.DEPLOY_PENDING_FILE_PATH = (_14 = serverSettings.DEPLOY_PENDING_FILE_PATH) !== null && _14 !== void 0 ? _14 : `${exports.BASE_DIR}/.pending`;
exports.CLOUDFLARE_AUD = (_15 = serverSettings.CLOUDFLARE_AUD) !== null && _15 !== void 0 ? _15 : "";
//# sourceMappingURL=serverSettings.js.map