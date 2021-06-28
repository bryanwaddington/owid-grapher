import { Persistable } from "../persistable/Persistable";
import { ColumnSlug, Time } from "../../coreTable/CoreTableConstants";
import { DimensionProperty } from "../core/GrapherConstants";
import { OwidSource } from "../../coreTable/OwidSource";
import { LegacyVariableDataTableConfigInteface, LegacyVariableDisplayConfigInterface } from "../../clientUtils/LegacyVariableDisplayConfigInterface";
import { LegacyVariableId } from "../../clientUtils/owidTypes";
export interface LegacyChartDimensionInterface {
    property: DimensionProperty;
    targetYear?: Time;
    display?: LegacyVariableDisplayConfigInterface;
    variableId: LegacyVariableId;
    slug?: ColumnSlug;
}
declare class LegacyVariableDisplayConfigDefaults {
    name?: string;
    unit?: string;
    shortUnit?: string;
    isProjection?: boolean;
    conversionFactor?: number;
    numDecimalPlaces?: number;
    tolerance?: number;
    yearIsDay?: boolean;
    zeroDay?: string;
    entityAnnotationsMap?: string;
    includeInTable?: boolean | undefined;
    tableDisplay?: LegacyVariableDataTableConfigInteface;
    color?: string;
}
export declare class LegacyVariableDisplayConfig extends LegacyVariableDisplayConfigDefaults implements Persistable {
    updateFromObject(obj?: Partial<LegacyVariableDisplayConfigInterface>): void;
    toObject(): LegacyVariableDisplayConfigDefaults;
    constructor(obj?: Partial<LegacyVariableDisplayConfigInterface>);
}
export interface LegacyVariableConfig {
    id: number;
    name?: string;
    description?: string;
    unit?: string;
    display?: LegacyVariableDisplayConfigInterface;
    shortUnit?: string;
    datasetName?: string;
    datasetId?: string;
    coverage?: string;
    source?: OwidSource;
    years?: number[];
    entities?: number[];
    values?: (string | number)[];
}
export interface LegacyEntityMeta {
    id: number;
    name: string;
    code: string;
}
declare interface LegacyEntityKey {
    [id: string]: LegacyEntityMeta;
}
export interface LegacyVariablesAndEntityKey {
    variables: {
        [id: string]: LegacyVariableConfig;
    };
    entityKey: LegacyEntityKey;
}
export {};
//# sourceMappingURL=LegacyVariableCode.d.ts.map