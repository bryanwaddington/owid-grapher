#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SiteBaker_1 = require("./SiteBaker");
it("can init", () => {
    const baker = new SiteBaker_1.SiteBaker(__dirname + "/example.com", "https://example.com");
    expect(baker).toBeTruthy();
});
//# sourceMappingURL=SiteBaker.test.js.map