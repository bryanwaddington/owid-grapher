import { CellPosition, CellDef, MatrixProgram, ParsedCell } from "./GridLangConstants";
export declare class GridCell implements ParsedCell {
    private position;
    private matrix;
    private rootDefinition;
    constructor(matrix: MatrixProgram, position: CellPosition, rootDefinition: CellDef);
    private get row();
    private get column();
    private get line();
    private get isCommentCell();
    private get cellTerminalTypeDefinition();
    private get parentSubTableInfo();
    private get subTableParseResults();
    /**
     * If a cell is:
     *  - to the right of the last filled cell in a line
     *  - and that line is indented to be part of a subtable, with options
     *  - and it is the first non-blank line in the subtabel
     *
     * Then consider is a "frontier cell"
     *
     */
    private isSubTableFrontierCell;
    private get isFirstCellOnFrontierRow();
    private get suggestions();
    private get definitionLinks();
    private get implementationLinks();
    get cellDef(): CellDef;
    get errorMessage(): string | undefined;
    get contents(): string | undefined;
    get comment(): string | undefined;
    get cssClasses(): string[];
    get placeholder(): string | undefined;
    get optionKeywords(): string[] | undefined;
}
//# sourceMappingURL=GridCell.d.ts.map