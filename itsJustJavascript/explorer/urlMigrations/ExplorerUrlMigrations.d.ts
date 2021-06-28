import { Url } from "../../clientUtils/urls/Url";
import { UrlMigration } from "../../clientUtils/urls/UrlMigration";
export declare enum ExplorerUrlMigrationId {
    legacyToGridCovidExplorer = "legacyToGridCovidExplorer"
}
export interface ExplorerUrlMigrationSpec {
    explorerSlug: string;
    migrateUrl: (url: Url, baseQueryStr: string) => Url;
}
export declare const explorerUrlMigrationsById: Record<ExplorerUrlMigrationId, ExplorerUrlMigrationSpec>;
export declare const migrateExplorerUrl: UrlMigration;
//# sourceMappingURL=ExplorerUrlMigrations.d.ts.map