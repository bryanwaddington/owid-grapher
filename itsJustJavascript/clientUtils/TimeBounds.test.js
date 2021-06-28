#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TimeBounds_1 = require("./TimeBounds");
describe(TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity, () => {
    it("handles unbounded left", () => {
        expect(TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity("earliest")).toEqual(TimeBounds_1.TimeBoundValue.negativeInfinity);
    });
    it("handles unbounded right", () => {
        expect(TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity("latest")).toEqual(TimeBounds_1.TimeBoundValue.positiveInfinity);
    });
    it("handles undefined", () => {
        expect(TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity(undefined)).toEqual(TimeBounds_1.TimeBoundValue.negativeInfinity);
    });
    it("handles number", () => {
        expect(TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity(1990)).toEqual(1990);
    });
    it("handles negative number", () => {
        expect(TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity(-1990)).toEqual(-1990);
    });
    it("handles zero", () => {
        expect(TimeBounds_1.minTimeBoundFromJSONOrNegativeInfinity(0)).toEqual(0);
    });
});
describe(TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity, () => {
    it("handles unbounded left", () => {
        expect(TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity("earliest")).toEqual(TimeBounds_1.TimeBoundValue.negativeInfinity);
    });
    it("handles unbounded right", () => {
        expect(TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity("latest")).toEqual(TimeBounds_1.TimeBoundValue.positiveInfinity);
    });
    it("handles undefined", () => {
        expect(TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(undefined)).toEqual(TimeBounds_1.TimeBoundValue.positiveInfinity);
    });
    it("handles number", () => {
        expect(TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(1990)).toEqual(1990);
    });
    it("handles negative number", () => {
        expect(TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(-1990)).toEqual(-1990);
    });
    it("handles zero", () => {
        expect(TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(0)).toEqual(0);
    });
});
describe(TimeBounds_1.minTimeToJSON, () => {
    it("handles unbounded left", () => {
        expect(TimeBounds_1.minTimeToJSON(TimeBounds_1.TimeBoundValue.negativeInfinity)).toEqual("earliest");
    });
    it("handles unbounded right", () => {
        expect(TimeBounds_1.minTimeToJSON(TimeBounds_1.TimeBoundValue.positiveInfinity)).toEqual("latest");
    });
    it("handles undefined", () => {
        expect(TimeBounds_1.minTimeToJSON(undefined)).toEqual(undefined);
    });
    it("handles number", () => {
        expect(TimeBounds_1.minTimeToJSON(1990)).toEqual(1990);
    });
    it("handles negative number", () => {
        expect(TimeBounds_1.minTimeToJSON(-1990)).toEqual(-1990);
    });
    it("handles zero", () => {
        expect(TimeBounds_1.minTimeToJSON(0)).toEqual(0);
    });
});
describe(TimeBounds_1.maxTimeToJSON, () => {
    it("handles unbounded left", () => {
        expect(TimeBounds_1.maxTimeToJSON(TimeBounds_1.TimeBoundValue.negativeInfinity)).toEqual("earliest");
    });
    it("handles unbounded right", () => {
        expect(TimeBounds_1.maxTimeToJSON(TimeBounds_1.TimeBoundValue.positiveInfinity)).toEqual("latest");
    });
    it("handles undefined", () => {
        expect(TimeBounds_1.maxTimeToJSON(undefined)).toEqual(undefined);
    });
    it("handles number", () => {
        expect(TimeBounds_1.maxTimeToJSON(1990)).toEqual(1990);
    });
    it("handles negative number", () => {
        expect(TimeBounds_1.maxTimeToJSON(-1990)).toEqual(-1990);
    });
    it("handles zero", () => {
        expect(TimeBounds_1.maxTimeToJSON(0)).toEqual(0);
    });
});
describe(TimeBounds_1.getTimeDomainFromQueryString, () => {
    it("can handle both unbounded", () => {
        expect(TimeBounds_1.getTimeDomainFromQueryString("..")).toEqual([
            -Infinity,
            Infinity,
        ]);
    });
});
//# sourceMappingURL=TimeBounds.test.js.map