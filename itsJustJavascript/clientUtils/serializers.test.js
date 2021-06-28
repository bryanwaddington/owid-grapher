#! /usr/bin/env jest
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
const serializers_1 = require("./serializers");
describe("encode and decode json", () => {
    it("should encode and decode an object correctly", () => __awaiter(void 0, void 0, void 0, function* () {
        const cases = [0, { foo: "bar" }, 2, false, { test: { nesting: 2 } }];
        cases.forEach((testCase) => {
            expect(serializers_1.deserializeJSONFromHTML(`<html>${serializers_1.serializeJSONForHTML(testCase)}</html>`)).toEqual(testCase);
        });
        expect(serializers_1.deserializeJSONFromHTML(`<html>${serializers_1.serializeJSONForHTML(undefined)}</html>`)).toEqual(undefined);
    }));
});
//# sourceMappingURL=serializers.test.js.map