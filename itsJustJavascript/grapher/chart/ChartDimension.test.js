#! /usr/bin/env jest
"use strict";
// todo: remove this when we remove chartDimension
Object.defineProperty(exports, "__esModule", { value: true });
const ChartDimension_1 = require("./ChartDimension");
const OwidTable_1 = require("../../coreTable/OwidTable");
const GrapherConstants_1 = require("../core/GrapherConstants");
it("can serialize for saving", () => {
    expect(new ChartDimension_1.ChartDimension({ property: GrapherConstants_1.DimensionProperty.x, variableId: 1 }, { table: OwidTable_1.BlankOwidTable() }).toObject()).toEqual({ property: "x", variableId: 1 });
});
//# sourceMappingURL=ChartDimension.test.js.map