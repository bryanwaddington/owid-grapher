import { FacetAxisRange, ScaleType } from "../core/GrapherConstants";
import { HorizontalAxis, VerticalAxis } from "./Axis";
import { Persistable } from "../persistable/Persistable";
import { AxisConfigInterface } from "./AxisConfigInterface";
import { ScaleSelectorManager } from "../controls/ScaleSelector";
export interface FontSizeManager {
    fontSize: number;
}
declare class AxisConfigDefaults {
    min?: number;
    max?: number;
    scaleType?: ScaleType;
    canChangeScaleType?: boolean;
    label: string;
    removePointsOutsideDomain?: boolean;
    facetAxisRange: FacetAxisRange;
}
export declare class AxisConfig extends AxisConfigDefaults implements AxisConfigInterface, Persistable, ScaleSelectorManager {
    constructor(props?: AxisConfigInterface, fontSizeManager?: FontSizeManager);
    private fontSizeManager?;
    hideAxis: boolean;
    updateFromObject(props?: AxisConfigInterface): void;
    toObject(): AxisConfigInterface;
    get fontSize(): number;
    private get constrainedMin();
    shouldRemovePoint(value: number): boolean;
    private get constrainedMax();
    get domain(): [number, number];
    toHorizontalAxis(): HorizontalAxis;
    toVerticalAxis(): VerticalAxis;
}
export {};
//# sourceMappingURL=AxisConfig.d.ts.map