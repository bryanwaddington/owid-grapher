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
exports.TimelineController = void 0;
const TimeBounds_1 = require("../../clientUtils/TimeBounds");
const Util_1 = require("../../clientUtils/Util");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class TimelineController {
    constructor(manager) {
        // By default, play means extend the endTime to the right. Toggle this to play one time unit at a time.
        this.rangeMode = true;
        this.dragOffsets = [0, 0];
        this.manager = manager;
    }
    get timesAsc() {
        // Note: assumes times is sorted in asc
        return this.manager.times;
    }
    get startTime() {
        return Util_1.findClosestTime(this.timesAsc, this.manager.startHandleTimeBound);
    }
    get endTime() {
        return Util_1.findClosestTime(this.timesAsc, this.manager.endHandleTimeBound);
    }
    get minTime() {
        return this.timesAsc[0];
    }
    get maxTime() {
        return Util_1.last(this.timesAsc);
    }
    get startTimeProgress() {
        return (this.startTime - this.minTime) / (this.maxTime - this.minTime);
    }
    get endTimeProgress() {
        return (this.endTime - this.minTime) / (this.maxTime - this.minTime);
    }
    getNextTime(time) {
        var _a;
        // Todo: speed up?
        return (_a = this.timesAsc[this.timesAsc.indexOf(time) + 1]) !== null && _a !== void 0 ? _a : this.maxTime;
    }
    toggleRangeMode() {
        this.rangeMode = !this.rangeMode;
        return this;
    }
    isAtEnd() {
        return this.endTime === this.maxTime;
    }
    resetToBeginning() {
        const { manager } = this;
        const beginning = manager.endHandleTimeBound !== manager.startHandleTimeBound
            ? manager.startHandleTimeBound
            : this.minTime;
        manager.endHandleTimeBound = beginning;
        manager.startHandleTimeBound = beginning;
    }
    play(numberOfTicks) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { manager } = this;
            manager.isPlaying = true;
            if (this.isAtEnd())
                this.resetToBeginning();
            if (manager.onPlay)
                manager.onPlay();
            // Keep and return a tickCount for easier testability
            let tickCount = 0;
            while (manager.isPlaying) {
                const nextTime = this.getNextTime(this.endTime);
                if (!this.rangeMode)
                    this.updateStartTime(nextTime);
                this.updateEndTime(nextTime);
                tickCount++;
                if (nextTime >= this.maxTime || numberOfTicks === tickCount) {
                    this.stop();
                    break;
                }
                yield delay((_a = manager.msPerTick) !== null && _a !== void 0 ? _a : 0);
            }
            return tickCount;
        });
    }
    stop() {
        this.manager.isPlaying = false;
    }
    pause() {
        this.manager.isPlaying = false;
    }
    togglePlay() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.manager.isPlaying)
                this.pause();
            else
                yield this.play();
        });
    }
    setDragOffsets(inputTime) {
        var _a;
        const closestTime = (_a = Util_1.findClosestTime(this.timesAsc, inputTime)) !== null && _a !== void 0 ? _a : inputTime;
        this.dragOffsets = [
            this.startTime - closestTime,
            this.endTime - closestTime,
        ];
    }
    getTimeBoundFromDrag(inputTime) {
        var _a;
        if (inputTime < this.minTime)
            return TimeBounds_1.TimeBoundValue.negativeInfinity;
        if (inputTime > this.maxTime)
            return TimeBounds_1.TimeBoundValue.positiveInfinity;
        const closestTime = (_a = Util_1.findClosestTime(this.timesAsc, inputTime)) !== null && _a !== void 0 ? _a : inputTime;
        return Math.min(this.maxTime, Math.max(this.minTime, closestTime));
    }
    dragRangeToTime(time) {
        var _a;
        const { minTime, maxTime } = this;
        const closestTime = (_a = Util_1.findClosestTime(this.timesAsc, time)) !== null && _a !== void 0 ? _a : time;
        let startTime = this.dragOffsets[0] + closestTime;
        let endTime = this.dragOffsets[1] + closestTime;
        if (startTime < minTime) {
            startTime = minTime;
            endTime = this.getTimeBoundFromDrag(minTime + (this.dragOffsets[1] - this.dragOffsets[0]));
        }
        else if (endTime > maxTime) {
            startTime = this.getTimeBoundFromDrag(maxTime + (this.dragOffsets[0] - this.dragOffsets[1]));
            endTime = maxTime;
        }
        this.updateStartTime(startTime);
        this.updateEndTime(endTime);
    }
    dragHandleToTime(handle, inputTime) {
        const { manager } = this;
        const time = this.getTimeBoundFromDrag(inputTime);
        const constrainedHandle = handle === "start" && time > this.endTime
            ? "end"
            : handle === "end" && time < this.startTime
                ? "start"
                : handle;
        if (constrainedHandle !== handle) {
            if (handle === "start")
                this.updateStartTime(manager.endHandleTimeBound);
            else
                this.updateEndTime(manager.startHandleTimeBound);
        }
        if (manager.isPlaying && !this.rangeMode) {
            this.updateStartTime(time);
            this.updateEndTime(time);
        }
        else if (handle === "both")
            this.dragRangeToTime(inputTime);
        else if (constrainedHandle === "start")
            this.updateStartTime(time);
        else if (constrainedHandle === "end")
            this.updateEndTime(time);
        return constrainedHandle;
    }
    updateStartTime(timeBound) {
        this.manager.startHandleTimeBound = timeBound;
    }
    updateEndTime(timeBound) {
        this.manager.endHandleTimeBound = timeBound;
    }
    resetStartToMin() {
        this.updateStartTime(TimeBounds_1.TimeBoundValue.negativeInfinity);
    }
    resetEndToMax() {
        this.updateEndTime(TimeBounds_1.TimeBoundValue.positiveInfinity);
    }
}
exports.TimelineController = TimelineController;
//# sourceMappingURL=TimelineController.js.map