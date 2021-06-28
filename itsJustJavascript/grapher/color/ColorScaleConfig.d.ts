import { Color } from "../../coreTable/CoreTableConstants";
import { ColumnColorScale } from "../../coreTable/CoreColumnDef";
import { Persistable } from "../persistable/Persistable";
import { ColorSchemeName } from "./ColorConstants";
import { BinningStrategy } from "./BinningStrategy";
export declare class ColorScaleConfigDefaults {
    /** Key for a colorbrewer scheme */
    baseColorScheme?: ColorSchemeName;
    /** Reverse the order of colors in the color scheme (defined by `baseColorScheme`) */
    colorSchemeInvert?: boolean;
    /** The strategy for generating the bin boundaries */
    binningStrategy: BinningStrategy;
    /** The *suggested* number of bins for the automatic binning algorithm */
    binningStrategyBinCount?: number;
    /** The minimum bracket of the first bin */
    customNumericMinValue?: number;
    /** Custom maximum brackets for each numeric bin. Only applied when strategy is `manual`. */
    customNumericValues: number[];
    /**
     * Custom labels for each numeric bin. Only applied when strategy is `manual`.
     * `undefined` or `null` falls back to default label.
     * We need to handle `null` because JSON serializes `undefined` values
     * inside arrays into `null`.
     */
    customNumericLabels: (string | undefined | null)[];
    /** Whether `customNumericColors` are used to override the color scheme. */
    customNumericColorsActive?: boolean;
    /**
     * Override some or all colors for the numerical color legend.
     * `undefined` or `null` falls back the color scheme color.
     * We need to handle `null` because JSON serializes `undefined` values
     * inside arrays into `null`.
     */
    customNumericColors: (Color | undefined | null)[];
    /** Whether the visual scaling for the color legend is disabled. */
    equalSizeBins?: boolean;
    customCategoryColors: {
        [key: string]: string | undefined;
    };
    customCategoryLabels: {
        [key: string]: string | undefined;
    };
    customHiddenCategories: {
        [key: string]: true | undefined;
    };
    /** A custom legend description. Only used in ScatterPlot legend titles for now. */
    legendDescription?: string;
}
export declare type ColorScaleConfigInterface = ColorScaleConfigDefaults;
export declare class ColorScaleConfig extends ColorScaleConfigDefaults implements Persistable {
    updateFromObject(obj: any): void;
    toObject(): ColorScaleConfigInterface;
    constructor(obj?: Partial<ColorScaleConfig>);
    static fromDSL(scale: ColumnColorScale): ColorScaleConfig | undefined;
    toDSL(): ColumnColorScale;
}
//# sourceMappingURL=ColorScaleConfig.d.ts.map