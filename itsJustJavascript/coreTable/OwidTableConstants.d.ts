import { ColumnSlug, CoreRow, Integer, PrimitiveType, Time, Year } from "./CoreTableConstants";
import { ColumnTypeNames, CoreColumnDef } from "./CoreColumnDef";
import { OwidSource } from "./OwidSource";
export declare enum OwidTableSlugs {
    entityName = "entityName",
    entityColor = "entityColor",
    entityId = "entityId",
    entityCode = "entityCode",
    time = "time",
    day = "day",
    year = "year",
    date = "date"
}
declare enum OwidTableNames {
    Entity = "Entity",
    Code = "Code"
}
export declare type EntityName = string;
export declare type EntityCode = string;
export declare type EntityId = number;
export interface OwidColumnDef extends CoreColumnDef {
    owidVariableId?: number;
    coverage?: string;
    datasetId?: string;
    datasetName?: string;
    source?: OwidSource;
    isDailyMeasurement?: boolean;
    annotationsColumnSlug?: ColumnSlug;
}
export declare const OwidEntityNameColumnDef: {
    name: OwidTableNames;
    slug: OwidTableSlugs;
    type: ColumnTypeNames;
};
export declare const OwidEntityIdColumnDef: {
    slug: OwidTableSlugs;
    type: ColumnTypeNames;
};
export declare const OwidEntityCodeColumnDef: {
    name: OwidTableNames;
    slug: OwidTableSlugs;
    type: ColumnTypeNames;
};
export declare const StandardOwidColumnDefs: OwidColumnDef[];
export interface OwidRow extends CoreRow {
    entityName: EntityName;
    time: Time;
    entityCode?: EntityCode;
    entityId?: EntityId;
    year?: Year;
    day?: Integer;
    date?: string;
}
export interface LegacyOwidRow<ValueType extends PrimitiveType> {
    entityName: EntityName;
    time: Time;
    value: ValueType;
}
export {};
//# sourceMappingURL=OwidTableConstants.d.ts.map