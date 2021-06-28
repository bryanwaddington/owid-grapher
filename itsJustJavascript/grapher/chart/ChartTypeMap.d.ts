import { ChartTypeName } from "../core/GrapherConstants";
import { ChartInterface } from "./ChartInterface";
import { ChartManager } from "./ChartManager";
import { ComponentClass, Component } from "react";
import { Bounds } from "../../clientUtils/Bounds";
interface ChartComponentProps {
    manager: ChartManager;
    bounds?: Bounds;
    containerElement?: any;
}
interface ChartComponentClass extends ComponentClass<ChartComponentProps> {
    new (props: ChartComponentProps): Component & ChartInterface;
}
export declare const ChartComponentClassMap: Map<ChartTypeName, ChartComponentClass>;
export declare const DefaultChartClass: ChartComponentClass;
export {};
//# sourceMappingURL=ChartTypeMap.d.ts.map