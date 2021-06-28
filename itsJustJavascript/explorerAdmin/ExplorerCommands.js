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
exports.InlineDataCommand = exports.AutofillColDefCommand = exports.SelectAllHitsCommand = void 0;
const ExplorerGrammar_1 = require("../explorer/ExplorerGrammar");
class HotCommand {
    constructor(program, setProgramCallback) {
        this.program = program;
        this.setProgramCallback = setProgramCallback;
    }
    selectedPosition(hot) {
        const coords = hot.getSelectedLast();
        if (!coords)
            return undefined;
        return { row: coords[0], column: coords[1] };
    }
    cell(hot) {
        const pos = this.selectedPosition(hot);
        return pos ? this.program.getCell(pos) : undefined;
    }
    searchResults(hot) {
        const pos = this.selectedPosition(hot);
        return pos ? this.program.findAll(pos) : [];
    }
    // handles the "this" binding needed by HOT
    toHotCommand() {
        const baseCommand = this;
        return {
            name: function () {
                return baseCommand.name(this);
            },
            callback: function () {
                return baseCommand.callback(this);
            },
            disabled: function () {
                return baseCommand.disabled(this);
            },
            hidden: function () {
                return baseCommand.hidden(this);
            },
        };
    }
}
class SelectAllHitsCommand extends HotCommand {
    name(hot) {
        const cell = this.cell(hot);
        if (!cell)
            return `Nothing selected`;
        const searchResults = this.searchResults(hot);
        if (searchResults.length === 1)
            return `1 match of '${cell.contents}'`;
        return `Select ${searchResults.length} matches of '${cell.contents}'`;
    }
    callback(hot) {
        const searchResults = this.searchResults(hot);
        if (!searchResults.length)
            return;
        hot.selectCells(searchResults.map((pos) => [pos.row, pos.column, pos.row, pos.column]));
    }
    hidden() {
        return false;
    }
    disabled(hot) {
        return this.searchResults(hot).length < 2;
    }
}
exports.SelectAllHitsCommand = SelectAllHitsCommand;
class AutofillColDefCommand extends HotCommand {
    constructor() {
        super(...arguments);
        this.commandName = "autofillMissingColumnDefinitionsForTableCommand";
    }
    name() {
        return "⚡ Autofill missing column definitions";
    }
    callback(hot) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedPosition = this.selectedPosition(hot);
            const { program, commandName } = this;
            if (!selectedPosition)
                return;
            const tableSlugCell = program.getCell(Object.assign(Object.assign({}, selectedPosition), { column: selectedPosition.column + 1 }));
            // todo: figure out typings. we need keyof ExplorerProgram but only if key is to a callable method.
            const newProgram = yield program[commandName](tableSlugCell.contents);
            this.setProgramCallback(newProgram.toString());
        });
    }
    disabled() {
        return false;
    }
    hidden(hot) {
        var _a;
        const cell = this.cell(hot);
        return cell
            ? ((_a = cell.cellDef) === null || _a === void 0 ? void 0 : _a.keyword) !== ExplorerGrammar_1.ExplorerGrammar.table.keyword
            : true;
    }
}
exports.AutofillColDefCommand = AutofillColDefCommand;
class InlineDataCommand extends AutofillColDefCommand {
    constructor() {
        super(...arguments);
        this.commandName = "replaceTableWithInlineDataAndAutofilledColumnDefsCommand";
    }
    name() {
        return "⚡ Inline data and autofill columns";
    }
}
exports.InlineDataCommand = InlineDataCommand;
//# sourceMappingURL=ExplorerCommands.js.map