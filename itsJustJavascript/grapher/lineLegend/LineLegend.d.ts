import * as React from "react";
import { TextWrap } from "../text/TextWrap";
import { VerticalAxis } from "../axis/Axis";
import { Bounds } from "../../clientUtils/Bounds";
import { EntityName } from "../../coreTable/OwidTableConstants";
import { ChartSeries } from "../chart/ChartInterface";
export interface LineLabelSeries extends ChartSeries {
    label: string;
    yValue: number;
    annotation?: string;
    yRange?: [number, number];
}
interface SizedSeries extends LineLabelSeries {
    textWrap: TextWrap;
    annotationTextWrap?: TextWrap;
    width: number;
    height: number;
}
interface PlacedSeries extends SizedSeries {
    origBounds: Bounds;
    bounds: Bounds;
    isOverlap: boolean;
    repositions: number;
    level: number;
    totalLevels: number;
}
export interface LineLegendManager {
    startSelectingWhenLineClicked?: boolean;
    canAddData?: boolean;
    isSelectingData?: boolean;
    entityType?: string;
    labelSeries: LineLabelSeries[];
    maxLegendWidth?: number;
    fontSize?: number;
    onLegendMouseOver?: (key: EntityName) => void;
    onLegendClick?: (key: EntityName) => void;
    onLegendMouseLeave?: () => void;
    focusedSeriesNames: EntityName[];
    verticalAxis: VerticalAxis;
    legendX?: number;
}
export declare class LineLegend extends React.Component<{
    manager: LineLegendManager;
}> {
    private get fontSize();
    leftPadding: number;
    private get maxWidth();
    get sizedLabels(): SizedSeries[];
    get width(): number;
    get onMouseOver(): any;
    get onMouseLeave(): any;
    get onClick(): any;
    get isFocusMode(): boolean;
    get legendX(): number;
    private get initialSeries();
    get standardPlacement(): PlacedSeries[];
    get overlappingPlacement(): PlacedSeries[];
    get placedSeries(): PlacedSeries[];
    private get backgroundSeries();
    private get focusedSeries();
    private get needsLines();
    private renderBackground;
    private renderFocus;
    get manager(): LineLegendManager;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=LineLegend.d.ts.map