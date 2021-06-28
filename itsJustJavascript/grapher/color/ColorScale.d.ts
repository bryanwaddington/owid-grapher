import { ColorScaleConfigDefaults, ColorScaleConfigInterface } from "./ColorScaleConfig";
import { Color } from "../../coreTable/CoreTableConstants";
import { ColorScaleBin } from "./ColorScaleBin";
import { ColorSchemeName } from "./ColorConstants";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
export declare const NO_DATA_LABEL = "No data";
export interface ColorScaleManager {
    colorScaleConfig?: ColorScaleConfigInterface;
    hasNoDataBin?: boolean;
    defaultNoDataColor?: string;
    defaultBaseColorScheme?: ColorSchemeName;
    colorScaleColumn?: CoreColumn;
}
export declare class ColorScale {
    private manager;
    constructor(manager?: ColorScaleManager);
    get config(): ColorScaleConfigDefaults;
    get customNumericValues(): number[];
    get customNumericColorsActive(): boolean;
    get customNumericColors(): (Color | undefined)[];
    get customHiddenCategories(): {
        [key: string]: true | undefined;
    };
    get customNumericLabels(): (string | undefined)[];
    get isColorSchemeInverted(): boolean;
    private get customCategoryLabels();
    get baseColorScheme(): ColorSchemeName;
    private get defaultColorScheme();
    private get defaultNoDataColor();
    get colorScaleColumn(): CoreColumn | undefined;
    get legendDescription(): string | undefined;
    private get hasNoDataBin();
    get sortedNumericValues(): any[];
    private get minPossibleValue();
    private get maxPossibleValue();
    private get categoricalValues();
    private get colorScheme();
    get singleColorScale(): boolean;
    get autoMinBinValue(): number;
    private get minBinValue();
    private get manualBinMaximums();
    get autoBinMaximums(): number[];
    private get bucketMaximums();
    private get customCategoryColors();
    get noDataColor(): Color;
    get baseColors(): Color[];
    get numAutoBins(): number;
    get isManualBuckets(): boolean;
    get numBins(): number;
    get sortedNumericValuesWithoutOutliers(): any[];
    /** Sorted numeric values passed onto the binning algorithms */
    private get sortedNumericBinningValues();
    private get numericLegendBins();
    get legendBins(): ColorScaleBin[];
    private get categoricalLegendBins();
    getColor(value: number | string | undefined): string | undefined;
}
//# sourceMappingURL=ColorScale.d.ts.map