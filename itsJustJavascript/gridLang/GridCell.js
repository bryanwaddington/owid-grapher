"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridCell = void 0;
const CoreTableUtils_1 = require("../coreTable/CoreTableUtils");
const isPresent_1 = require("../clientUtils/isPresent");
const GrammarUtils_1 = require("./GrammarUtils");
const GridLangConstants_1 = require("./GridLangConstants");
class GridCell {
    constructor(matrix, position, rootDefinition) {
        this.position = position;
        this.matrix = matrix;
        this.rootDefinition = rootDefinition;
    }
    get row() {
        return this.position.row;
    }
    get column() {
        return this.position.column;
    }
    get line() {
        return this.matrix[this.row];
    }
    get isCommentCell() {
        const { contents } = this;
        return contents && GridLangConstants_1.CommentCellDef.regex.test(contents);
    }
    get cellTerminalTypeDefinition() {
        const { rootDefinition } = this;
        if (this.isCommentCell)
            return GridLangConstants_1.CommentCellDef;
        const grammar = rootDefinition.grammar;
        if (this.column === 0)
            return rootDefinition;
        const firstWordOnLine = this.line ? this.line[0] : undefined;
        const isFirstWordAKeyword = firstWordOnLine && grammar[firstWordOnLine] !== undefined;
        if (this.column === 1 && firstWordOnLine && isFirstWordAKeyword)
            return grammar[firstWordOnLine];
        if (!isFirstWordAKeyword)
            return undefined;
        // It has a keyword but it is column >1
        const def = grammar[firstWordOnLine];
        const positionalCellTypeDef = def.positionalCellDefs && def.positionalCellDefs[this.column - 2];
        if (positionalCellTypeDef)
            return positionalCellTypeDef;
        if (def.isHorizontalList && this.contents)
            return def; // For now only return a def for lists if it is non-empty
        return GridLangConstants_1.NothingGoesThereCellDef;
    }
    get parentSubTableInfo() {
        const { row, matrix } = this;
        let pointerRow = row;
        let subTableHeaderRow = -1;
        while (pointerRow >= 0) {
            const line = matrix[pointerRow];
            if (!line)
                break;
            const parentKeyword = line[0];
            if (parentKeyword) {
                if (subTableHeaderRow === -1)
                    return undefined;
                return {
                    parentKeyword,
                    parentRow: pointerRow,
                    subTableHeaderRow,
                    isCellInHeader: row === subTableHeaderRow,
                    headerKeyword: matrix[subTableHeaderRow][this.column],
                };
            }
            if (!GrammarUtils_1.isBlankLine(line))
                subTableHeaderRow = pointerRow;
            pointerRow--;
        }
        return undefined;
    }
    get subTableParseResults() {
        const { cellTerminalTypeDefinition } = this;
        if (cellTerminalTypeDefinition)
            return undefined;
        const info = this.parentSubTableInfo;
        if (!info)
            return undefined;
        const { parentKeyword, isCellInHeader, subTableHeaderRow, headerKeyword, } = info;
        const subTableDef = this.rootDefinition.grammar[parentKeyword];
        const headerCellDef = subTableDef && subTableDef.headerCellDef;
        if (!headerCellDef)
            return undefined;
        const headerGrammar = headerCellDef.grammar;
        const valueCellDef = !isCellInHeader && headerGrammar
            ? headerGrammar[headerKeyword]
            : undefined;
        return {
            isFrontierCell: this.isSubTableFrontierCell(subTableHeaderRow, subTableDef),
            def: isCellInHeader
                ? headerCellDef
                : valueCellDef !== null && valueCellDef !== void 0 ? valueCellDef : GridLangConstants_1.SubTableValueCellDef,
        };
    }
    /**
     * If a cell is:
     *  - to the right of the last filled cell in a line
     *  - and that line is indented to be part of a subtable, with options
     *  - and it is the first non-blank line in the subtabel
     *
     * Then consider is a "frontier cell"
     *
     */
    isSubTableFrontierCell(headerRow, subTableDef) {
        const { line, column, row } = this;
        const grammar = subTableDef.headerCellDef.grammar;
        const isToTheImmediateRightOfLastFullCell = line && CoreTableUtils_1.trimArray(line).length === column;
        return (row === headerRow &&
            !GrammarUtils_1.isBlankLine(line) &&
            isToTheImmediateRightOfLastFullCell &&
            grammar &&
            Object.keys(grammar).length);
    }
    // If true show a +
    get isFirstCellOnFrontierRow() {
        const { row, column } = this;
        const numRows = this.matrix.length;
        if (column)
            return false; // Only first column should have a +
        if (!GrammarUtils_1.isBlankLine(this.line))
            return false; // Only blank lines can be frontier
        if (numRows === 1) {
            if (row === 1)
                return !GrammarUtils_1.isBlankLine(this.matrix[0]);
            return row === 0;
        }
        return row === numRows;
    }
    get suggestions() {
        return [];
    }
    get definitionLinks() {
        return [];
    }
    get implementationLinks() {
        return [];
    }
    get cellDef() {
        var _a;
        const def = this.cellTerminalTypeDefinition;
        if (def)
            return def;
        const subTable = (_a = this.subTableParseResults) === null || _a === void 0 ? void 0 : _a.def;
        if (subTable)
            return subTable;
        return GridLangConstants_1.WorkInProgressCellDef;
    }
    get errorMessage() {
        if (!this.line)
            return "";
        const { cellDef, contents, optionKeywords } = this;
        const { regex, requirementsDescription, catchAllCellDef } = cellDef;
        const catchAllKeywordRegex = catchAllCellDef === null || catchAllCellDef === void 0 ? void 0 : catchAllCellDef.regex;
        if (contents === undefined || contents === "")
            return "";
        const regexResult = regex
            ? validate(contents, regex, requirementsDescription)
            : undefined;
        const catchAllRegexResult = catchAllKeywordRegex
            ? validate(contents, catchAllKeywordRegex, catchAllCellDef.requirementsDescription)
            : undefined;
        if (optionKeywords) {
            if (optionKeywords.includes(contents))
                return "";
            if (regex)
                return regexResult;
            if (catchAllKeywordRegex)
                return catchAllRegexResult;
            const guess = GrammarUtils_1.didYouMean(contents, optionKeywords);
            if (guess)
                return `Did you mean '${guess}'?`;
            return `Error: '${contents}' is not a valid option. Valid options are ${optionKeywords
                .map((opt) => `'${opt}'`)
                .join(", ")}`;
        }
        if (regex)
            return regexResult;
        if (catchAllKeywordRegex)
            return catchAllRegexResult;
        return "";
    }
    get contents() {
        return this.line ? this.line[this.column] : undefined;
    }
    get comment() {
        var _a;
        const { contents, errorMessage, cellDef } = this;
        if (GrammarUtils_1.isEmpty(contents))
            return undefined;
        if (errorMessage)
            return errorMessage;
        if (cellDef.grammar) {
            const def = (_a = cellDef.grammar[contents]) !== null && _a !== void 0 ? _a : cellDef.catchAllCellDef;
            return def.description;
        }
        return [cellDef.description].join("\n");
    }
    get cssClasses() {
        var _a;
        const { errorMessage, cellDef } = this;
        if (errorMessage)
            return [GridLangConstants_1.CellHasErrorsClass];
        const showArrow = this.isFirstCellOnFrontierRow ||
            ((_a = this.subTableParseResults) === null || _a === void 0 ? void 0 : _a.isFrontierCell)
            ? GridLangConstants_1.FrontierCellClass
            : undefined;
        const hasSuggestions = this.cellDef.keyword === "table" ? "HasSuggestions" : null; // todo: switch from strings to constants
        return [cellDef.cssClass, hasSuggestions, showArrow].filter(isPresent_1.isPresent);
    }
    get placeholder() {
        var _a;
        const { contents, cellDef } = this;
        const { terminalOptions } = cellDef;
        const firstOption = terminalOptions && terminalOptions[0];
        const firstOptionName = firstOption && firstOption.keyword;
        const placeholder = (_a = cellDef.valuePlaceholder) !== null && _a !== void 0 ? _a : firstOptionName;
        return GrammarUtils_1.isEmpty(contents) && placeholder
            ? `eg "${placeholder}"`
            : undefined;
    }
    get optionKeywords() {
        const { cellDef } = this;
        const { grammar, headerCellDef, terminalOptions } = cellDef;
        return terminalOptions
            ? terminalOptions.map((def) => def.keyword)
            : grammar
                ? Object.keys(grammar)
                : headerCellDef
                    ? Object.keys(headerCellDef.grammar)
                    : undefined;
    }
}
__decorate([
    CoreTableUtils_1.imemo
], GridCell.prototype, "subTableParseResults", null);
__decorate([
    CoreTableUtils_1.imemo
], GridCell.prototype, "cellDef", null);
exports.GridCell = GridCell;
const validate = (value, regex, requirements) => {
    if (typeof value !== "string")
        return "";
    if (!regex.test(value)) {
        return `Error: ${requirements
            ? requirements
            : `'${value}' did not validate against ${regex}`}`;
    }
    return "";
};
//# sourceMappingURL=GridCell.js.map