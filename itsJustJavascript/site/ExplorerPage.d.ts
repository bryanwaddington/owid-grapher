/// <reference types="react" />
import { ExplorerProgram } from "../explorer/ExplorerProgram";
import { GrapherInterface } from "../grapher/core/GrapherInterface";
import { ExplorerPageUrlMigrationSpec } from "../explorer/urlMigrations/ExplorerPageUrlMigrationSpec";
interface ExplorerPageSettings {
    program: ExplorerProgram;
    wpContent?: string;
    grapherConfigs: GrapherInterface[];
    baseUrl: string;
    urlMigrationSpec?: ExplorerPageUrlMigrationSpec;
}
export declare const ExplorerPage: (props: ExplorerPageSettings) => JSX.Element;
export {};
//# sourceMappingURL=ExplorerPage.d.ts.map