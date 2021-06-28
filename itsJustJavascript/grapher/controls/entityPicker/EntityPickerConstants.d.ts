import { CoreColumnDef } from "../../../coreTable/CoreColumnDef";
import { ColumnSlug, SortOrder } from "../../../coreTable/CoreTableConstants";
import { OwidTable } from "../../../coreTable/OwidTable";
import { GrapherAnalytics } from "../../core/GrapherAnalytics";
import { SelectionArray } from "../../selection/SelectionArray";
export interface EntityPickerManager {
    entityPickerMetric?: ColumnSlug;
    entityPickerSort?: SortOrder;
    setEntityPicker?: (options: {
        metric?: string;
        sort?: SortOrder;
    }) => void;
    requiredColumnSlugs?: ColumnSlug[];
    entityPickerColumnDefs?: CoreColumnDef[];
    entityPickerTable?: OwidTable;
    entityPickerTableIsLoading?: boolean;
    grapherTable?: OwidTable;
    selection: SelectionArray;
    analytics?: GrapherAnalytics;
    analyticsNamespace?: string;
}
//# sourceMappingURL=EntityPickerConstants.d.ts.map