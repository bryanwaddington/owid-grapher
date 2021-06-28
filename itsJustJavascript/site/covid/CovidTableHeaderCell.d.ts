import * as React from "react";
import { SortOrder } from "../../coreTable/CoreTableConstants";
import { CovidSortKey } from "./CovidTypes";
export interface CovidTableHeaderCellProps {
    children: React.ReactNode;
    className?: string;
    sortKey?: CovidSortKey;
    currentSortKey?: CovidSortKey;
    currentSortOrder?: SortOrder;
    colSpan?: number;
    onSort?: (key: CovidSortKey) => void;
}
export declare class CovidTableHeaderCell extends React.Component<CovidTableHeaderCellProps> {
    onClick(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=CovidTableHeaderCell.d.ts.map