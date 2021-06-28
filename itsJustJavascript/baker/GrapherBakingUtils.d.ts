interface ChartExportMeta {
    key: string;
    svgUrl: string;
    version: number;
    width: number;
    height: number;
}
export declare const grapherUrlToSlugAndQueryStr: (grapherUrl: string) => {
    slug: string;
    queryStr: string;
};
export declare const grapherSlugToExportFileKey: (slug: string, queryStr: string | undefined) => string;
export interface GrapherExports {
    get: (grapherUrl: string) => ChartExportMeta | undefined;
}
export declare const bakeGrapherUrls: (urls: string[]) => Promise<void>;
export declare const getGrapherExportsByUrl: () => Promise<GrapherExports>;
export {};
//# sourceMappingURL=GrapherBakingUtils.d.ts.map