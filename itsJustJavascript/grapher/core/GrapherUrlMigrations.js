"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyToCurrentGrapherQueryParams = exports.legacyToCurrentGrapherUrl = exports.grapherUrlMigrations = void 0;
const Url_1 = require("../../clientUtils/urls/Url");
const UrlMigration_1 = require("../../clientUtils/urls/UrlMigration");
const EntityUrlBuilder_1 = require("./EntityUrlBuilder");
exports.grapherUrlMigrations = [
    (url) => {
        const { year, time } = url.queryParams;
        if (!year)
            return url;
        return url.updateQueryParams({
            year: undefined,
            time: time !== null && time !== void 0 ? time : year,
        });
    },
    EntityUrlBuilder_1.migrateSelectedEntityNamesParam,
];
const legacyToCurrentGrapherUrl = (url) => UrlMigration_1.performUrlMigrations(exports.grapherUrlMigrations, url);
exports.legacyToCurrentGrapherUrl = legacyToCurrentGrapherUrl;
const legacyToCurrentGrapherQueryParams = (queryStr) => {
    const url = Url_1.Url.fromQueryStr(queryStr);
    return exports.legacyToCurrentGrapherUrl(url).queryParams;
};
exports.legacyToCurrentGrapherQueryParams = legacyToCurrentGrapherQueryParams;
//# sourceMappingURL=GrapherUrlMigrations.js.map