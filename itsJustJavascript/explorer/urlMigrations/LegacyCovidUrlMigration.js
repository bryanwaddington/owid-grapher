"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyCovidMigrationSpec = void 0;
const Util_1 = require("../../clientUtils/Util");
const GrapherUrlMigrations_1 = require("../../grapher/core/GrapherUrlMigrations");
const Url_1 = require("../../clientUtils/urls/Url");
const ExplorerConstants_1 = require("../ExplorerConstants");
const covidMetricFromLegacyQueryParams = (queryParams) => {
    if (queryParams.casesMetric) {
        return "Confirmed cases";
    }
    else if (queryParams.deathsMetric) {
        return "Confirmed deaths";
    }
    else if (queryParams.cfrMetric) {
        return "Case fatality rate";
    }
    else if (queryParams.testsMetric) {
        return "Tests";
    }
    else if (queryParams.testsPerCaseMetric) {
        return "Tests per confirmed case";
    }
    else if (queryParams.positiveTestRate) {
        return "Share of positive tests";
    }
    else if (queryParams.vaccinationsMetric) {
        return "Vaccinations";
    }
    return undefined;
};
const legacyIntervalToNewValue = {
    daily: "New per day",
    weekly: "Weekly",
    total: "Cumulative",
    smoothed: "7-day rolling average",
    biweekly: "Biweekly",
    weeklyChange: "Weekly change",
    biweeklyChange: "Biweekly change",
};
const covidIntervalFromLegacyQueryParams = (queryParams) => {
    let legacyInterval = undefined;
    // Early on, the query string was a few booleans like dailyFreq=true.
    // Now it is a single 'interval'. This transformation is for backward compat.
    if (queryParams.interval) {
        legacyInterval = queryParams.interval;
    }
    else if (queryParams.totalFreq) {
        legacyInterval = "total";
    }
    else if (queryParams.dailyFreq) {
        legacyInterval = "daily";
    }
    else if (queryParams.smoothing) {
        legacyInterval = "smoothed";
    }
    if (legacyInterval) {
        return legacyIntervalToNewValue[legacyInterval];
    }
    return undefined;
};
const boolParamToString = (bool) => bool ? "true" : "false";
const legacyToCurrentCovidQueryParams = (queryParams, baseQueryParams = {}) => {
    var _a, _b;
    const restQueryParams = Util_1.omit(Object.assign(Object.assign({}, baseQueryParams), queryParams), "casesMetric", "deathsMetric", "cfrMetric", "testsMetric", "testsPerCaseMetric", "positiveTestRate", "vaccinationsMetric", "interval", "smoothing", "totalFreq", "dailyFreq", "aligned", "perCapita");
    const urlContainsMetric = !!covidMetricFromLegacyQueryParams(queryParams);
    const explorerQueryParams = {
        Metric: (_a = covidMetricFromLegacyQueryParams(queryParams)) !== null && _a !== void 0 ? _a : covidMetricFromLegacyQueryParams(baseQueryParams),
        Interval: (_b = covidIntervalFromLegacyQueryParams(queryParams)) !== null && _b !== void 0 ? _b : covidIntervalFromLegacyQueryParams(baseQueryParams),
        "Align outbreaks": urlContainsMetric
            ? boolParamToString(queryParams.aligned)
            : boolParamToString(baseQueryParams.aligned),
        "Relative to Population": urlContainsMetric
            ? boolParamToString(queryParams.perCapita)
            : boolParamToString(baseQueryParams.perCapita),
    };
    return Object.assign(Object.assign({}, restQueryParams), explorerQueryParams);
};
exports.legacyCovidMigrationSpec = {
    explorerSlug: "coronavirus-data-explorer",
    migrateUrl: (url, baseQueryStr) => {
        // Migrate the Grapher query params in both URLs
        const [explorerUrl, baseUrl] = [
            url,
            Url_1.Url.fromQueryStr(baseQueryStr),
        ].map(GrapherUrlMigrations_1.legacyToCurrentGrapherUrl);
        return explorerUrl
            .setQueryParams(legacyToCurrentCovidQueryParams(explorerUrl.queryParams, baseUrl.queryParams))
            .update({
            pathname: `/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/coronavirus-data-explorer`,
        });
    },
};
//# sourceMappingURL=LegacyCovidUrlMigration.js.map