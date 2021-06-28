import React from "react";
import { OwidTable } from "../../coreTable/OwidTable";
interface SpreadsheetManager {
    table: OwidTable;
}
export declare class Spreadsheet extends React.Component<{
    manager: SpreadsheetManager;
}> {
    private hotTableComponent;
    private updateFromHot;
    private isChanged;
    componentDidMount(): void;
    private get manager();
    private _version;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Spreadsheet.d.ts.map