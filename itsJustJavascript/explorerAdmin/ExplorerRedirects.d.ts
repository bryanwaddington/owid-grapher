import { CoreTable } from "../coreTable/CoreTable";
import { ExplorerUrlMigrationId } from "../explorer/urlMigrations/ExplorerUrlMigrations";
interface RedirectRow {
    migrationId: ExplorerUrlMigrationId;
    path: string;
    baseQueryStr: string;
}
export declare const explorerRedirectTable: CoreTable<RedirectRow, import("../coreTable/CoreColumnDef").CoreColumnDef>;
export declare const getExplorerRedirectForPath: (path: string) => RedirectRow | undefined;
export declare const isPathRedirectedToExplorer: (path: string) => boolean;
export {};
//# sourceMappingURL=ExplorerRedirects.d.ts.map