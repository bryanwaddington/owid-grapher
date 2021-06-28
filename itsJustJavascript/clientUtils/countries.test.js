#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const countries_1 = require("./countries");
it("generates correct country redirect urls for netlify", () => {
    expect(countries_1.getCountryDetectionRedirects()).toContain(`/detect-country-redirect /detect-country.js?GBR 302! Country=gb`);
});
//# sourceMappingURL=countries.test.js.map