/// <reference types="node" />
import express from "express";
import "reflect-metadata";
import * as http from "http";
interface OwidAdminAppOptions {
    slackErrorsWebHookUrl?: string;
    gitCmsDir: string;
    isDev: boolean;
    quiet?: boolean;
}
export declare class OwidAdminApp {
    constructor(options: OwidAdminAppOptions);
    app: import("express-serve-static-core").Express;
    private options;
    private getGitCmsBranchName;
    private gitCmsBranchName;
    server?: http.Server;
    stopListening(): Promise<void>;
    startListening(adminServerPort: number, adminServerHost: string): Promise<void>;
    private listenPromise;
    errorHandler: (err: any, req: any, res: express.Response) => Promise<void>;
    connectToDatabases: () => Promise<void>;
}
export {};
//# sourceMappingURL=app.d.ts.map