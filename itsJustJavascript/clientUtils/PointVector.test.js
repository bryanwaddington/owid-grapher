#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PointVector_1 = require("./PointVector");
it("can report the center", () => {
    const point = new PointVector_1.PointVector(6, 8);
    expect(point.magnitude).toEqual(10);
});
//# sourceMappingURL=PointVector.test.js.map