#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LegacyVariableCode_1 = require("./LegacyVariableCode");
it("can create and save display settings", () => {
    const settings = new LegacyVariableCode_1.LegacyVariableDisplayConfig();
    expect(settings.toObject()).toEqual({});
    settings.shortUnit = "kwh";
    expect(settings.toObject()).toEqual({ shortUnit: "kwh" });
});
//# sourceMappingURL=LegacyVariableCode.test.js.map