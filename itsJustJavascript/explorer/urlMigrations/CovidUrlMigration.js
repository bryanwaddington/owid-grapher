"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.covidUrlMigration = void 0;
const ExplorerUrlMigrationUtils_1 = require("./ExplorerUrlMigrationUtils");
const EXPLORER_SLUG = "coronavirus-data-explorer";
const transformMap = {
    Metric: {
        transformValue: (value) => {
            // Since we introduced multiple vaccinations metrics, we want to
            // differentiate between them.
            // And while we're there, reduce the length of "Tests per confirmed
            // case", because it wraps to 2 lines.
            //
            // -@danielgavrilov, 2021-03-30
            //
            if (value === "Vaccinations")
                return "Vaccine doses";
            if (value === "Tests per confirmed case")
                return "Tests per case";
            return value;
        },
    },
};
const covidUrlMigration = (url) => {
    // if it's not the /explorer/energy path, skip it
    const explorerSlug = ExplorerUrlMigrationUtils_1.getExplorerSlugFromUrl(url);
    if (explorerSlug !== EXPLORER_SLUG)
        return url;
    return url.setQueryParams(ExplorerUrlMigrationUtils_1.transformQueryParams(url.queryParams, transformMap));
};
exports.covidUrlMigration = covidUrlMigration;
//# sourceMappingURL=CovidUrlMigration.js.map