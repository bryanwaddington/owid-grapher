import ProgressBar = require("progress");
export declare class SiteBaker {
    private grapherExports;
    private bakedSiteDir;
    baseUrl: string;
    progressBar: ProgressBar;
    constructor(bakedSiteDir: string, baseUrl: string);
    private bakeEmbeds;
    private bakeCountryProfiles;
    private bakePost;
    private getPostSlugsToRemove;
    private bakePosts;
    private bakeSpecialPages;
    private bakeGoogleScholar;
    private bakeBlogIndex;
    private bakeRSS;
    private bakeAssets;
    bakeRedirects(): Promise<void>;
    bakeWordpressPages(): Promise<void>;
    private _bakeNonWordpressPages;
    bakeNonWordpressPages(): Promise<void>;
    bakeAll(): Promise<void>;
    ensureDir(relPath: string): Promise<void>;
    writeFile(relPath: string, content: string): Promise<void>;
    private stageWrite;
    private stage;
    private execAndLogAnyErrorsToSlack;
    deployToNetlifyAndPushToGitPush(commitMsg: string, authorEmail?: string, authorName?: string): Promise<void>;
    endDbConnections(): void;
    private flushCache;
}
//# sourceMappingURL=SiteBaker.d.ts.map