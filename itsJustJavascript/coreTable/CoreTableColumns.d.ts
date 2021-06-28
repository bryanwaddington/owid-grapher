import { CoreTable } from "./CoreTable";
import { CoreRow, ColumnSlug, Time, PrimitiveType, JsTypes, CoreValueType } from "./CoreTableConstants";
import { CoreColumnDef } from "./CoreColumnDef";
import { EntityName, LegacyOwidRow } from "./OwidTableConstants";
import { ErrorValue } from "./ErrorValues";
import { OwidSource } from "./OwidSource";
import { TickFormattingOptions } from "../clientUtils/formatValue";
import { LegacyVariableDisplayConfigInterface } from "../clientUtils/LegacyVariableDisplayConfigInterface";
interface ColumnSummary {
    numErrorValues: number;
    numUniqs: number;
    numValues: number;
    median: PrimitiveType;
    sum: number;
    mean: number;
    min: PrimitiveType;
    max: PrimitiveType;
    range: number;
    mode: PrimitiveType;
    modeSize: number;
    deciles: {
        [decile: number]: PrimitiveType;
    };
}
export declare abstract class AbstractCoreColumn<JS_TYPE extends PrimitiveType> {
    def: CoreColumnDef;
    table: CoreTable;
    constructor(table: CoreTable, def: CoreColumnDef);
    abstract jsType: JsTypes;
    parse(val: any): any;
    get isMissing(): boolean;
    get sum(): number | undefined;
    get median(): PrimitiveType | undefined;
    get max(): PrimitiveType | undefined;
    get min(): PrimitiveType | undefined;
    get summary(): Partial<ColumnSummary>;
    get unitConversionFactor(): number;
    get isAllIntegers(): boolean;
    get tolerance(): number;
    get domain(): [JS_TYPE, JS_TYPE];
    get display(): LegacyVariableDisplayConfigInterface | undefined;
    abstract formatValue(value: any, options?: TickFormattingOptions): string;
    formatValueForMobile(value: any, options?: TickFormattingOptions): string;
    formatValueShortWithAbbreviations(value: any, options?: TickFormattingOptions): string;
    formatValueShort(value: any, options?: TickFormattingOptions): string;
    formatValueLong(value: any, options?: TickFormattingOptions): string;
    formatForTick(value: any, options?: TickFormattingOptions): string;
    formatForCsv(value: JS_TYPE): string;
    get numDecimalPlaces(): number;
    get unit(): string | undefined;
    get shortUnit(): string | undefined;
    getUniqueValuesGroupedBy(indexColumnSlug: ColumnSlug): Map<PrimitiveType, Set<PrimitiveType>>;
    get description(): string | undefined;
    get isEmpty(): boolean;
    get name(): string;
    get displayName(): string;
    get sortedUniqNonEmptyStringVals(): JS_TYPE[];
    get slug(): string;
    get valuesToIndices(): Map<any, number[]>;
    indicesWhere(value: JS_TYPE | JS_TYPE[]): any;
    needsParsing(value: any): boolean;
    get isProjection(): boolean;
    get uniqValues(): JS_TYPE[];
    get uniqValuesAsSet(): Set<JS_TYPE>;
    /**
     * Returns all values including ErrorValues..
     * Normally you want just the valid values, like `[45000, 50000, ...]`. But sometimes you
     * need the ErrorValues too like `[45000, DivideByZeroError, 50000,...]`
     */
    get valuesIncludingErrorValues(): CoreValueType[];
    get validRowIndices(): number[];
    get values(): JS_TYPE[];
    get originalTimeColumnSlug(): string;
    get originalTimeColumn(): CoreColumn;
    get originalTimes(): number[];
    /**
     * True if the column has only 1 unique value. ErrorValues are counted as values, so
     * something like [DivideByZeroError, 2, 2] would not be constant.
     */
    get isConstant(): boolean;
    get minValue(): JS_TYPE;
    get maxValue(): JS_TYPE;
    get numErrorValues(): number;
    get numValues(): number;
    get numUniqs(): number;
    get valuesAscending(): JS_TYPE[];
    get source(): OwidSource;
    private get allTimes();
    get uniqTimesAsc(): Time[];
    get maxTime(): Time;
    get minTime(): Time;
    get uniqEntityNames(): EntityName[];
    private get allEntityNames();
    get owidRows(): LegacyOwidRow<JS_TYPE>[];
    get owidRowsByEntityName(): Map<EntityName, CoreRow[]>;
    get valueByEntityNameAndTime(): Map<EntityName, Map<Time, JS_TYPE>>;
}
export declare type CoreColumn = AbstractCoreColumn<any>;
export declare class MissingColumn extends AbstractCoreColumn<any> {
    jsType: JsTypes;
    formatValue(): string;
}
declare class StringColumn extends AbstractCoreColumn<string> {
    jsType: JsTypes;
    formatValue(value: any): string;
    parse(val: any): any;
}
declare class SeriesAnnotationColumn extends StringColumn {
}
declare class CategoricalColumn extends StringColumn {
}
declare class RegionColumn extends CategoricalColumn {
}
declare class ContinentColumn extends RegionColumn {
}
declare class ColorColumn extends CategoricalColumn {
}
declare class BooleanColumn extends AbstractCoreColumn<boolean> {
    jsType: JsTypes;
    formatValue(value: any): "true" | "false";
    parse(val: any): boolean;
}
declare abstract class AbstractNumericColumn extends AbstractCoreColumn<number> {
    jsType: JsTypes;
    formatValue(value: number, options?: TickFormattingOptions): string;
    formatValueShortWithAbbreviations(value: number, options?: TickFormattingOptions): string;
    formatValueShort(value: number, options?: TickFormattingOptions): string;
    formatValueLong(value: number, options?: TickFormattingOptions): string;
    get isAllIntegers(): boolean;
    parse(val: any): number | ErrorValue;
    protected _parse(val: any): number;
}
declare class NumericColumn extends AbstractNumericColumn {
}
declare class NumericCategoricalColumn extends AbstractNumericColumn {
}
declare class IntegerColumn extends NumericColumn {
    formatValue(value: any, options?: TickFormattingOptions): string;
    protected _parse(val: any): number;
}
declare class CurrencyColumn extends NumericColumn {
    formatValue(value: any, options?: TickFormattingOptions): string;
}
declare class PercentageColumn extends NumericColumn {
    formatValue(value: number, options?: TickFormattingOptions): string;
}
declare class RelativePercentageColumn extends PercentageColumn {
}
declare class PercentChangeOverTimeColumn extends PercentageColumn {
    formatValue(value: number, options?: TickFormattingOptions): string;
}
declare class DecimalPercentageColumn extends PercentageColumn {
}
declare class RatioColumn extends NumericColumn {
}
declare class EntityIdColumn extends NumericCategoricalColumn {
}
declare class EntityCodeColumn extends CategoricalColumn {
}
declare class EntityNameColumn extends CategoricalColumn {
}
declare abstract class TimeColumn extends AbstractCoreColumn<number> {
    jsType: JsTypes;
    parse(val: any): number | ErrorValue;
}
declare class YearColumn extends TimeColumn {
    formatValue(value: number): string;
}
declare class DayColumn extends TimeColumn {
    formatValue(value: number): string;
    formatValueForMobile(value: number): string;
    formatForCsv(value: number): string;
}
declare class DateColumn extends DayColumn {
    parse(val: any): number;
}
declare class QuarterColumn extends TimeColumn {
    private static regEx;
    parse(val: any): number | ErrorValue;
    private static numToQuarter;
    formatValue(value: number): string;
    formatForCsv(value: number): string;
}
declare class PopulationColumn extends IntegerColumn {
}
declare class PopulationDensityColumn extends NumericColumn {
}
declare class AgeColumn extends NumericColumn {
}
export declare const ColumnTypeMap: {
    String: typeof StringColumn;
    SeriesAnnotation: typeof SeriesAnnotationColumn;
    Categorical: typeof CategoricalColumn;
    Region: typeof RegionColumn;
    Continent: typeof ContinentColumn;
    Numeric: typeof NumericColumn;
    Day: typeof DayColumn;
    Date: typeof DateColumn;
    Year: typeof YearColumn;
    Quarter: typeof QuarterColumn;
    Time: typeof TimeColumn;
    Boolean: typeof BooleanColumn;
    Currency: typeof CurrencyColumn;
    Percentage: typeof PercentageColumn;
    RelativePercentage: typeof RelativePercentageColumn;
    Integer: typeof IntegerColumn;
    DecimalPercentage: typeof DecimalPercentageColumn;
    PercentChangeOverTime: typeof PercentChangeOverTimeColumn;
    Ratio: typeof RatioColumn;
    Color: typeof ColorColumn;
    EntityCode: typeof EntityCodeColumn;
    EntityId: typeof EntityIdColumn;
    EntityName: typeof EntityNameColumn;
    Population: typeof PopulationColumn;
    PopulationDensity: typeof PopulationDensityColumn;
    Age: typeof AgeColumn;
};
export {};
//# sourceMappingURL=CoreTableColumns.d.ts.map