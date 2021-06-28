declare type CellFormatter = (str: string, rowIndex: number, colIndex: number) => any;
export interface AlignedTextTableOptions {
    alignRight?: boolean;
    maxCharactersPerColumn?: number;
    maxCharactersPerLine?: number;
}
export declare const toAlignedTextTable: (headerSlugs: string[], rows: any[], options?: AlignedTextTableOptions) => string;
export declare const toMarkdownTable: (slugs: string[], rows: any[], formatFn?: CellFormatter | undefined) => string;
export declare const toDelimited: (delimiter: string, columnSlugs: string[], rows: any[], cellFn?: CellFormatter | undefined, rowDelimiter?: string) => string;
export {};
//# sourceMappingURL=CoreTablePrinters.d.ts.map