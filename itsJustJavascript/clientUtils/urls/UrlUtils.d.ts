export interface QueryParams {
    [key: string]: string | undefined;
}
export declare const getQueryParams: (queryStr?: string | undefined) => QueryParams;
export declare const getWindowQueryParams: () => QueryParams;
/**
 * Converts a query string into an object of key-value pairs.
 * Handles URI-decoding of the values.
 * @param queryStr
 * @param doNotDecode Passing `true` will return a QueryParams object with URI-encoded values.
 *                    Only use when absolutely necessary, for example, to distinguish between
 *                    `+` and `%20` for legacy URLs.
 */
export declare const strToQueryParams: (queryStr?: string, doNotDecode?: boolean) => QueryParams;
/**
 * Converts an object to a query string.
 * Expects the input object to not be encoded already, and handles the URI-encoding of the values.
 */
export declare const queryParamsToStr: (params: QueryParams) => string;
export declare const getWindowQueryStr: () => string;
export declare const setWindowQueryStr: (str: string) => void;
//# sourceMappingURL=UrlUtils.d.ts.map