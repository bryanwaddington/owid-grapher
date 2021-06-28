export declare const GIT_CMS_DEFAULT_BRANCH = "master";
export declare const GIT_CMS_READ_ROUTE = "/git-cms-read";
export declare const GIT_CMS_WRITE_ROUTE = "/git-cms-write";
export declare const GIT_CMS_DELETE_ROUTE = "/git-cms-delete";
export declare const GIT_CMS_PULL_ROUTE = "/git-cms-pull";
export declare const GIT_CMS_GLOB_ROUTE = "/git-cms-glob";
export declare const GIT_CMS_DIR: string;
export declare const GIT_CMS_REPO_URL = "https://github.com/owid/owid-content";
export declare const GIT_CMS_BASE_ROUTE = "/admin/";
export interface GitCmsFile {
    filename: string;
    content: string;
}
export interface WriteRequest {
    filepath: string;
    content: string;
    commitMessage: string;
}
export interface ReadRequest {
    filepath: string;
}
export interface GlobRequest {
    folder: string;
    glob: string;
}
export interface DeleteRequest {
    filepath: string;
}
export interface GitCmsResponse {
    success: boolean;
    error?: any;
}
export interface GitCmsReadResponse extends GitCmsResponse {
    content: string;
}
export interface GitCmsGlobResponse extends GitCmsResponse {
    files: GitCmsFile[];
}
export interface GitPullResponse extends GitCmsResponse {
    stdout?: string;
}
//# sourceMappingURL=GitCmsConstants.d.ts.map