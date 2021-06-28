/// <reference types="node" />
import { ReadStream } from "fs";
export declare const parseCSV: (csv: string) => Promise<string[][]>;
export declare class CSVStreamParser {
    private parser;
    private error;
    private isEnded;
    private isReadable;
    private rowResolve?;
    private rowReject?;
    constructor(input: ReadStream);
    private update;
    nextRow(): Promise<string[] | undefined>;
}
//# sourceMappingURL=csv.d.ts.map