import sharp from "sharp";
import { GrapherInterface } from "../grapher/core/GrapherInterface";
import { Grapher } from "../grapher/core/Grapher";
export declare function bakeGraphersToPngs(outDir: string, jsonConfig: GrapherInterface, vardata: any, optimizeSvgs?: boolean): Promise<[void, sharp.OutputInfo]>;
export declare function getGraphersAndRedirectsBySlug(): Promise<Map<string, GrapherInterface>>;
export declare function getPublishedGraphersBySlug(includePrivate?: boolean): Promise<{
    graphersBySlug: Map<string, GrapherInterface>;
    graphersById: Map<number, GrapherInterface>;
}>;
export declare function bakeGrapherToSvg(jsonConfig: GrapherInterface, outDir: string, slug: string, queryStr?: string, optimizeSvgs?: boolean, overwriteExisting?: boolean, verbose?: boolean): Promise<string | undefined>;
export declare function initGrapherForSvgExport(jsonConfig: GrapherInterface, queryStr?: string): Grapher;
export declare function buildSvgOutFilename(slug: string, version: number | undefined, width: number, height: number, queryStr?: string): string;
export declare function buildSvgOutFilepath(slug: string, outDir: string, version: number | undefined, width: number, height: number, verbose: boolean, queryStr?: string): string;
export declare function bakeGraphersToSvgs(grapherUrls: string[], outDir: string, optimizeSvgs?: boolean): Promise<(string | undefined)[]>;
export declare function grapherToSVG(jsonConfig: GrapherInterface, vardata: any): Promise<string>;
//# sourceMappingURL=GrapherImageBaker.d.ts.map