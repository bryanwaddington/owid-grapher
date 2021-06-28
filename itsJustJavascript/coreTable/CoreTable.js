"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.columnDefinitionsFromDelimited = exports.CoreTable = void 0;
const Util_1 = require("../clientUtils/Util");
const isPresent_1 = require("../clientUtils/isPresent");
const CoreTableColumns_1 = require("./CoreTableColumns");
const CoreTableConstants_1 = require("./CoreTableConstants");
const CoreColumnDef_1 = require("./CoreColumnDef");
const CoreTablePrinters_1 = require("./CoreTablePrinters");
const CoreTableUtils_1 = require("./CoreTableUtils");
const ErrorValues_1 = require("./ErrorValues");
const OwidTableConstants_1 = require("./OwidTableConstants");
const Transforms_1 = require("./Transforms");
// The complex generic with default here just enables you to optionally specify a more
// narrow interface for the input rows. This is helpful for OwidTable.
class CoreTable {
    constructor(input = [], inputColumnDefs = [], advancedOptions = {}) {
        this._columns = new Map();
        this.timeToLoad = 0;
        this.initTime = Date.now();
        this.valuesFromColumnDefs = {};
        this.guid = ++CoreTable.guids;
        const start = Date.now(); // Perf aid
        const { parent, tableDescription = "" } = advancedOptions;
        this.originalInput = input;
        this.tableDescription = tableDescription;
        this.parent = parent;
        this.inputColumnDefs =
            typeof inputColumnDefs === "string"
                ? exports.columnDefinitionsFromDelimited(inputColumnDefs)
                : inputColumnDefs;
        // If any values were passed in, copy those to column store now and then remove them from column definitions.
        // todo: remove values property entirely? may be an anti-pattern.
        this.inputColumnDefs = this.inputColumnDefs.map((def) => {
            if (!def.values)
                return def;
            this.valuesFromColumnDefs[def.slug] = def.values;
            const copy = Object.assign({}, def);
            delete copy.values;
            return copy;
        });
        this.inputColumnDefs.forEach((def) => this.setColumn(def));
        this.advancedOptions = advancedOptions;
        // If this has a parent table, than we expect all defs. This makes "deletes" and "renames" fast.
        // If this is the first input table, then we do a simple check to generate any missing column defs.
        if (!parent)
            CoreTableUtils_1.autodetectColumnDefs(this.inputColumnStore, this._columns).forEach((def) => this.setColumn(def));
        this.timeToLoad = Date.now() - start; // Perf aid
    }
    // A method currently used just in debugging but may be useful in the author backend.
    // If your charts look funny, a good thing to check is if the autodetected columns are wrong.
    get autodetectedColumnDefs() {
        const providedSlugs = new Set(this.inputColumnDefs.map((def) => def.slug));
        return new CoreTable(this.defs.filter((def) => !providedSlugs.has(def.slug)));
    }
    get transformCategory() {
        const { advancedOptions, inputType } = this;
        if (advancedOptions.transformCategory)
            return advancedOptions.transformCategory;
        if (inputType === CoreTableConstants_1.InputType.Delimited)
            return CoreTableConstants_1.TransformType.LoadFromDelimited;
        if (inputType === CoreTableConstants_1.InputType.Matrix)
            return CoreTableConstants_1.TransformType.LoadFromMatrix;
        if (inputType === CoreTableConstants_1.InputType.RowStore)
            return CoreTableConstants_1.TransformType.LoadFromRowStore;
        return CoreTableConstants_1.TransformType.LoadFromColumnStore;
    }
    // If the input is a column store, returns that. If it is DSV, parses that and turns it into a column store.
    // If it is a Rows[], turns it into a column store.
    get inputColumnStore() {
        const { originalInput, inputType } = this;
        if (inputType === CoreTableConstants_1.InputType.Delimited)
            return this.delimitedAsColumnStore;
        else if (inputType === CoreTableConstants_1.InputType.Matrix)
            return CoreTableUtils_1.rowsToColumnStore(CoreTableUtils_1.rowsFromMatrix(originalInput));
        else if (inputType === CoreTableConstants_1.InputType.RowStore)
            return CoreTableUtils_1.rowsToColumnStore(originalInput);
        return originalInput;
    }
    get columnStore() {
        const { inputColumnStore, valuesFromColumnDefs, inputColumnsToParsedColumnStore, inputColumnDefs, isRoot, advancedOptions, } = this;
        // Set blank columns
        let columnStore = Object.assign({}, this.blankColumnStore, inputColumnStore, valuesFromColumnDefs);
        // Overwrite any non-parsed columns with parsed values
        if (Object.keys(inputColumnsToParsedColumnStore).length)
            columnStore = Object.assign(columnStore, inputColumnsToParsedColumnStore);
        // NB: transforms are *only* run on the root table for now. They will not be rerun later on (after adding or filtering rows, for example)
        const columnsFromTransforms = inputColumnDefs.filter((def) => def.transform); // todo: sort by graph dependency order
        if (isRoot && columnsFromTransforms.length)
            columnStore = Transforms_1.applyTransforms(columnStore, columnsFromTransforms);
        return advancedOptions.filterMask
            ? advancedOptions.filterMask.apply(columnStore)
            : columnStore;
    }
    get blankColumnStore() {
        const columnsObject = {};
        this.columnSlugs.forEach((slug) => {
            columnsObject[slug] = [];
        });
        return columnsObject;
    }
    get delimitedAsColumnStore() {
        const { originalInput, _numericColumnSlugs } = this;
        const parsed = CoreTableUtils_1.parseDelimited(originalInput, undefined, CoreTableUtils_1.makeAutoTypeFn(_numericColumnSlugs));
        // dsv_parse adds a columns prop to the result we don't want since we handle our own column defs.
        // https://github.com/d3/d3-dsv#dsv_parse
        delete parsed.columns;
        const renamedRows = CoreTableUtils_1.standardizeSlugs(parsed); // todo: pass renamed defs back in.
        return CoreTableUtils_1.rowsToColumnStore(renamedRows ? renamedRows.rows : parsed);
    }
    get tableSlug() {
        return this.advancedOptions.tableSlug;
    }
    get inputColumnsToParsedColumnStore() {
        const { inputColumnStore, colsToParse } = this;
        const columnsObject = {};
        if (!colsToParse.length)
            return columnsObject;
        const missingCols = [];
        let len = 0;
        colsToParse.forEach((col) => {
            const { slug } = col;
            const unparsedVals = inputColumnStore[slug];
            if (!unparsedVals) {
                missingCols.push(col);
                return;
            }
            columnsObject[slug] = unparsedVals.map((val) => col.parse(val));
            len = columnsObject[slug].length;
        });
        // If column defs were provided but there were no values provided for those columns, create blank columns the same size
        // as the filled columns.
        missingCols.forEach((col) => (columnsObject[col.slug] = Util_1.range(0, len).map(() => col.parse(undefined))));
        return columnsObject;
    }
    get colsToParse() {
        const { inputType, columnsAsArray, inputColumnStore } = this;
        const firstInputRow = CoreTableUtils_1.makeRowFromColumnStore(0, inputColumnStore);
        if (inputType === CoreTableConstants_1.InputType.Delimited) {
            const missingTypes = new Set(this.getColumns(CoreTableUtils_1.emptyColumnsInFirstRowInDelimited(this.originalInput))); // Our autotyping is poor if the first value in a column is empty
            return columnsAsArray.filter((col) => col.needsParsing(firstInputRow[col.slug]) ||
                missingTypes.has(col));
        }
        if (this.advancedOptions.skipParsing || this.parent || !firstInputRow)
            return [];
        // The default behavior is to assume some missing or bad data in user data, so we always parse the full input the first time we load
        // user data, with the exception of columns that have values passed directly.
        // Todo: measure the perf hit and add a parameter to opt out of this this if you know the data is complete?
        const alreadyTypedSlugs = new Set(Object.keys(this.valuesFromColumnDefs));
        if (this.isRoot) {
            return this.columnsAsArray.filter((col) => !alreadyTypedSlugs.has(col.slug));
        }
        return columnsAsArray.filter((col) => !alreadyTypedSlugs.has(col.slug) ||
            col.needsParsing(firstInputRow[col.slug]));
    }
    toOneDimensionalArray() {
        return Util_1.flatten(this.toTypedMatrix().slice(1));
    }
    setColumn(def) {
        const { type, slug } = def;
        const ColumnType = (type && CoreTableColumns_1.ColumnTypeMap[type]) || CoreTableColumns_1.ColumnTypeMap.String;
        this._columns.set(slug, new ColumnType(this, def));
    }
    transform(rowsOrColumnStore, defs, tableDescription, transformCategory, filterMask) {
        // The combo of the "this" return type and then casting this to any allows subclasses to create transforms of the
        // same type. The "any" typing is very brief (the returned type will have the same type as the instance being transformed).
        return new this.constructor(rowsOrColumnStore, defs, {
            parent: this,
            tableDescription,
            transformCategory,
            filterMask,
        });
    }
    // Time between when the parent table finished loading and this table started constructing.
    // A large time may just be due to a transform only happening after a user action, or it
    // could be do to other sync code executing between transforms.
    get betweenTime() {
        return this.parent
            ? this.initTime - (this.parent.initTime + this.parent.timeToLoad)
            : 0;
    }
    get rows() {
        return CoreTableUtils_1.columnStoreToRows(this.columnStore);
    }
    get indices() {
        return Util_1.range(0, this.numRows);
    }
    *[Symbol.iterator]() {
        const { columnStore, numRows } = this;
        for (let index = 0; index < numRows; index++) {
            yield CoreTableUtils_1.makeRowFromColumnStore(index, columnStore);
        }
    }
    getTimesAtIndices(indices) {
        if (!indices.length)
            return [];
        return this.getValuesAtIndices(this.timeColumn.slug, indices);
    }
    getValuesAtIndices(columnSlug, indices) {
        const values = this.get(columnSlug).valuesIncludingErrorValues;
        return indices.map((index) => values[index]);
    }
    get firstRow() {
        return CoreTableUtils_1.makeRowFromColumnStore(0, this.columnStore);
    }
    get lastRow() {
        return CoreTableUtils_1.makeRowFromColumnStore(this.numRows - 1, this.columnStore);
    }
    get numRows() {
        const firstColValues = Object.values(this.columnStore)[0];
        return firstColValues ? firstColValues.length : 0;
    }
    get numColumns() {
        return this.columnSlugs.length;
    }
    get(columnSlug) {
        var _a;
        if (columnSlug === undefined)
            return new CoreTableColumns_1.MissingColumn(this, {
                slug: `undefined_slug`,
            });
        return ((_a = this._columns.get(columnSlug)) !== null && _a !== void 0 ? _a : new CoreTableColumns_1.MissingColumn(this, {
            slug: columnSlug,
        }));
    }
    has(columnSlug) {
        if (columnSlug === undefined)
            return false;
        return this._columns.has(columnSlug);
    }
    getFirstColumnWithType(columnTypeName) {
        return this.columnsAsArray.find((col) => col.def.type === columnTypeName);
    }
    // todo: move this. time methods should not be in CoreTable, in OwidTable instead (which is really TimeSeriesTable).
    // TODO: remove this. Currently we use this to get the right day/year time formatting. For now a chart is either a "day chart" or a "year chart".
    // But we can have charts with multiple time columns. Ideally each place that needs access to the timeColumn, would get the specific column
    // and not the first time column from the table.
    get timeColumn() {
        var _a, _b, _c, _d;
        // "time" is the canonical time column slug.
        // See LegacyToOwidTable where this column is injected for all Graphers.
        const maybeTimeColumn = this.get(OwidTableConstants_1.OwidTableSlugs.time);
        if (maybeTimeColumn instanceof CoreTableColumns_1.ColumnTypeMap.Time)
            return maybeTimeColumn;
        // If a valid "time" column doesn't exist, find _some_ time column to use.
        // This is somewhat unreliable and currently only used to infer the time
        // column on explorers.
        return ((_d = (_c = (_b = (_a = this.columnsAsArray.find((col) => col instanceof CoreTableColumns_1.ColumnTypeMap.Day)) !== null && _a !== void 0 ? _a : this.columnsAsArray.find((col) => col instanceof CoreTableColumns_1.ColumnTypeMap.Date)) !== null && _b !== void 0 ? _b : this.columnsAsArray.find((col) => col instanceof CoreTableColumns_1.ColumnTypeMap.Year)) !== null && _c !== void 0 ? _c : this.columnsAsArray.find((col) => col instanceof CoreTableColumns_1.ColumnTypeMap.Quarter)) !== null && _d !== void 0 ? _d : maybeTimeColumn);
    }
    // todo: should be on owidtable
    get entityNameColumn() {
        var _a;
        return ((_a = this.getFirstColumnWithType(CoreColumnDef_1.ColumnTypeNames.EntityName)) !== null && _a !== void 0 ? _a : this.get(OwidTableConstants_1.OwidTableSlugs.entityName));
    }
    // todo: should be on owidtable
    get entityNameSlug() {
        return this.entityNameColumn.slug;
    }
    // Todo: remove this. Generally this should not be called until the data is loaded. Even then, all calls should probably be made
    // on the column itself, and not tied tightly to the idea of a time column.
    get timeColumnFormatFunction() {
        return !this.timeColumn.isMissing
            ? this.timeColumn.formatValue
            : Util_1.formatYear;
    }
    formatTime(value) {
        return this.timeColumnFormatFunction(value);
    }
    get columnsWithParseErrors() {
        return this.columnsAsArray.filter((col) => col.numErrorValues);
    }
    get numColumnsWithErrorValues() {
        return this.columnsWithParseErrors.length;
    }
    get numErrorValues() {
        return Util_1.sum(this.columnsAsArray.map((col) => col.numErrorValues));
    }
    get numValidCells() {
        return Util_1.sum(this.columnsAsArray.map((col) => col.numValues));
    }
    get rootTable() {
        return this.parent ? this.parent.rootTable : this;
    }
    /**
     * Returns a string map (aka index) where the keys are the combined string values of columnSlug[], and the values
     * are the indices for the rows that match.
     *
     * {country: "USA", population: 100}
     *
     * So `table.rowIndex(["country", "population"]).get("USA 100")` would return [0].
     *
     */
    rowIndex(columnSlugs) {
        const index = new Map();
        const keyFn = CoreTableUtils_1.makeKeyFn(this.columnStore, columnSlugs);
        this.indices.forEach((rowIndex) => {
            // todo: be smarter for string keys
            const key = keyFn(rowIndex);
            if (!index.has(key))
                index.set(key, []);
            index.get(key).push(rowIndex);
        });
        return index;
    }
    /**
     * Returns a map (aka index) where the keys are the values of the indexColumnSlug, and the values
     * are the values of the valueColumnSlug.
     *
     * {country: "USA", population: 100}
     *
     * So `table.valueIndex("country", "population").get("USA")` would return 100.
     *
     */
    valueIndex(indexColumnSlug, valueColumnSlug) {
        const indexCol = this.get(indexColumnSlug);
        const valueCol = this.get(valueColumnSlug);
        const indexValues = indexCol.valuesIncludingErrorValues;
        const valueValues = valueCol.valuesIncludingErrorValues;
        const valueIndices = new Set(valueCol.validRowIndices);
        const intersection = indexCol.validRowIndices.filter((index) => valueIndices.has(index));
        const map = new Map();
        intersection.forEach((index) => {
            map.set(indexValues[index], valueValues[index]);
        });
        return map;
    }
    grep(searchStringOrRegex) {
        return this.rowFilter((row) => {
            const line = Object.values(row).join(" ");
            return typeof searchStringOrRegex === "string"
                ? line.includes(searchStringOrRegex)
                : searchStringOrRegex.test(line);
        }, `Kept rows that matched '${searchStringOrRegex.toString()}'`);
    }
    get opposite() {
        const { parent } = this;
        const { filterMask } = this.advancedOptions;
        if (!filterMask || !parent)
            return this;
        return this.transform(parent.columnStore, this.defs, `Inversing previous filter`, CoreTableConstants_1.TransformType.InverseFilterRows, filterMask.inverse());
    }
    get oppositeColumns() {
        if (this.isRoot)
            return this;
        const columnsToDrop = new Set(this.columnSlugs);
        const defs = this.parent.columnsAsArray.filter((col) => !columnsToDrop.has(col.slug)).map((col) => col.def);
        return this.transform(this.columnStore, defs, `Inversing previous column filter`, CoreTableConstants_1.TransformType.InverseFilterColumns);
    }
    grepColumns(searchStringOrRegex) {
        const columnsToDrop = this.columnSlugs.filter((slug) => {
            return typeof searchStringOrRegex === "string"
                ? !slug.includes(searchStringOrRegex)
                : !searchStringOrRegex.test(slug);
        });
        return this.dropColumns(columnsToDrop, `Kept ${this.columnSlugs.length - columnsToDrop.length} columns that matched '${searchStringOrRegex.toString()}'.`);
    }
    rowFilter(predicate, opName) {
        return this.transform(this.columnStore, this.defs, opName, CoreTableConstants_1.TransformType.FilterRows, new FilterMask(this.numRows, this.rows.map(predicate)) // Warning: this will be slow
        );
    }
    columnFilter(columnSlug, predicate, opName) {
        return this.transform(this.columnStore, this.defs, opName, CoreTableConstants_1.TransformType.FilterRows, new FilterMask(this.numRows, this.get(columnSlug).valuesIncludingErrorValues.map(predicate)));
    }
    sortBy(slugs) {
        return this.transform(CoreTableUtils_1.sortColumnStore(this.columnStore, slugs), this.defs, `Sort by ${slugs.join(",")}`, CoreTableConstants_1.TransformType.SortRows);
    }
    sortColumns(slugs) {
        const first = this.getColumns(slugs);
        const rest = this.columnsAsArray.filter((col) => !first.includes(col));
        return this.transform(this.columnStore, [...first, ...rest].map((col) => col.def), `Sorted columns`, CoreTableConstants_1.TransformType.SortColumns);
    }
    reverse() {
        return this.transform(CoreTableUtils_1.reverseColumnStore(this.columnStore), this.defs, `Reversed row order`, CoreTableConstants_1.TransformType.SortRows);
    }
    // Assumes table is sorted by columnSlug. Returns an array representing the starting index of each new group.
    groupBoundaries(columnSlug) {
        const values = this.get(columnSlug).valuesIncludingErrorValues;
        const arr = [];
        let last;
        this.get(columnSlug).valuesIncludingErrorValues.forEach((val, index) => {
            if (val !== last) {
                arr.push(index);
                last = val;
            }
        });
        // Include the end of the last group, which doesn't result in a change in value above.
        if (values && values.length) {
            arr.push(values.length);
        }
        return arr;
    }
    get defs() {
        return this.columnsAsArray.map((col) => col.def);
    }
    get columnNames() {
        return this.columnsAsArray.map((col) => col.name);
    }
    get columnTypes() {
        return this.columnsAsArray.map((col) => col.def.type);
    }
    get columnJsTypes() {
        return this.columnsAsArray.map((col) => col.jsType);
    }
    get columnSlugs() {
        return Array.from(this._columns.keys());
    }
    get numericColumnSlugs() {
        return this._numericColumnSlugs;
    }
    get _numericColumnSlugs() {
        return this._columnsAsArray
            .filter((col) => col instanceof CoreTableColumns_1.ColumnTypeMap.Numeric)
            .map((col) => col.slug);
    }
    get _columnsAsArray() {
        return Array.from(this._columns.values());
    }
    get columnsAsArray() {
        return this._columnsAsArray;
    }
    getColumns(slugs) {
        return slugs.map((slug) => this.get(slug));
    }
    // Get the min and max for multiple columns at once
    domainFor(slugs) {
        const cols = this.getColumns(slugs);
        const mins = cols.map((col) => col.minValue);
        const maxes = cols.map((col) => col.maxValue);
        return [Util_1.min(mins), Util_1.max(maxes)];
    }
    extract(slugs = this.columnSlugs) {
        return this.rows.map((row) => slugs.map((slug) => ErrorValues_1.isNotErrorValue(row[slug]) ? row[slug] : undefined));
    }
    get isRoot() {
        return !this.parent;
    }
    dump(rowLimit = 30) {
        this.dumpPipeline();
        this.dumpColumns();
        this.dumpRows(rowLimit);
    }
    dumpPipeline() {
        // eslint-disable-next-line no-console
        console.table(this.ancestors.map((tb) => tb.explanation));
    }
    dumpColumns() {
        // eslint-disable-next-line no-console
        console.table(this.explainColumns);
    }
    rowsFrom(start, end) {
        if (start >= this.numRows)
            return [];
        if (end > this.numRows)
            end = this.numRows;
        return Util_1.range(start, end).map((index) => CoreTableUtils_1.makeRowFromColumnStore(index, this.columnStore));
    }
    dumpRows(rowLimit = 30) {
        // eslint-disable-next-line no-console
        console.table(this.rowsFrom(0, rowLimit), this.columnSlugs);
    }
    dumpInputTable() {
        // eslint-disable-next-line no-console
        console.table(this.inputAsTable);
    }
    get inputType() {
        const { originalInput } = this;
        if (typeof originalInput === "string")
            return CoreTableConstants_1.InputType.Delimited;
        if (Array.isArray(originalInput))
            return Array.isArray(originalInput[0])
                ? CoreTableConstants_1.InputType.Matrix
                : CoreTableConstants_1.InputType.RowStore;
        return CoreTableConstants_1.InputType.ColumnStore;
    }
    get inputColumnStoreToRows() {
        return CoreTableUtils_1.columnStoreToRows(this.inputColumnStore);
    }
    get inputAsTable() {
        const { inputType } = this;
        return inputType === CoreTableConstants_1.InputType.ColumnStore
            ? this.inputColumnStoreToRows
            : inputType === CoreTableConstants_1.InputType.Matrix
                ? CoreTableUtils_1.rowsFromMatrix(this.originalInput)
                : this.originalInput;
    }
    get explainColumns() {
        return this.columnsAsArray.map((col) => {
            const { slug, jsType, name, numValues, numErrorValues, displayName, def, } = col;
            return {
                slug,
                type: def.type,
                jsType,
                name,
                numValues,
                numErrorValues,
                displayName,
                color: def.color,
            };
        });
    }
    get ancestors() {
        return this.parent ? [...this.parent.ancestors, this] : [this];
    }
    get numColsToParse() {
        return this.colsToParse.length;
    }
    get explanation() {
        // todo: is there a better way to do this in JS?
        const { tableDescription, transformCategory, guid, numColumns, numRows, betweenTime, timeToLoad, numColsToParse, numValidCells, numErrorValues, numColumnsWithErrorValues, } = this;
        return {
            tableDescription: CoreTableUtils_1.truncate(tableDescription, 40),
            transformCategory,
            guid,
            numColumns,
            numRows,
            betweenTime,
            timeToLoad,
            numColsToParse,
            numValidCells,
            numErrorValues,
            numColumnsWithErrorValues,
        };
    }
    // Output a pretty table for consles
    toAlignedTextTable(options) {
        return CoreTablePrinters_1.toAlignedTextTable(this.columnSlugs, this.rows, options);
    }
    toMarkdownTable() {
        return CoreTablePrinters_1.toMarkdownTable(this.columnSlugs, this.rows);
    }
    toDelimited(delimiter = ",", columnSlugs = this.columnSlugs, rows = this.rows) {
        return CoreTablePrinters_1.toDelimited(delimiter, columnSlugs, rows);
    }
    toTsv() {
        return this.toDelimited("\t");
    }
    toCsvWithColumnNames() {
        const delimiter = ",";
        const header = this.columnsAsArray
            .map((col) => Util_1.csvEscape(col.name))
            .join(delimiter) + "\n";
        const body = this.rows
            .map((row) => this.columnsAsArray.map((col) => { var _a; return (_a = col.formatForCsv(row[col.slug])) !== null && _a !== void 0 ? _a : ""; }))
            .map((row) => row.join(delimiter))
            .join("\n");
        return header + body;
    }
    // Get all the columns that only have 1 value
    get constantColumns() {
        return this.columnsAsArray.filter((col) => col.isConstant);
    }
    rowsAt(indices) {
        const { columnStore } = this;
        return indices.map((index) => CoreTableUtils_1.makeRowFromColumnStore(index, columnStore));
    }
    findRows(query) {
        return this.rowsAt(this.findRowsIndices(query));
    }
    findRowsIndices(query) {
        const slugs = Object.keys(query);
        if (!slugs.length)
            return this.indices;
        const arrs = this.getColumns(slugs).map((col) => col.indicesWhere(query[col.slug]));
        return Util_1.intersection(...arrs);
    }
    indexOf(row) {
        var _a;
        return (_a = this.findRowsIndices(row)[0]) !== null && _a !== void 0 ? _a : -1;
    }
    where(query) {
        const rows = this.findRows(query);
        const queryDescription = Object.entries(query)
            .map(([col, value]) => `${col}=${value}`)
            .join("&");
        return this.transform(rows, this.defs, `Selecting ${rows.length} rows where ${queryDescription}`, CoreTableConstants_1.TransformType.FilterRows);
    }
    appendRows(rows, opDescription) {
        return this.concat([new this.constructor(rows, this.defs)], opDescription);
    }
    limit(howMany, offset = 0) {
        const start = offset;
        const end = offset + howMany;
        return this.transform(this.columnStore, this.defs, `Kept ${howMany} rows starting at ${offset}`, CoreTableConstants_1.TransformType.FilterRows, new FilterMask(this.numRows, this.indices.map((index) => index >= start && index < end)));
    }
    updateDefs(fn) {
        return this.transform(this.columnStore, this.defs.map(fn), `Updated column defs`, CoreTableConstants_1.TransformType.UpdateColumnDefs);
    }
    limitColumns(howMany, offset = 0) {
        const slugs = this.columnSlugs.slice(offset, howMany + offset);
        return this.dropColumns(slugs, `Kept ${howMany} columns and dropped '${slugs}'`);
    }
    select(slugs) {
        const columnsToKeep = new Set(slugs);
        const newStore = {};
        const defs = this.columnsAsArray
            .filter((col) => columnsToKeep.has(col.slug))
            .map((col) => col.def);
        Object.keys(this.columnStore)
            .filter((slug) => columnsToKeep.has(slug))
            .forEach((slug) => {
            newStore[slug] = this.columnStore[slug];
        });
        return this.transform(newStore, defs, `Kept columns '${slugs}'`, CoreTableConstants_1.TransformType.FilterColumns);
    }
    dropColumns(slugs, message) {
        const columnsToDrop = new Set(slugs);
        const newStore = Object.assign({}, this.columnStore);
        const defs = this.columnsAsArray
            .filter((col) => !columnsToDrop.has(col.slug))
            .map((col) => col.def);
        slugs.forEach((slug) => {
            delete newStore[slug];
        });
        return this.transform(newStore, defs, message !== null && message !== void 0 ? message : `Dropped columns '${slugs}'`, CoreTableConstants_1.TransformType.FilterColumns);
    }
    get duplicateRowIndices() {
        const keyFn = CoreTableUtils_1.makeKeyFn(this.columnStore, this.columnSlugs);
        const dupeSet = new Set();
        const dupeIndices = [];
        this.indices.forEach((rowIndex) => {
            const key = keyFn(rowIndex);
            if (dupeSet.has(key))
                dupeIndices.push(rowIndex);
            else
                dupeSet.add(key);
        });
        return dupeIndices;
    }
    dropDuplicateRows() {
        return this.dropRowsAt(this.duplicateRowIndices);
    }
    isRowEmpty(index) {
        const { columnStore } = this;
        return (this.columnSlugs
            .map((slug) => columnStore[slug][index])
            .filter((value) => ErrorValues_1.isNotErrorValue(value) && value !== "")
            .length === 0);
    }
    dropEmptyRows() {
        return this.dropRowsAt(this.indices
            .map((index) => (this.isRowEmpty(index) ? index : null))
            .filter(isPresent_1.isPresent));
    }
    renameColumn(oldSlug, newSlug) {
        return this.renameColumns({ [oldSlug]: newSlug });
    }
    // Todo: improve typings. After renaming a column the row interface should change. Applies to some other methods as well.
    renameColumns(columnRenameMap) {
        const oldSlugs = Object.keys(columnRenameMap);
        const newSlugs = Object.values(columnRenameMap);
        const message = `Renamed ` +
            oldSlugs
                .map((name, index) => `'${name}' to '${newSlugs[index]}'`)
                .join(" and ");
        return this.transform(CoreTableUtils_1.renameColumnStore(this.columnStore, columnRenameMap), this.defs.map((def) => oldSlugs.indexOf(def.slug) > -1
            ? Object.assign(Object.assign({}, def), { slug: newSlugs[oldSlugs.indexOf(def.slug)] }) : def), message, CoreTableConstants_1.TransformType.RenameColumns);
    }
    dropRowsAt(indices, message) {
        return this.transform(this.columnStore, this.defs, message !== null && message !== void 0 ? message : `Dropping ${indices.length} rows`, CoreTableConstants_1.TransformType.FilterRows, new FilterMask(this.numRows, indices, false));
    }
    // for testing. Preserves ordering.
    dropRandomRows(howMany = 1, seed = Date.now()) {
        if (!howMany)
            return this; // todo: clone?
        const indexesToDrop = CoreTableUtils_1.getDropIndexes(this.numRows, howMany, seed);
        return this.dropRowsAt(Array.from(indexesToDrop.values()), `Dropping a random ${howMany} rows`);
    }
    replaceNonPositiveCellsForLogScale(columnSlugs = []) {
        return this.transform(CoreTableUtils_1.replaceCells(this.columnStore, columnSlugs, (val) => val <= 0 ? ErrorValues_1.ErrorValueTypes.InvalidOnALogScale : val), this.defs, `Replaced negative or zero cells across columns ${columnSlugs.join(" and ")}`, CoreTableConstants_1.TransformType.UpdateRows);
    }
    replaceNonNumericCellsWithErrorValues(columnSlugs) {
        return this.transform(CoreTableUtils_1.replaceCells(this.columnStore, columnSlugs, (val) => !Util_1.isNumber(val) ? ErrorValues_1.ErrorValueTypes.NaNButShouldBeNumber : val), this.defs, `Replaced non-numeric cells across columns ${columnSlugs.join(", ")}`, CoreTableConstants_1.TransformType.UpdateRows);
    }
    replaceRandomCells(howMany = 1, columnSlugs = [], seed = Date.now(), replacementGenerator = () => ErrorValues_1.ErrorValueTypes.DroppedForTesting) {
        return this.transform(CoreTableUtils_1.replaceRandomCellsInColumnStore(this.columnStore, howMany, columnSlugs, seed, replacementGenerator), this.defs, `Replaced a random ${howMany} cells in ${columnSlugs.join(" and ")}`, CoreTableConstants_1.TransformType.UpdateRows);
    }
    dropRandomPercent(dropHowMuch = 1, seed = Date.now()) {
        return this.dropRandomRows(Math.floor((dropHowMuch / 100) * this.numRows), seed);
    }
    isGreaterThan(columnSlug, value, opName) {
        return this.columnFilter(columnSlug, (colValue) => colValue > value, opName !== null && opName !== void 0 ? opName : `Filter where ${columnSlug} > ${value}`);
    }
    filterNegativesForLogScale(columnSlug) {
        return this.isGreaterThan(columnSlug, 0, `Remove rows if ${columnSlug} is <= 0 for log scale`);
    }
    filterNegatives(slug) {
        return this.columnFilter(slug, (value) => value >= 0, `Filter negative values for ${slug}`);
    }
    appendColumns(defs) {
        return this.transform(this.columnStore, this.defs.concat(defs), `Appended columns ${defs
            .map((def) => `'${def.slug}'`)
            .join(" and ")}`, CoreTableConstants_1.TransformType.AppendColumns);
    }
    duplicateColumn(slug, overrides) {
        return this.transform(Object.assign(Object.assign({}, this.columnStore), { [overrides.slug]: this.columnStore[slug] }), this.defs.concat([
            Object.assign(Object.assign({}, this.get(slug).def), overrides),
        ]), `Duplicated column '${slug}' to column '${overrides.slug}'`, CoreTableConstants_1.TransformType.AppendColumns);
    }
    transpose(by, columnTypeNameForNewColumns = CoreColumnDef_1.ColumnTypeNames.Numeric) {
        const newColumnSlugs = [by, ...this.get(by).uniqValues];
        const newColumnDefs = newColumnSlugs.map((slug) => {
            if (slug === by)
                return { slug };
            return {
                type: columnTypeNameForNewColumns,
                slug,
            };
        });
        const newRowValues = this.columnsAsArray
            .filter((col) => col.slug !== by)
            .map((col) => [col.slug, ...col.valuesIncludingErrorValues]);
        return this.transform([newColumnSlugs, ...newRowValues], newColumnDefs, `Transposed`, CoreTableConstants_1.TransformType.Transpose);
    }
    columnIntersection(tables) {
        return Util_1.intersection(this.columnSlugs, ...tables.map((table) => table.columnSlugs));
    }
    intersectingRowIndices(tables) {
        const columnSlugs = this.columnIntersection(tables);
        if (!columnSlugs.length)
            return [];
        const thisIndex = this.rowIndex(columnSlugs);
        const indices = [
            thisIndex,
            ...tables.map((table) => table.rowIndex(columnSlugs)),
        ];
        const keys = Util_1.intersectionOfSets(indices.map((index) => new Set(index.keys())));
        return Array.from(keys).map((key) => thisIndex.get(key)[0]); // Only include first match if many b/c we are treating tables as sets here
    }
    intersection(tables) {
        return this.transform(this.columnStore, this.defs, `Keeping only rows also in all tables`, CoreTableConstants_1.TransformType.FilterRows, new FilterMask(this.numRows, this.intersectingRowIndices(tables), true));
    }
    difference(tables) {
        return this.transform(this.columnStore, this.defs, `Keeping only rows not in all other tables`, CoreTableConstants_1.TransformType.FilterRows, new FilterMask(this.numRows, this.intersectingRowIndices(tables), false));
    }
    appendColumnsIfNew(defs) {
        return this.appendColumns(defs.filter((def) => !this.has(def.slug)));
    }
    toMatrix() {
        const slugs = this.columnSlugs;
        const rows = this.rows.map((row) => slugs.map((slug) => ErrorValues_1.isNotErrorValue(row[slug]) ? row[slug] : undefined));
        return [this.columnSlugs, ...rows];
    }
    // Same as toMatrix, but preserves error types
    toTypedMatrix() {
        const slugs = this.columnSlugs;
        const rows = this.rows.map((row) => slugs.map((slug) => row[slug]));
        return [this.columnSlugs, ...rows];
    }
    defToObject() {
        const output = {};
        this.columnsAsArray.forEach((col) => {
            output[col.slug] = col.def;
        });
        return output;
    }
    toJs() {
        return {
            columns: this.defToObject(),
            rows: this.rows,
        };
    }
    join(destinationTable, sourceTable, by) {
        by =
            by !== null && by !== void 0 ? by : Util_1.intersection(sourceTable.columnSlugs, destinationTable.columnSlugs);
        const columnSlugsToAdd = Util_1.difference(sourceTable.columnSlugs, destinationTable.columnSlugs);
        const defsToAdd = sourceTable
            .getColumns(columnSlugsToAdd)
            .map((col) => {
            const def = Object.assign({}, col.def);
            def.values = [];
            return def;
        });
        const rightIndex = sourceTable.rowIndex(by);
        const sourceColumns = sourceTable.columnStore;
        const keyFn = CoreTableUtils_1.makeKeyFn(destinationTable.columnStore, by);
        destinationTable.indices.forEach((rowIndex) => {
            const matchingRightRowIndex = rightIndex.get(keyFn(rowIndex));
            defsToAdd.forEach((def) => {
                var _a, _b;
                if (matchingRightRowIndex !== undefined)
                    (_a = def.values) === null || _a === void 0 ? void 0 : _a.push(sourceColumns[def.slug][matchingRightRowIndex[0]]);
                // todo: use first or last match?
                else
                    (_b = def.values) === null || _b === void 0 ? void 0 : _b.push(ErrorValues_1.ErrorValueTypes.NoMatchingValueAfterJoin);
            });
        });
        return defsToAdd;
    }
    concat(tables, message = `Combined tables`) {
        const all = [this, ...tables];
        const defs = Util_1.flatten(all.map((table) => table.defs));
        const uniqDefs = Util_1.uniqBy(defs, (def) => def.slug);
        return this.transform(CoreTableUtils_1.concatColumnStores(all.map((table) => table.columnStore), uniqDefs.map((def) => def.slug)), uniqDefs, message, CoreTableConstants_1.TransformType.Concat);
    }
    /**
     * Ensure a row exists for all values in columnSlug1 × columnSlug2 × ...
     *
     * For example, if we have a table:
     *
     *   ```
     *   entityName, year, …
     *   UK, 2000, …
     *   UK, 2005, …
     *   USA, 2003, …
     *   ```
     *
     * After `complete(["entityName", "year"])`, we'd get:
     *
     *   ```
     *   entityName, year, …
     *   UK, 2000, …
     *   UK, 2003, …
     *   UK, 2005, …
     *   USA, 2000, …
     *   USA, 2003, …
     *   USA, 2005, …
     *   ```
     *
     */
    complete(columnSlugs) {
        const index = this.rowIndex(columnSlugs);
        const cols = this.getColumns(columnSlugs);
        const product = CoreTableUtils_1.cartesianProduct(...cols.map((col) => col.uniqValues));
        const toAdd = product.filter((row) => !index.has(row.join(" ")));
        return this.appendRows(CoreTableUtils_1.rowsFromMatrix([columnSlugs, ...toAdd]), `Append missing combos of ${columnSlugs}`);
    }
    leftJoin(rightTable, by) {
        return this.appendColumns(this.join(this, rightTable, by));
    }
    rightJoin(rightTable, by) {
        return rightTable.leftJoin(this, by); // todo: change parent?
    }
    innerJoin(rightTable, by) {
        const defs = this.join(this, rightTable, by);
        const newValues = defs.map((def) => def.values);
        const rowsToDrop = [];
        newValues.forEach((col) => {
            col === null || col === void 0 ? void 0 : col.forEach((value, index) => {
                if (value === ErrorValues_1.ErrorValueTypes.NoMatchingValueAfterJoin)
                    rowsToDrop.push(index);
            });
        });
        return this.appendColumns(defs).dropRowsAt(rowsToDrop);
    }
    fullJoin(rightTable, by) {
        return this.leftJoin(rightTable, by)
            .concat([rightTable.leftJoin(this, by)])
            .dropDuplicateRows();
    }
    union(tables) {
        return this.concat(tables).dropDuplicateRows();
    }
    indexBy(slug) {
        const map = new Map();
        this.get(slug).values.map((value, index) => {
            if (!map.has(value))
                map.set(value, []);
            map.get(value).push(index);
        });
        return map;
    }
    groupBy(by) {
        const index = this.indexBy(by);
        return Array.from(index.keys()).map((groupName) => this.transform(this.columnStore, this.defs, `Rows for group ${groupName}`, CoreTableConstants_1.TransformType.FilterRows, new FilterMask(this.numRows, index.get(groupName))));
    }
    reduce(reductionMap) {
        const lastRow = Object.assign({}, this.lastRow);
        Object.keys(reductionMap).forEach((slug) => {
            const prop = reductionMap[slug];
            const col = this.get(slug);
            if (typeof prop === "string")
                lastRow[slug] = col[prop];
            else
                lastRow[slug] = prop(col);
        });
        return this.transform(CoreTableUtils_1.rowsToColumnStore([lastRow]), this.defs, `Reduced table`, CoreTableConstants_1.TransformType.Reduce);
    }
}
CoreTable.guids = 0;
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "transformCategory", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "inputColumnStore", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "columnStore", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "delimitedAsColumnStore", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "rows", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "indices", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "firstRow", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "lastRow", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "numRows", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "numColumns", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "timeColumn", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "entityNameColumn", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "entityNameSlug", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "timeColumnFormatFunction", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "columnsWithParseErrors", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "numColumnsWithErrorValues", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "numErrorValues", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "numValidCells", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "oppositeColumns", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "defs", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "columnNames", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "columnTypes", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "columnJsTypes", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "columnSlugs", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "numericColumnSlugs", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "columnsAsArray", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "inputType", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "inputColumnStoreToRows", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "inputAsTable", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "explainColumns", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "numColsToParse", null);
__decorate([
    CoreTableUtils_1.imemo
], CoreTable.prototype, "duplicateRowIndices", null);
exports.CoreTable = CoreTable;
class FilterMask {
    constructor(numRows, input, keepThese = true) {
        this.numRows = numRows;
        if (typeof input[0] === "boolean")
            this.mask = input;
        else {
            const set = new Set(input);
            this.mask = Util_1.range(0, numRows).map((index) => set.has(index) ? keepThese : !keepThese);
        }
    }
    inverse() {
        return new FilterMask(this.numRows, this.mask.map((bit) => !bit));
    }
    apply(columnStore) {
        const columnsObject = {};
        Object.keys(columnStore).forEach((slug) => {
            columnsObject[slug] = columnStore[slug].filter((slug, index) => this.mask[index]);
        });
        return columnsObject;
    }
}
/**
 * Allows you to store your column definitions in CSV/TSV like:
 * slug,name,type etc.
 *
 * todo: define all column def property types
 */
const columnDefinitionsFromDelimited = (delimited) => new CoreTable(delimited.trim()).columnFilter("slug", (value) => !!value, "Keep only column defs with a slug").rows;
exports.columnDefinitionsFromDelimited = columnDefinitionsFromDelimited;
//# sourceMappingURL=CoreTable.js.map