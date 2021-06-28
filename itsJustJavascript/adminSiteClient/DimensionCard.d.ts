import * as React from "react";
import { ChartDimension } from "../grapher/chart/ChartDimension";
import { ChartEditor } from "./ChartEditor";
import { OwidTable } from "../coreTable/OwidTable";
export declare class DimensionCard extends React.Component<{
    dimension: ChartDimension;
    editor: ChartEditor;
    onEdit?: () => void;
    onRemove?: () => void;
    onMouseEnter?: () => void;
    onMouseDown?: () => void;
}> {
    isExpanded: boolean;
    get table(): OwidTable;
    get hasExpandedOptions(): boolean;
    onToggleExpand(): void;
    onIsProjection(value: boolean): void;
    onColor(color: string | undefined): void;
    get color(): string | undefined;
    private get tableDisplaySettings();
    updateTables(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=DimensionCard.d.ts.map