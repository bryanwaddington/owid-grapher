"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWindowUrl = exports.setWindowUrl = exports.Url = void 0;
const url_parse_1 = __importDefault(require("url-parse"));
const Util_1 = require("../Util");
const UrlUtils_1 = require("./UrlUtils");
const parseUrl = (url) => {
    const parsed = url_parse_1.default(url, {});
    // The library returns an unparsed string for `query`, its types aren't quite right.
    const query = parsed.query.toString();
    return Object.assign(Object.assign({}, parsed), { query });
};
const ensureStartsWith = (str, start) => {
    if (str.startsWith(start))
        return str;
    return `${start}${str}`;
};
const ensureQueryStrFormat = (queryStr) => ensureStartsWith(queryStr, "?");
const ensureHashFormat = (queryStr) => ensureStartsWith(queryStr, "#");
class Url {
    constructor(props = {}) {
        this.props = Object.assign(Object.assign({}, props), { pathname: props.pathname !== undefined
                ? props.pathname
                : props.origin
                    ? ""
                    : undefined });
    }
    /**
     * @param url Absolute or relative URL
     */
    static fromURL(url) {
        const { origin, pathname, query, hash } = parseUrl(url);
        return new Url({
            origin: origin !== undefined && origin !== "null" ? origin : undefined,
            pathname,
            queryStr: query,
            hash,
        });
    }
    static fromQueryStr(queryStr) {
        return new Url({
            queryStr: ensureQueryStrFormat(queryStr),
        });
    }
    static fromQueryParams(queryParams) {
        return new Url({
            queryStr: UrlUtils_1.queryParamsToStr(queryParams),
        });
    }
    get origin() {
        return this.props.origin;
    }
    get pathname() {
        return this.props.pathname;
    }
    get originAndPath() {
        const strings = Util_1.excludeUndefined([this.origin, this.pathname]);
        if (strings.length === 0)
            return undefined;
        return strings.join("");
    }
    get queryStr() {
        const { queryStr } = this.props;
        // Drop a single trailing `?`, if there is one
        return queryStr && queryStr !== "?"
            ? ensureQueryStrFormat(queryStr)
            : "";
    }
    get hash() {
        const { hash } = this.props;
        return hash ? ensureHashFormat(hash) : "";
    }
    get fullUrl() {
        return Util_1.excludeUndefined([
            this.origin,
            this.pathname,
            this.queryStr,
            this.hash,
        ]).join("");
    }
    get queryParams() {
        return UrlUtils_1.strToQueryParams(this.queryStr);
    }
    get encodedQueryParams() {
        return UrlUtils_1.strToQueryParams(this.queryStr, true);
    }
    update(props) {
        return new Url(Object.assign(Object.assign({}, this.props), props));
    }
    setQueryParams(queryParams) {
        return new Url(Object.assign(Object.assign({}, this.props), { queryStr: UrlUtils_1.queryParamsToStr(queryParams) }));
    }
    updateQueryParams(queryParams) {
        return this.update({
            queryStr: UrlUtils_1.queryParamsToStr(Util_1.omitUndefinedValues(Object.assign(Object.assign({}, this.queryParams), queryParams))),
        });
    }
}
exports.Url = Url;
const setWindowUrl = (url) => {
    var _a;
    const pathname = (_a = url.pathname) !== null && _a !== void 0 ? _a : window.location.pathname;
    window.history.replaceState(null, document.title, Util_1.excludeUndefined([pathname, url.queryStr, url.hash]).join(""));
};
exports.setWindowUrl = setWindowUrl;
const getWindowUrl = () => {
    return Url.fromURL(window.location.href);
};
exports.getWindowUrl = getWindowUrl;
//# sourceMappingURL=Url.js.map