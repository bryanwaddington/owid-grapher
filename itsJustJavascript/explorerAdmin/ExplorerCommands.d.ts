import { ExplorerProgram } from "../explorer/ExplorerProgram";
import { CellPosition } from "../gridLang/GridLangConstants";
import Handsontable from "handsontable";
declare abstract class HotCommand {
    protected program: ExplorerProgram;
    protected setProgramCallback?: (newProgram: string) => void;
    constructor(program: ExplorerProgram, setProgramCallback?: (newProgram: string) => void);
    abstract name(hot: Handsontable): string;
    abstract callback(hot: Handsontable): void;
    abstract disabled(hot: Handsontable): boolean;
    abstract hidden(hot: Handsontable): boolean;
    protected selectedPosition(hot: Handsontable): CellPosition | undefined;
    protected cell(hot: Handsontable): import("../gridLang/GridLangConstants").ParsedCell | undefined;
    protected searchResults(hot: Handsontable): CellPosition[];
    toHotCommand(): Handsontable.contextMenu.MenuItemConfig;
}
export declare class SelectAllHitsCommand extends HotCommand {
    name(hot: Handsontable): string;
    callback(hot: Handsontable): void;
    hidden(): boolean;
    disabled(hot: Handsontable): boolean;
}
export declare class AutofillColDefCommand extends HotCommand {
    name(): string;
    commandName: keyof ExplorerProgram;
    callback(hot: Handsontable): Promise<void>;
    disabled(): boolean;
    hidden(hot: Handsontable): boolean;
}
export declare class InlineDataCommand extends AutofillColDefCommand {
    name(): string;
    commandName: keyof ExplorerProgram;
}
export {};
//# sourceMappingURL=ExplorerCommands.d.ts.map