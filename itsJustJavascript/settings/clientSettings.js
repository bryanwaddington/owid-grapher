"use strict";
// All of this information is available to the client-side code
// DO NOT retrieve sensitive information from the environment in here! :O
// Settings in here will be made available to the client-side code that is
// bundled and shipped out to our users.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECAPTCHA_SITE_KEY = exports.DONATE_API_URL = exports.STRIPE_PUBLIC_KEY = exports.ALGOLIA_SEARCH_KEY = exports.ALGOLIA_ID = exports.WORDPRESS_URL = exports.ADMIN_BASE_URL = exports.BAKED_GRAPHER_URL = exports.BAKED_BASE_URL = exports.ADMIN_SERVER_HOST = exports.ADMIN_SERVER_PORT = exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const findBaseDir_1 = __importDefault(require("./findBaseDir"));
const baseDir = findBaseDir_1.default(__dirname);
if (baseDir)
    dotenv_1.default.config({ path: `${baseDir}/.env` });
const Util_1 = require("../clientUtils/Util");
exports.ENV = process.env.ENV === "production" ? "production" : "development";
exports.ADMIN_SERVER_PORT = (_a = Util_1.parseIntOrUndefined(process.env.PORT)) !== null && _a !== void 0 ? _a : 3030;
exports.ADMIN_SERVER_HOST = (_b = process.env.BIND_IP) !== null && _b !== void 0 ? _b : "localhost";
exports.BAKED_BASE_URL = (_c = process.env.BAKED_BASE_URL) !== null && _c !== void 0 ? _c : `http://${exports.ADMIN_SERVER_HOST}:${exports.ADMIN_SERVER_PORT}`;
// CORE-CHANGE-START
console.log('clientSettings.ts logging');
console.log('ADMIN_SERVER_HOST', exports.ADMIN_SERVER_HOST);
console.log('DMIN_SERVER_PORT', exports.ADMIN_SERVER_PORT);
console.log('ENV', exports.ENV);
console.log('process.env.BIND_IP', process.env.BIND_IP);
// CORE-CHANGE-END
exports.BAKED_GRAPHER_URL = (_d = process.env.BAKED_GRAPHER_URL) !== null && _d !== void 0 ? _d : `${exports.BAKED_BASE_URL}/grapher`;
// CORE-CHANGE-START
console.log('clientSettings.ts-BAKED_GRAPHER_URL', exports.BAKED_GRAPHER_URL);
console.log('clientSettings.ts-process.env.BAKED_GRAPHER_URL', process.env.BAKED_GRAPHER_URL);
// CORE-CHANGE-END
exports.ADMIN_BASE_URL = (_e = process.env.ADMIN_BASE_URL) !== null && _e !== void 0 ? _e : `http://${exports.ADMIN_SERVER_HOST}:${exports.ADMIN_SERVER_PORT}`;
exports.WORDPRESS_URL = (_f = process.env.WORDPRESS_URL) !== null && _f !== void 0 ? _f : "";
exports.ALGOLIA_ID = (_g = process.env.ALGOLIA_ID) !== null && _g !== void 0 ? _g : "";
exports.ALGOLIA_SEARCH_KEY = (_h = process.env.ALGOLIA_SEARCH_KEY) !== null && _h !== void 0 ? _h : "";
exports.STRIPE_PUBLIC_KEY = (_j = process.env.STRIPE_PUBLIC_KEY) !== null && _j !== void 0 ? _j : "pk_test_nIHvmH37zsoltpw3xMssPIYq";
exports.DONATE_API_URL = (_k = process.env.DONATE_API_URL) !== null && _k !== void 0 ? _k : "http://localhost:9000/donate";
exports.RECAPTCHA_SITE_KEY = (_l = process.env.RECAPTCHA_SITE_KEY) !== null && _l !== void 0 ? _l : "6LcJl5YUAAAAAATQ6F4vl9dAWRZeKPBm15MAZj4Q";
//# sourceMappingURL=clientSettings.js.map