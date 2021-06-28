"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridProgram = void 0;
const CoreTableUtils_1 = require("../coreTable/CoreTableUtils");
const isPresent_1 = require("../clientUtils/isPresent");
const GridCell_1 = require("./GridCell");
const GridLangConstants_1 = require("./GridLangConstants");
class GridProgram {
    constructor(slug, tsv, lastCommit, grammar) {
        this.guid = ++GridProgram.guids;
        this.nodeDelimiter = GridLangConstants_1.GRID_NODE_DELIMITER;
        this.cellDelimiter = GridLangConstants_1.GRID_CELL_DELIMITER;
        this.edgeDelimiter = GridLangConstants_1.GRID_EDGE_DELIMITER;
        this.lines = tsv.replace(/\r/g, "").split(this.nodeDelimiter);
        this.slug = slug;
        this.lastCommit = lastCommit;
        this.grammar = grammar;
    }
    toJson() {
        return {
            program: this.toString(),
            slug: this.slug,
            lastCommit: this.lastCommit,
        };
    }
    findNext(position) {
        const cell = this.getCell(position);
        const { contents } = cell;
        return this.grepFirst(contents, Object.assign(Object.assign({}, position), { column: position.column + 1 }));
    }
    findAll(position) {
        const cell = this.getCell(position);
        const { contents } = cell;
        return this.grep(contents, Object.assign(Object.assign({}, position), { column: position.column + 1 }));
    }
    ring(position) {
        const matrix = this.asArrays;
        const numRows = matrix.length;
        if (!numRows)
            return (function* generator() { })();
        const pointer = Object.assign(Object.assign({}, position), { started: false, endRow: position.row, endCol: position.column });
        if (pointer.row >= numRows)
            pointer.endRow = numRows - 1;
        const lastLine = matrix[pointer.endRow];
        pointer.endCol =
            lastLine[pointer.endCol] === undefined
                ? lastLine.length
                : pointer.endCol;
        function* generator() {
            while (true) {
                if (pointer.started &&
                    pointer.row === pointer.endRow &&
                    pointer.column === pointer.endCol)
                    return;
                pointer.started = true;
                if (matrix[pointer.row] === undefined ||
                    matrix[pointer.row][pointer.column] === undefined) {
                    pointer.row++;
                    pointer.column = 0;
                    if (pointer.row >= numRows)
                        pointer.row = 0;
                    continue;
                }
                yield {
                    row: pointer.row,
                    column: pointer.column,
                };
                pointer.column++;
            }
        }
        return generator();
    }
    valuesFrom(position = GridLangConstants_1.Origin) {
        return Array.from(this.ring(position)).map((next) => this.getCellContents(next));
    }
    get numRows() {
        return this.lines.length;
    }
    patch(obj) {
        Object.keys(obj).forEach((key) => this.setLineValue(key, obj[key]));
        return this;
    }
    grepFirst(key, position = GridLangConstants_1.Origin) {
        for (const next of this.ring(position)) {
            if (this.getCellContents(next) === key)
                return next;
        }
        return undefined;
    }
    grep(key, position = GridLangConstants_1.Origin) {
        const hits = [];
        for (const next of this.ring(position)) {
            if (this.getCellContents(next) === key)
                hits.push(next);
        }
        return hits;
    }
    /**
     * Returns all non-blocks as an object literal
     */
    get tuplesObject() {
        const obj = {};
        this.lines
            .filter((line) => !line.startsWith(this.edgeDelimiter))
            .forEach((line) => {
            const words = line.split(this.cellDelimiter);
            const key = words.shift();
            if (key)
                obj[key.trim()] = words.join(this.cellDelimiter).trim();
        });
        return obj;
    }
    getLine(keyword) {
        return this.lines.find((line) => line.startsWith(keyword + this.cellDelimiter));
    }
    getLineValue(keyword) {
        const line = this.getLine(keyword);
        return line ? line.split(this.cellDelimiter)[1] : undefined;
    }
    getBlockLocation(blockRowNumber) {
        const startRow = blockRowNumber + 1;
        let numRows = this.lines
            .slice(startRow)
            .findIndex((line) => line && !line.startsWith(this.edgeDelimiter));
        if (numRows === -1)
            numRows = this.lines.slice(startRow).length;
        return { startRow, endRow: startRow + numRows, numRows };
    }
    getKeywordIndex(key) {
        return this.lines.findIndex((line) => line.startsWith(key + this.cellDelimiter) || line === key);
    }
    getCell(position) {
        return new GridCell_1.GridCell(this.matrix, position, this.grammar);
    }
    getCellContents(position) {
        const line = this.matrix[position.row];
        return line ? line[position.column] : undefined;
    }
    get matrix() {
        return this.lines.map((line) => line.split(this.cellDelimiter));
    }
    deleteBlock(row) {
        if (row === undefined)
            return this;
        const location = this.getBlockLocation(row);
        if (!location)
            return this;
        this.lines.splice(location.startRow, location.numRows);
        return this;
    }
    deleteLine(row) {
        if (row === undefined)
            return this;
        this.lines.splice(row, 1);
        return this;
    }
    appendLine(line) {
        this.lines.push(line);
        return this;
    }
    // todo: make immutable and return a new copy
    setCell(row, col, value) {
        const line = this.lines[row];
        const words = line.split(this.cellDelimiter);
        words[col] = value;
        this.lines[row] = words.join(this.cellDelimiter);
        return this;
    }
    setLineValue(key, value) {
        const index = this.getKeywordIndex(key);
        const newLine = `${key}${this.cellDelimiter}${value}`;
        if (index === -1 && value !== undefined)
            this.lines.push(newLine);
        else if (value === undefined)
            this.deleteLine(index);
        else
            this.lines[index] = newLine;
        return this;
    }
    getBlock(keywordIndex) {
        const location = this.getBlockLocation(keywordIndex);
        return this.lines
            .slice(location.startRow, location.endRow)
            .map((line) => line.substr(1))
            .join(this.nodeDelimiter);
    }
    updateBlock(rowNumber, value) {
        const location = this.getBlockLocation(rowNumber);
        this.lines.splice(location.startRow, location.numRows, ...value
            .split(this.nodeDelimiter)
            .map((line) => this.edgeDelimiter + line));
        return this;
    }
    appendBlock(key, value) {
        this.lines.push(key);
        value
            .split(this.nodeDelimiter)
            .forEach((line) => this.lines.push(this.edgeDelimiter + line));
    }
    getRowNumbersStartingWith(startsWith) {
        return this.lines
            .map((line, index) => line.startsWith(startsWith + this.cellDelimiter) ||
            line === startsWith
            ? index
            : null)
            .filter(isPresent_1.isPresent);
    }
    getRowMatchingWords(...words) {
        const matches = (line) => words.every((word, index) => word === undefined || line[index] === word);
        return this.asArrays.findIndex(matches);
    }
    get asArrays() {
        return this.lines.map((line) => line.split(this.cellDelimiter));
    }
    // The max number of columns in any row when you view a program as a spreadsheet
    get width() {
        return Math.max(...this.asArrays.map((arr) => arr.length));
    }
    toString() {
        return this.prettify();
    }
    prettify() {
        return CoreTableUtils_1.trimMatrix(this.asArrays)
            .map((line) => line.join(this.cellDelimiter))
            .join(this.nodeDelimiter);
    }
}
GridProgram.guids = 0;
__decorate([
    CoreTableUtils_1.imemo
], GridProgram.prototype, "matrix", null);
exports.GridProgram = GridProgram;
//# sourceMappingURL=GridProgram.js.map