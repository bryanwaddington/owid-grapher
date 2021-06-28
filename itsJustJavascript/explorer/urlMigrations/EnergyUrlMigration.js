"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.energyUrlMigration = void 0;
const GrapherUrlMigrations_1 = require("../../grapher/core/GrapherUrlMigrations");
const ExplorerUrlMigrationUtils_1 = require("./ExplorerUrlMigrationUtils");
const EXPLORER_SLUG = "energy";
const energyQueryParamTransformMap = {
    "Total or Breakdown ": {
        newName: "Total or Breakdown",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
    "Select a source ": {
        newName: "Select a source",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
    "Energy or Electricity ": {
        newName: "Energy or Electricity",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
    "Metric ": {
        newName: "Metric",
        transformValue: ExplorerUrlMigrationUtils_1.decodeURIComponentOrUndefined,
    },
};
const energyUrlMigration = (url) => {
    // if it's not the /explorer/energy path, skip it
    const explorerSlug = ExplorerUrlMigrationUtils_1.getExplorerSlugFromUrl(url);
    if (explorerSlug !== EXPLORER_SLUG)
        return url;
    url = GrapherUrlMigrations_1.legacyToCurrentGrapherUrl(url);
    const queryParams = ExplorerUrlMigrationUtils_1.transformQueryParams(url.queryParams, energyQueryParamTransformMap);
    return url.setQueryParams(queryParams);
};
exports.energyUrlMigration = energyUrlMigration;
//# sourceMappingURL=EnergyUrlMigration.js.map