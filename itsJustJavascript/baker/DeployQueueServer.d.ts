import { Deploy, DeployChange } from "../clientUtils/owidTypes";
export declare class DeployQueueServer {
    constructor(queueFilePath?: string, pendingFilePath?: string);
    private queueFilePath;
    private pendingFilePath;
    private readQueuedFile;
    private readPendingFile;
    readQueuedAndPendingFiles(): Promise<string>;
    enqueueChange(item: DeployChange): Promise<void>;
    clearQueueFile(): Promise<void>;
    writePendingFile(content: string): Promise<void>;
    deletePendingFile(): Promise<void>;
    queueIsEmpty(): Promise<boolean>;
    parseQueueContent(content: string): DeployChange[];
    getDeploys(): Promise<Deploy[]>;
}
//# sourceMappingURL=DeployQueueServer.d.ts.map