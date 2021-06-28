"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimAndParseObject = exports.makeFullPath = exports.ExplorerProgram = exports.EXPLORER_FILE_SUFFIX = void 0;
const Util_1 = require("../clientUtils/Util");
const ExplorerConstants_1 = require("./ExplorerConstants");
const CoreTable_1 = require("../coreTable/CoreTable");
const ExplorerGrammar_1 = require("./ExplorerGrammar");
const GridLangConstants_1 = require("../gridLang/GridLangConstants");
const OwidTable_1 = require("../coreTable/OwidTable");
const GridProgram_1 = require("../gridLang/GridProgram");
const GrapherGrammar_1 = require("./GrapherGrammar");
const ColumnGrammar_1 = require("./ColumnGrammar");
const ExplorerDecisionMatrix_1 = require("./ExplorerDecisionMatrix");
const PromiseCache_1 = require("../clientUtils/PromiseCache");
exports.EXPLORER_FILE_SUFFIX = ".explorer.tsv";
const ExplorerRootDef = Object.assign(Object.assign({}, GridLangConstants_1.RootKeywordCellDef), { grammar: ExplorerGrammar_1.ExplorerGrammar });
class ExplorerProgram extends GridProgram_1.GridProgram {
    constructor(slug, tsv, lastCommit) {
        var _a;
        super(slug, tsv, lastCommit, ExplorerRootDef);
        this.decisionMatrix = new ExplorerDecisionMatrix_1.DecisionMatrix((_a = this.decisionMatrixCode) !== null && _a !== void 0 ? _a : "", lastCommit === null || lastCommit === void 0 ? void 0 : lastCommit.hash);
    }
    static fromJson(json) {
        return new ExplorerProgram(json.slug, json.program, json.lastCommit);
    }
    get clone() {
        return ExplorerProgram.fromJson(this.toJson());
    }
    get isNewFile() {
        return this.slug === ExplorerConstants_1.DefaultNewExplorerSlug;
    }
    get filename() {
        return this.slug + exports.EXPLORER_FILE_SUFFIX;
    }
    initDecisionMatrix(choiceParams) {
        this.decisionMatrix.setValuesFromChoiceParams(choiceParams);
        return this;
    }
    get fullPath() {
        return exports.makeFullPath(this.slug);
    }
    get currentlySelectedGrapherRow() {
        const row = this.getKeywordIndex(ExplorerGrammar_1.ExplorerGrammar.graphers.keyword);
        return row === -1
            ? undefined
            : row + this.decisionMatrix.selectedRowIndex + 2;
    }
    static fromMatrix(slug, matrix) {
        const str = matrix
            .map((row) => row.join(GridLangConstants_1.GRID_CELL_DELIMITER))
            .join(GridLangConstants_1.GRID_NODE_DELIMITER);
        return new ExplorerProgram(slug, str);
    }
    get explorerTitle() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.explorerTitle.keyword);
    }
    get title() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.title.keyword);
    }
    get subNavId() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.subNavId.keyword);
    }
    get googleSheet() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.googleSheet.keyword);
    }
    get hideAlertBanner() {
        return (this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.hideAlertBanner.keyword) ===
            GridLangConstants_1.GridBoolean.true);
    }
    get subNavCurrentId() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.subNavCurrentId.keyword);
    }
    get thumbnail() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.thumbnail.keyword);
    }
    get explorerSubtitle() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.explorerSubtitle.keyword);
    }
    get entityType() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.entityType.keyword);
    }
    get selection() {
        var _a;
        return (_a = this.getLine(ExplorerGrammar_1.ExplorerGrammar.selection.keyword)) === null || _a === void 0 ? void 0 : _a.split(this.cellDelimiter).slice(1);
    }
    get pickerColumnSlugs() {
        const slugs = this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.pickerColumnSlugs.keyword);
        return slugs ? slugs.split(" ") : undefined;
    }
    get hideControls() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.hideControls.keyword);
    }
    get downloadDataLink() {
        return this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.downloadDataLink.keyword);
    }
    get isPublished() {
        return (this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.isPublished.keyword) ===
            GridLangConstants_1.GridBoolean.true);
    }
    setPublished(value) {
        return this.clone.setLineValue(ExplorerGrammar_1.ExplorerGrammar.isPublished.keyword, value ? GridLangConstants_1.GridBoolean.true : GridLangConstants_1.GridBoolean.false);
    }
    get wpBlockId() {
        const blockIdString = this.getLineValue(ExplorerGrammar_1.ExplorerGrammar.wpBlockId.keyword);
        return blockIdString ? parseInt(blockIdString, 10) : undefined;
    }
    get decisionMatrixCode() {
        const keywordIndex = this.getKeywordIndex(ExplorerGrammar_1.ExplorerGrammar.graphers.keyword);
        if (keywordIndex === -1)
            return undefined;
        return this.getBlock(keywordIndex);
    }
    get grapherCount() {
        return this.decisionMatrix.numRows || 1;
    }
    get tableCount() {
        return this.lines.filter((line) => line.startsWith(ExplorerGrammar_1.ExplorerGrammar.table.keyword)).length;
    }
    get inlineTableCount() {
        return this.lines
            .filter((line) => line.startsWith(ExplorerGrammar_1.ExplorerGrammar.table.keyword))
            .filter((line) => {
            var _a;
            const data = (_a = this.getTableDef(line.split(this.cellDelimiter)[1])) === null || _a === void 0 ? void 0 : _a.inlineData;
            return data ? data.trim() : false;
        }).length;
    }
    get tableSlugs() {
        return this.lines
            .filter((line) => line.startsWith(ExplorerGrammar_1.ExplorerGrammar.table.keyword))
            .map((line) => line.split(this.cellDelimiter)[2]);
    }
    get columnDefsByTableSlug() {
        const result = new Map();
        this.tableSlugs.forEach((tableSlug) => {
            const tableDef = this.getTableDef(tableSlug);
            if (tableDef && tableDef.columnDefinitions) {
                result.set(tableSlug, tableDef.columnDefinitions);
            }
        });
        return result;
    }
    replaceTableWithInlineDataAndAutofilledColumnDefsCommand(tableSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            const clone = this.clone;
            const colDefRow = clone.getRowMatchingWords(ExplorerGrammar_1.ExplorerGrammar.columns.keyword, tableSlug);
            if (colDefRow > -1) {
                clone.deleteBlock(colDefRow);
                clone.deleteLine(colDefRow);
            }
            const table = yield clone.constructTable(tableSlug);
            const tableDefRow = clone.getRowMatchingWords(ExplorerGrammar_1.ExplorerGrammar.table.keyword, undefined, tableSlug);
            if (tableDefRow > -1) {
                clone.deleteBlock(tableDefRow);
                clone.deleteLine(tableDefRow);
            }
            const newCols = table.autodetectedColumnDefs;
            const missing = newCols
                .appendColumns([
                {
                    slug: ColumnGrammar_1.ColumnGrammar.notes.keyword,
                    values: newCols.indices.map(() => `Unreviewed`),
                },
            ])
                .select([
                ColumnGrammar_1.ColumnGrammar.slug.keyword,
                ,
                ColumnGrammar_1.ColumnGrammar.name.keyword,
                ,
                ColumnGrammar_1.ColumnGrammar.type.keyword,
                ColumnGrammar_1.ColumnGrammar.notes.keyword,
            ]);
            clone.appendBlock(ExplorerGrammar_1.ExplorerGrammar.table.keyword, table.toTsv());
            clone.appendBlock(ExplorerGrammar_1.ExplorerGrammar.columns.keyword, missing.toTsv());
            return clone;
        });
    }
    autofillMissingColumnDefinitionsForTableCommand(tableSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            const clone = this.clone;
            const remoteTable = yield clone.constructTable(tableSlug);
            const existingTableDef = this.getTableDef(tableSlug);
            const table = remoteTable ||
                (existingTableDef
                    ? new CoreTable_1.CoreTable(existingTableDef.inlineData, existingTableDef.columnDefinitions)
                    : undefined);
            const newCols = table.autodetectedColumnDefs;
            const missing = newCols
                .appendColumns([
                {
                    slug: ColumnGrammar_1.ColumnGrammar.notes.keyword,
                    values: newCols.indices.map(() => `Unreviewed`),
                },
            ])
                .select([
                ColumnGrammar_1.ColumnGrammar.slug.keyword,
                ,
                ColumnGrammar_1.ColumnGrammar.name.keyword,
                ,
                ColumnGrammar_1.ColumnGrammar.type.keyword,
                ColumnGrammar_1.ColumnGrammar.notes.keyword,
            ]);
            const colDefsRow = this.getRowMatchingWords(ExplorerGrammar_1.ExplorerGrammar.columns.keyword, tableSlug);
            if (colDefsRow !== -1)
                clone.updateBlock(colDefsRow, new CoreTable_1.CoreTable(clone.getBlock(colDefsRow))
                    .concat([missing])
                    .toTsv());
            else
                clone.appendBlock(`${ExplorerGrammar_1.ExplorerGrammar.columns.keyword}${tableSlug ? this.cellDelimiter + tableSlug : ""}`, missing.toTsv());
            return clone;
        });
    }
    get grapherConfig() {
        const rootObject = exports.trimAndParseObject(this.tuplesObject, GrapherGrammar_1.GrapherGrammar);
        Object.keys(rootObject).forEach((key) => {
            if (!GrapherGrammar_1.GrapherGrammar[key])
                delete rootObject[key];
        });
        const selectedGrapherRow = this.decisionMatrix.selectedRow;
        if (selectedGrapherRow && Object.keys(selectedGrapherRow).length) {
            return Object.assign(Object.assign({}, rootObject), selectedGrapherRow);
        }
        return rootObject;
    }
    constructTable(tableSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableDef = this.getTableDef(tableSlug);
            if (!tableDef) {
                throw new Error(`Table definitions not found for '${tableSlug}'`);
            }
            if (tableDef.inlineData) {
                return new OwidTable_1.OwidTable(tableDef.inlineData, tableDef.columnDefinitions, {
                    tableDescription: `Loaded '${tableSlug}' from inline data`,
                    tableSlug: tableSlug,
                }).dropEmptyRows();
            }
            else if (tableDef.url) {
                const input = yield ExplorerProgram.tableDataLoader.get(tableDef.url);
                return new OwidTable_1.OwidTable(input, tableDef.columnDefinitions, {
                    tableDescription: `Loaded from ${tableDef.url}`,
                });
            }
            throw new Error(`No data for table '${tableSlug}'`);
        });
    }
    getTableDef(tableSlug) {
        const tableDefRow = this.getRowMatchingWords(ExplorerGrammar_1.ExplorerGrammar.table.keyword, undefined, tableSlug);
        if (tableDefRow === -1)
            return undefined;
        const inlineData = this.getBlock(tableDefRow);
        let url = inlineData
            ? undefined
            : this.lines[tableDefRow].split(this.cellDelimiter)[1];
        if (url && !url.startsWith("http")) {
            const owidDatasetSlug = encodeURIComponent(url);
            url = `https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/${owidDatasetSlug}/${owidDatasetSlug}.csv`;
        }
        const colDefsRow = this.getRowMatchingWords(ExplorerGrammar_1.ExplorerGrammar.columns.keyword, tableSlug);
        const columnDefinitions = colDefsRow !== -1
            ? CoreTable_1.columnDefinitionsFromDelimited(this.getBlock(colDefsRow)).map((row) => exports.trimAndParseObject(row, ColumnGrammar_1.ColumnGrammar))
            : undefined;
        return {
            url,
            columnDefinitions,
            inlineData,
        };
    }
}
exports.ExplorerProgram = ExplorerProgram;
/**
 * A static method so that all explorers on the page share requests,
 * and no duplicate requests are sent.
 */
ExplorerProgram.tableDataLoader = new PromiseCache_1.PromiseCache((url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    if (!response.ok)
        throw new Error(response.statusText);
    const tableInput = url.endsWith(".json")
        ? yield response.json()
        : yield response.text();
    return tableInput;
}));
const makeFullPath = (slug) => `${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/${slug}${exports.EXPLORER_FILE_SUFFIX}`;
exports.makeFullPath = makeFullPath;
const trimAndParseObject = (config, grammar) => {
    // Trim empty properties. Prevents things like clearing "type" which crashes Grapher. The call to grapher.reset will automatically clear things like title, subtitle, if not set.
    const trimmedRow = Util_1.trimObject(config, true);
    // parse types
    Object.keys(trimmedRow).forEach((key) => {
        const def = grammar[key];
        if (def && def.parse)
            trimmedRow[key] = def.parse(trimmedRow[key]);
        // If there no definition but it is a boolean, parse it (todo: always have a def)
        else if (!def) {
            const value = trimmedRow[key];
            if (value === GridLangConstants_1.GridBoolean.true)
                trimmedRow[key] = true;
            else if (value === GridLangConstants_1.GridBoolean.false)
                trimmedRow[key] = false;
        }
    });
    return trimmedRow;
};
exports.trimAndParseObject = trimAndParseObject;
//# sourceMappingURL=ExplorerProgram.js.map