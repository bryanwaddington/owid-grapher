import { GitCommit, SubNavId } from "../clientUtils/owidTypes";
import { ExplorerChoiceParams } from "./ExplorerConstants";
import { CoreMatrix, TableSlug } from "../coreTable/CoreTableConstants";
import { Grammar } from "../gridLang/GridLangConstants";
import { OwidTable } from "../coreTable/OwidTable";
import { GridProgram } from "../gridLang/GridProgram";
import { SerializedGridProgram } from "../clientUtils/owidTypes";
import { GrapherInterface } from "../grapher/core/GrapherInterface";
import { DecisionMatrix } from "./ExplorerDecisionMatrix";
import { CoreColumnDef } from "../coreTable/CoreColumnDef";
import { FacetAxisRange } from "../grapher/core/GrapherConstants";
export declare const EXPLORER_FILE_SUFFIX = ".explorer.tsv";
export interface TableDef {
    url?: string;
    columnDefinitions?: CoreColumnDef[];
    inlineData?: string;
}
interface ExplorerGrapherInterface extends GrapherInterface {
    grapherId?: number;
    tableSlug?: string;
    yScaleToggle?: boolean;
    yAxisMin?: number;
    facetYRange?: FacetAxisRange;
}
export declare class ExplorerProgram extends GridProgram {
    constructor(slug: string, tsv: string, lastCommit?: GitCommit);
    decisionMatrix: DecisionMatrix;
    static fromJson(json: SerializedGridProgram): ExplorerProgram;
    get clone(): ExplorerProgram;
    get isNewFile(): boolean;
    get filename(): string;
    initDecisionMatrix(choiceParams: ExplorerChoiceParams): this;
    get fullPath(): string;
    get currentlySelectedGrapherRow(): any;
    static fromMatrix(slug: string, matrix: CoreMatrix): ExplorerProgram;
    get explorerTitle(): string | undefined;
    get title(): string | undefined;
    get subNavId(): SubNavId | undefined;
    get googleSheet(): string | undefined;
    get hideAlertBanner(): boolean;
    get subNavCurrentId(): string | undefined;
    get thumbnail(): string | undefined;
    get explorerSubtitle(): string | undefined;
    get entityType(): string | undefined;
    get selection(): string[] | undefined;
    get pickerColumnSlugs(): string[] | undefined;
    get hideControls(): string | undefined;
    get downloadDataLink(): string | undefined;
    get isPublished(): boolean;
    setPublished(value: boolean): ExplorerProgram;
    get wpBlockId(): number | undefined;
    get decisionMatrixCode(): string | undefined;
    get grapherCount(): number;
    get tableCount(): number;
    get inlineTableCount(): number;
    get tableSlugs(): (TableSlug | undefined)[];
    get columnDefsByTableSlug(): Map<TableSlug | undefined, CoreColumnDef[]>;
    replaceTableWithInlineDataAndAutofilledColumnDefsCommand(tableSlug?: string): Promise<ExplorerProgram>;
    autofillMissingColumnDefinitionsForTableCommand(tableSlug?: string): Promise<ExplorerProgram>;
    get grapherConfig(): ExplorerGrapherInterface;
    /**
     * A static method so that all explorers on the page share requests,
     * and no duplicate requests are sent.
     */
    private static tableDataLoader;
    constructTable(tableSlug?: TableSlug): Promise<OwidTable>;
    getTableDef(tableSlug?: TableSlug): TableDef | undefined;
}
export declare const makeFullPath: (slug: string) => string;
export declare const trimAndParseObject: (config: any, grammar: Grammar) => any;
export {};
//# sourceMappingURL=ExplorerProgram.d.ts.map