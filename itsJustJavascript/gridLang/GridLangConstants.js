"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugsDeclarationCellDef = exports.FrontierCellClass = exports.SlugDeclarationCellDef = exports.WorkInProgressCellDef = exports.CommentCellDef = exports.NothingGoesThereCellDef = exports.QueryStringCellDef = exports.UrlCellDef = exports.SubTableValueCellDef = exports.SubTableHeaderCellDef = exports.IntegerCellDef = exports.NumericCellDef = exports.RootKeywordCellDef = exports.EnumCellDef = exports.StringDeclarationDef = exports.StringCellDef = exports.BooleanCellDef = exports.Origin = exports.GRID_EDGE_DELIMITER = exports.GRID_CELL_DELIMITER = exports.GRID_NODE_DELIMITER = exports.GridBoolean = exports.CellHasErrorsClass = void 0;
exports.CellHasErrorsClass = "CellHasErrorsClass";
var GridBoolean;
(function (GridBoolean) {
    GridBoolean["true"] = "true";
    GridBoolean["false"] = "false";
})(GridBoolean = exports.GridBoolean || (exports.GridBoolean = {}));
exports.GRID_NODE_DELIMITER = "\n";
exports.GRID_CELL_DELIMITER = "\t";
exports.GRID_EDGE_DELIMITER = "\t";
exports.Origin = {
    row: 0,
    column: 0,
};
exports.BooleanCellDef = {
    keyword: "",
    terminalOptions: [
        { keyword: GridBoolean.true, cssClass: "", description: "" },
        { keyword: GridBoolean.false, cssClass: "", description: "" },
    ],
    cssClass: "BooleanCellDef",
    description: "Boolean",
    parse: (value) => value === GridBoolean.true,
};
exports.StringCellDef = {
    keyword: "",
    cssClass: "StringCellDef",
    description: "",
};
exports.StringDeclarationDef = {
    keyword: "",
    cssClass: "StringDeclarationDef",
    description: "",
};
exports.EnumCellDef = {
    keyword: "",
    cssClass: "EnumCellDef",
    description: "",
};
exports.RootKeywordCellDef = {
    keyword: "",
    cssClass: "KeywordCellDef",
    description: "Keyword",
};
exports.NumericCellDef = {
    keyword: "",
    cssClass: "NumericCellDef",
    description: "",
    regex: /^-?\d+\.?\d*$/,
    requirementsDescription: `Must be a number`,
    valuePlaceholder: "98.6",
    parse: (value) => parseFloat(value),
};
exports.IntegerCellDef = {
    keyword: "",
    cssClass: "IntegerCellDef",
    description: "",
    regex: /^[0-9]+$/,
    requirementsDescription: `Must be an integer`,
    valuePlaceholder: "12345",
    parse: (value) => parseInt(value),
};
exports.SubTableHeaderCellDef = {
    keyword: "",
    cssClass: "SubTableHeaderCellDef",
    description: "",
};
exports.SubTableValueCellDef = {
    keyword: "",
    cssClass: "SubTableValueCellDef",
    description: "",
};
const MatchUrlsOnlyRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
exports.UrlCellDef = {
    keyword: "",
    cssClass: "UrlCellDef",
    description: "",
    regex: MatchUrlsOnlyRegex,
};
exports.QueryStringCellDef = {
    keyword: "",
    cssClass: "QueryStringCellDef",
    description: "",
};
exports.NothingGoesThereCellDef = {
    keyword: "",
    cssClass: "NothingGoesThereType",
    description: "Nothing should be here. You can make this a comment by prepending a ##",
};
exports.CommentCellDef = {
    keyword: "",
    cssClass: "CommentType",
    description: "Just a comment.",
    regex: /^(\#\#|💬)/,
};
exports.WorkInProgressCellDef = {
    keyword: "",
    cssClass: "WorkInProgressCellDef",
    description: "Not a recognized statement. Treating as a work in progress.",
};
exports.SlugDeclarationCellDef = {
    keyword: "",
    cssClass: "SlugDeclarationType",
    description: "A unique URL-friendly name.",
    regex: /^[a-zA-Z0-9-_]+$/,
    requirementsDescription: `Can only contain the characters a-zA-Z0-9-_`,
};
// This is the name for a cell that is on the "frontier", where the next user input is expected to go. Okay to rename if you have a better word.
exports.FrontierCellClass = "ShowDropdownArrow";
exports.SlugsDeclarationCellDef = {
    keyword: "",
    cssClass: "SlugDeclarationType",
    description: "Unique URL-friendly names.",
    regex: /^[a-zA-Z0-9-_ ]+$/,
    requirementsDescription: `Can only contain the characters a-zA-Z0-9-_ `,
};
//# sourceMappingURL=GridLangConstants.js.map