"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performUrlMigrations = void 0;
const performUrlMigrations = (migrations, url) => {
    return migrations.reduce((url, migration) => migration(url), url);
};
exports.performUrlMigrations = performUrlMigrations;
//# sourceMappingURL=UrlMigration.js.map