import { Router } from "express";
interface GitCmsServerOptions {
    baseDir: string;
    shouldAutoPush?: boolean;
}
export declare class GitCmsServer {
    private _options;
    verbose: boolean;
    constructor(options: GitCmsServerOptions);
    private get baseDir();
    private get options();
    private _git?;
    private get git();
    createDirAndInitIfNeeded(): Promise<this>;
    private commitFile;
    private autopush;
    private pullCommand;
    private readFileCommand;
    private globCommand;
    private deleteFileCommand;
    private writeFileCommand;
    addToRouter(app: Router): void;
}
export {};
//# sourceMappingURL=GitCmsServer.d.ts.map