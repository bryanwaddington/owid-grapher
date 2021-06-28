import { LegacyVariableDisplayConfigInterface } from "../clientUtils/LegacyVariableDisplayConfigInterface";
import { ColumnSlug, CoreValueType, Color } from "./CoreTableConstants";
export declare enum ColumnTypeNames {
    Numeric = "Numeric",
    String = "String",
    Region = "Region",
    SeriesAnnotation = "SeriesAnnotation",
    Categorical = "Categorical",
    Continent = "Continent",
    EntityName = "EntityName",
    EntityId = "EntityId",
    EntityCode = "EntityCode",
    Boolean = "Boolean",
    Currency = "Currency",
    Percentage = "Percentage",
    RelativePercentage = "RelativePercentage",
    DecimalPercentage = "DecimalPercentage",
    Integer = "Integer",
    PercentChangeOverTime = "PercentChangeOverTime",
    Ratio = "Ratio",
    Year = "Year",
    Day = "Day",
    Date = "Date",
    Color = "Color",
    Population = "Population",
    PopulationDensity = "PopulationDensity",
    Age = "Age",
    Quarter = "Quarter"
}
export interface ColumnColorScale {
    colorScaleScheme?: string;
    colorScaleInvert?: boolean;
    colorScaleBinningStrategy?: string;
    colorScaleEqualSizeBins?: boolean;
    colorScaleNumericMinValue?: number;
    colorScaleNumericBins?: string;
    colorScaleCategoricalBins?: string;
    colorScaleNoDataLabel?: string;
    colorScaleLegendDescription?: string;
}
export interface CoreColumnDef extends ColumnColorScale {
    slug: ColumnSlug;
    type?: ColumnTypeNames;
    transform?: string;
    tolerance?: number;
    name?: string;
    description?: string;
    note?: string;
    color?: Color;
    sourceName?: string;
    sourceLink?: string;
    dataPublishedBy?: string;
    dataPublisherSource?: string;
    retrievedDate?: string;
    additionalInfo?: string;
    values?: CoreValueType[];
    generator?: () => number;
    growthRateGenerator?: () => number;
    unit?: string;
    shortUnit?: string;
    display?: LegacyVariableDisplayConfigInterface;
}
//# sourceMappingURL=CoreColumnDef.d.ts.map