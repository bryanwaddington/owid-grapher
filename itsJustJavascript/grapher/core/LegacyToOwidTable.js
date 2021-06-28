"use strict";
// todo: Remove this file when we've migrated OWID data and OWID charts to next version
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyToOwidTableAndDimensions = void 0;
const GrapherConstants_1 = require("../core/GrapherConstants");
const CoreColumnDef_1 = require("../../coreTable/CoreColumnDef");
const Util_1 = require("../../clientUtils/Util");
const OwidTableConstants_1 = require("../../coreTable/OwidTableConstants");
const OwidTable_1 = require("../../coreTable/OwidTable");
const owidTypes_1 = require("../../clientUtils/owidTypes");
const legacyToOwidTableAndDimensions = (json, grapherConfig) => {
    // Entity meta map
    var _a;
    const entityMetaById = json.entityKey;
    // Color maps
    const entityColorMap = new Map();
    const columnColorMap = new Map();
    const dimensions = grapherConfig.dimensions || [];
    (_a = grapherConfig.selectedData) === null || _a === void 0 ? void 0 : _a.filter((item) => item.entityId && item.color).forEach((item) => {
        var _a;
        entityColorMap.set(item.entityId, item.color);
        const varId = (_a = dimensions[item.index]) === null || _a === void 0 ? void 0 : _a.variableId;
        if (varId)
            columnColorMap.set(varId.toString(), item.color);
    });
    // Base column defs, shared by all variable tables
    const baseColumnDefs = new Map();
    OwidTableConstants_1.StandardOwidColumnDefs.forEach((def) => {
        baseColumnDefs.set(def.slug, def);
    });
    const colorColumnSlug = entityColorMap.size > 0 || grapherConfig.selectedEntityColors
        ? OwidTableConstants_1.OwidTableSlugs.entityColor
        : undefined;
    if (colorColumnSlug) {
        baseColumnDefs.set(colorColumnSlug, {
            slug: colorColumnSlug,
            type: CoreColumnDef_1.ColumnTypeNames.Color,
            name: colorColumnSlug,
        });
    }
    // We need to create a column for each unique [variable, targetTime] pair. So there can be
    // multiple columns for a single variable.
    const newDimensions = dimensions.map((dimension) => (Object.assign(Object.assign({}, dimension), { slug: dimension.targetYear
            ? `${dimension.variableId}-${dimension.targetYear}`
            : `${dimension.variableId}` })));
    const dimensionColumns = Util_1.uniqBy(newDimensions, (dim) => dim.slug);
    const variableTables = dimensionColumns.map((dimension) => {
        var _a, _b, _c, _d, _e;
        const variable = json.variables[dimension.variableId];
        // Copy the base columnDef
        const columnDefs = new Map(baseColumnDefs);
        // Time column
        const timeColumnDef = timeColumnDefFromLegacyVariable(variable);
        columnDefs.set(timeColumnDef.slug, timeColumnDef);
        // Value column
        const valueColumnDef = columnDefFromLegacyVariable(variable);
        const valueColumnColor = (_b = (_a = dimension.display) === null || _a === void 0 ? void 0 : _a.color) !== null && _b !== void 0 ? _b : columnColorMap.get(dimension.variableId.toString());
        // Ensure the column slug is unique by copying it from the dimensions
        // (there can be two columns of the same variable with different targetTimes)
        valueColumnDef.slug = dimension.slug;
        if (valueColumnColor) {
            valueColumnDef.color = valueColumnColor;
        }
        if (dimension) {
            valueColumnDef.display = Object.assign(Object.assign({}, Util_1.trimObject(valueColumnDef.display)), Util_1.trimObject(dimension.display));
        }
        columnDefs.set(valueColumnDef.slug, valueColumnDef);
        // Annotations column
        const [annotationMap, annotationColumnDef,] = annotationMapAndDefFromLegacyVariable(variable);
        // Column values
        const times = timeColumnValuesFromLegacyVariable(variable);
        const entityIds = (_c = variable.entities) !== null && _c !== void 0 ? _c : [];
        const entityNames = entityIds.map((id) => entityMetaById[id].name);
        const entityCodes = entityIds.map((id) => entityMetaById[id].code);
        // If there is a conversionFactor, apply it.
        let values = variable.values || [];
        const conversionFactor = (_d = valueColumnDef.display) === null || _d === void 0 ? void 0 : _d.conversionFactor;
        if (conversionFactor !== undefined) {
            values = values.map((value) => Util_1.isNumber(value) ? value * conversionFactor : value);
        }
        const columnStore = {
            [OwidTableConstants_1.OwidTableSlugs.entityId]: entityIds,
            [OwidTableConstants_1.OwidTableSlugs.entityCode]: entityCodes,
            [OwidTableConstants_1.OwidTableSlugs.entityName]: entityNames,
            [timeColumnDef.slug]: times,
            [valueColumnDef.slug]: values,
        };
        if (annotationColumnDef) {
            columnStore[annotationColumnDef.slug] = entityNames.map((entityName) => annotationMap.get(entityName));
        }
        if (colorColumnSlug) {
            columnStore[colorColumnSlug] = entityIds.map((entityId) => {
                var _a, _b;
                return (_b = (_a = grapherConfig.selectedEntityColors) === null || _a === void 0 ? void 0 : _a[entityMetaById[entityId].name]) !== null && _b !== void 0 ? _b : entityColorMap.get(entityId);
            });
        }
        // Build the tables
        let variableTable = new OwidTable_1.OwidTable(columnStore, Array.from(columnDefs.values()), 
        // Because database columns can contain mixed types, we want to avoid
        // parsing for Grapher data until we fix that.
        { skipParsing: true });
        // If there is a targetTime set on the dimension, we need to perform the join on the
        // entities columns only, excluding any time columns.
        // We do this by dropping the column. We interpolate before which adds an originalTime
        // column which can be used to recover the time.
        const targetTime = dimension === null || dimension === void 0 ? void 0 : dimension.targetYear;
        if (grapherConfig.type === GrapherConstants_1.ChartTypeName.ScatterPlot &&
            Util_1.isNumber(targetTime)) {
            variableTable = variableTable
                // interpolateColumnWithTolerance() won't handle injecting times beyond the current
                // allTimes. So if targetYear is 2018, and we have data up to 2017, the
                // interpolation won't add the 2018 rows (unless we apply the interpolation after
                // the big join).
                // This is why we use filterByTargetTimes() which handles that case.
                .filterByTargetTimes([targetTime], (_e = valueColumnDef.display) === null || _e === void 0 ? void 0 : _e.tolerance)
                // Interpolate with 0 to add originalTimes column
                .interpolateColumnWithTolerance(valueColumnDef.slug, 0)
                // Drop the time column to join table only on entity
                .dropColumns([timeColumnDef.slug]);
        }
        return variableTable;
    });
    let joinedVariablesTable = variableTables.length
        ? fullJoinTables(variableTables)
        : new OwidTable_1.OwidTable();
    // Inject a common "time" column that is used as the main time column for the table
    // e.g. for the timeline.
    for (const dayOrYearSlug of [OwidTableConstants_1.OwidTableSlugs.day, OwidTableConstants_1.OwidTableSlugs.year]) {
        if (joinedVariablesTable.columnSlugs.includes(dayOrYearSlug)) {
            joinedVariablesTable = joinedVariablesTable.duplicateColumn(dayOrYearSlug, {
                slug: OwidTableConstants_1.OwidTableSlugs.time,
                name: OwidTableConstants_1.OwidTableSlugs.time,
            });
            // Do not inject multiple columns, terminate after one is successful
            break;
        }
    }
    return { dimensions: newDimensions, table: joinedVariablesTable };
};
exports.legacyToOwidTableAndDimensions = legacyToOwidTableAndDimensions;
const fullJoinTables = (tables) => tables.reduce((joinedTable, table) => joinedTable.fullJoin(table));
const columnDefFromLegacyVariable = (variable) => {
    var _a;
    const slug = variable.id.toString(); // For now, the variableId will be the column slug
    const { unit, shortUnit, description, coverage, datasetId, datasetName, source, display, } = variable;
    // Without this the much used var 123 appears as "Countries Continent". We could rename in Grapher but not sure the effects of that.
    const isContinent = variable.id == 123;
    const name = isContinent ? "Continent" : variable.name;
    return {
        name,
        slug,
        isDailyMeasurement: (_a = variable.display) === null || _a === void 0 ? void 0 : _a.yearIsDay,
        unit,
        shortUnit,
        description,
        coverage,
        datasetId,
        datasetName,
        display,
        source,
        owidVariableId: variable.id,
        type: isContinent ? CoreColumnDef_1.ColumnTypeNames.Continent : CoreColumnDef_1.ColumnTypeNames.Numeric,
    };
};
const timeColumnDefFromLegacyVariable = (variable) => {
    var _a;
    return ((_a = variable.display) === null || _a === void 0 ? void 0 : _a.yearIsDay)
        ? {
            slug: OwidTableConstants_1.OwidTableSlugs.day,
            type: CoreColumnDef_1.ColumnTypeNames.Day,
            name: "Day",
        }
        : {
            slug: OwidTableConstants_1.OwidTableSlugs.year,
            type: CoreColumnDef_1.ColumnTypeNames.Year,
            name: "Year",
        };
};
const timeColumnValuesFromLegacyVariable = (variable) => {
    const { display, years } = variable;
    const yearsNeedTransform = display &&
        display.yearIsDay &&
        display.zeroDay !== undefined &&
        display.zeroDay !== owidTypes_1.EPOCH_DATE;
    const yearsRaw = years || [];
    return yearsNeedTransform
        ? convertLegacyYears(yearsRaw, display.zeroDay)
        : yearsRaw;
};
const convertLegacyYears = (years, zeroDay) => {
    // Only shift years if the variable zeroDay is different from EPOCH_DATE
    // When the dataset uses days (`yearIsDay == true`), the days are expressed as integer
    // days since the specified `zeroDay`, which can be different for different variables.
    // In order to correctly join variables with different `zeroDay`s in a single chart, we
    // normalize all days to be in reference to a single epoch date.
    const diff = Util_1.diffDateISOStringInDays(zeroDay, owidTypes_1.EPOCH_DATE);
    return years.map((y) => y + diff);
};
const annotationMapAndDefFromLegacyVariable = (variable) => {
    var _a;
    if ((_a = variable.display) === null || _a === void 0 ? void 0 : _a.entityAnnotationsMap) {
        const slug = Util_1.makeAnnotationsSlug(variable.id.toString());
        const annotationMap = annotationsToMap(variable.display.entityAnnotationsMap);
        const columnDef = {
            slug,
            type: CoreColumnDef_1.ColumnTypeNames.SeriesAnnotation,
            name: slug,
        };
        return [annotationMap, columnDef];
    }
    return [];
};
const annotationsToMap = (annotations) => {
    // Todo: let's delete this and switch to traditional columns
    const entityAnnotationsMap = new Map();
    const delimiter = ":";
    annotations.split("\n").forEach((line) => {
        const [key, ...words] = line.split(delimiter);
        entityAnnotationsMap.set(key.trim(), words.join(delimiter).trim());
    });
    return entityAnnotationsMap;
};
//# sourceMappingURL=LegacyToOwidTable.js.map