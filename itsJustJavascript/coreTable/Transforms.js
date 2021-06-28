"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTransforms = exports.AvailableTransforms = exports.computeRollingAverage = exports.insertMissingValuePlaceholders = void 0;
const Util_1 = require("../clientUtils/Util");
const ErrorValues_1 = require("./ErrorValues");
// In Grapher we return just the years for which we have values for. This puts MissingValuePlaceholder
// in the spots where we are missing values (added to make computing rolling windows easier).
// Takes an array of value/year pairs and expands it so that there is an undefined
// for each missing value from the first year to the last year, preserving the position of
// the existing values.
const insertMissingValuePlaceholders = (values, times) => {
    const startTime = times[0];
    const endTime = times[times.length - 1];
    const filledRange = [];
    let time = startTime;
    const timeToValueIndex = new Map();
    times.forEach((time, index) => {
        timeToValueIndex.set(time, index);
    });
    while (time <= endTime) {
        filledRange.push(timeToValueIndex.has(time)
            ? values[timeToValueIndex.get(time)]
            : ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder);
        time++;
    }
    return filledRange;
};
exports.insertMissingValuePlaceholders = insertMissingValuePlaceholders;
// todo: add the precision param to ensure no floating point effects
function computeRollingAverage(numbers, windowSize, align = "right") {
    const result = [];
    for (let valueIndex = 0; valueIndex < numbers.length; valueIndex++) {
        // If a value is undefined in the original input, keep it undefined in the output
        const currentVal = numbers[valueIndex];
        if (currentVal === null) {
            result[valueIndex] = ErrorValues_1.ErrorValueTypes.NullButShouldBeNumber;
            continue;
        }
        else if (currentVal === undefined) {
            result[valueIndex] = ErrorValues_1.ErrorValueTypes.UndefinedButShouldBeNumber;
            continue;
        }
        else if (currentVal instanceof ErrorValues_1.ErrorValue) {
            result[valueIndex] = currentVal;
            continue;
        }
        // Take away 1 for the current value (windowSize=1 means no smoothing & no expansion)
        const expand = windowSize - 1;
        // With centered smoothing, expand uneven windows asymmetrically (ceil & floor) to ensure
        // a correct number of window values get taken into account.
        // Arbitrarily biased towards left (past).
        const expandLeft = align === "center" ? Math.ceil(expand / 2) : expand;
        const expandRight = align === "center" ? Math.floor(expand / 2) : 0;
        const startIndex = Math.max(valueIndex - expandLeft, 0);
        const endIndex = Math.min(valueIndex + expandRight, numbers.length - 1);
        let count = 0;
        let sum = 0;
        for (let windowIndex = startIndex; windowIndex <= endIndex; windowIndex++) {
            const value = numbers[windowIndex];
            if (value !== undefined &&
                value !== null &&
                !(value instanceof ErrorValues_1.ErrorValue)) {
                sum += value;
                count++;
            }
        }
        result[valueIndex] = sum / count;
    }
    return result;
}
exports.computeRollingAverage = computeRollingAverage;
// Assumptions: data is sorted by entity, then time
// todo: move tests over from CE
const timeSinceEntityExceededThreshold = (columnStore, timeSlug, entitySlug, columnSlug, thresholdAsString) => {
    const threshold = parseFloat(thresholdAsString);
    const groupValues = columnStore[entitySlug];
    const columnValues = columnStore[columnSlug];
    const timeValues = columnStore[timeSlug];
    let currentGroup;
    let groupExceededThresholdAtTime;
    return columnValues.map((value, index) => {
        const group = groupValues[index];
        const currentTime = timeValues[index];
        if (group !== currentGroup) {
            if (!ErrorValues_1.isNotErrorValue(value))
                return value;
            if (value < threshold)
                return ErrorValues_1.ErrorValueTypes.ValueTooLow;
            currentGroup = group;
            groupExceededThresholdAtTime = currentTime;
        }
        return currentTime - groupExceededThresholdAtTime;
    });
};
// Assumptions: data is sorted by entity, then time
// todo: move tests over from CE
const rollingAverage = (columnStore, timeSlug, entitySlug, columnSlug, windowSize) => {
    const entityNames = columnStore[entitySlug];
    const columnValues = columnStore[columnSlug];
    const timeValues = columnStore[timeSlug];
    const len = entityNames.length;
    if (!len)
        return [];
    let currentEntity = entityNames[0];
    let currentValues = [];
    let currentTimes = [];
    const groups = [];
    for (let rowIndex = 0; rowIndex <= len; rowIndex++) {
        const entityName = entityNames[rowIndex];
        const value = columnValues[rowIndex];
        const time = timeValues[rowIndex];
        if (currentEntity !== entityName) {
            const averages = computeRollingAverage(exports.insertMissingValuePlaceholders(currentValues, currentTimes), windowSize).filter((value) => !(value === ErrorValues_1.ErrorValueTypes.MissingValuePlaceholder)); // filter the placeholders back out
            groups.push(averages);
            if (value === undefined)
                break; // We iterate to <= so that we push the last row
            currentValues = [];
            currentTimes = [];
            currentEntity = entityName;
        }
        currentValues.push(value);
        currentTimes.push(time);
    }
    return Util_1.flatten(groups);
};
const divideBy = (columnStore, numeratorSlug, denominatorSlug) => {
    const numeratorValues = columnStore[numeratorSlug];
    const denominatorValues = columnStore[denominatorSlug];
    return denominatorValues.map((denominator, index) => {
        if (denominator === 0)
            return ErrorValues_1.ErrorValueTypes.DivideByZeroError;
        const numerator = numeratorValues[index];
        if (!ErrorValues_1.isNotErrorValue(numerator))
            return numerator;
        if (!ErrorValues_1.isNotErrorValue(denominator))
            return denominator;
        return numerator / denominator;
    });
};
const multiplyBy = (columnStore, columnSlug, factor) => columnStore[columnSlug].map((value) => ErrorValues_1.isNotErrorValue(value) ? value * factor : value);
const subtract = (columnStore, columnSlugA, columnSlugB) => {
    const values = columnStore[columnSlugA];
    const subValues = columnStore[columnSlugB];
    return subValues.map((subValue, index) => {
        const value = values[index];
        if (!ErrorValues_1.isNotErrorValue(value))
            return value;
        if (!ErrorValues_1.isNotErrorValue(subValue))
            return subValue;
        return value - subValue;
    });
};
var WhereOperators;
(function (WhereOperators) {
    WhereOperators["is"] = "is";
    WhereOperators["isNot"] = "isNot";
    WhereOperators["isGreaterThan"] = "isGreaterThan";
    WhereOperators["isGreaterThanOrEqual"] = "isGreaterThanOrEqual";
    WhereOperators["isLessThan"] = "isLessThan";
    WhereOperators["isLessThanOrEqual"] = "isLessThanOrEqual";
})(WhereOperators || (WhereOperators = {}));
// Todo: add tests/expand capabilities/remove?
// Currently this just supports `columnSlug where someColumnSlug (isNot|is) this or that or this`
const where = (columnStore, columnSlug, conditionSlug, ...condition) => {
    const values = columnStore[columnSlug];
    const conditionValues = columnStore[conditionSlug];
    const operator = condition.shift();
    let passes = (value) => true;
    if (operator === WhereOperators.isNot || operator === WhereOperators.is) {
        const result = operator === "isNot" ? false : true;
        const list = condition.join(" ").split(" or ");
        const set = new Set(list);
        passes = (value) => (set.has(value) ? result : !result);
    }
    else if (operator === WhereOperators.isGreaterThan)
        passes = (value) => value > parseFloat(condition.join(""));
    else if (operator === WhereOperators.isGreaterThanOrEqual)
        passes = (value) => value >= parseFloat(condition.join(""));
    else if (operator === WhereOperators.isLessThan)
        passes = (value) => value < parseFloat(condition.join(""));
    else if (operator === WhereOperators.isLessThanOrEqual)
        passes = (value) => value <= parseFloat(condition.join(""));
    return values.map((value, index) => passes(conditionValues[index]) ? value : ErrorValues_1.ErrorValueTypes.FilteredValue);
};
// Assumptions: data is sorted by entity, then time, and time is a continous integer with a row for each time step.
// todo: move tests over from CE
const percentChange = (columnStore, timeSlug, entitySlug, columnSlug, windowSize) => {
    const entityNames = columnStore[entitySlug];
    const columnValues = columnStore[columnSlug];
    // If windowSize is 0 then there is zero change for every valid value
    if (!windowSize)
        return columnValues.map((val) => (ErrorValues_1.isNotErrorValue(val) ? 0 : val));
    let currentEntity;
    return columnValues.map((value, index) => {
        const entity = entityNames[index];
        const previousEntity = entityNames[index - windowSize];
        const previousValue = columnValues[index - windowSize];
        if (!currentEntity ||
            currentEntity !== entity ||
            previousEntity !== entity) {
            currentEntity = entity;
            return ErrorValues_1.ErrorValueTypes.NoValueToCompareAgainst;
        }
        if (previousValue instanceof ErrorValues_1.ErrorValue)
            return previousValue;
        if (value instanceof ErrorValues_1.ErrorValue)
            return value;
        if (previousValue === 0)
            return ErrorValues_1.ErrorValueTypes.DivideByZeroError;
        if (previousValue === undefined)
            return ErrorValues_1.ErrorValueTypes.NoValueToCompareAgainst;
        return (100 * (value - previousValue)) / previousValue;
    });
};
// Todo: remove?
const asPercentageOf = (columnStore, numeratorSlug, denominatorSlug) => divideBy(columnStore, numeratorSlug, denominatorSlug).map((num) => typeof num === "number" ? 100 * num : num);
const availableTransforms = {
    asPercentageOf: asPercentageOf,
    timeSinceEntityExceededThreshold: timeSinceEntityExceededThreshold,
    divideBy: divideBy,
    rollingAverage: rollingAverage,
    percentChange: percentChange,
    multiplyBy: multiplyBy,
    subtract: subtract,
    where: where,
};
exports.AvailableTransforms = Object.keys(availableTransforms);
const applyTransforms = (columnStore, defs) => {
    defs.forEach((def) => {
        const words = def.transform.split(" ");
        const transformName = words.find((word) => availableTransforms[word] !== undefined);
        if (!transformName) {
            console.warn(`Warning: transform '${transformName}' not found`);
            return;
        }
        const params = words.filter((word) => word !== transformName);
        const fn = availableTransforms[transformName];
        try {
            columnStore[def.slug] = fn(columnStore, ...params);
        }
        catch (err) {
            console.error(`Error performing transform '${def.transform}' for column '${def.slug}'. Expected args: ${fn.length}. Provided args: ${1 + params.length}. Ran as ${transformName}(columnStore, ${params
                .map((param) => `"${param}"`)
                .join(",")}).`);
            console.error(err);
        }
    });
    return columnStore;
};
exports.applyTransforms = applyTransforms;
//# sourceMappingURL=Transforms.js.map