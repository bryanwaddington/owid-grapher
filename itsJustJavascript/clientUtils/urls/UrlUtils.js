"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWindowQueryStr = exports.getWindowQueryStr = exports.queryParamsToStr = exports.strToQueryParams = exports.getWindowQueryParams = exports.getQueryParams = void 0;
const Util_1 = require("../Util");
// Deprecated. Use getWindowQueryParams() to get the params from the global URL,
// or strToQueryParams(str) to parse an arbtirary query string.
const getQueryParams = (queryStr) => exports.strToQueryParams(queryStr || exports.getWindowQueryStr());
exports.getQueryParams = getQueryParams;
const getWindowQueryParams = () => exports.strToQueryParams(exports.getWindowQueryStr());
exports.getWindowQueryParams = getWindowQueryParams;
/**
 * Converts a query string into an object of key-value pairs.
 * Handles URI-decoding of the values.
 * @param queryStr
 * @param doNotDecode Passing `true` will return a QueryParams object with URI-encoded values.
 *                    Only use when absolutely necessary, for example, to distinguish between
 *                    `+` and `%20` for legacy URLs.
 */
const strToQueryParams = (queryStr = "", doNotDecode = false) => {
    if (queryStr[0] === "?")
        queryStr = queryStr.substring(1);
    const querySplit = queryStr.split("&").filter((s) => s);
    const params = {};
    for (const param of querySplit) {
        const [key, value] = param.split("=", 2);
        const decodedKey = decodeURIComponent(key.replace(/\+/g, "%20"));
        const decoded = value !== undefined
            ? decodeURIComponent(value.replace(/\+/g, "%20"))
            : undefined;
        params[decodedKey] = doNotDecode ? value : decoded;
    }
    return params;
};
exports.strToQueryParams = strToQueryParams;
/**
 * Converts an object to a query string.
 * Expects the input object to not be encoded already, and handles the URI-encoding of the values.
 */
const queryParamsToStr = (params) => {
    const queryParams = new URLSearchParams(Util_1.omitUndefinedValues(params));
    // we're relying on `~` (%7E) to not be encoded in some places, so make sure that it never is
    const newQueryStr = queryParams.toString().replace(/%7E/g, "~");
    return newQueryStr.length ? `?${newQueryStr}` : "";
};
exports.queryParamsToStr = queryParamsToStr;
const getWindowQueryStr = () => window.location.search;
exports.getWindowQueryStr = getWindowQueryStr;
const setWindowQueryStr = (str) => history.replaceState(null, document.title, window.location.pathname + str + window.location.hash);
exports.setWindowQueryStr = setWindowQueryStr;
//# sourceMappingURL=UrlUtils.js.map