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
const GitCmsClient_1 = require("./GitCmsClient");
// Just some sanity tests, main tests are in the integration tests file.
it("can init", () => {
    expect(new GitCmsClient_1.GitCmsClient("")).toBeTruthy();
});
it("validates input", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield new GitCmsClient_1.GitCmsClient("").deleteRemoteFile({ filepath: "foo~bar" });
    }
    catch (err) {
        expect(err).toBeTruthy();
    }
}));
//# sourceMappingURL=GitCmsClient.test.js.map