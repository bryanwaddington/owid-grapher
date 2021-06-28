import { DimensionProperty } from "../core/GrapherConstants";
import { OwidTable } from "../../coreTable/OwidTable";
import { LegacyChartDimensionInterface, LegacyVariableDisplayConfig } from "../core/LegacyVariableCode";
import { LegacyVariableId } from "../../clientUtils/owidTypes";
import { ColumnSlug, Time } from "../../coreTable/CoreTableConstants";
import { Persistable } from "../persistable/Persistable";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
declare class ChartDimensionDefaults implements LegacyChartDimensionInterface {
    property: DimensionProperty;
    variableId: LegacyVariableId;
    display: LegacyVariableDisplayConfig;
    targetYear?: Time;
}
export interface LegacyDimensionsManager {
    table: OwidTable;
}
export declare class ChartDimension extends ChartDimensionDefaults implements Persistable {
    private manager;
    constructor(obj: LegacyChartDimensionInterface, manager: LegacyDimensionsManager);
    private get table();
    updateFromObject(obj: LegacyChartDimensionInterface): void;
    toObject(): LegacyChartDimensionInterface;
    slug?: ColumnSlug;
    get column(): CoreColumn;
    get columnSlug(): string;
}
export {};
//# sourceMappingURL=ChartDimension.d.ts.map