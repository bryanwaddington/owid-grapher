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
jest.setTimeout(10000); // wait up to 10s
const ExplorerProgram_1 = require("../explorer/ExplorerProgram");
const ExplorerAdminServer_1 = require("./ExplorerAdminServer");
it("can init", () => __awaiter(void 0, void 0, void 0, function* () {
    const server = new ExplorerAdminServer_1.ExplorerAdminServer(__dirname, "https://example.com");
    expect(server).toBeTruthy();
    expect(yield server.renderExplorerPage(new ExplorerProgram_1.ExplorerProgram("foo", "explorerTitle helloWorld"))).toContain("helloWorld");
    const allExplorersResult = yield server.getAllExplorersCommand();
    expect(allExplorersResult.success).toBeTruthy();
}));
//# sourceMappingURL=ExplorerAdminServer.test.js.map