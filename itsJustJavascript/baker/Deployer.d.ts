import { DeployTarget } from "./DeployTarget";
interface DeployerOptions {
    owidGrapherRootDir: string;
    userRunningTheDeploy: string;
    target: DeployTarget;
    skipChecks?: boolean;
    runChecksRemotely?: boolean;
}
export declare class Deployer {
    private options;
    private progressBar;
    private stream;
    constructor(options: DeployerOptions);
    private runAndTick;
    private get isValidTarget();
    get targetIsProd(): boolean;
    private get targetIpAddress();
    private runPreDeployChecksRemotely;
    private runLiveSafetyChecks;
    private _simpleGit?;
    private get simpleGit();
    private get pathsOnTarget();
    private get sshHost();
    private writeHeadDotText;
    deploy(): Promise<void>;
    private generateShellScriptsAndRunThemOnServer;
    printAndExit(message: string): void;
    private ensureTmpDirExistsOnServer;
    private copyLocalRepoToServerTmpDirectory;
    private runAndStreamScriptOnRemoteServerViaSSH;
}
export {};
//# sourceMappingURL=Deployer.d.ts.map