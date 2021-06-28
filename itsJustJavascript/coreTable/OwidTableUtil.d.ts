import { ColumnTypeNames, CoreColumnDef } from "./CoreColumnDef";
import { CoreTable } from "./CoreTable";
import { ColumnSlug } from "./CoreTableConstants";
import { OwidColumnDef, OwidTableSlugs } from "./OwidTableConstants";
export declare function timeColumnSlugFromColumnDef(def: OwidColumnDef): OwidTableSlugs.day | OwidTableSlugs.year;
export declare function makeOriginalTimeSlugFromColumnSlug(slug: ColumnSlug): string;
export declare function getOriginalTimeColumnSlug(table: CoreTable, slug: ColumnSlug): ColumnSlug;
export declare function toPercentageColumnDef(columnDef: CoreColumnDef, type?: ColumnTypeNames): CoreColumnDef;
//# sourceMappingURL=OwidTableUtil.d.ts.map