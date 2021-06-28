"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyColumnsInFirstRowInDelimited = exports.sortColumnStore = exports.cartesianProduct = exports.trimArray = exports.trimEmptyRows = exports.isCellEmpty = exports.rowsToMatrix = exports.detectDelimiter = exports.parseDelimited = exports.matrixToDelimited = exports.trimMatrix = exports.rowsFromMatrix = exports.Timer = exports.replaceRandomCellsInColumnStore = exports.getDropIndexes = exports.replaceCells = exports.renameColumnStore = exports.reverseColumnStore = exports.replaceDef = exports.autodetectColumnDefs = exports.rowsToColumnStore = exports.concatColumnStores = exports.appendRowsToColumnStore = exports.imemo = exports.makeKeyFn = exports.interpolateRowValuesWithTolerance = exports.toleranceInterpolation = exports.linearInterpolation = exports.makeRowFromColumnStore = exports.guessColumnDefFromSlugAndRow = exports.standardizeSlugs = exports.makeAutoTypeFn = exports.truncate = exports.columnStoreToRows = void 0;
const d3_dsv_1 = require("d3-dsv");
const fast_cartesian_1 = __importDefault(require("fast-cartesian"));
const Util_1 = require("../clientUtils/Util");
const CoreColumnDef_1 = require("./CoreColumnDef");
const ErrorValues_1 = require("./ErrorValues");
const OwidTableConstants_1 = require("./OwidTableConstants");
const columnStoreToRows = (columnStore) => {
    const firstCol = Object.values(columnStore)[0];
    if (!firstCol)
        return [];
    const slugs = Object.keys(columnStore);
    return firstCol.map((val, index) => {
        const newRow = {};
        slugs.forEach((slug) => {
            newRow[slug] = columnStore[slug][index];
        });
        return newRow;
    });
};
exports.columnStoreToRows = columnStoreToRows;
// If string exceeds maxLength, will replace the end char with a ... and drop the rest
const truncate = (str, maxLength) => str.length > maxLength ? `${str.substr(0, maxLength - 3)}...` : str;
exports.truncate = truncate;
// Picks a type for each column from the first row then autotypes all rows after that so all values in
// a column will have the same type. Only chooses between strings and numbers.
const numberOnly = /^-?\d+\.?\d*$/;
const makeAutoTypeFn = (numericSlugs) => {
    const slugToType = {};
    numericSlugs === null || numericSlugs === void 0 ? void 0 : numericSlugs.forEach((slug) => {
        slugToType[slug] = "number";
    });
    return (object) => {
        for (const columnSlug in object) {
            const value = object[columnSlug];
            const type = slugToType[columnSlug];
            if (type === "string") {
                object[columnSlug] = value;
                continue;
            }
            const number = parseFloat(value); // The "+" type casting that d3 does for perf converts "" to 0, so use parseFloat.
            if (type === "number") {
                object[columnSlug] = isNaN(number)
                    ? ErrorValues_1.ErrorValueTypes.NaNButShouldBeNumber
                    : number;
                continue;
            }
            if (isNaN(number) || !numberOnly.test(value)) {
                object[columnSlug] = value;
                slugToType[columnSlug] = "string";
                continue;
            }
            object[columnSlug] = number;
            slugToType[columnSlug] = "number";
        }
        return object;
    };
};
exports.makeAutoTypeFn = makeAutoTypeFn;
// Removes whitespace and non-word characters from column slugs if any exist.
// The original names are moved to the name property on the column def.
const standardizeSlugs = (rows) => {
    var _a;
    const firstRow = (_a = rows[0]) !== null && _a !== void 0 ? _a : {};
    const colsToRename = Object.keys(firstRow)
        .map((name) => {
        return {
            name,
            slug: Util_1.slugifySameCase(name),
        };
    })
        .filter((col) => col.name !== col.slug);
    if (!colsToRename.length)
        return undefined;
    rows.forEach((row) => {
        colsToRename.forEach((col) => {
            row[col.slug] = row[col.name];
            delete row[col.name];
        });
    });
    return { rows, defs: colsToRename };
};
exports.standardizeSlugs = standardizeSlugs;
const guessColumnDefFromSlugAndRow = (slug, sampleValue) => {
    const valueType = typeof sampleValue;
    const name = slug;
    if (slug === "Entity")
        return {
            slug,
            type: CoreColumnDef_1.ColumnTypeNames.EntityName,
            name,
        };
    if (slug === "day")
        return {
            slug,
            type: CoreColumnDef_1.ColumnTypeNames.Day,
            name: "Day",
        };
    if (slug === "year" || slug === "Year")
        return {
            slug,
            type: CoreColumnDef_1.ColumnTypeNames.Year,
            name: "Year",
        };
    if (slug === OwidTableConstants_1.OwidTableSlugs.entityName)
        return OwidTableConstants_1.OwidEntityNameColumnDef;
    if (slug === OwidTableConstants_1.OwidTableSlugs.entityCode)
        return OwidTableConstants_1.OwidEntityCodeColumnDef;
    if (slug === OwidTableConstants_1.OwidTableSlugs.entityId)
        return OwidTableConstants_1.OwidEntityIdColumnDef;
    if (slug === "date")
        return {
            slug,
            type: CoreColumnDef_1.ColumnTypeNames.Date,
            name: "Date",
        };
    if (valueType === "number")
        return {
            slug,
            type: CoreColumnDef_1.ColumnTypeNames.Numeric,
            name,
        };
    if (valueType === "string") {
        if (sampleValue.match(/^\d+$/))
            return {
                slug,
                type: CoreColumnDef_1.ColumnTypeNames.Numeric,
                name,
            };
    }
    return { slug, type: CoreColumnDef_1.ColumnTypeNames.String, name };
};
exports.guessColumnDefFromSlugAndRow = guessColumnDefFromSlugAndRow;
const makeRowFromColumnStore = (rowIndex, columnStore) => {
    const row = {};
    const columns = Object.values(columnStore);
    Object.keys(columnStore).forEach((slug, colIndex) => {
        row[slug] = columns[colIndex][rowIndex];
    });
    return row;
};
exports.makeRowFromColumnStore = makeRowFromColumnStore;
function isNotErrorValueOrEmptyCell(value) {
    return value !== undefined && !(value instanceof ErrorValues_1.ErrorValue);
}
function linearInterpolation(valuesSortedByTimeAsc, timesAsc, context, start = 0, end = valuesSortedByTimeAsc.length) {
    if (!valuesSortedByTimeAsc.length)
        return;
    let prevNonBlankIndex = -1;
    let nextNonBlankIndex = -1;
    for (let index = start; index < end; index++) {
        const currentValue = valuesSortedByTimeAsc[index];
        if (isNotErrorValueOrEmptyCell(currentValue)) {
            prevNonBlankIndex = index;
            continue;
        }
        if (nextNonBlankIndex === -1 || nextNonBlankIndex <= index) {
            nextNonBlankIndex = Util_1.findIndexFast(valuesSortedByTimeAsc, (val) => isNotErrorValueOrEmptyCell(val), index + 1, end);
        }
        const prevValue = valuesSortedByTimeAsc[prevNonBlankIndex];
        const nextValue = valuesSortedByTimeAsc[nextNonBlankIndex];
        let value;
        if (isNotErrorValueOrEmptyCell(prevValue) &&
            isNotErrorValueOrEmptyCell(nextValue)) {
            const distLeft = index - prevNonBlankIndex;
            const distRight = nextNonBlankIndex - index;
            value =
                (prevValue * distRight + nextValue * distLeft) /
                    (distLeft + distRight);
        }
        else if (isNotErrorValueOrEmptyCell(prevValue) &&
            context.extrapolateAtEnd)
            value = prevValue;
        else if (isNotErrorValueOrEmptyCell(nextValue) &&
            context.extrapolateAtStart)
            value = nextValue;
        else
            value = ErrorValues_1.ErrorValueTypes.NoValueForInterpolation;
        prevNonBlankIndex = index;
        valuesSortedByTimeAsc[index] = value;
    }
}
exports.linearInterpolation = linearInterpolation;
function toleranceInterpolation(valuesSortedByTimeAsc, timesAsc, context, start = 0, end = valuesSortedByTimeAsc.length) {
    if (!valuesSortedByTimeAsc.length)
        return;
    let prevNonBlankIndex = undefined;
    let nextNonBlankIndex = undefined;
    for (let index = start; index < end; index++) {
        const currentValue = valuesSortedByTimeAsc[index];
        if (isNotErrorValueOrEmptyCell(currentValue)) {
            prevNonBlankIndex = index;
            continue;
        }
        if (nextNonBlankIndex !== -1 &&
            (nextNonBlankIndex === undefined || nextNonBlankIndex <= index)) {
            nextNonBlankIndex = Util_1.findIndexFast(valuesSortedByTimeAsc, isNotErrorValueOrEmptyCell, index + 1, end);
        }
        const timeOfCurrent = timesAsc[index];
        const timeOfPrevIndex = prevNonBlankIndex !== undefined
            ? timesAsc[prevNonBlankIndex]
            : -Infinity;
        const timeOfNextIndex = nextNonBlankIndex !== undefined && nextNonBlankIndex !== -1
            ? timesAsc[nextNonBlankIndex]
            : Infinity;
        const prevTimeDiff = Math.abs(timeOfPrevIndex - timeOfCurrent);
        const nextTimeDiff = Math.abs(timeOfNextIndex - timeOfCurrent);
        if (nextNonBlankIndex !== -1 &&
            nextTimeDiff <= prevTimeDiff &&
            nextTimeDiff <= context.timeTolerance) {
            valuesSortedByTimeAsc[index] =
                valuesSortedByTimeAsc[nextNonBlankIndex];
            timesAsc[index] = timesAsc[nextNonBlankIndex];
        }
        else if (prevNonBlankIndex !== undefined &&
            prevTimeDiff <= context.timeTolerance) {
            valuesSortedByTimeAsc[index] =
                valuesSortedByTimeAsc[prevNonBlankIndex];
            timesAsc[index] = timesAsc[prevNonBlankIndex];
        }
        else
            valuesSortedByTimeAsc[index] =
                ErrorValues_1.ErrorValueTypes.NoValueWithinTolerance;
    }
}
exports.toleranceInterpolation = toleranceInterpolation;
function interpolateRowValuesWithTolerance(rowsSortedByTimeAsc, valueSlug, timeSlug, timeTolerance) {
    const values = rowsSortedByTimeAsc.map((row) => row[valueSlug]);
    const times = rowsSortedByTimeAsc.map((row) => row[timeSlug]);
    toleranceInterpolation(values, times, { timeTolerance });
    return rowsSortedByTimeAsc.map((row, index) => {
        return Object.assign(Object.assign({}, row), { [valueSlug]: values[index], [timeSlug]: times[index] });
    });
}
exports.interpolateRowValuesWithTolerance = interpolateRowValuesWithTolerance;
// A dumb function for making a function that makes a key for a row given certain columns.
const makeKeyFn = (columnStore, columnSlugs) => (rowIndex) => 
// toString() handles `undefined` and `null` values, which can be in the table.
columnSlugs.map((slug) => Util_1.toString(columnStore[slug][rowIndex])).join(" ");
exports.makeKeyFn = makeKeyFn;
// Memoization for immutable getters. Run the function once for this instance and cache the result.
const imemo = (target, propertyName, descriptor) => {
    const originalFn = descriptor.get;
    descriptor.get = function () {
        const propName = `${propertyName}_memoized`;
        if (this[propName] === undefined) {
            // Define the prop the long way so we don't enumerate over it
            Object.defineProperty(this, propName, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: originalFn.apply(this),
            });
        }
        return this[propName];
    };
};
exports.imemo = imemo;
const appendRowsToColumnStore = (columnStore, rows) => {
    const slugs = Object.keys(columnStore);
    const newColumnStore = columnStore;
    slugs.forEach((slug) => {
        newColumnStore[slug] = columnStore[slug].concat(rows.map((row) => row[slug]));
    });
    return newColumnStore;
};
exports.appendRowsToColumnStore = appendRowsToColumnStore;
const getColumnStoreLength = (store) => {
    for (const slug in store) {
        return store[slug].length;
    }
    return 0;
};
const concatColumnStores = (stores, slugsToKeep) => {
    if (!stores.length)
        return {};
    const lengths = stores.map(getColumnStoreLength);
    const slugs = slugsToKeep !== null && slugsToKeep !== void 0 ? slugsToKeep : Object.keys(Util_1.first(stores));
    const newColumnStore = {};
    slugs.forEach((slug) => {
        newColumnStore[slug] = Util_1.flatten(stores.map((store, i) => {
            var _a;
            return (_a = store[slug]) !== null && _a !== void 0 ? _a : new Array(lengths[i]).fill(ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder);
        }));
    });
    return newColumnStore;
};
exports.concatColumnStores = concatColumnStores;
const rowsToColumnStore = (rows) => {
    const columnsObject = {};
    if (!rows.length)
        return columnsObject;
    Object.keys(rows[0]).forEach((slug) => {
        columnsObject[slug] = rows.map((row) => row[slug]);
    });
    return columnsObject;
};
exports.rowsToColumnStore = rowsToColumnStore;
const guessColumnDefsFromRows = (rows, definedSlugs) => {
    if (!rows[0])
        return [];
    return Object.keys(rows[0])
        .filter((slug) => !definedSlugs.has(slug))
        .map((slug) => {
        const firstRowWithValue = rows.find((row) => row[slug] !== undefined &&
            row[slug] !== null &&
            row[slug] !== "");
        const firstValue = firstRowWithValue
            ? firstRowWithValue[slug]
            : undefined;
        return exports.guessColumnDefFromSlugAndRow(slug, firstValue);
    });
};
const autodetectColumnDefs = (rowsOrColumnStore, definedSlugs) => {
    if (!Array.isArray(rowsOrColumnStore)) {
        const columnStore = rowsOrColumnStore;
        return Object.keys(columnStore)
            .filter((slug) => !definedSlugs.has(slug))
            .map((slug) => {
            return exports.guessColumnDefFromSlugAndRow(slug, columnStore[slug].find((val) => val !== undefined && val !== null));
        });
    }
    return guessColumnDefsFromRows(rowsOrColumnStore, definedSlugs);
};
exports.autodetectColumnDefs = autodetectColumnDefs;
// Convenience method when you are replacing columns
const replaceDef = (defs, newDefs) => defs.map((def) => {
    const newDef = newDefs.find((newDef) => newDef.slug === def.slug);
    return newDef !== null && newDef !== void 0 ? newDef : def;
});
exports.replaceDef = replaceDef;
const reverseColumnStore = (columnStore) => {
    const newStore = {};
    Object.keys(columnStore).forEach((slug) => {
        newStore[slug] = columnStore[slug].slice().reverse();
    });
    return newStore;
};
exports.reverseColumnStore = reverseColumnStore;
const renameColumnStore = (columnStore, columnRenameMap) => {
    const newStore = {};
    Object.keys(columnStore).forEach((slug) => {
        if (columnRenameMap[slug])
            newStore[columnRenameMap[slug]] = columnStore[slug];
        else
            newStore[slug] = columnStore[slug];
    });
    return newStore;
};
exports.renameColumnStore = renameColumnStore;
const replaceCells = (columnStore, columnSlugs, replaceFn) => {
    const newStore = Object.assign({}, columnStore);
    columnSlugs.forEach((slug) => {
        newStore[slug] = newStore[slug].map(replaceFn);
    });
    return newStore;
};
exports.replaceCells = replaceCells;
// Returns a Set of random indexes to drop in an array, preserving the order of the array
const getDropIndexes = (arrayLength, howMany, seed = Date.now()) => new Set(Util_1.sampleFrom(Util_1.range(0, arrayLength), howMany, seed));
exports.getDropIndexes = getDropIndexes;
const replaceRandomCellsInColumnStore = (columnStore, howMany = 1, columnSlugs = [], seed = Date.now(), replacementGenerator = () => ErrorValues_1.ErrorValueTypes.DroppedForTesting) => {
    const newStore = Object.assign({}, columnStore);
    columnSlugs.forEach((slug) => {
        const values = newStore[slug];
        const indexesToDrop = exports.getDropIndexes(values.length, howMany, seed);
        newStore[slug] = values.map((value, index) => indexesToDrop.has(index) ? replacementGenerator() : value);
    });
    return newStore;
};
exports.replaceRandomCellsInColumnStore = replaceRandomCellsInColumnStore;
class Timer {
    constructor() {
        this._tickTime = Date.now();
        this._firstTickTime = this._tickTime;
    }
    tick(msg) {
        const elapsed = Date.now() - this._tickTime;
        // eslint-disable-next-line no-console
        if (msg)
            console.log(`${elapsed}ms ${msg}`);
        this._tickTime = Date.now();
        return elapsed;
    }
    getTotalElapsedTime() {
        return Date.now() - this._firstTickTime;
    }
}
exports.Timer = Timer;
const rowsFromMatrix = (matrix) => {
    const table = exports.trimMatrix(matrix);
    const header = table[0];
    return table.slice(1).map((row) => {
        const newRow = {};
        header.forEach((col, index) => {
            newRow[col] = row[index];
        });
        return newRow;
    });
};
exports.rowsFromMatrix = rowsFromMatrix;
const trimEmptyColumns = (matrix) => matrix.map(exports.trimArray);
const trimMatrix = (matrix) => trimEmptyColumns(exports.trimEmptyRows(matrix));
exports.trimMatrix = trimMatrix;
const matrixToDelimited = (table, delimiter = "\t") => {
    return table
        .map((row) => row
        .map((cell) => cell === null || cell === undefined ? "" : cell)
        .join(delimiter))
        .join("\n");
};
exports.matrixToDelimited = matrixToDelimited;
const parseDelimited = (str, delimiter, parseFn) => d3_dsv_1.dsvFormat(delimiter !== null && delimiter !== void 0 ? delimiter : exports.detectDelimiter(str)).parse(str, parseFn);
exports.parseDelimited = parseDelimited;
const detectDelimiter = (str) => str.includes("\t") ? "\t" : str.includes(",") ? "," : " ";
exports.detectDelimiter = detectDelimiter;
const rowsToMatrix = (rows) => rows.length
    ? [Object.keys(rows[0]), ...rows.map((row) => Object.values(row))]
    : undefined;
exports.rowsToMatrix = rowsToMatrix;
const isRowEmpty = (row) => row.every(exports.isCellEmpty);
const isCellEmpty = (cell) => cell === null || cell === undefined || cell === "";
exports.isCellEmpty = isCellEmpty;
const trimEmptyRows = (matrix) => {
    let trimAt = undefined;
    for (let rowIndex = matrix.length - 1; rowIndex >= 0; rowIndex--) {
        if (!isRowEmpty(matrix[rowIndex]))
            break;
        trimAt = rowIndex;
    }
    return trimAt === undefined ? matrix : matrix.slice(0, trimAt);
};
exports.trimEmptyRows = trimEmptyRows;
const trimArray = (arr) => {
    let rightIndex;
    for (rightIndex = arr.length - 1; rightIndex >= 0; rightIndex--) {
        if (!exports.isCellEmpty(arr[rightIndex]))
            break;
    }
    return arr.slice(0, rightIndex + 1);
};
exports.trimArray = trimArray;
function cartesianProduct(...allEntries) {
    return fast_cartesian_1.default(allEntries);
}
exports.cartesianProduct = cartesianProduct;
const applyNewSortOrder = (arr, newOrder) => newOrder.map((index) => arr[index]);
const sortColumnStore = (columnStore, slugs) => {
    const firstCol = Object.values(columnStore)[0];
    if (!firstCol)
        return {};
    const len = firstCol.length;
    const newOrder = Util_1.range(0, len).sort(makeSortByFn(columnStore, slugs));
    const newStore = {};
    Object.keys(columnStore).forEach((slug) => {
        newStore[slug] = applyNewSortOrder(columnStore[slug], newOrder);
    });
    return newStore;
};
exports.sortColumnStore = sortColumnStore;
const makeSortByFn = (columnStore, columnSlugs) => {
    const numSlugs = columnSlugs.length;
    return (indexA, indexB) => {
        const nodeAFirst = -1;
        const nodeBFirst = 1;
        for (let slugIndex = 0; slugIndex < numSlugs; slugIndex++) {
            const slug = columnSlugs[slugIndex];
            const col = columnStore[slug];
            const av = col[indexA];
            const bv = col[indexB];
            if (av < bv)
                return nodeAFirst;
            if (av > bv)
                return nodeBFirst;
            // todo: handle ErrorValues
        }
        return 0;
    };
};
const emptyColumnsInFirstRowInDelimited = (str) => {
    var _a;
    // todo: don't split a big string here, just do a faster first line scan
    const shortCsv = exports.parseDelimited(str.split("\n").slice(0, 2).join("\n"));
    const firstRow = (_a = shortCsv[0]) !== null && _a !== void 0 ? _a : {};
    const emptySlugs = [];
    Object.keys(firstRow).forEach((slug) => {
        if (firstRow[slug] === "")
            emptySlugs.push(slug);
    });
    return emptySlugs;
};
exports.emptyColumnsInFirstRowInDelimited = emptyColumnsInFirstRowInDelimited;
//# sourceMappingURL=CoreTableUtils.js.map