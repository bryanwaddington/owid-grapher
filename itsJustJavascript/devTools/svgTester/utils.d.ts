/// <reference types="node" />
import * as stream from "stream";
import { ChartTypeName } from "../../grapher/core/GrapherConstants";
import { GrapherInterface } from "../../grapher/core/GrapherInterface";
export declare const SVG_CSV_HEADER = "grapherId,slug,chartType,md5,svgFilename";
export declare const finished: typeof stream.finished.__promisify__;
export interface ResultOk<T> {
    kind: "ok";
    value: T;
}
export interface ResultError<E> {
    kind: "error";
    error: E;
}
export declare type Result<T, E> = ResultOk<T> | ResultError<E>;
export declare type SvgRecord = {
    chartId: number;
    slug: string;
    chartType: ChartTypeName | undefined;
    md5: string;
    svgFilename: string;
};
export interface SvgDifference {
    chartId: number;
    startIndex: number;
    referenceSvgFragment: string;
    newSvgFragment: string;
}
export declare function logIfVerbose(verbose: boolean, message: string, param?: any): void;
export declare function verifySvg(newSvg: string, newSvgRecord: SvgRecord, referenceSvgRecord: SvgRecord, referenceSvgsPath: string, verbose: boolean): Promise<Result<null, SvgDifference>>;
export declare function decideDirectoriesToVerify(grapherIds: number[], inDir: string, reverseDirectories: boolean, numPartitions?: number, partition?: number): Promise<string[]>;
export declare function sortAndPartitionDirectories(directories: string[], reverseDirectories: boolean, inDir: string, numPartitions: number, partition: number): string[];
/** Turn a list of comma separated numbers and ranges into an array of numbers */
export declare function getGrapherIdListFromString(rawGrapherIds: string): number[];
export declare function writeToGzippedFile(data: unknown, filename: string): Promise<void>;
export declare function saveGrapherSchemaAndData(config: GrapherInterface, outDir: string): Promise<void>;
export declare function renderSvg(dir: string): Promise<[string, SvgRecord]>;
/** Remove all non-deterministic parts of the svg and then calculate an md5 hash */
export declare function processSvgAndCalculateHash(svg: string): string;
export declare function renderSvgAndSave(dir: string, outDir: string): Promise<SvgRecord>;
export declare function readGzippedJsonFile(filename: string): Promise<unknown>;
export declare function loadReferenceSvg(referenceDir: string, referenceSvgRecord: SvgRecord): Promise<string>;
export declare function loadGrapherConfigAndData(inputDir: string): Promise<[GrapherInterface, unknown]>;
export declare function logDifferencesToConsole(svgRecord: SvgRecord, validationResult: ResultError<SvgDifference>): void;
export declare function getReferenceCsvContentMap(referenceDir: string): Promise<Map<number, SvgRecord>>;
export declare function writeResultsCsvFile(outDir: string, svgRecords: SvgRecord[]): Promise<void>;
export interface RenderJobDescription {
    dir: string;
    referenceEntry: SvgRecord;
    referenceDir: string;
    outDir: string;
    verbose: boolean;
}
export declare function renderAndVerifySvg({ dir, referenceEntry, referenceDir, outDir, verbose, }: RenderJobDescription): Promise<Result<null, SvgDifference>>;
export declare function prepareVerifyRun(rawGrapherIds: string, inDir: string, reverseDirectories: boolean, referenceDir: string): Promise<{
    directoriesToProcess: string[];
    csvContentMap: Map<number, SvgRecord>;
}>;
export declare function displayVerifyResultsAndGetExitCode(validationResults: Result<null, SvgDifference>[], verbose: boolean, directoriesToProcess: string[]): number;
//# sourceMappingURL=utils.d.ts.map