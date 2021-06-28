"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorerSlugFromUrl = exports.transformQueryParams = exports.decodeURIComponentOrUndefined = void 0;
const ExplorerConstants_1 = require("../ExplorerConstants");
const Util_1 = require("../../clientUtils/Util");
const decodeURIComponentOrUndefined = (value) => value !== undefined
    ? decodeURIComponent(value.replace(/\+/g, "%20"))
    : undefined;
exports.decodeURIComponentOrUndefined = decodeURIComponentOrUndefined;
const transformQueryParams = (oldQueryParams, transformMap) => {
    const newQueryParams = Util_1.omit(oldQueryParams, ...Object.keys(transformMap));
    for (const oldParamName in transformMap) {
        if (!(oldParamName in oldQueryParams))
            continue;
        const { newName, transformValue } = transformMap[oldParamName];
        newQueryParams[newName !== null && newName !== void 0 ? newName : oldParamName] = transformValue(oldQueryParams[oldParamName]);
    }
    return newQueryParams;
};
exports.transformQueryParams = transformQueryParams;
const getExplorerSlugFromUrl = (url) => {
    if (!url.pathname)
        return undefined;
    const match = url.pathname.match(new RegExp(`^\/+${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}\/+([^\/]+)`));
    if (match && match[1])
        return match[1];
    return undefined;
};
exports.getExplorerSlugFromUrl = getExplorerSlugFromUrl;
//# sourceMappingURL=ExplorerUrlMigrationUtils.js.map