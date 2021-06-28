#! /usr/bin/env jest
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const timezoneMock = __importStar(require("timezone-mock"));
const Util_1 = require("./Util");
const owidTypes_1 = require("./owidTypes");
describe(Util_1.findClosestTime, () => {
    describe("without tolerance", () => {
        describe("array", () => {
            it("returns the correct year", () => {
                const years = [2010, 2015, 2017];
                expect(Util_1.findClosestTime(years, 2015, 0)).toEqual(2015);
            });
            it("returns undefined", () => {
                const years = [2010, 2015, 2017];
                expect(Util_1.findClosestTime(years, 2014, 0)).toEqual(undefined);
            });
            it("can also get the index", () => {
                const years = [2010, 2015, 2017];
                expect(Util_1.findClosestTimeIndex(years, 2014, 1)).toEqual(1);
            });
        });
    });
    describe("specified tolerance", () => {
        it("returns the closest year within the specified tolerance", () => {
            const years = [2010, 2015, 2017];
            expect(Util_1.findClosestTime(years, 2013, 2)).toEqual(2015);
        });
        it("returns undefined outside the tolerance", () => {
            const years = [2010, 2017];
            expect(Util_1.findClosestTime(years, 2014, 1)).toEqual(undefined);
        });
        it("prefers later years", () => {
            const years = [2010, 2012, 2013, 2017];
            expect(Util_1.findClosestTime(years, 2011, 3)).toEqual(2012);
            expect(Util_1.findClosestTime(years, 2015, 3)).toEqual(2017);
        });
    });
    describe("unspecified tolerance", () => {
        it("returns the closest year", () => {
            const years = [1990, 2016];
            expect(Util_1.findClosestTime(years, 2013)).toEqual(2016);
            expect(Util_1.findClosestTime(years, 2002)).toEqual(1990);
        });
    });
});
describe(Util_1.getStartEndValues, () => {
    it("handles an empty array", () => {
        const extent = Util_1.getStartEndValues([]);
        expect(extent[0]).toEqual(undefined);
        expect(extent[1]).toEqual(undefined);
    });
    it("handles a single element array", () => {
        const extent = Util_1.getStartEndValues([{ time: 2016, value: 1 }]);
        expect(extent[0].time).toEqual(2016);
        expect(extent[1].time).toEqual(2016);
    });
    it("handles a multi-element array", () => {
        const extent = Util_1.getStartEndValues([
            { time: 2016, value: -20 },
            { time: 2014, value: 5 },
            { time: 2017, value: 7 },
        ]);
        expect(extent[0].time).toEqual(2014);
        expect(extent[1].time).toEqual(2017);
    });
});
describe(Util_1.next, () => {
    const scenarios = [
        {
            list: [55, 33, 22],
            current: 33,
            next: 22,
            previous: 55,
        },
        {
            list: [55, 33, 22],
            current: 44,
            next: 55,
            previous: 22,
        },
        {
            list: [55, 33, 22],
            current: 22,
            next: 55,
            previous: 33,
        },
        {
            list: [55, 33, 22],
            current: 55,
            next: 33,
            previous: 22,
        },
        {
            list: [55],
            current: 55,
            next: 55,
            previous: 55,
        },
    ];
    it("iterates correctly", () => {
        scenarios.forEach((scenario) => {
            expect(Util_1.next(scenario.list, scenario.current)).toBe(scenario.next);
            expect(Util_1.previous(scenario.list, scenario.current)).toBe(scenario.previous);
        });
    });
});
describe("random functions", () => {
    it("can generate a repeatable sequence of random numbers between 1 and 100 given a seed", () => {
        const rand = Util_1.getRandomNumberGenerator(1, 100, 123);
        expect([rand(), rand()]).toEqual([96, 13]);
    });
});
describe(Util_1.formatDay, () => {
    describe("timezones", () => {
        it("formats date consistently in GMT", () => {
            timezoneMock.register("Europe/London");
            expect(Util_1.formatDay(0)).toEqual("Jan 21, 2020");
            timezoneMock.unregister();
        });
        it("formats date consistently in US/Pacific", () => {
            timezoneMock.register("US/Pacific");
            expect(Util_1.formatDay(0)).toEqual("Jan 21, 2020");
            timezoneMock.unregister();
        });
        it("formats date consistently in US/Pacific", () => {
            timezoneMock.register("Australia/Adelaide");
            expect(Util_1.formatDay(0)).toEqual("Jan 21, 2020");
            timezoneMock.unregister();
        });
    });
    describe("epoch", () => {
        it("starts on Jan 21, 2020", () => {
            expect(Util_1.formatDay(0)).toEqual("Jan 21, 2020");
        });
        it("handles increments", () => {
            expect(Util_1.formatDay(11)).toEqual("Feb 1, 2020");
        });
        it("handles decrements", () => {
            expect(Util_1.formatDay(-21)).toEqual("Dec 31, 2019");
        });
    });
});
describe(Util_1.retryPromise, () => {
    function resolveAfterNthRetry(nth, message = "success") {
        let retried = 0;
        return () => new Promise((resolve, reject) => retried++ >= nth ? resolve(message) : reject());
    }
    it("resolves when promise succeeds first-time", () => __awaiter(void 0, void 0, void 0, function* () {
        const promiseGetter = resolveAfterNthRetry(0, "success");
        expect(Util_1.retryPromise(promiseGetter, 1)).resolves.toEqual("success");
    }));
    it("resolves when promise succeeds before retry limit", () => __awaiter(void 0, void 0, void 0, function* () {
        const promiseGetter = resolveAfterNthRetry(2, "success");
        expect(Util_1.retryPromise(promiseGetter, 3)).resolves.toEqual("success");
    }));
    it("rejects when promise doesn't succeed within retry limit", () => __awaiter(void 0, void 0, void 0, function* () {
        const promiseGetter = resolveAfterNthRetry(3, "success");
        expect(Util_1.retryPromise(promiseGetter, 3)).rejects.toBeUndefined();
    }));
});
describe(Util_1.rollingMap, () => {
    it("handles empty arrays", () => {
        expect(Util_1.rollingMap([], () => undefined).length).toEqual(0);
    });
    it("handles arrays with 1 element", () => {
        expect(Util_1.rollingMap([1], (a, b) => a + b).length).toEqual(0);
    });
    it("handles arrays with multiple elements", () => {
        expect(Util_1.rollingMap([1, 2, 4, 8], (a, b) => b - a)).toEqual([1, 2, 4]);
    });
});
describe("intersection", () => {
    const groupA = ["a", "b", "c"];
    const groupB = ["a", "b", "c", "d"];
    const groupC = ["a", "c", "d"];
    const groupD = ["a", "c", "d"];
    const groupE = [""];
    it("can compute intersections", () => {
        expect(Util_1.intersection(groupA, groupB)).toEqual(["a", "b", "c"]);
        expect(Util_1.intersection(groupA, groupE)).toEqual([]);
        expect(Util_1.intersection([], [])).toEqual([]);
        expect(Util_1.intersection(groupA, groupA)).toEqual(groupA);
        expect(Util_1.intersection(groupE, groupE)).toEqual([""]);
        expect(Util_1.intersection(groupA, groupB, groupC)).toEqual(["a", "c"]);
    });
    it("can detect set intersections", () => {
        const setA = new Set(groupA);
        const setB = new Set(groupB);
        const setC = new Set(groupC);
        const setD = new Set(groupD);
        const setE = new Set(groupE);
        expect(Array.from(Util_1.intersectionOfSets([setA, setB, setC, setD]).values())).toEqual(["a", "c"]);
        expect(Array.from(Util_1.intersectionOfSets([setA, setB, setC, setD, setE]).values())).toEqual([]);
        expect(Util_1.intersectionOfSets([]).size).toEqual(new Set().size);
    });
});
describe("anyToString", () => {
    const values = [
        false,
        0,
        1,
        "0",
        "1",
        null,
        undefined,
        "false",
        "true",
        NaN,
        Infinity,
        {},
        0.1,
    ];
    const expected = [
        "false",
        "0",
        "1",
        "0",
        "1",
        "",
        "",
        "false",
        "true",
        "NaN",
        "Infinity",
        "[object Object]",
        "0.1",
    ];
    it("handles edge cases in format value", () => {
        expect(values.map(Util_1.anyToString)).toEqual(expected);
    });
});
describe(Util_1.trimObject, () => {
    it("trims an object", () => {
        expect(Util_1.trimObject({ foo: undefined })).toEqual({});
        expect(Util_1.trimObject({ foo: {} })).toEqual({});
        expect(Util_1.trimObject({ foo: undefined, bar: 1 })).toEqual({ bar: 1 });
        expect(Util_1.trimObject({ foo: undefined, bar: 1, test: "" })).toEqual({
            bar: 1,
            test: "",
        });
        expect(Util_1.trimObject({ foo: undefined, bar: 1, test: "" }, true)).toEqual({
            bar: 1,
        });
    });
});
describe(Util_1.groupMap, () => {
    it("groups by key", () => {
        const group = Util_1.groupMap([0, 1, "a", 1, 1], (v) => v);
        expect(group.get(0)).toEqual([0]);
        expect(group.get(1)).toEqual([1, 1, 1]);
        expect(group.get("a")).toEqual(["a"]);
    });
});
describe(Util_1.numberMagnitude, () => {
    it("0 has magnitude 0", () => expect(Util_1.numberMagnitude(0)).toEqual(0));
    it("1 has magnitude 1", () => expect(Util_1.numberMagnitude(1)).toEqual(1));
    it("1.1 has magnitude 1", () => expect(Util_1.numberMagnitude(1.1)).toEqual(1));
    it("-10 has magnitude 2", () => expect(Util_1.numberMagnitude(-10)).toEqual(2));
    it("11 has magnitude 2", () => expect(Util_1.numberMagnitude(11)).toEqual(2));
    it("0.02 has magnitude -1", () => expect(Util_1.numberMagnitude(0.02)).toEqual(-1));
    it("0.5 has magnitude 0", () => expect(Util_1.numberMagnitude(0.5)).toEqual(0));
});
describe(Util_1.roundSigFig, () => {
    it("rounds to 1 sig fig by default", () => {
        expect(Util_1.roundSigFig(652)).toEqual(700);
    });
    it("rounds integer to provided sig figs", () => {
        expect(Util_1.roundSigFig(652, 2)).toEqual(650);
    });
    it("rounds floating point to provided sig figs", () => {
        expect(Util_1.roundSigFig(0.00652, 1)).toEqual(0.007);
    });
    it("rounds negative values to provided sig figs", () => {
        expect(Util_1.roundSigFig(-652, 1)).toEqual(-700);
    });
    it("leaves zero unchanged", () => {
        expect(Util_1.roundSigFig(0, 2)).toEqual(0);
    });
});
describe(Util_1.lowerCaseFirstLetterUnlessAbbreviation, () => {
    it("works", () => {
        expect(Util_1.lowerCaseFirstLetterUnlessAbbreviation("GDP")).toEqual("GDP");
        expect(Util_1.lowerCaseFirstLetterUnlessAbbreviation("Change in")).toEqual("change in");
    });
});
describe(Util_1.sortNumeric, () => {
    it("sorts numeric values", () => {
        expect(Util_1.sortNumeric([3, 4, 2, 1, 3, 8])).toEqual([1, 2, 3, 3, 4, 8]);
    });
    it("sorts numeric values in ascending value", () => {
        expect(Util_1.sortNumeric([3, 4, 2, 1, 3, 8], undefined, owidTypes_1.SortOrder.asc)).toEqual([1, 2, 3, 3, 4, 8]);
    });
    it("sorts numeric values in descending order", () => {
        expect(Util_1.sortNumeric([3, 4, 2, 1, 3, 8], undefined, owidTypes_1.SortOrder.desc)).toEqual([8, 4, 3, 3, 2, 1]);
    });
    it("sorts objects using a sortBy function", () => {
        expect(Util_1.sortNumeric([{ a: 3 }, { a: 4 }, { a: 2 }, { a: 1 }, { a: 3 }, { a: 8 }], (o) => o.a)).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 3 }, { a: 4 }, { a: 8 }]);
    });
});
describe(Util_1.getClosestTimePairs, () => {
    it("case 1", () => {
        expect(Util_1.getClosestTimePairs([0, 4], [3, 4])).toEqual(expect.arrayContaining([
            [0, 3],
            [4, 4],
        ]));
    });
    it("case 2", () => {
        expect(Util_1.getClosestTimePairs([0, 5, 6, 8], [3, 7])).toEqual(expect.arrayContaining([
            [5, 3],
            [6, 7],
        ]));
    });
    it("case 3", () => {
        expect(Util_1.getClosestTimePairs([0, 1, 2], [2])).toEqual(expect.arrayContaining([[2, 2]]));
    });
    it("case 4", () => {
        expect(Util_1.getClosestTimePairs([0, 1], [2])).toEqual(expect.arrayContaining([[1, 2]]));
    });
    it("case 5", () => {
        expect(Util_1.getClosestTimePairs([5, 6], [1])).toEqual(expect.arrayContaining([[5, 1]]));
    });
    it("case 6", () => {
        expect(Util_1.getClosestTimePairs([0, 1], [2, 3])).toEqual(expect.arrayContaining([[1, 2]]));
    });
    it("case 7", () => {
        expect(Util_1.getClosestTimePairs([2, 3], [0, 1])).toEqual(expect.arrayContaining([[2, 1]]));
    });
    it("case 8", () => {
        expect(Util_1.getClosestTimePairs([0, 4], [3])).toEqual(expect.arrayContaining([[4, 3]]));
    });
    describe("with maxDiff", () => {
        it("case 1", () => {
            expect(Util_1.getClosestTimePairs([0, 1], [2, 3], 1)).toEqual([[1, 2]]);
        });
        it("case 2", () => {
            expect(Util_1.getClosestTimePairs([0, 1], [3, 4], 1)).toEqual([]);
        });
        it("case 3", () => {
            expect(Util_1.getClosestTimePairs([2, 3], [0], 2)).toEqual([[2, 0]]);
        });
        it("case 4", () => {
            expect(Util_1.getClosestTimePairs([2, 3], [0], 1)).toEqual([]);
        });
    });
});
describe(Util_1.differenceObj, () => {
    it("handles empty objects", () => {
        expect(Util_1.differenceObj({}, {})).toEqual({});
        expect(Util_1.differenceObj({ a: 1 }, {})).toEqual({ a: 1 });
        expect(Util_1.differenceObj({}, { a: 1 })).toEqual({});
    });
    it("discards values that don't strictly equal values on reference object", () => {
        expect(Util_1.differenceObj({ a: 1, b: 2, c: 3 }, { a: 1, b: 3, d: 4 })).toEqual({ b: 2, c: 3 });
    });
});
//# sourceMappingURL=Util.test.js.map