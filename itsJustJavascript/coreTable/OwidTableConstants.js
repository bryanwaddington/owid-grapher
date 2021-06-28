"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardOwidColumnDefs = exports.OwidEntityCodeColumnDef = exports.OwidEntityIdColumnDef = exports.OwidEntityNameColumnDef = exports.OwidTableSlugs = void 0;
const CoreColumnDef_1 = require("./CoreColumnDef");
var OwidTableSlugs;
(function (OwidTableSlugs) {
    OwidTableSlugs["entityName"] = "entityName";
    OwidTableSlugs["entityColor"] = "entityColor";
    OwidTableSlugs["entityId"] = "entityId";
    OwidTableSlugs["entityCode"] = "entityCode";
    OwidTableSlugs["time"] = "time";
    OwidTableSlugs["day"] = "day";
    OwidTableSlugs["year"] = "year";
    OwidTableSlugs["date"] = "date";
})(OwidTableSlugs = exports.OwidTableSlugs || (exports.OwidTableSlugs = {}));
var OwidTableNames;
(function (OwidTableNames) {
    OwidTableNames["Entity"] = "Entity";
    OwidTableNames["Code"] = "Code";
})(OwidTableNames || (OwidTableNames = {}));
exports.OwidEntityNameColumnDef = {
    name: OwidTableNames.Entity,
    slug: OwidTableSlugs.entityName,
    type: CoreColumnDef_1.ColumnTypeNames.EntityName,
};
exports.OwidEntityIdColumnDef = {
    slug: OwidTableSlugs.entityId,
    type: CoreColumnDef_1.ColumnTypeNames.EntityId,
};
exports.OwidEntityCodeColumnDef = {
    name: OwidTableNames.Code,
    slug: OwidTableSlugs.entityCode,
    type: CoreColumnDef_1.ColumnTypeNames.EntityCode,
};
exports.StandardOwidColumnDefs = [
    exports.OwidEntityNameColumnDef,
    exports.OwidEntityIdColumnDef,
    exports.OwidEntityCodeColumnDef,
];
//# sourceMappingURL=OwidTableConstants.js.map