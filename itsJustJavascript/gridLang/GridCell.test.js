#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GridCell_1 = require("./GridCell");
const GridLangConstants_1 = require("./GridLangConstants");
const GrammarUtils_1 = require("./GrammarUtils");
const TestGrammar = {
    title: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "title", valuePlaceholder: "A whole new world", description: "Some description" }),
};
const TestGrammarRootDef = Object.assign(Object.assign({}, GridLangConstants_1.RootKeywordCellDef), { grammar: TestGrammar });
describe(GridCell_1.GridCell, () => {
    it("can parse a cell", () => {
        const cell = new GridCell_1.GridCell(GrammarUtils_1.tsvToMatrix(`title\tHello world`), { row: 0, column: 1 }, TestGrammarRootDef);
        expect(cell.errorMessage).toEqual(``);
        expect(cell.comment).toContain(TestGrammar.title.description);
        expect(cell.cssClasses).toContain(GridLangConstants_1.StringCellDef.cssClass);
        expect(cell.placeholder).toBeFalsy();
    });
    it("can show a placeholder", () => {
        const cell = new GridCell_1.GridCell(GrammarUtils_1.tsvToMatrix(`title`), { row: 0, column: 1 }, TestGrammarRootDef);
        expect(cell.placeholder).toBeTruthy();
    });
    it("uses the keyword definition for the first cell instead of abstract keyword", () => {
        const cell = new GridCell_1.GridCell(GrammarUtils_1.tsvToMatrix(`title\tHello world`), { row: 0, column: 0 }, TestGrammarRootDef);
        expect(cell.comment).toContain(TestGrammar.title.description);
    });
    it("can insert a css class to show the user a + button", () => {
        expect(new GridCell_1.GridCell(GrammarUtils_1.tsvToMatrix(`title\tHello world`), { row: 1, column: 0 }, TestGrammarRootDef).cssClasses).toContain(GridLangConstants_1.FrontierCellClass);
        expect(new GridCell_1.GridCell(GrammarUtils_1.tsvToMatrix(``), { row: 1, column: 0 }, TestGrammarRootDef).cssClasses).not.toContain(GridLangConstants_1.FrontierCellClass);
    });
    it("can detect errors", () => {
        const cell = new GridCell_1.GridCell(GrammarUtils_1.tsvToMatrix(`tile\tHello world`), { row: 0, column: 0 }, TestGrammarRootDef);
        expect(cell.errorMessage).not.toEqual(``);
        expect(cell.cssClasses).toContain(GridLangConstants_1.CellHasErrorsClass);
    });
});
//# sourceMappingURL=GridCell.test.js.map