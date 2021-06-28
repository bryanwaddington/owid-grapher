#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitCmsServer_1 = require("./GitCmsServer");
// Just a sanity test, main tests are in the integration tests file.
it("can init", () => {
    expect(new GitCmsServer_1.GitCmsServer({ baseDir: __dirname })).toBeTruthy();
});
//# sourceMappingURL=GitCmsServer.test.js.map