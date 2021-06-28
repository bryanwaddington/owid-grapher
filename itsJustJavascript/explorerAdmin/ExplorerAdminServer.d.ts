import { ExplorerProgram } from "../explorer/ExplorerProgram";
import { Router } from "express";
import { ExplorersRouteResponse } from "../explorer/ExplorerConstants";
import { ExplorerPageUrlMigrationSpec } from "../explorer/urlMigrations/ExplorerPageUrlMigrationSpec";
export declare class ExplorerAdminServer {
    constructor(gitDir: string, baseUrl: string);
    private baseUrl;
    private gitDir;
    private get absoluteFolderPath();
    private _simpleGit?;
    private get simpleGit();
    getAllExplorersCommand(): Promise<ExplorersRouteResponse>;
    addMockBakedSiteRoutes(app: Router): void;
    addAdminRoutes(app: Router): void;
    getExplorerFromFile(filename: string): Promise<ExplorerProgram>;
    getExplorerFromSlug(slug: string): Promise<ExplorerProgram>;
    renderExplorerPage(program: ExplorerProgram, urlMigrationSpec?: ExplorerPageUrlMigrationSpec): Promise<string>;
    bakeAllPublishedExplorers(outputFolder: string): Promise<void>;
    private getAllPublishedExplorers;
    private getAllExplorers;
    private write;
    private bakeExplorersToDir;
    bakeAllExplorerRedirects(outputFolder: string): Promise<void>;
}
//# sourceMappingURL=ExplorerAdminServer.d.ts.map