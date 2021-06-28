import { MapProjectionName } from "./MapProjections";
import { ColorScaleConfig } from "../color/ColorScaleConfig";
import { ColumnSlug } from "../../coreTable/CoreTableConstants";
import { LegacyVariableId } from "../../clientUtils/owidTypes";
import { Persistable } from "../persistable/Persistable";
import { NoUndefinedValues } from "../../clientUtils/Util";
declare class MapConfigDefaults {
    columnSlug?: ColumnSlug;
    time?: number;
    timeTolerance?: number;
    hideTimeline?: boolean;
    projection: MapProjectionName;
    colorScale: ColorScaleConfig;
    tooltipUseCustomLabels?: boolean;
}
export declare type MapConfigInterface = MapConfigDefaults;
interface MapConfigWithLegacyInterface extends MapConfigInterface {
    variableId?: LegacyVariableId;
    targetYear?: number;
}
export declare class MapConfig extends MapConfigDefaults implements Persistable {
    updateFromObject(obj: Partial<MapConfigWithLegacyInterface>): void;
    toObject(): NoUndefinedValues<MapConfigWithLegacyInterface>;
    constructor(obj?: Partial<MapConfigWithLegacyInterface>);
}
export {};
//# sourceMappingURL=MapConfig.d.ts.map