import * as React from "react";
import { MapChartManager, ChoroplethSeries } from "./MapChartConstants";
import { ColorScale } from "../color/ColorScale";
import { Time } from "../../coreTable/CoreTableConstants";
import { OwidTable } from "../../coreTable/OwidTable";
interface MapTooltipProps {
    tooltipDatum?: ChoroplethSeries;
    tooltipTarget?: {
        x: number;
        y: number;
        featureId: string;
    };
    isEntityClickable?: boolean;
    manager: MapChartManager;
    colorScale?: ColorScale;
    targetTime?: Time;
}
export declare class MapTooltip extends React.Component<MapTooltipProps> {
    private sparkBarsDatumXAccessor;
    private get sparkBarsToDisplay();
    private get sparkBarsProps();
    get inputTable(): OwidTable;
    private get mapColumnSlug();
    private get sparkBarColumn();
    private get sparkBarsData();
    private get sparkBarsDomain();
    private get currentSparkBar();
    colorScale: ColorScale;
    private get renderSparkBars();
    private get darkestColorInColorScheme();
    private get barColor();
    private get tooltipTarget();
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=MapTooltip.d.ts.map