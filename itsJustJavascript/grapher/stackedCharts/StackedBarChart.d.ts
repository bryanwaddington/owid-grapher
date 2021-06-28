/// <reference types="react" />
import { Bounds } from "../../clientUtils/Bounds";
import { VerticalColorLegendManager } from "../verticalColorLegend/VerticalColorLegend";
import { ColorScaleManager } from "../color/ColorScale";
import { AbstactStackedChart, AbstactStackedChartProps } from "./AbstractStackedChart";
import { StackedPoint, StackedSeries } from "./StackedConstants";
import { ColorSchemeName } from "../color/ColorConstants";
import { Time } from "../../clientUtils/owidTypes";
import { ColorScaleConfigDefaults } from "../color/ColorScaleConfig";
export declare class StackedBarChart extends AbstactStackedChart<Time> implements VerticalColorLegendManager, ColorScaleManager {
    readonly minBarSpacing = 4;
    constructor(props: AbstactStackedChartProps);
    hoverColor?: string;
    hoverBar?: StackedPoint<Time>;
    hoverSeries?: StackedSeries<Time>;
    private get baseFontSize();
    get tickFontSize(): number;
    get barWidth(): number;
    get barSpacing(): number;
    get barFontSize(): number;
    protected get paddingForLegend(): number;
    get hoverKeys(): string[];
    get activeColors(): string[];
    get legendItems(): {
        label: string;
        color: string;
    }[];
    get maxLegendWidth(): number;
    get sidebarMaxWidth(): number;
    get sidebarMinWidth(): number;
    get sidebarWidth(): number;
    private get legendDimensions();
    get tooltip(): JSX.Element | undefined;
    get mapXValueToOffset(): Map<number, number>;
    private get tickPlacements();
    get ticks(): {
        text: string;
        bounds: Bounds;
        isHidden: boolean;
    }[];
    onLegendMouseOver(color: string): void;
    onLegendMouseLeave(): void;
    onLegendClick(): void;
    onBarMouseOver(bar: StackedPoint<Time>, series: StackedSeries<Time>): void;
    onBarMouseLeave(): void;
    render(): JSX.Element;
    get legendY(): number;
    get legendX(): number;
    private get xValues();
    get colorScaleConfig(): ColorScaleConfigDefaults | undefined;
    defaultBaseColorScheme: ColorSchemeName;
    get series(): readonly StackedSeries<number>[];
}
//# sourceMappingURL=StackedBarChart.d.ts.map