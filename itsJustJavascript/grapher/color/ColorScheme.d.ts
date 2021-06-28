import { Color } from "../../coreTable/CoreTableConstants";
import { ChartSeries } from "../chart/ChartInterface";
import { SeriesColorMap, SeriesName } from "../core/GrapherConstants";
import { ColorSchemeInterface } from "./ColorConstants";
export declare class ColorScheme implements ColorSchemeInterface {
    name: string;
    colorSets: Color[][];
    singleColorScale: boolean;
    isDistinct: boolean;
    constructor(name: string, colorSets: Color[][], singleColorScale?: boolean, isDistinct?: boolean);
    improviseGradientFromShorter(shortColors: Color[], numColors: number): Color[];
    improviseGradientFromLonger(knownColors: Color[], numColors: number): Color[];
    getGradientColors(numColors: number): Color[];
    getDistinctColors(numColors: number): Color[];
    getColors(numColors: number): Color[];
    getUniqValueColorMap(uniqValues: any[], inverseOrder?: boolean): Map<number, string>;
    assignColors(seriesArr: ChartSeries[], invertColorScheme?: boolean, customColorMap?: Map<SeriesName, Color>, seriesColorMap?: SeriesColorMap): void;
    private updateColorMap;
    static fromObject(name: string, colorSets: {
        [key: string]: Color[];
    }, singleColorScale?: boolean): ColorScheme;
}
//# sourceMappingURL=ColorScheme.d.ts.map