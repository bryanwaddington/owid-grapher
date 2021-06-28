#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ColorScaleBin_1 = require("./ColorScaleBin");
it("can create a bin", () => {
    const bin = new ColorScaleBin_1.CategoricalBin({
        index: 1,
        value: "North America",
        label: "100",
        color: "red",
    });
    expect(bin.color).toEqual("red");
});
//# sourceMappingURL=ColorScaleBin.test.js.map