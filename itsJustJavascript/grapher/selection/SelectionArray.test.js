#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelectionArray_1 = require("./SelectionArray");
it("can create a selection", () => {
    const selection = new SelectionArray_1.SelectionArray([], [{ entityName: "USA" }, { entityName: "Canada" }]);
    expect(selection.hasSelection).toEqual(false);
    selection.selectAll();
    expect(selection.hasSelection).toEqual(true);
    expect(selection.selectedEntityNames).toEqual(["USA", "Canada"]);
});
//# sourceMappingURL=SelectionArray.test.js.map