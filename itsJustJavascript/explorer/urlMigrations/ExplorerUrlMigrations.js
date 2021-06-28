"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateExplorerUrl = exports.explorerUrlMigrationsById = exports.ExplorerUrlMigrationId = void 0;
const UrlMigration_1 = require("../../clientUtils/urls/UrlMigration");
const LegacyCovidUrlMigration_1 = require("./LegacyCovidUrlMigration");
const CO2UrlMigration_1 = require("./CO2UrlMigration");
const EnergyUrlMigration_1 = require("./EnergyUrlMigration");
const CovidUrlMigration_1 = require("./CovidUrlMigration");
var ExplorerUrlMigrationId;
(function (ExplorerUrlMigrationId) {
    ExplorerUrlMigrationId["legacyToGridCovidExplorer"] = "legacyToGridCovidExplorer";
})(ExplorerUrlMigrationId = exports.ExplorerUrlMigrationId || (exports.ExplorerUrlMigrationId = {}));
exports.explorerUrlMigrationsById = {
    legacyToGridCovidExplorer: LegacyCovidUrlMigration_1.legacyCovidMigrationSpec,
};
const explorerUrlMigrations = [
    // NOTE: The order of migrations matters!
    CO2UrlMigration_1.co2UrlMigration,
    EnergyUrlMigration_1.energyUrlMigration,
    CovidUrlMigration_1.covidUrlMigration,
];
const migrateExplorerUrl = (url) => {
    return UrlMigration_1.performUrlMigrations(explorerUrlMigrations, url);
};
exports.migrateExplorerUrl = migrateExplorerUrl;
//# sourceMappingURL=ExplorerUrlMigrations.js.map