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
const TimeBounds_1 = require("../../clientUtils/TimeBounds");
const Util_1 = require("../../clientUtils/Util");
const TimelineController_1 = require("./TimelineController");
it("can play a timeline", () => __awaiter(void 0, void 0, void 0, function* () {
    let wasPlayed = false;
    const manager = {
        times: Util_1.range(2000, 2010),
        startHandleTimeBound: 2000,
        endHandleTimeBound: 2005,
        isPlaying: false,
        onPlay: () => (wasPlayed = true),
    };
    const controller = new TimelineController_1.TimelineController(manager);
    expect(manager.isPlaying).toEqual(false);
    expect(manager.endHandleTimeBound).toEqual(2005);
    expect(wasPlayed).toEqual(false);
    expect(controller.startTimeProgress).toEqual(0);
    expect(controller.endTimeProgress).toBeLessThan(1);
    const ticks = yield controller.play();
    expect(manager.isPlaying).toEqual(false);
    expect(manager.endHandleTimeBound).toEqual(2009);
    expect(wasPlayed).toEqual(true);
    expect(ticks).toEqual(4);
    expect(controller.getNextTime(2008)).toEqual(2009);
    expect(controller.getNextTime(2009)).toEqual(2009);
    expect(controller.startTimeProgress).toEqual(0);
    expect(controller.endTimeProgress).toEqual(1);
    // Can hit play, even if the end is here, and will replay from the beginning
    const ticks2 = yield controller.play();
    expect(ticks2).toEqual(9);
    // Start handle also resets if replay triggered
    controller.dragHandleToTime("start", controller.maxTime);
    controller.dragHandleToTime("end", controller.maxTime);
    yield controller.play();
    expect(controller.startTimeProgress).toEqual(0);
    // Can play single year mode
    controller.toggleRangeMode();
    yield controller.play(2);
    expect(manager.startHandleTimeBound).toEqual(2002);
}));
it("can handle when an end handle is dragged past a start handle", () => {
    const manager = {
        times: Util_1.range(1900, 2010),
        startHandleTimeBound: 2000,
        endHandleTimeBound: 2005,
    };
    const controller = new TimelineController_1.TimelineController(manager);
    controller.dragHandleToTime("end", 1950);
    expect(manager.startHandleTimeBound).toEqual(1950);
    expect(manager.endHandleTimeBound).toEqual(2000);
});
it("can report correct progress with Infinity values", () => {
    const manager = {
        times: Util_1.range(1900, 2010),
        startHandleTimeBound: -Infinity,
        endHandleTimeBound: Infinity,
    };
    const controller = new TimelineController_1.TimelineController(manager);
    expect(controller.startTimeProgress).toEqual(0);
    expect(controller.endTimeProgress).toEqual(1);
});
it("pins time to unboundedLeft or unboundedRight when marker is dragged beyond end of timeline", () => {
    const manager = {
        times: Util_1.range(1900, 2010),
        startHandleTimeBound: 2000,
        endHandleTimeBound: 2005,
    };
    const controller = new TimelineController_1.TimelineController(manager);
    expect(controller.getTimeBoundFromDrag(2009)).toBe(2009);
    expect(controller.getTimeBoundFromDrag(2009.1)).toBe(TimeBounds_1.TimeBoundValue.positiveInfinity);
    expect(controller.getTimeBoundFromDrag(1900)).toBe(1900);
    expect(controller.getTimeBoundFromDrag(1899.9)).toBe(TimeBounds_1.TimeBoundValue.negativeInfinity);
});
//# sourceMappingURL=TimelineController.test.js.map