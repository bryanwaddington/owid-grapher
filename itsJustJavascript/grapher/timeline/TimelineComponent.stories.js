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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisablePlayButton = exports.OneYearAtATime = exports.StartPartialRange = exports.Default = void 0;
const React = __importStar(require("react"));
const TimelineComponent_1 = require("./TimelineComponent");
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
const TimelineController_1 = require("./TimelineController");
class TimelineManagerMock {
    constructor() {
        this.isPlaying = false;
        this.userHasSetTimeline = true;
        this.times = Util_1.range(1900, 2021);
        this._endTime = 2020;
        this._startTime = 1950;
        this.disablePlay = false;
    }
    set endHandleTimeBound(num) {
        this.updateEndTime(num);
    }
    get endHandleTimeBound() {
        return this._endTime;
    }
    updateEndTime(num) {
        this._endTime = num;
    }
    set startHandleTimeBound(num) {
        this.updateStartTime(num);
    }
    get startHandleTimeBound() {
        return this._startTime;
    }
    updateStartTime(num) {
        this._startTime = num;
    }
}
__decorate([
    mobx_1.observable
], TimelineManagerMock.prototype, "isPlaying", void 0);
__decorate([
    mobx_1.observable
], TimelineManagerMock.prototype, "userHasSetTimeline", void 0);
__decorate([
    mobx_1.observable
], TimelineManagerMock.prototype, "times", void 0);
__decorate([
    mobx_1.observable
], TimelineManagerMock.prototype, "_endTime", void 0);
__decorate([
    mobx_1.computed
], TimelineManagerMock.prototype, "endHandleTimeBound", null);
__decorate([
    mobx_1.action.bound
], TimelineManagerMock.prototype, "updateEndTime", null);
__decorate([
    mobx_1.observable
], TimelineManagerMock.prototype, "_startTime", void 0);
__decorate([
    mobx_1.computed
], TimelineManagerMock.prototype, "startHandleTimeBound", null);
__decorate([
    mobx_1.action.bound
], TimelineManagerMock.prototype, "updateStartTime", null);
__decorate([
    mobx_1.observable
], TimelineManagerMock.prototype, "disablePlay", void 0);
exports.default = {
    title: "TimelineControl",
    component: TimelineComponent_1.TimelineComponent,
};
class SingleYearManager extends TimelineManagerMock {
    constructor() {
        super(...arguments);
        this._endTime = 1950;
    }
    updateEndTime(num) {
        // Simulate the Map class, which can only have 1 target time
        this._endTime = num;
        this._startTime = num;
    }
    updateStartTime(num) {
        this._endTime = num;
        this._startTime = num;
    }
}
__decorate([
    mobx_1.action.bound
], SingleYearManager.prototype, "updateEndTime", null);
__decorate([
    mobx_1.action.bound
], SingleYearManager.prototype, "updateStartTime", null);
__decorate([
    mobx_1.observable
], SingleYearManager.prototype, "_endTime", void 0);
const Default = () => {
    const manager = new TimelineManagerMock();
    manager.startHandleTimeBound = 1900;
    const timelineController = new TimelineController_1.TimelineController(manager);
    return React.createElement(TimelineComponent_1.TimelineComponent, { timelineController: timelineController });
};
exports.Default = Default;
const StartPartialRange = () => (React.createElement(TimelineComponent_1.TimelineComponent, { timelineController: new TimelineController_1.TimelineController(new TimelineManagerMock()) }));
exports.StartPartialRange = StartPartialRange;
const OneYearAtATime = () => (React.createElement(TimelineComponent_1.TimelineComponent, { timelineController: new TimelineController_1.TimelineController(new SingleYearManager()) }));
exports.OneYearAtATime = OneYearAtATime;
const DisablePlayButton = () => {
    const manager = new TimelineManagerMock();
    manager.disablePlay = true;
    return (React.createElement(TimelineComponent_1.TimelineComponent, { timelineController: new TimelineController_1.TimelineController(manager) }));
};
exports.DisablePlayButton = DisablePlayButton;
//# sourceMappingURL=TimelineComponent.stories.js.map