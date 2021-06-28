"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlankOwidTable = exports.OwidTable = void 0;
const Util_1 = require("../clientUtils/Util");
const isPresent_1 = require("../clientUtils/isPresent");
const CoreTableConstants_1 = require("./CoreTableConstants");
const CoreColumnDef_1 = require("./CoreColumnDef");
const CoreTable_1 = require("./CoreTable");
const PopulationMap_1 = require("./PopulationMap");
const OwidTableConstants_1 = require("./OwidTableConstants");
const ErrorValues_1 = require("./ErrorValues");
const OwidTableUtil_1 = require("./OwidTableUtil");
const CoreTableUtils_1 = require("./CoreTableUtils");
const CoreTableColumns_1 = require("./CoreTableColumns");
// An OwidTable is a subset of Table. An OwidTable always has EntityName, EntityCode, EntityId, and Time columns,
// and value column(s). Whether or not we need in the long run is uncertain and it may just be a stepping stone
// to go from our Variables paradigm to the Table paradigm.
class OwidTable extends CoreTable_1.CoreTable {
    constructor() {
        super(...arguments);
        this.entityType = "Country";
    }
    get availableEntityNames() {
        return Array.from(this.availableEntityNameSet);
    }
    get availableEntityNameSet() {
        return new Set(this.entityNameColumn.uniqValues);
    }
    // todo: can we remove at some point?
    get entityIdToNameMap() {
        return this.valueIndex(this.entityIdColumn.slug, this.entityNameColumn.slug);
    }
    // todo: can we remove at some point?
    get entityCodeToNameMap() {
        return this.valueIndex(this.entityCodeColumn.slug, this.entityNameColumn.slug);
    }
    // todo: can we remove at some point?
    get entityNameToIdMap() {
        return this.valueIndex(this.entityNameColumn.slug, this.entityIdColumn.slug);
    }
    // todo: can we remove at some point?
    get entityNameToCodeMap() {
        return this.valueIndex(this.entityNameColumn.slug, this.entityCodeColumn.slug);
    }
    get maxTime() {
        return Util_1.last(this.allTimes);
    }
    get entityIdColumn() {
        var _a;
        return ((_a = this.getFirstColumnWithType(CoreColumnDef_1.ColumnTypeNames.EntityId)) !== null && _a !== void 0 ? _a : this.get(OwidTableConstants_1.OwidTableSlugs.entityId));
    }
    get entityCodeColumn() {
        var _a;
        return ((_a = this.getFirstColumnWithType(CoreColumnDef_1.ColumnTypeNames.EntityCode)) !== null && _a !== void 0 ? _a : this.get(OwidTableConstants_1.OwidTableSlugs.entityCode));
    }
    get minTime() {
        return this.allTimes[0];
    }
    get allTimes() {
        return this.sortedByTime.get(this.timeColumn.slug).values;
    }
    get rowIndicesByEntityName() {
        return this.rowIndex([this.entityNameSlug]);
    }
    getAnnotationColumnSlug(columnDef) {
        return Util_1.isEmpty(columnDef === null || columnDef === void 0 ? void 0 : columnDef.annotationsColumnSlug)
            ? Util_1.makeAnnotationsSlug(columnDef.slug)
            : columnDef.annotationsColumnSlug;
    }
    // todo: instead of this we should probably make annotations another property on charts—something like "annotationsColumnSlugs"
    getAnnotationColumnForColumn(columnSlug) {
        const def = this.get(columnSlug).def;
        const slug = this.getAnnotationColumnSlug(def);
        return this.get(slug);
    }
    getTimesUniqSortedAscForColumns(columnSlugs) {
        // todo: should be easy to speed up if necessary.
        return Util_1.sortNumeric(Util_1.uniq(Util_1.flatten(this.getColumns(columnSlugs)
            .filter((col) => col)
            .map((col) => col.uniqTimesAsc))));
    }
    timeDomainFor(slugs) {
        const cols = this.getColumns(slugs);
        const mins = cols.map((col) => col.minTime);
        const maxes = cols.map((col) => col.maxTime);
        return [Util_1.min(mins), Util_1.max(maxes)];
    }
    originalTimeDomainFor(slugs) {
        const cols = this.getColumns(slugs);
        const mins = cols.map((col) => Util_1.min(col.originalTimes));
        const maxes = cols.map((col) => Util_1.max(col.originalTimes));
        return [Util_1.min(mins), Util_1.max(maxes)];
    }
    filterByEntityNames(names) {
        const namesSet = new Set(names);
        return this.columnFilter(this.entityNameSlug, (value) => namesSet.has(value), `Filter out all entities except '${names}'`);
    }
    // Does a stable sort by time. You can refer to this table for fast time filtering.
    get sortedByTime() {
        if (this.timeColumn.isMissing)
            return this;
        return this.sortBy([this.timeColumn.slug]);
    }
    filterByTimeRange(start, end) {
        var _a;
        // We may want to do this time adjustment in Grapher instead of here.
        const adjustedStart = start === Infinity ? this.maxTime : start;
        const adjustedEnd = end === -Infinity ? this.minTime : end;
        // todo: we should set a time column onload so we don't have to worry about it again.
        const timeColumnSlug = ((_a = this.timeColumn) === null || _a === void 0 ? void 0 : _a.slug) || OwidTableConstants_1.OwidTableSlugs.time;
        // Sorting by time, because incidentally some parts of the code depended on this method
        // returning sorted rows.
        return this.sortedByTime.columnFilter(timeColumnSlug, (time) => time >= adjustedStart && time <= adjustedEnd, `Keep only rows with Time between ${adjustedStart} - ${adjustedEnd}`);
    }
    filterByTargetTimes(targetTimes, tolerance = 0) {
        const timeColumn = this.timeColumn;
        const timeValues = timeColumn.valuesIncludingErrorValues;
        const entityNameToIndices = this.rowIndicesByEntityName;
        const matchingIndices = new Set();
        this.availableEntityNames.forEach((entityName) => {
            const indices = entityNameToIndices.get(entityName) || [];
            const allTimes = indices.map((index) => timeValues[index]);
            targetTimes.forEach((targetTime) => {
                const index = Util_1.findClosestTimeIndex(allTimes, targetTime, tolerance);
                if (index !== undefined)
                    matchingIndices.add(indices[index]);
            });
        });
        return this.columnFilter(this.entityNameSlug, (row, index) => matchingIndices.has(index), `Keep a row for each entity for each of the closest times ${targetTimes.join(", ")} with tolerance ${tolerance}`);
    }
    dropRowsWithErrorValuesForColumn(slug) {
        return this.columnFilter(slug, (value) => ErrorValues_1.isNotErrorValue(value), `Drop rows with empty or ErrorValues in ${slug} column`);
    }
    // TODO rewrite with column ops
    // TODO move to CoreTable
    dropRowsWithErrorValuesForAnyColumn(slugs) {
        return this.rowFilter((row) => slugs.every((slug) => ErrorValues_1.isNotErrorValue(row[slug])), `Drop rows with empty or ErrorValues in any column: ${slugs.join(", ")}`);
    }
    // TODO rewrite with column ops
    // TODO move to CoreTable
    dropRowsWithErrorValuesForAllColumns(slugs) {
        return this.rowFilter((row) => slugs.some((slug) => ErrorValues_1.isNotErrorValue(row[slug])), `Drop rows with empty or ErrorValues in every column: ${slugs.join(", ")}`);
    }
    sumsByTime(columnSlug) {
        const timeValues = this.timeColumn.values;
        const values = this.get(columnSlug).values;
        const map = new Map();
        timeValues.forEach((time, index) => { var _a; return map.set(time, ((_a = map.get(time)) !== null && _a !== void 0 ? _a : 0) + values[index]); });
        return map;
    }
    // todo: this needs tests (and/or drop in favor of someone else's package)
    // Shows how much each entity contributed to the given column for each time period
    toPercentageFromEachEntityForEachTime(columnSlug) {
        if (!this.has(columnSlug))
            return this;
        const timeColumn = this.timeColumn;
        const col = this.get(columnSlug);
        const timeTotals = this.sumsByTime(columnSlug);
        const timeValues = timeColumn.values;
        const newDefs = CoreTableUtils_1.replaceDef(this.defs, [
            OwidTableUtil_1.toPercentageColumnDef(col.def, CoreColumnDef_1.ColumnTypeNames.RelativePercentage),
        ]);
        const newColumnStore = Object.assign(Object.assign({}, this.columnStore), { [columnSlug]: this.columnStore[columnSlug].map((val, index) => {
                const timeTotal = timeTotals.get(timeValues[index]);
                if (timeTotal === 0)
                    return ErrorValues_1.ErrorValueTypes.DivideByZeroError;
                return (100 * val) / timeTotal;
            }) });
        return this.transform(newColumnStore, newDefs, `Transformed ${columnSlug} column to be % contribution of each entity for that time`, CoreTableConstants_1.TransformType.UpdateColumnDefsAndApply);
    }
    // If you want to see how much each column contributed to the entity for that year, use this.
    // NB: Uses absolute value. So if one entity added 100, and another -100, they both would have contributed "50%" to that year.
    // Otherwise we'd have NaN.
    toPercentageFromEachColumnForEachEntityAndTime(columnSlugs) {
        columnSlugs = columnSlugs.filter((slug) => this.has(slug));
        if (!columnSlugs.length)
            return this;
        const newDefs = this.defs.map((def) => {
            if (columnSlugs.includes(def.slug))
                return OwidTableUtil_1.toPercentageColumnDef(def, CoreColumnDef_1.ColumnTypeNames.RelativePercentage);
            return def;
        });
        const columnStore = this.columnStore;
        const columnStorePatch = {};
        const totals = new Array(this.numRows).fill(0).map((_, i) => Util_1.sumBy(columnSlugs, (slug) => {
            const value = columnStore[slug][i];
            return Util_1.isNumber(value) ? Math.abs(value) : 0;
        }));
        columnSlugs.forEach((slug) => {
            columnStorePatch[slug] = columnStore[slug].map((value, i) => {
                const total = totals[i];
                if (!Util_1.isNumber(value) || !Util_1.isNumber(total))
                    return value;
                if (total === 0)
                    return ErrorValues_1.ErrorValueTypes.DivideByZeroError;
                return (100 * Math.abs(value)) / total;
            });
        });
        const newColumnStore = Object.assign(Object.assign({}, columnStore), columnStorePatch);
        return this.transform(newColumnStore, newDefs, `Transformed columns from absolute numbers to % of abs sum of ${columnSlugs.join(",")} `, CoreTableConstants_1.TransformType.UpdateColumnDefs);
    }
    // todo: this needs tests (and/or drop in favor of someone else's package)
    // If you wanted to build a table showing something like GDP growth relative to 1950, use this.
    toTotalGrowthForEachColumnComparedToStartTime(startTimeBound, columnSlugs) {
        if (this.timeColumn.isMissing)
            return this;
        const timeColumnSlug = this.timeColumn.slug;
        const newDefs = this.defs.map((def) => {
            if (columnSlugs.includes(def.slug))
                return OwidTableUtil_1.toPercentageColumnDef(def, CoreColumnDef_1.ColumnTypeNames.PercentChangeOverTime);
            return def;
        });
        const newRows = Util_1.flatten(Object.values(Util_1.groupBy(this.sortedByTime.rows, (row) => row[this.entityNameSlug])).map((rowsForSingleEntity) => {
            columnSlugs.forEach((valueSlug) => {
                let comparisonValue;
                rowsForSingleEntity = rowsForSingleEntity.map((row) => {
                    const newRow = Object.assign({}, row);
                    const value = row[valueSlug];
                    if (row[timeColumnSlug] < startTimeBound) {
                        newRow[valueSlug] =
                            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder;
                    }
                    else if (!Util_1.isNumber(value)) {
                        newRow[valueSlug] =
                            ErrorValues_1.ErrorValueTypes.NaNButShouldBeNumber;
                    }
                    else if (comparisonValue !== undefined) {
                        // Note: comparisonValue can be negative!
                        // +value / -comparisonValue = negative growth, which is incorrect.
                        newRow[valueSlug] =
                            (100 * (value - comparisonValue)) /
                                Math.abs(comparisonValue);
                    }
                    else if (value === 0) {
                        newRow[valueSlug] =
                            ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder;
                    }
                    else {
                        comparisonValue = value;
                        newRow[valueSlug] = 0;
                    }
                    return newRow;
                });
            });
            return rowsForSingleEntity;
        }));
        return this.transform(newRows, newDefs, `Transformed columns from absolute values to % of time ${startTimeBound} for columns ${columnSlugs.join(",")} `, CoreTableConstants_1.TransformType.UpdateColumnDefs);
    }
    keepMinTimeAndMaxTimeForEachEntityOnly() {
        const indexMap = this.rowIndicesByEntityName;
        const timeColumn = this.timeColumn;
        if (timeColumn.isMissing)
            return this;
        const timeValues = timeColumn.valuesIncludingErrorValues;
        const matchingIndices = new Set();
        indexMap.forEach((indices) => [Util_1.minBy, Util_1.maxBy]
            .map((f) => f(indices, (index) => timeValues[index]))
            .filter(isPresent_1.isPresent)
            .forEach((index) => matchingIndices.add(index)));
        return this.columnFilter(timeColumn.slug, (row, index) => matchingIndices.has(index), `Keep minTime & maxTime rows only for each entity`);
    }
    getAverageAnnualChangeIndicesByEntity(columnSlugs) {
        const columns = columnSlugs.map((slug) => this.get(slug));
        const indexMap = this.rowIndicesByEntityName;
        const timeValues = this.timeColumn.valuesIncludingErrorValues;
        // Find indices of min & max rows
        const entityNameToIndices = new Map();
        indexMap.forEach((indices, entityName) => {
            // We are discarding every row which contains a 0 for any columnSlug.
            // Technically, to be more correct, we should support distinct min/max indices for each
            // columnSlug, but that only makes a tiny difference in a tiny subset of charts.
            const nonZeroValueIndices = indices.filter((index) => columns.every((col) => {
                const value = col.valuesIncludingErrorValues[index];
                return Util_1.isNumber(value) && value !== 0;
            }));
            const minIndex = Util_1.minBy(nonZeroValueIndices, (index) => timeValues[index]);
            const maxIndex = Util_1.maxBy(indices, (index) => timeValues[index]);
            if (minIndex === undefined || maxIndex === undefined)
                return;
            const allValuePairsHaveDistinctTime = columns.every((col) => {
                const originalTimes = this.columnStore[col.originalTimeColumnSlug];
                return originalTimes[minIndex] !== originalTimes[maxIndex];
            });
            if (allValuePairsHaveDistinctTime)
                entityNameToIndices.set(entityName, [minIndex, maxIndex]);
        });
        return entityNameToIndices;
    }
    toAverageAnnualChangeForEachEntity(columnSlugs) {
        columnSlugs = columnSlugs.filter((slug) => this.has(slug));
        if (this.timeColumn.isMissing ||
            !(this.timeColumn instanceof CoreTableColumns_1.ColumnTypeMap.Year) ||
            columnSlugs.length === 0)
            return this;
        const columns = columnSlugs.map((slug) => this.get(slug));
        const entityNameToIndices = this.getAverageAnnualChangeIndicesByEntity(columnSlugs);
        // Overwrite table rows
        const rows = [];
        entityNameToIndices.forEach((indices) => {
            const [startRow, endRow] = this.rowsAt(indices);
            const newRow = Object.assign({}, endRow);
            columns.forEach((col) => {
                const timeSlug = col.originalTimeColumnSlug;
                const yearsElapsed = endRow[timeSlug] - startRow[timeSlug];
                newRow[col.slug] = Util_1.cagr(startRow[col.slug], endRow[col.slug], yearsElapsed);
            });
            rows.push(newRow);
        });
        const newDefs = CoreTableUtils_1.replaceDef(this.defs, columns.map((col) => OwidTableUtil_1.toPercentageColumnDef(col.def, CoreColumnDef_1.ColumnTypeNames.PercentChangeOverTime)));
        return this.transform(rows, newDefs, `Average annual change for columns: ${columnSlugs.join(", ")}`, CoreTableConstants_1.TransformType.UpdateRows);
    }
    // Return slugs that would be good to chart
    get suggestedYColumnSlugs() {
        const skips = new Set([
            OwidTableConstants_1.OwidTableSlugs.entityId,
            OwidTableConstants_1.OwidTableSlugs.time,
            OwidTableConstants_1.OwidTableSlugs.year,
            OwidTableConstants_1.OwidTableSlugs.day,
        ]);
        return this.numericColumnSlugs.filter((slug) => !skips.has(slug));
    }
    // Give our users a clean CSV of each Grapher. Assumes an Owid Table with entityName.
    toPrettyCsv() {
        return this.dropColumns([
            OwidTableConstants_1.OwidTableSlugs.entityId,
            OwidTableConstants_1.OwidTableSlugs.time,
            OwidTableConstants_1.OwidTableSlugs.entityColor,
        ])
            .sortBy([this.entityNameSlug])
            .toCsvWithColumnNames();
    }
    get entityNameColorIndex() {
        return this.valueIndex(this.entityNameSlug, OwidTableConstants_1.OwidTableSlugs.entityColor);
    }
    getColorForEntityName(entityName) {
        return this.entityNameColorIndex.get(entityName);
    }
    get columnDisplayNameToColorMap() {
        return new Map(this.columnsAsArray
            .filter((col) => col.def.color)
            .map((col) => [col.displayName, col.def.color]));
    }
    getColorForColumnByDisplayName(displayName) {
        return this.columnDisplayNameToColorMap.get(displayName);
    }
    // This assumes the table is sorted where the times for entity names go in asc order.
    // The whole table does not have to be sorted by time.
    getLatestValueForEntity(entityName, columnSlug) {
        const indices = this.rowIndicesByEntityName.get(entityName);
        if (!indices)
            return undefined;
        const values = this.get(columnSlug).valuesIncludingErrorValues;
        const descending = indices.slice().reverse();
        const index = descending.find((index) => !(values[index] instanceof ErrorValues_1.ErrorValue));
        return index !== undefined ? values[index] : undefined;
    }
    entitiesWith(columnSlugs) {
        if (!columnSlugs.length)
            return new Set();
        if (columnSlugs.length === 1)
            return new Set(this.get(columnSlugs[0]).uniqEntityNames);
        return Util_1.intersectionOfSets(columnSlugs.map((slug) => new Set(this.get(slug).uniqEntityNames)));
    }
    // Retrieves the two columns `columnSlug` and `timeColumnSlug` from the table and
    // passes their values to the respective interpolation method.
    // `withAllRows` is expected to be completed and sorted.
    interpolate(withAllRows, columnSlug, timeColumnSlug, interpolation, context) {
        const groupBoundaries = withAllRows.groupBoundaries(this.entityNameSlug);
        const newValues = withAllRows
            .get(columnSlug)
            .valuesIncludingErrorValues.slice();
        const newTimes = withAllRows
            .get(timeColumnSlug)
            .valuesIncludingErrorValues.slice();
        groupBoundaries.forEach((_, index) => {
            interpolation(newValues, newTimes, context, groupBoundaries[index], groupBoundaries[index + 1]);
        });
        return {
            values: newValues,
            times: newTimes,
        };
    }
    // TODO generalize `interpolateColumnWithTolerance` and `interpolateColumnLinearly` more
    // There are finicky details in both of them that complicate this
    interpolateColumnWithTolerance(columnSlug, toleranceOverride) {
        var _a, _b;
        // If the column doesn't exist, return the table unchanged.
        if (!this.has(columnSlug))
            return this;
        const column = this.get(columnSlug);
        const columnDef = column.def;
        const tolerance = (_a = toleranceOverride !== null && toleranceOverride !== void 0 ? toleranceOverride : column.tolerance) !== null && _a !== void 0 ? _a : 0;
        const timeColumnOfTable = !this.timeColumn.isMissing
            ? this.timeColumn
            : // CovidTable does not have a day or year column so we need to use time.
                this.get(OwidTableConstants_1.OwidTableSlugs.time);
        const maybeTimeColumnOfValue = (_b = OwidTableUtil_1.getOriginalTimeColumnSlug(this, columnSlug)) !== null && _b !== void 0 ? _b : OwidTableUtil_1.timeColumnSlugFromColumnDef(columnDef);
        const timeColumnOfValue = this.get(maybeTimeColumnOfValue);
        const originalTimeSlug = OwidTableUtil_1.makeOriginalTimeSlugFromColumnSlug(columnSlug);
        let columnStore;
        if (tolerance) {
            const withAllRows = this.complete([
                this.entityNameSlug,
                timeColumnOfTable.slug,
            ]).sortBy([this.entityNameSlug, timeColumnOfTable.slug]);
            const interpolationResult = this.interpolate(withAllRows, columnSlug, timeColumnOfValue.slug, CoreTableUtils_1.toleranceInterpolation, { timeTolerance: tolerance });
            columnStore = Object.assign(Object.assign({}, withAllRows.columnStore), { [columnSlug]: interpolationResult.values, [originalTimeSlug]: interpolationResult.times });
        }
        else {
            // If there is no tolerance still append the tolerance column
            columnStore = Object.assign(Object.assign({}, this.columnStore), { [originalTimeSlug]: timeColumnOfValue.valuesIncludingErrorValues });
        }
        return this.transform(columnStore, [
            ...this.defs,
            Object.assign(Object.assign({}, timeColumnOfValue.def), { slug: originalTimeSlug }),
        ], `Interpolated values in column ${columnSlug} with tolerance ${tolerance} and appended column ${originalTimeSlug} with the original times`, CoreTableConstants_1.TransformType.UpdateColumnDefs);
    }
    interpolateColumnLinearly(columnSlug, extrapolate = false) {
        var _a, _b;
        // If the column doesn't exist, return the table unchanged.
        if (!this.has(columnSlug))
            return this;
        const column = this.get(columnSlug);
        const columnDef = column === null || column === void 0 ? void 0 : column.def;
        const maybeTimeColumnSlug = (_a = OwidTableUtil_1.getOriginalTimeColumnSlug(this, columnSlug)) !== null && _a !== void 0 ? _a : OwidTableUtil_1.timeColumnSlugFromColumnDef(columnDef);
        const timeColumn = (_b = this.get(maybeTimeColumnSlug)) !== null && _b !== void 0 ? _b : this.get(OwidTableConstants_1.OwidTableSlugs.time); // CovidTable does not have a day or year column so we need to use time.
        // todo: we can probably do this once early in the pipeline so we dont have to do it again since complete and sort can be expensive.
        const withAllRows = this.complete([
            this.entityNameSlug,
            timeColumn.slug,
        ]).sortBy([this.entityNameSlug, timeColumn.slug]);
        const interpolationResult = this.interpolate(withAllRows, columnSlug, timeColumn.slug, CoreTableUtils_1.linearInterpolation, { extrapolateAtStart: extrapolate, extrapolateAtEnd: extrapolate });
        const columnStore = Object.assign(Object.assign({}, withAllRows.columnStore), { [columnSlug]: interpolationResult.values });
        return this.transform(columnStore, [
            ...this.defs,
            Object.assign({}, timeColumn.def),
        ], `Interpolated values in column ${columnSlug} linearly`, CoreTableConstants_1.TransformType.UpdateColumnDefs);
    }
    interpolateColumnsByClosestTimeMatch(columnSlugA, columnSlugB) {
        var _a, _b;
        if (!this.has(columnSlugA) || !this.has(columnSlugB))
            return this;
        const columnA = this.get(columnSlugA);
        const columnB = this.get(columnSlugB);
        const toleranceA = (_a = columnA.tolerance) !== null && _a !== void 0 ? _a : 0;
        const toleranceB = (_b = columnB.tolerance) !== null && _b !== void 0 ? _b : 0;
        // If the columns are of mismatching time types, then we can't do any time matching.
        // This can happen when we have a ScatterPlot with days in one column, and a column with
        // xOverrideYear.
        // We also don't need to do any time matching when the tolerance of both columns is 0.
        if (this.timeColumn.isMissing ||
            this.timeColumn.slug !== columnA.originalTimeColumnSlug ||
            this.timeColumn.slug !== columnB.originalTimeColumnSlug ||
            (toleranceA === 0 && toleranceB === 0)) {
            return this;
        }
        const maxDiff = Math.max(toleranceA, toleranceB);
        const withAllRows = this.complete([
            this.entityNameSlug,
            this.timeColumn.slug,
        ]).sortBy([this.entityNameSlug, this.timeColumn.slug]);
        // Existing columns
        const valuesA = withAllRows.get(columnA.slug).valuesIncludingErrorValues;
        const valuesB = withAllRows.get(columnB.slug).valuesIncludingErrorValues;
        const times = withAllRows.timeColumn
            .valuesIncludingErrorValues;
        // New columns
        const newValuesA = new Array(times.length).fill(ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance);
        const newValuesB = new Array(times.length).fill(ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance);
        const newTimesA = new Array(times.length).fill(ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance);
        const newTimesB = new Array(times.length).fill(ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance);
        const groupBoundaries = withAllRows.groupBoundaries(this.entityNameSlug);
        Util_1.pairs(groupBoundaries).forEach(([startIndex, endIndex]) => {
            const availableTimesA = [];
            const availableTimesB = [];
            for (let index = startIndex; index < endIndex; index++) {
                if (ErrorValues_1.isNotErrorValue(valuesA[index]))
                    availableTimesA.push(times[index]);
                if (ErrorValues_1.isNotErrorValue(valuesB[index]))
                    availableTimesB.push(times[index]);
            }
            const timePairs = Util_1.getClosestTimePairs(availableTimesA, availableTimesB, maxDiff);
            const timeAtoTimeB = new Map(timePairs);
            const pairedTimesInA = Util_1.sortNumeric(Array.from(timeAtoTimeB.keys()));
            for (let index = startIndex; index < endIndex; index++) {
                const currentTime = times[index];
                const candidateTimeA = Util_1.sortedFindClosest(pairedTimesInA, currentTime);
                if (candidateTimeA === undefined)
                    continue;
                const candidateIndexA = times.indexOf(candidateTimeA, startIndex);
                if (Math.abs(currentTime - candidateTimeA) > toleranceA)
                    continue;
                const candidateTimeB = timeAtoTimeB.get(candidateTimeA);
                if (candidateTimeB === undefined ||
                    Math.abs(currentTime - candidateTimeB) > toleranceB) {
                    continue;
                }
                const candidateIndexB = times.indexOf(candidateTimeB, startIndex);
                newValuesA[index] = valuesA[candidateIndexA];
                newValuesB[index] = valuesB[candidateIndexB];
                newTimesA[index] = times[candidateIndexA];
                newTimesB[index] = times[candidateIndexB];
            }
        });
        const originalTimeColumnASlug = OwidTableUtil_1.makeOriginalTimeSlugFromColumnSlug(columnA.slug);
        const originalTimeColumnBSlug = OwidTableUtil_1.makeOriginalTimeSlugFromColumnSlug(columnB.slug);
        const columnStore = Object.assign(Object.assign({}, withAllRows.columnStore), { [columnA.slug]: newValuesA, [columnB.slug]: newValuesB, [originalTimeColumnASlug]: newTimesA, [originalTimeColumnBSlug]: newTimesB });
        return withAllRows.transform(columnStore, [
            ...withAllRows.defs,
            Object.assign(Object.assign({}, withAllRows.timeColumn.def), { slug: originalTimeColumnASlug }),
            Object.assign(Object.assign({}, withAllRows.timeColumn.def), { slug: originalTimeColumnBSlug }),
        ], `Interpolated values`, CoreTableConstants_1.TransformType.UpdateColumnDefs);
    }
    // one datum per entityName. use the closest value to target year within tolerance.
    // selected rows only. value from any primary column.
    // getClosestRowForEachSelectedEntity(targetYear, tolerance)
    // Make sure we use the closest value to the target year within tolerance (preferring later)
    getClosestIndexForEachEntity(entityNames, targetTime, tolerance) {
        const indexMap = this.rowIndicesByEntityName;
        const timeColumn = this.timeColumn;
        if (this.timeColumn.isMissing)
            return [];
        const timeValues = timeColumn.valuesIncludingErrorValues;
        return entityNames
            .map((name) => {
            const rowIndices = indexMap.get(name);
            if (!rowIndices)
                return null;
            const rowIndex = Util_1.findClosestTimeIndex(rowIndices.map((index) => timeValues[index]), targetTime, tolerance);
            return rowIndex ? rowIndices[rowIndex] : null;
        })
            .filter(isPresent_1.isPresent);
    }
    filterByPopulationExcept(minPop, entityNames = []) {
        const set = new Set(entityNames);
        return this.columnFilter(this.entityNameSlug, (value) => {
            const name = value;
            const pop = PopulationMap_1.populationMap[name];
            return !pop || set.has(name) || pop >= minPop;
        }, `Filter out countries with population less than ${minPop}`);
    }
    get availableEntities() {
        const { entityNameToCodeMap, entityNameToIdMap } = this;
        return this.availableEntityNames.map((entityName) => {
            return {
                entityName,
                entityId: entityNameToIdMap.get(entityName),
                entityCode: entityNameToCodeMap.get(entityName),
            };
        });
    }
    sampleEntityName(howMany = 1) {
        return this.availableEntityNames.slice(0, howMany);
    }
    get isBlank() {
        return (this.tableDescription.startsWith(BLANK_TABLE_MESSAGE) &&
            !this.numRows);
    }
}
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "availableEntityNames", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "availableEntityNameSet", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "entityIdToNameMap", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "entityCodeToNameMap", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "entityNameToIdMap", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "entityNameToCodeMap", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "maxTime", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "entityIdColumn", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "entityCodeColumn", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "minTime", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "allTimes", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "rowIndicesByEntityName", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "sortedByTime", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "suggestedYColumnSlugs", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "entityNameColorIndex", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "columnDisplayNameToColorMap", null);
__decorate([
    CoreTableUtils_1.imemo
], OwidTable.prototype, "availableEntities", null);
exports.OwidTable = OwidTable;
const BLANK_TABLE_MESSAGE = `Table is empty.`;
// This just assures that even an emtpty OwidTable will have an entityName column. Probably a cleaner way to do this pattern (add a defaultColumns prop??)
const BlankOwidTable = (tableSlug = `blankOwidTable`, extraTableDescription = "") => new OwidTable(undefined, [
    { slug: OwidTableConstants_1.OwidTableSlugs.entityName },
    { slug: OwidTableConstants_1.OwidTableSlugs.year, type: CoreColumnDef_1.ColumnTypeNames.Year },
], {
    tableDescription: BLANK_TABLE_MESSAGE + extraTableDescription,
    tableSlug,
});
exports.BlankOwidTable = BlankOwidTable;
//# sourceMappingURL=OwidTable.js.map