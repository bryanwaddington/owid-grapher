import * as React from "react";
import { Color } from "../../coreTable/CoreTableConstants";
export interface VerticalColorLegendManager {
    maxLegendWidth?: number;
    fontSize?: number;
    legendItems: LegendItem[];
    title?: string;
    onLegendMouseOver?: (color: string) => void;
    onLegendClick?: (color: string) => void;
    onLegendMouseLeave?: () => void;
    legendX?: number;
    legendY?: number;
    activeColors: Color[];
    focusColors?: Color[];
}
interface LegendItem {
    label?: string;
    minText?: string;
    maxText?: string;
    color: Color;
}
export declare class VerticalColorLegend extends React.Component<{
    manager: VerticalColorLegendManager;
}> {
    get manager(): VerticalColorLegendManager;
    private get maxLegendWidth();
    private get fontSize();
    private get rectSize();
    private rectPadding;
    private lineHeight;
    private get title();
    private get titleHeight();
    private get series();
    get width(): number;
    get height(): number;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=VerticalColorLegend.d.ts.map