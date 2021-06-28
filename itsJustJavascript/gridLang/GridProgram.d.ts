import { GitCommit, SerializedGridProgram } from "../clientUtils/owidTypes";
import { CellDef, CellPosition, ParsedCell } from "./GridLangConstants";
/**
 * Block location for the below would be like (numRows = 2)
 * table             |
 *  slug name        | startRow = 1
 *  pop Population   | endRow   = 2
 */
interface BlockLocation {
    startRow: number;
    endRow: number;
    numRows: number;
}
export declare class GridProgram {
    constructor(slug: string, tsv: string, lastCommit?: GitCommit, grammar?: CellDef);
    private grammar?;
    private static guids;
    guid: number;
    lastCommit?: GitCommit;
    slug: string;
    private nodeDelimiter;
    cellDelimiter: string;
    private edgeDelimiter;
    lines: string[];
    toJson(): SerializedGridProgram;
    findNext(position: CellPosition): CellPosition | undefined;
    findAll(position: CellPosition): CellPosition[];
    private ring;
    valuesFrom(position?: CellPosition): (string | undefined)[];
    get numRows(): number;
    patch(obj: any): this;
    grepFirst(key: string, position?: CellPosition): CellPosition | undefined;
    grep(key: string, position?: CellPosition): CellPosition[];
    /**
     * Returns all non-blocks as an object literal
     */
    get tuplesObject(): {
        [key: string]: any;
    };
    getLine(keyword: string): string | undefined;
    getLineValue(keyword: string): string | undefined;
    protected getBlockLocation(blockRowNumber: number): BlockLocation;
    protected getKeywordIndex(key: string): number;
    getCell(position: CellPosition): ParsedCell;
    getCellContents(position: CellPosition): string | undefined;
    private get matrix();
    deleteBlock(row?: number): this;
    deleteLine(row?: number): this;
    appendLine(line: string): this;
    setCell(row: number, col: number, value: string): this;
    setLineValue(key: string, value: string | undefined): this;
    getBlock(keywordIndex: number): string;
    updateBlock(rowNumber: number, value: string): this;
    protected appendBlock(key: string, value: string): void;
    getRowNumbersStartingWith(startsWith: string): number[];
    getRowMatchingWords(...words: (string | undefined)[]): number;
    get asArrays(): string[][];
    get width(): number;
    toString(): string;
    protected prettify(): string;
}
export {};
//# sourceMappingURL=GridProgram.d.ts.map