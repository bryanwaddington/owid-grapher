#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CoreTablePrinters_1 = require("./CoreTablePrinters");
const CoreTableUtils_1 = require("./CoreTableUtils");
const input = `name,score,color
bob,12,red
mike,321,blue
al,1214,green`;
const rows = CoreTableUtils_1.parseDelimited(input);
it("to aligned table", () => {
    const result = CoreTablePrinters_1.toAlignedTextTable(Object.keys(rows[0]), rows, {
        alignRight: false,
        maxCharactersPerColumn: 100,
    });
    expect(result).toEqual(`name score color
bob  12    red  
mike 321   blue 
al   1214  green`);
});
it("to markdown table", () => {
    const result = CoreTablePrinters_1.toMarkdownTable(Object.keys(rows[0]), rows);
    expect(result).toEqual(`|name|score|color|
|-|-|-|
|bob|12|red|
|mike|321|blue|
|al|1214|green|`);
});
//# sourceMappingURL=CoreTablePrinter.test.js.map