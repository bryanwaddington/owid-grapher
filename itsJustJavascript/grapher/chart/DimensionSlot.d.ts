import { Grapher } from "../core/Grapher";
import { DimensionProperty } from "../core/GrapherConstants";
import { ChartDimension } from "./ChartDimension";
export declare class DimensionSlot {
    private grapher;
    property: DimensionProperty;
    constructor(grapher: Grapher, property: DimensionProperty);
    get name(): string;
    get allowMultiple(): boolean;
    get isOptional(): boolean;
    get dimensions(): ChartDimension[];
    get dimensionsOrderedAsInPersistedSelection(): ChartDimension[];
}
//# sourceMappingURL=DimensionSlot.d.ts.map