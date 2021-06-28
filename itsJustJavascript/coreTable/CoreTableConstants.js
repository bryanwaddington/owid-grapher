"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsTypes = exports.TransformType = exports.InputType = exports.SortOrder = void 0;
var SortOrder;
(function (SortOrder) {
    SortOrder["asc"] = "asc";
    SortOrder["desc"] = "desc";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
var InputType;
(function (InputType) {
    InputType["Delimited"] = "Delimited";
    InputType["RowStore"] = "RowStore";
    InputType["ColumnStore"] = "ColumnStore";
    InputType["Matrix"] = "Matrix";
})(InputType = exports.InputType || (exports.InputType = {}));
var TransformType;
(function (TransformType) {
    // Table level ops
    TransformType["LoadFromDelimited"] = "LoadFromDelimited";
    TransformType["LoadFromRowStore"] = "LoadFromRowStore";
    TransformType["LoadFromColumnStore"] = "LoadFromColumnStore";
    TransformType["LoadFromMatrix"] = "LoadFromMatrix";
    TransformType["Transpose"] = "Transpose";
    TransformType["Concat"] = "Concat";
    TransformType["Reduce"] = "Reduce";
    // Row ops
    TransformType["FilterRows"] = "FilterRows";
    TransformType["SortRows"] = "SortRows";
    TransformType["AppendRows"] = "AppendRows";
    TransformType["UpdateRows"] = "UpdateRows";
    TransformType["InverseFilterRows"] = "InverseFilterRows";
    // Column ops
    TransformType["FilterColumns"] = "FilterColumns";
    TransformType["SortColumns"] = "SortColumns";
    TransformType["AppendColumns"] = "AppendColumns";
    TransformType["UpdateColumnDefs"] = "UpdateColumnDefs";
    TransformType["UpdateColumnDefsAndApply"] = "UpdateColumnDefsAndApply";
    TransformType["RenameColumns"] = "RenameColumns";
    TransformType["InverseFilterColumns"] = "InverseFilterColumns";
})(TransformType = exports.TransformType || (exports.TransformType = {}));
var JsTypes;
(function (JsTypes) {
    JsTypes["string"] = "string";
    JsTypes["boolean"] = "boolean";
    JsTypes["number"] = "number";
})(JsTypes = exports.JsTypes || (exports.JsTypes = {}));
//# sourceMappingURL=CoreTableConstants.js.map