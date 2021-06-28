#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextWrap_1 = require("./TextWrap");
const Bounds_1 = require("../../clientUtils/Bounds");
const FONT_SIZE = 14;
describe("width()", () => {
    const stringWidth = (text) => Bounds_1.Bounds.forText(text, { fontSize: FONT_SIZE }).width;
    const renderedWidth = (text, raw) => {
        const textwrap = new TextWrap_1.TextWrap({
            maxWidth: Infinity,
            fontSize: FONT_SIZE,
            text,
            rawHtml: raw,
        });
        return textwrap.width;
    };
    it("correct for single line text", () => {
        const text = "an example line";
        expect(stringWidth(text)).toEqual(renderedWidth(text));
    });
    it("collapses congiguous spaces", () => {
        const text = "an example    spaced   out text";
        expect(stringWidth(text)).toEqual(renderedWidth(text));
    });
    it("strips HTML in raw strings", () => {
        const html = "<b>an example</b> line, <i> hopefully </i> it works";
        const text = "an example line, hopefully it works";
        expect(stringWidth(text)).toEqual(renderedWidth(html, true));
    });
    it("strips HTML when the first word token is an HTML tag", () => {
        const html = "<b>  test</b>";
        const text = " test";
        expect(stringWidth(text)).toEqual(renderedWidth(html, true));
    });
    it("doesn't naively strip '<' and '>' symbols", () => {
        const text = "text that contains <  and  > symbols that aren't HTML";
        expect(stringWidth(text)).toEqual(renderedWidth(text, true));
    });
});
describe("height()", () => {
    const renderedHeight = (text, raw) => {
        const textwrap = new TextWrap_1.TextWrap({
            maxWidth: Infinity,
            fontSize: FONT_SIZE,
            text,
            rawHtml: raw,
        });
        return textwrap.height;
    };
    it("calculates a height of zero for an empty string", () => {
        const text = "";
        expect(renderedHeight(text)).toEqual(0);
    });
});
//# sourceMappingURL=TextWrap.test.js.map