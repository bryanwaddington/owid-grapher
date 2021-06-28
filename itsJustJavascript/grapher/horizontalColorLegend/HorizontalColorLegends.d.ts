import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { ColorScaleBin, NumericBin, CategoricalBin } from "../color/ColorScaleBin";
import { Color } from "../../clientUtils/owidTypes";
interface PositionedBin {
    x: number;
    width: number;
    margin: number;
    bin: ColorScaleBin;
}
interface NumericLabel {
    text: string;
    fontSize: number;
    bounds: Bounds;
    priority?: boolean;
    hidden: boolean;
}
interface CategoricalMark {
    x: number;
    y: number;
    rectSize: number;
    label: {
        text: string;
        bounds: Bounds;
        fontSize: number;
    };
    bin: CategoricalBin;
}
export declare enum LegendAlign {
    left = "left",
    center = "center",
    right = "right"
}
export interface HorizontalColorLegendManager {
    fontSize?: number;
    legendX?: number;
    legendAlign?: LegendAlign;
    categoryLegendY?: number;
    numericLegendY?: number;
    legendWidth?: number;
    legendHeight?: number;
    scale?: number;
    categoricalLegendData?: CategoricalBin[];
    categoricalFocusBracket?: CategoricalBin;
    categoricalBinStroke?: Color;
    numericLegendData?: ColorScaleBin[];
    numericFocusBracket?: ColorScaleBin;
    equalSizeBins?: boolean;
    onLegendMouseLeave?: () => void;
    onLegendMouseOver?: (d: CategoricalBin) => void;
}
declare class HorizontalColorLegend extends React.Component<{
    manager: HorizontalColorLegendManager;
}> {
    get manager(): HorizontalColorLegendManager;
    get legendX(): number;
    get categoryLegendY(): number;
    get numericLegendY(): number;
    get legendWidth(): number;
    get legendHeight(): number;
    get legendAlign(): LegendAlign;
    get fontSize(): number;
}
export declare class HorizontalNumericColorLegend extends HorizontalColorLegend {
    base: React.RefObject<SVGGElement>;
    get numericLegendData(): ColorScaleBin[];
    get numericBins(): NumericBin[];
    rectHeight: number;
    get tickFontSize(): number;
    get minValue(): number;
    get maxValue(): number;
    get rangeSize(): number;
    get categoryBinWidth(): number;
    get categoryBinMargin(): number;
    get totalCategoricalWidth(): number;
    get availableNumericWidth(): number;
    get positionedBins(): PositionedBin[];
    get numericLabels(): NumericLabel[];
    get height(): number;
    get bounds(): Bounds;
    onMouseMove(ev: MouseEvent | TouchEvent): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export declare class HorizontalCategoricalColorLegend extends HorizontalColorLegend {
    get categoricalLegendData(): CategoricalBin[];
    private get markLines();
    get width(): number;
    get marks(): CategoricalMark[];
    get height(): number;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=HorizontalColorLegends.d.ts.map