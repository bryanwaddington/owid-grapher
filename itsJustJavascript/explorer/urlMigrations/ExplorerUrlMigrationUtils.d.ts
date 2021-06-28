import { QueryParams } from "../../clientUtils/urls/UrlUtils";
import { Url } from "../../clientUtils/urls/Url";
export declare const decodeURIComponentOrUndefined: (value: string | undefined) => string | undefined;
export declare type QueryParamTransformMap = Record<string, {
    newName?: string;
    transformValue: (value: string | undefined) => string | undefined;
}>;
export declare const transformQueryParams: (oldQueryParams: Readonly<QueryParams>, transformMap: QueryParamTransformMap) => QueryParams;
export declare const getExplorerSlugFromUrl: (url: Url) => string | undefined;
//# sourceMappingURL=ExplorerUrlMigrationUtils.d.ts.map