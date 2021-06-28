"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployStatus = exports.JsonError = exports.PageType = exports.WP_PostType = exports.SubNavId = exports.ScaleType = exports.SortOrder = exports.EPOCH_DATE = void 0;
// todo: remove when we ditch Year and YearIsDay
exports.EPOCH_DATE = "2020-01-21";
// TODO: remove duplicate definition, also available in CoreTable
var SortOrder;
(function (SortOrder) {
    SortOrder["asc"] = "asc";
    SortOrder["desc"] = "desc";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
var ScaleType;
(function (ScaleType) {
    ScaleType["linear"] = "linear";
    ScaleType["log"] = "log";
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
var SubNavId;
(function (SubNavId) {
    SubNavId["about"] = "about";
    SubNavId["biodiversity"] = "biodiversity";
    SubNavId["coronavirus"] = "coronavirus";
    SubNavId["co2"] = "co2";
    SubNavId["energy"] = "energy";
    SubNavId["forests"] = "forests";
})(SubNavId = exports.SubNavId || (exports.SubNavId = {}));
var WP_PostType;
(function (WP_PostType) {
    WP_PostType["Post"] = "post";
    WP_PostType["Page"] = "page";
})(WP_PostType = exports.WP_PostType || (exports.WP_PostType = {}));
var PageType;
(function (PageType) {
    PageType["Entry"] = "ENTRY";
    PageType["SubEntry"] = "SUBENTRY";
    PageType["Standard"] = "STANDARD";
})(PageType = exports.PageType || (exports.PageType = {}));
// Exception format that can be easily given as an API error
class JsonError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 400;
    }
}
exports.JsonError = JsonError;
var DeployStatus;
(function (DeployStatus) {
    DeployStatus["queued"] = "queued";
    DeployStatus["pending"] = "pending";
    // done = "done"
})(DeployStatus = exports.DeployStatus || (exports.DeployStatus = {}));
//# sourceMappingURL=owidTypes.js.map