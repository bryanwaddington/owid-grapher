import { WriteRequest, ReadRequest, GitCmsResponse, GitCmsReadResponse, DeleteRequest, GitPullResponse, GlobRequest, GitCmsGlobResponse } from "./GitCmsConstants";
export declare class GitCmsClient {
    private basePath;
    constructor(basePath: string);
    pullFromGithub(): Promise<GitPullResponse>;
    readRemoteFiles(request: GlobRequest): Promise<GitCmsGlobResponse>;
    private post;
    deleteRemoteFile(request: DeleteRequest): Promise<GitCmsResponse>;
    readRemoteFile(request: ReadRequest): Promise<GitCmsReadResponse>;
    writeRemoteFile(request: WriteRequest): Promise<GitCmsResponse>;
}
//# sourceMappingURL=GitCmsClient.d.ts.map