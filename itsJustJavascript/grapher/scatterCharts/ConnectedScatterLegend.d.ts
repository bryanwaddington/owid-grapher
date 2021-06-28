import * as React from "react";
import { TextWrap } from "../text/TextWrap";
export interface ConnectedScatterLegendManager {
    sidebarWidth: number;
    displayStartTime: string;
    displayEndTime: string;
    fontSize?: number;
    compareEndPointsOnly?: boolean;
}
export declare class ConnectedScatterLegend {
    manager: ConnectedScatterLegendManager;
    constructor(manager: ConnectedScatterLegendManager);
    get fontSize(): number;
    get fontColor(): string;
    get maxLabelWidth(): number;
    get startLabel(): TextWrap;
    get endLabel(): TextWrap;
    get width(): number;
    get height(): number;
    render(targetX: number, targetY: number, renderOptions?: React.SVGAttributes<SVGGElement>): JSX.Element;
}
//# sourceMappingURL=ConnectedScatterLegend.d.ts.map