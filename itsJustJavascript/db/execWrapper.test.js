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
const execWrapper_1 = require("./execWrapper");
describe("execWrapper()", () => {
    it("should resolve when there is a zero exit code", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield execWrapper_1.execWrapper(`echo "it works"; exit 0`, {
            silent: true,
        });
        expect(result).toEqual({
            code: 0,
            stdout: "it works\n",
            stderr: "",
        });
    }));
    it("should reject when there is a non-zero exit code", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield execWrapper_1.execWrapper(`echo "begin"; echo "fail" 1>&2; exit 1`, {
                silent: true,
            });
        }
        catch (err) {
            expect(err).toBeInstanceOf(execWrapper_1.ExecError);
            expect(err.code).toEqual(1);
            expect(err.stdout).toEqual("begin\n");
            expect(err.stderr).toEqual("fail\n");
        }
        finally {
            expect.assertions(4);
        }
    }));
});
//# sourceMappingURL=execWrapper.test.js.map