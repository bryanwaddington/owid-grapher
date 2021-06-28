"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.co2UrlMigration = void 0;
const GrapherUrlMigrations_1 = require("../../grapher/core/GrapherUrlMigrations");
const ExplorerUrlMigrationUtils_1 = require("./ExplorerUrlMigrationUtils");
const EXPLORER_SLUG = "co2";
const co2QueryParamTransformMap = {
    "Gas ": {
        newName: "Gas",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
    "Accounting ": {
        newName: "Accounting",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
    "Fuel ": {
        newName: "Fuel",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
    "Count ": {
        newName: "Count",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
    "Relative to world total ": {
        newName: "Relative to world total",
        transformValue: (value) => (value ? "true" : "false"),
    },
};
const co2UrlMigration = (url) => {
    // if it's not the /explorer/co2 path, skip it
    const explorerSlug = ExplorerUrlMigrationUtils_1.getExplorerSlugFromUrl(url);
    if (explorerSlug !== EXPLORER_SLUG)
        return url;
    url = GrapherUrlMigrations_1.legacyToCurrentGrapherUrl(url);
    const queryParams = ExplorerUrlMigrationUtils_1.transformQueryParams(url.queryParams, co2QueryParamTransformMap);
    return url.setQueryParams(queryParams);
};
exports.co2UrlMigration = co2UrlMigration;
//# sourceMappingURL=CO2UrlMigration.js.map