import { QueryParams } from "./UrlUtils";
interface UrlProps {
    readonly origin?: string;
    readonly pathname?: string;
    readonly queryStr?: string;
    readonly hash?: string;
}
export declare class Url {
    private props;
    /**
     * @param url Absolute or relative URL
     */
    static fromURL(url: string): Url;
    static fromQueryStr(queryStr: string): Url;
    static fromQueryParams(queryParams: QueryParams): Url;
    private constructor();
    get origin(): string | undefined;
    get pathname(): string | undefined;
    get originAndPath(): string | undefined;
    get queryStr(): string;
    get hash(): string;
    get fullUrl(): string;
    get queryParams(): QueryParams;
    get encodedQueryParams(): QueryParams;
    update(props: UrlProps): Url;
    setQueryParams(queryParams: QueryParams): Url;
    updateQueryParams(queryParams: QueryParams): Url;
}
export declare const setWindowUrl: (url: Url) => void;
export declare const getWindowUrl: () => Url;
export {};
//# sourceMappingURL=Url.d.ts.map