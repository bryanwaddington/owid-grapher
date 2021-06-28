"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPercentageColumnDef = exports.getOriginalTimeColumnSlug = exports.makeOriginalTimeSlugFromColumnSlug = exports.timeColumnSlugFromColumnDef = void 0;
const CoreColumnDef_1 = require("./CoreColumnDef");
const OwidTableConstants_1 = require("./OwidTableConstants");
function timeColumnSlugFromColumnDef(def) {
    return def.isDailyMeasurement ? OwidTableConstants_1.OwidTableSlugs.day : OwidTableConstants_1.OwidTableSlugs.year;
}
exports.timeColumnSlugFromColumnDef = timeColumnSlugFromColumnDef;
function makeOriginalTimeSlugFromColumnSlug(slug) {
    return `${slug}-originalTime`;
}
exports.makeOriginalTimeSlugFromColumnSlug = makeOriginalTimeSlugFromColumnSlug;
function getOriginalTimeColumnSlug(table, slug) {
    const originalTimeSlug = makeOriginalTimeSlugFromColumnSlug(slug);
    if (table.has(originalTimeSlug))
        return originalTimeSlug;
    return table.timeColumn.slug;
}
exports.getOriginalTimeColumnSlug = getOriginalTimeColumnSlug;
function toPercentageColumnDef(columnDef, type = CoreColumnDef_1.ColumnTypeNames.Percentage) {
    // drops all values that can hinder the correct display of a percentage column
    // (e.g. a "kWh" unit or a numDecimalPlaces value of 0)
    return Object.assign(Object.assign({}, columnDef), { type, unit: undefined, shortUnit: undefined, display: Object.assign(Object.assign({}, columnDef.display), { unit: undefined, shortUnit: undefined, numDecimalPlaces: undefined, conversionFactor: undefined }) });
}
exports.toPercentageColumnDef = toPercentageColumnDef;
//# sourceMappingURL=OwidTableUtil.js.map