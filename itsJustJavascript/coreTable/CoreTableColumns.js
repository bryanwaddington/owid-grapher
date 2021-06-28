"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnTypeMap = exports.MissingColumn = exports.AbstractCoreColumn = void 0;
const Util_1 = require("../clientUtils/Util");
const isPresent_1 = require("../clientUtils/isPresent");
const CoreTableConstants_1 = require("./CoreTableConstants");
const ErrorValues_1 = require("./ErrorValues");
const OwidTableUtil_1 = require("./OwidTableUtil");
const CoreTableUtils_1 = require("./CoreTableUtils");
const moment_1 = __importDefault(require("moment"));
const formatValue_1 = require("../clientUtils/formatValue");
class AbstractCoreColumn {
    constructor(table, def) {
        this.table = table;
        this.def = def;
    }
    parse(val) {
        return val;
    }
    get isMissing() {
        return this instanceof MissingColumn;
    }
    get sum() {
        return this.summary.sum;
    }
    get median() {
        return this.summary.median;
    }
    get max() {
        return this.summary.max;
    }
    get min() {
        return this.summary.min;
    }
    // todo: switch to a lib and/or add tests for this. handle non numerics better.
    get summary() {
        const { numErrorValues, numValues, numUniqs } = this;
        const basicSummary = {
            numErrorValues,
            numUniqs,
            numValues,
        };
        if (!numValues)
            return basicSummary;
        const summary = Object.assign({}, basicSummary);
        const arr = this.valuesAscending;
        const isNumeric = this.jsType === "number";
        let min = arr[0];
        let max = arr[0];
        let sum = 0;
        let mode = undefined;
        let modeSize = 0;
        let currentBucketValue = undefined;
        let currentBucketSize = 0;
        for (let index = 0; index < numValues; index++) {
            const value = arr[index];
            sum += value;
            if (value > max)
                max = value;
            if (value < min)
                min = value;
            if (value === currentBucketValue)
                currentBucketSize++;
            else {
                currentBucketValue = value;
                currentBucketSize = 1;
            }
            if (currentBucketSize > modeSize) {
                modeSize = currentBucketSize;
                mode = currentBucketValue;
            }
        }
        const medianIndex = Math.floor(numValues / 2);
        summary.sum = sum;
        summary.median = arr[medianIndex];
        summary.mean = sum / numValues;
        summary.min = min;
        summary.max = max;
        summary.range = max - min;
        summary.mode = mode;
        summary.modeSize = modeSize;
        if (!isNumeric) {
            summary.sum = undefined;
            summary.mean = undefined;
        }
        summary.deciles = {};
        const deciles = [10, 20, 30, 40, 50, 60, 70, 80, 90, 99, 100];
        deciles.forEach((decile) => {
            let index = Math.floor(numValues * (decile / 100));
            index = index === numValues ? index - 1 : index;
            summary.deciles[decile] = arr[index];
        });
        return summary;
    }
    // todo: migrate from unitConversionFactor to computed columns instead. then delete this.
    // note: unitConversionFactor is used >400 times in charts and >800 times in variables!!!
    get unitConversionFactor() {
        var _a, _b;
        return (_b = (_a = this.display) === null || _a === void 0 ? void 0 : _a.conversionFactor) !== null && _b !== void 0 ? _b : 1;
    }
    get isAllIntegers() {
        return false;
    }
    get tolerance() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.display) === null || _a === void 0 ? void 0 : _a.tolerance) !== null && _b !== void 0 ? _b : this.def.tolerance) !== null && _c !== void 0 ? _c : 0;
    }
    get domain() {
        return [this.minValue, this.maxValue];
    }
    get display() {
        return this.def.display;
    }
    formatValueForMobile(value, options) {
        return this.formatValue(value, options);
    }
    formatValueShortWithAbbreviations(value, options) {
        return this.formatValue(value, options);
    }
    formatValueShort(value, options) {
        return this.formatValue(value, options);
    }
    formatValueLong(value, options) {
        return this.formatValue(value, options);
    }
    formatForTick(value, options) {
        return this.formatValueShort(value, options);
    }
    // A method for formatting for CSV
    formatForCsv(value) {
        return Util_1.csvEscape(Util_1.anyToString(value));
    }
    get numDecimalPlaces() {
        var _a, _b;
        return (_b = (_a = this.display) === null || _a === void 0 ? void 0 : _a.numDecimalPlaces) !== null && _b !== void 0 ? _b : 2;
    }
    get unit() {
        var _a, _b;
        return (_b = (_a = this.display) === null || _a === void 0 ? void 0 : _a.unit) !== null && _b !== void 0 ? _b : this.def.unit;
    }
    get shortUnit() {
        var _a, _b, _c;
        const shortUnit = (_c = (_b = (_a = this.display) === null || _a === void 0 ? void 0 : _a.shortUnit) !== null && _b !== void 0 ? _b : this.def.shortUnit) !== null && _c !== void 0 ? _c : undefined;
        if (shortUnit !== undefined)
            return shortUnit;
        const unit = this.unit;
        if (!unit)
            return undefined;
        if (unit.length < 3)
            return unit;
        if (new Set(["$", "£", "€", "%"]).has(unit[0]))
            return unit[0];
        return undefined;
    }
    // Returns a map where the key is a series slug such as "name" and the value is a set
    // of all the unique values that this column has for that particular series.
    getUniqueValuesGroupedBy(indexColumnSlug) {
        const map = new Map();
        const values = this.values;
        const indexValues = this.table.getValuesAtIndices(indexColumnSlug, this.validRowIndices);
        indexValues.forEach((indexVal, index) => {
            if (!map.has(indexVal))
                map.set(indexVal, new Set());
            map.get(indexVal).add(values[index]);
        });
        return map;
    }
    get description() {
        return this.def.description;
    }
    get isEmpty() {
        return this.valuesIncludingErrorValues.length === 0;
    }
    get name() {
        var _a;
        return (_a = this.def.name) !== null && _a !== void 0 ? _a : this.def.slug;
    }
    get displayName() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.display) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : this.name) !== null && _c !== void 0 ? _c : "";
    }
    // todo: is the isString necessary?
    get sortedUniqNonEmptyStringVals() {
        return Array.from(new Set(this.values.filter(Util_1.isString).filter((i) => i))).sort();
    }
    get slug() {
        return this.def.slug;
    }
    get valuesToIndices() {
        const map = new Map();
        this.valuesIncludingErrorValues.forEach((value, index) => {
            if (!map.has(value))
                map.set(value, []);
            map.get(value).push(index);
        });
        return map;
    }
    indicesWhere(value) {
        const queries = Array.isArray(value) ? value : [value];
        return Util_1.union(...queries
            .map((val) => this.valuesToIndices.get(val))
            .filter(isPresent_1.isPresent));
    }
    // We approximate whether a column is parsed simply by looking at the first row.
    needsParsing(value) {
        // Never parse computeds. The computed should return the correct JS type. Ideally we can provide some error messaging around this.
        if (this.def.transform)
            return false;
        // If we already tried to parse it and failed we consider it "parsed"
        if (value instanceof ErrorValues_1.ErrorValue)
            return false;
        // If the passed value is of the correct type consider the column parsed.
        if (typeof value === this.jsType)
            return false;
        return true;
    }
    get isProjection() {
        var _a;
        return !!((_a = this.display) === null || _a === void 0 ? void 0 : _a.isProjection);
    }
    get uniqValues() {
        return Util_1.uniq(this.values);
    }
    get uniqValuesAsSet() {
        return new Set(this.uniqValues);
    }
    /**
     * Returns all values including ErrorValues..
     * Normally you want just the valid values, like `[45000, 50000, ...]`. But sometimes you
     * need the ErrorValues too like `[45000, DivideByZeroError, 50000,...]`
     */
    get valuesIncludingErrorValues() {
        const { table, slug } = this;
        return table.has(slug) ? table.columnStore[slug] : [];
    }
    get validRowIndices() {
        return this.valuesIncludingErrorValues
            .map((value, index) => value instanceof ErrorValues_1.ErrorValue ? null : index)
            .filter(isPresent_1.isPresent);
    }
    get values() {
        const values = this.valuesIncludingErrorValues;
        return this.validRowIndices.map((index) => values[index]);
    }
    get originalTimeColumnSlug() {
        return OwidTableUtil_1.getOriginalTimeColumnSlug(this.table, this.slug);
    }
    get originalTimeColumn() {
        return this.table.get(this.originalTimeColumnSlug);
    }
    get originalTimes() {
        const { originalTimeColumnSlug } = this;
        if (!originalTimeColumnSlug)
            return [];
        return this.table.getValuesAtIndices(originalTimeColumnSlug, this.validRowIndices);
    }
    /**
     * True if the column has only 1 unique value. ErrorValues are counted as values, so
     * something like [DivideByZeroError, 2, 2] would not be constant.
     */
    get isConstant() {
        return new Set(this.valuesIncludingErrorValues).size === 1;
    }
    get minValue() {
        return this.valuesAscending[0];
    }
    get maxValue() {
        return Util_1.last(this.valuesAscending);
    }
    get numErrorValues() {
        return this.valuesIncludingErrorValues.length - this.numValues;
    }
    // Number of correctly parsed values
    get numValues() {
        return this.values.length;
    }
    get numUniqs() {
        return this.uniqValues.length;
    }
    get valuesAscending() {
        const values = this.values.slice();
        return this.jsType === "string" ? values.sort() : Util_1.sortNumeric(values);
    }
    // todo: cleanup this method. figure out what source properties should be on CoreTable vs OwidTable.
    get source() {
        const { def } = this;
        // todo: flatten out source onto column def in Grapher backend, then can remove this.
        const { source } = def;
        if (source)
            return source;
        return {
            name: def.sourceName,
            link: def.sourceLink,
            dataPublishedBy: def.dataPublishedBy,
            dataPublisherSource: def.dataPublisherSource,
            retrievedDate: def.retrievedDate,
            additionalInfo: def.additionalInfo,
        };
    }
    // todo: remove. should not be on coretable
    get allTimes() {
        return this.table.getTimesAtIndices(this.validRowIndices);
    }
    // todo: remove. should not be on coretable
    get uniqTimesAsc() {
        return Util_1.sortNumeric(Util_1.uniq(this.allTimes));
    }
    // todo: remove. should not be on coretable
    get maxTime() {
        return Util_1.last(this.uniqTimesAsc);
    }
    // todo: remove. should not be on coretable
    get minTime() {
        return this.uniqTimesAsc[0];
    }
    // todo: remove? Should not be on CoreTable
    get uniqEntityNames() {
        return Util_1.uniq(this.allEntityNames);
    }
    // todo: remove? Should not be on CoreTable
    get allEntityNames() {
        return this.table.getValuesAtIndices(this.table.entityNameSlug, this.validRowIndices);
    }
    // todo: remove? Should not be on CoreTable
    // assumes table is sorted by time
    get owidRows() {
        const times = this.originalTimes;
        const values = this.values;
        const entities = this.allEntityNames;
        return Util_1.range(0, times.length).map((index) => {
            return {
                entityName: entities[index],
                time: times[index],
                value: values[index],
            };
        });
    }
    // todo: remove? Should not be on CoreTable
    get owidRowsByEntityName() {
        const map = new Map();
        this.owidRows.forEach((row) => {
            if (!map.has(row.entityName))
                map.set(row.entityName, []);
            map.get(row.entityName).push(row);
        });
        return map;
    }
    // todo: remove? Should not be on CoreTable
    get valueByEntityNameAndTime() {
        const valueByEntityNameAndTime = new Map();
        this.owidRows.forEach((row) => {
            if (!valueByEntityNameAndTime.has(row.entityName))
                valueByEntityNameAndTime.set(row.entityName, new Map());
            valueByEntityNameAndTime
                .get(row.entityName)
                .set(row.time, row.value);
        });
        return valueByEntityNameAndTime;
    }
}
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "isMissing", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "summary", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "unitConversionFactor", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "isAllIntegers", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "tolerance", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "domain", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "display", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "numDecimalPlaces", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "unit", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "shortUnit", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "description", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "isEmpty", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "name", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "displayName", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "sortedUniqNonEmptyStringVals", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "slug", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "valuesToIndices", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "isProjection", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "uniqValues", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "uniqValuesAsSet", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "valuesIncludingErrorValues", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "validRowIndices", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "values", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "originalTimeColumnSlug", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "originalTimeColumn", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "originalTimes", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "isConstant", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "minValue", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "maxValue", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "numErrorValues", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "numValues", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "numUniqs", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "valuesAscending", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "allTimes", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "uniqTimesAsc", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "maxTime", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "minTime", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "uniqEntityNames", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "allEntityNames", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "owidRows", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "owidRowsByEntityName", null);
__decorate([
    CoreTableUtils_1.imemo
], AbstractCoreColumn.prototype, "valueByEntityNameAndTime", null);
exports.AbstractCoreColumn = AbstractCoreColumn;
class MissingColumn extends AbstractCoreColumn {
    constructor() {
        super(...arguments);
        this.jsType = CoreTableConstants_1.JsTypes.string;
    }
    formatValue() {
        return "";
    }
}
exports.MissingColumn = MissingColumn;
class StringColumn extends AbstractCoreColumn {
    constructor() {
        super(...arguments);
        this.jsType = CoreTableConstants_1.JsTypes.string;
    }
    formatValue(value) {
        return Util_1.anyToString(value);
    }
    parse(val) {
        if (val === null)
            return ErrorValues_1.ErrorValueTypes.NullButShouldBeString;
        if (val === undefined)
            return ErrorValues_1.ErrorValueTypes.UndefinedButShouldBeString;
        return val.toString() || "";
    }
}
class SeriesAnnotationColumn extends StringColumn {
}
class CategoricalColumn extends StringColumn {
}
class RegionColumn extends CategoricalColumn {
}
class ContinentColumn extends RegionColumn {
}
class ColorColumn extends CategoricalColumn {
}
class BooleanColumn extends AbstractCoreColumn {
    constructor() {
        super(...arguments);
        this.jsType = CoreTableConstants_1.JsTypes.boolean;
    }
    formatValue(value) {
        return value ? "true" : "false";
    }
    parse(val) {
        return !!val;
    }
}
class AbstractNumericColumn extends AbstractCoreColumn {
    constructor() {
        super(...arguments);
        this.jsType = CoreTableConstants_1.JsTypes.number;
    }
    formatValue(value, options) {
        if (Util_1.isNumber(value)) {
            return formatValue_1.formatValue(value, Object.assign({ numDecimalPlaces: this.numDecimalPlaces }, options));
        }
        return "";
    }
    formatValueShortWithAbbreviations(value, options) {
        return super.formatValueShortWithAbbreviations(value, Object.assign({ shortNumberPrefixes: true }, options));
    }
    formatValueShort(value, options) {
        return super.formatValueShort(value, Object.assign(Object.assign({}, Util_1.omitUndefinedValues({
            unit: this.shortUnit,
        })), options));
    }
    formatValueLong(value, options) {
        return super.formatValueLong(value, Object.assign(Object.assign({}, Util_1.omitUndefinedValues({
            unit: this.unit,
        })), options));
    }
    get isAllIntegers() {
        return this.values.every((val) => val % 1 === 0);
    }
    parse(val) {
        if (val === null)
            return ErrorValues_1.ErrorValueTypes.NullButShouldBeNumber;
        if (val === undefined)
            return ErrorValues_1.ErrorValueTypes.UndefinedButShouldBeNumber;
        if (val === "")
            return ErrorValues_1.ErrorValueTypes.BlankButShouldBeNumber;
        if (isNaN(val))
            return ErrorValues_1.ErrorValueTypes.NaNButShouldBeNumber;
        const res = this._parse(val);
        if (isNaN(res))
            return ErrorValues_1.ErrorValueTypes.NotAParseableNumberButShouldBeNumber;
        return res;
    }
    _parse(val) {
        return parseFloat(val);
    }
}
__decorate([
    CoreTableUtils_1.imemo
], AbstractNumericColumn.prototype, "isAllIntegers", null);
class NumericColumn extends AbstractNumericColumn {
}
class NumericCategoricalColumn extends AbstractNumericColumn {
}
class IntegerColumn extends NumericColumn {
    formatValue(value, options) {
        return super.formatValue(value, Object.assign({ numDecimalPlaces: 0 }, options));
    }
    _parse(val) {
        return parseInt(val);
    }
}
class CurrencyColumn extends NumericColumn {
    formatValue(value, options) {
        return super.formatValue(value, Object.assign({ numDecimalPlaces: 0, unit: "$" }, options));
    }
}
// Expects 50% to be 50
class PercentageColumn extends NumericColumn {
    formatValue(value, options) {
        return super.formatValue(value, Object.assign({ numberPrefixes: false, unit: "%" }, options));
    }
}
// Same as %, but indicates it's part of a group of columns that add up to 100%.
// Might not need this.
class RelativePercentageColumn extends PercentageColumn {
}
class PercentChangeOverTimeColumn extends PercentageColumn {
    formatValue(value, options) {
        return super.formatValue(value, Object.assign({ showPlus: true }, options));
    }
}
class DecimalPercentageColumn extends PercentageColumn {
}
class RatioColumn extends NumericColumn {
}
// todo: remove. should not be in coretable
class EntityIdColumn extends NumericCategoricalColumn {
}
class EntityCodeColumn extends CategoricalColumn {
}
class EntityNameColumn extends CategoricalColumn {
}
// todo: cleanup time columns. current schema is a little incorrect.
class TimeColumn extends AbstractCoreColumn {
    constructor() {
        super(...arguments);
        this.jsType = CoreTableConstants_1.JsTypes.number;
    }
    parse(val) {
        return parseInt(val);
    }
}
class YearColumn extends TimeColumn {
    formatValue(value) {
        // Include BCE
        return Util_1.formatYear(value);
    }
}
class DayColumn extends TimeColumn {
    formatValue(value) {
        return Util_1.formatDay(value);
    }
    formatValueForMobile(value) {
        return Util_1.formatDay(value, { format: "MMM D, 'YY" });
    }
    formatForCsv(value) {
        return Util_1.formatDay(value, { format: "YYYY-MM-DD" });
    }
}
const dateToTimeCache = new Map(); // Cache for performance
class DateColumn extends DayColumn {
    parse(val) {
        // skip parsing if a date is a number, it's already been parsed
        if (typeof val === "number")
            return val;
        if (!dateToTimeCache.has(val))
            dateToTimeCache.set(val, Util_1.dateDiffInDays(moment_1.default.utc(val).toDate(), moment_1.default.utc("2020-01-21").toDate()));
        return dateToTimeCache.get(val);
    }
}
class QuarterColumn extends TimeColumn {
    parse(val) {
        // skip parsing if a date is a number, it's already been parsed
        if (typeof val === "number")
            return val;
        if (typeof val === "string") {
            const match = val.match(QuarterColumn.regEx);
            if (match) {
                const [, year, quarter] = match;
                return parseInt(year) * 4 + (parseInt(quarter) - 1);
            }
        }
        return ErrorValues_1.ErrorValueTypes.InvalidQuarterValue;
    }
    static numToQuarter(value) {
        const year = Math.floor(value / 4);
        const quarter = (Math.abs(value) % 4) + 1;
        return [year, quarter];
    }
    formatValue(value) {
        const [year, quarter] = QuarterColumn.numToQuarter(value);
        return `Q${quarter}/${year}`;
    }
    formatForCsv(value) {
        const [year, quarter] = QuarterColumn.numToQuarter(value);
        return `${year}-Q${quarter}`;
    }
}
QuarterColumn.regEx = /^([+-]?\d+)-Q([1-4])$/;
class PopulationColumn extends IntegerColumn {
}
class PopulationDensityColumn extends NumericColumn {
}
class AgeColumn extends NumericColumn {
}
exports.ColumnTypeMap = {
    String: StringColumn,
    SeriesAnnotation: SeriesAnnotationColumn,
    Categorical: CategoricalColumn,
    Region: RegionColumn,
    Continent: ContinentColumn,
    Numeric: NumericColumn,
    Day: DayColumn,
    Date: DateColumn,
    Year: YearColumn,
    Quarter: QuarterColumn,
    Time: TimeColumn,
    Boolean: BooleanColumn,
    Currency: CurrencyColumn,
    Percentage: PercentageColumn,
    RelativePercentage: RelativePercentageColumn,
    Integer: IntegerColumn,
    DecimalPercentage: DecimalPercentageColumn,
    PercentChangeOverTime: PercentChangeOverTimeColumn,
    Ratio: RatioColumn,
    Color: ColorColumn,
    EntityCode: EntityCodeColumn,
    EntityId: EntityIdColumn,
    EntityName: EntityNameColumn,
    Population: PopulationColumn,
    PopulationDensity: PopulationDensityColumn,
    Age: AgeColumn,
};
// Keep this in. This is used as a compile-time check that ColumnTypeMap covers all
// column names defined in ColumnTypeNames, since that is quite difficult to ensure
// otherwise without losing inferred type information.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ColumnTypeMap = exports.ColumnTypeMap;
//# sourceMappingURL=CoreTableColumns.js.map