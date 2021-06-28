#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ColorUtils_1 = require("./ColorUtils");
describe(ColorUtils_1.getLeastUsedColor, () => {
    it("returns unused color", () => {
        expect(ColorUtils_1.getLeastUsedColor(["red", "green"], ["red"])).toEqual("green");
    });
    it("returns least used color", () => {
        expect(ColorUtils_1.getLeastUsedColor(["red", "green"], ["red", "green", "green"])).toEqual("red");
    });
});
describe(ColorUtils_1.isDarkColor, () => {
    it("black is dark", () => expect(ColorUtils_1.isDarkColor("#000")).toEqual(true));
    it("white is light", () => expect(ColorUtils_1.isDarkColor("#fff")).toEqual(false));
    it("can handle rgb", () => expect(ColorUtils_1.isDarkColor("rgb(0, 0, 0)")).toEqual(true));
    it("yellow is light", () => expect(ColorUtils_1.isDarkColor("#ff1")).toEqual(false));
    it("green is dark", () => expect(ColorUtils_1.isDarkColor("#2b2")).toEqual(true));
});
//# sourceMappingURL=ColorUtils.test.js.map