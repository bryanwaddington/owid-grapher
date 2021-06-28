import React from "react";
import { ScatterRenderSeries } from "./ScatterPlotChartConstants";
export declare class ScatterPoint extends React.Component<{
    series: ScatterRenderSeries;
    isLayerMode?: boolean;
    isConnected?: boolean;
}> {
    render(): JSX.Element | null;
}
export declare class ScatterLine extends React.Component<{
    series: ScatterRenderSeries;
    isLayerMode: boolean;
    isConnected: boolean;
}> {
    render(): JSX.Element | null;
}
//# sourceMappingURL=ScatterPoints.d.ts.map