import { Json } from "../clientUtils/Util";
declare type HTTPMethod = "GET" | "PUT" | "POST" | "DELETE";
interface ClientSettings {
    ENV: "development" | "production";
    GITHUB_USERNAME: string;
}
export declare class Admin {
    errorMessage?: {
        title: string;
        content: string;
        isFatal?: boolean;
    };
    basePath: string;
    username: string;
    isSuperuser: boolean;
    settings: ClientSettings;
    constructor(props: {
        username: string;
        isSuperuser: boolean;
        settings: ClientSettings;
    });
    currentRequests: Promise<Response>[];
    get showLoadingIndicator(): boolean;
    loadingIndicatorSetting: "loading" | "off" | "default";
    start(containerNode: HTMLElement, gitCmsBranchName: string): void;
    url(path: string): string;
    goto(path: string): void;
    rawRequest(path: string, data: string | File, method: HTTPMethod): Promise<Response>;
    requestJSON(path: string, data: Json | File, method: HTTPMethod, opts?: {
        onFailure?: "show" | "continue";
    }): Promise<Json>;
    private setErrorMessage;
    private addRequest;
    private removeRequest;
    getJSON(path: string, params?: Json): Promise<Json>;
}
export {};
//# sourceMappingURL=Admin.d.ts.map