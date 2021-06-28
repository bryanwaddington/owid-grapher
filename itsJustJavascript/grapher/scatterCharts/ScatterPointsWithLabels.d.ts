import React from "react";
import { ScatterPointsWithLabelsProps, ScatterRenderSeries } from "./ScatterPlotChartConstants";
export declare class ScatterPointsWithLabels extends React.Component<ScatterPointsWithLabelsProps> {
    base: React.RefObject<SVGGElement>;
    private get seriesArray();
    private get isConnected();
    private get focusedSeriesNames();
    private get hoveredSeriesNames();
    private get isLayerMode();
    private get bounds();
    private get isSubtleForeground();
    private get colorScale();
    private get sizeScale();
    private get fontScale();
    private get hideConnectedScatterLines();
    private get initialRenderSeries();
    private get renderSeries();
    private hideUnselectedLabels;
    private hideCollidingLabelsByPriority;
    private moveLabelsInsideChartBounds;
    mouseFrame?: number;
    onMouseLeave(): void;
    onMouseMove(ev: React.MouseEvent<SVGGElement>): void;
    onClick(): void;
    get backgroundSeries(): ScatterRenderSeries[];
    get foregroundSeries(): ScatterRenderSeries[];
    private renderBackgroundSeries;
    private renderBackgroundLabels;
    get renderUid(): number;
    private renderForegroundSeries;
    private renderForegroundLabels;
    animSelection?: d3.Selection<d3.BaseType, unknown, SVGGElement | null, unknown>;
    private runAnimation;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=ScatterPointsWithLabels.d.ts.map