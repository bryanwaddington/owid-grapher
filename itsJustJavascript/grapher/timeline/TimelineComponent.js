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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineComponent = void 0;
const React = __importStar(require("react"));
const d3_selection_1 = require("d3-selection");
const Util_1 = require("../../clientUtils/Util");
const Bounds_1 = require("../../clientUtils/Bounds");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const faPlay_1 = require("@fortawesome/free-solid-svg-icons/faPlay");
const faPause_1 = require("@fortawesome/free-solid-svg-icons/faPause");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const react_1 = __importDefault(require("@tippyjs/react"));
const classnames_1 = __importDefault(require("classnames"));
const TimeBounds_1 = require("../../clientUtils/TimeBounds");
const HANDLE_TOOLTIP_FADE_TIME_MS = 2000;
let TimelineComponent = class TimelineComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.base = React.createRef();
        this.mouseHoveringOverTimeline = false;
        this.hideStartTooltip = Util_1.debounce(() => {
            this.startTooltipVisible = false;
        }, HANDLE_TOOLTIP_FADE_TIME_MS);
        this.hideEndTooltip = Util_1.debounce(() => {
            this.endTooltipVisible = false;
        }, HANDLE_TOOLTIP_FADE_TIME_MS);
        this.startTooltipVisible = false;
        this.endTooltipVisible = false;
    }
    get isDragging() {
        return !!this.dragTarget;
    }
    get manager() {
        return this.props.timelineController.manager;
    }
    get controller() {
        return this.props.timelineController;
    }
    get sliderBounds() {
        return this.slider
            ? Bounds_1.Bounds.fromRect(this.slider.getBoundingClientRect())
            : new Bounds_1.Bounds(0, 0, 100, 100);
    }
    getInputTimeFromMouse(event) {
        const { minTime, maxTime } = this.controller;
        const mouseX = Util_1.getRelativeMouse(this.slider, event).x;
        const fracWidth = mouseX / this.sliderBounds.width;
        return minTime + fracWidth * (maxTime - minTime);
    }
    onDrag(inputTime) {
        if (!this.manager.isPlaying)
            this.manager.userHasSetTimeline = true;
        this.dragTarget = this.controller.dragHandleToTime(this.dragTarget, inputTime);
        this.showTooltips();
    }
    showTooltips() {
        this.hideStartTooltip.cancel();
        this.hideEndTooltip.cancel();
        this.startTooltipVisible = true;
        this.endTooltipVisible = true;
        if (this.dragTarget === "start")
            this.lastUpdatedTooltip = "startMarker";
        if (this.dragTarget === "end")
            this.lastUpdatedTooltip = "endMarker";
        if (this.manager.startHandleTimeBound > this.manager.endHandleTimeBound)
            this.lastUpdatedTooltip =
                this.lastUpdatedTooltip === "startMarker"
                    ? "endMarker"
                    : "startMarker";
    }
    getDragTarget(inputTime, isStartMarker, isEndMarker) {
        const { startHandleTimeBound, endHandleTimeBound } = this.manager;
        if (startHandleTimeBound === endHandleTimeBound &&
            (isStartMarker || isEndMarker))
            return "both";
        else if (isStartMarker || inputTime <= startHandleTimeBound)
            return "start";
        else if (isEndMarker || inputTime >= endHandleTimeBound)
            return "end";
        return "both";
    }
    onMouseDown(event) {
        const logic = this.controller;
        const targetEl = d3_selection_1.select(event.target);
        const inputTime = this.getInputTimeFromMouse(event);
        this.dragTarget = this.getDragTarget(inputTime, targetEl.classed("startMarker"), targetEl.classed("endMarker"));
        if (this.dragTarget === "both")
            logic.setDragOffsets(inputTime);
        this.onDrag(inputTime);
        event.preventDefault();
    }
    onMouseMove(event) {
        const { dragTarget } = this;
        if (!dragTarget)
            return;
        if (this.queuedDrag)
            return;
        this.queuedDrag = true;
        this.onDrag(this.getInputTimeFromMouse(event));
        this.queuedDrag = false;
    }
    onMouseUp() {
        this.dragTarget = undefined;
        if (this.manager.isPlaying)
            return;
        if (Util_1.isMobile()) {
            if (this.startTooltipVisible)
                this.hideStartTooltip();
            if (this.endTooltipVisible)
                this.hideEndTooltip();
        }
        else if (!this.mouseHoveringOverTimeline) {
            this.startTooltipVisible = false;
            this.endTooltipVisible = false;
        }
    }
    onMouseOver() {
        this.mouseHoveringOverTimeline = true;
        this.hideStartTooltip.cancel();
        this.startTooltipVisible = true;
        this.hideEndTooltip.cancel();
        this.endTooltipVisible = true;
    }
    onMouseLeave() {
        if (!this.manager.isPlaying && !this.isDragging) {
            this.startTooltipVisible = false;
            this.endTooltipVisible = false;
        }
        this.mouseHoveringOverTimeline = false;
    }
    onPlayTouchEnd(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.controller.togglePlay();
    }
    get isPlayingOrDragging() {
        return this.manager.isPlaying || this.isDragging;
    }
    componentDidMount() {
        var _a, _b;
        const current = this.base.current;
        if (current) {
            this.slider = current.querySelector(".slider");
            this.playButton = current.querySelector(".play");
        }
        document.documentElement.addEventListener("mouseup", this.onMouseUp);
        document.documentElement.addEventListener("mouseleave", this.onMouseUp);
        document.documentElement.addEventListener("mousemove", this.onMouseMove);
        document.documentElement.addEventListener("touchend", this.onMouseUp);
        document.documentElement.addEventListener("touchmove", this.onMouseMove);
        (_a = this.slider) === null || _a === void 0 ? void 0 : _a.addEventListener("touchstart", this.onMouseDown, {
            passive: false,
        });
        (_b = this.playButton) === null || _b === void 0 ? void 0 : _b.addEventListener("touchend", this.onPlayTouchEnd, {
            passive: false,
        });
    }
    componentWillUnmount() {
        var _a, _b;
        document.documentElement.removeEventListener("mouseup", this.onMouseUp);
        document.documentElement.removeEventListener("mouseleave", this.onMouseUp);
        document.documentElement.removeEventListener("mousemove", this.onMouseMove);
        document.documentElement.removeEventListener("touchend", this.onMouseUp);
        document.documentElement.removeEventListener("touchmove", this.onMouseMove);
        (_a = this.slider) === null || _a === void 0 ? void 0 : _a.removeEventListener("touchstart", this.onMouseDown, {
            passive: false,
        });
        (_b = this.playButton) === null || _b === void 0 ? void 0 : _b.removeEventListener("touchend", this.onPlayTouchEnd, {
            passive: false,
        });
    }
    formatTime(time) {
        return this.manager.formatTimeFn
            ? this.manager.formatTimeFn(time)
            : time.toString();
    }
    timelineEdgeMarker(markerType) {
        const { controller } = this;
        const time = markerType === "start" ? controller.minTime : controller.maxTime;
        return (React.createElement("div", { className: "date clickable", onClick: () => markerType === "start"
                ? controller.resetStartToMin()
                : controller.resetEndToMax() }, this.formatTime(time)));
    }
    togglePlay() {
        this.controller.togglePlay();
    }
    convertToTime(time) {
        if (time === -Infinity)
            return this.controller.minTime;
        if (time === +Infinity)
            return this.controller.maxTime;
        return time;
    }
    render() {
        const { manager, controller } = this;
        const { startTimeProgress, endTimeProgress, minTime, maxTime, } = controller;
        const { startHandleTimeBound, endHandleTimeBound } = manager;
        const formattedStartTime = this.formatTime(TimeBounds_1.timeFromTimebounds(startHandleTimeBound, minTime));
        const formattedEndTime = this.formatTime(TimeBounds_1.timeFromTimebounds(endHandleTimeBound, maxTime));
        return (React.createElement("div", { ref: this.base, className: "TimelineComponent", onMouseOver: this.onMouseOver, onMouseLeave: this.onMouseLeave },
            !this.manager.disablePlay && (React.createElement("div", { onMouseDown: (e) => e.stopPropagation(), onClick: this.togglePlay, className: "play" }, manager.isPlaying ? (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPause_1.faPause })) : (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faPlay_1.faPlay })))),
            this.timelineEdgeMarker("start"),
            React.createElement("div", { className: "slider clickable", onMouseDown: this.onMouseDown },
                React.createElement(TimelineHandle, { type: "startMarker", offsetPercent: startTimeProgress * 100, tooltipContent: formattedStartTime, tooltipVisible: this.startTooltipVisible, tooltipZIndex: this.lastUpdatedTooltip === "startMarker" ? 2 : 1 }),
                React.createElement("div", { className: "interval", style: {
                        left: `${startTimeProgress * 100}%`,
                        right: `${100 - endTimeProgress * 100}%`,
                    } }),
                React.createElement(TimelineHandle, { type: "endMarker", offsetPercent: endTimeProgress * 100, tooltipContent: formattedEndTime, tooltipVisible: this.endTooltipVisible, tooltipZIndex: this.lastUpdatedTooltip === "endMarker" ? 2 : 1 })),
            this.timelineEdgeMarker("end")));
    }
};
__decorate([
    mobx_1.observable
], TimelineComponent.prototype, "dragTarget", void 0);
__decorate([
    mobx_1.computed
], TimelineComponent.prototype, "isDragging", null);
__decorate([
    mobx_1.computed
], TimelineComponent.prototype, "manager", null);
__decorate([
    mobx_1.computed
], TimelineComponent.prototype, "controller", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "onDrag", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "showTooltips", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "onMouseDown", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "onMouseMove", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "onMouseUp", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "onMouseOver", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "onMouseLeave", null);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "onPlayTouchEnd", null);
__decorate([
    mobx_1.computed
], TimelineComponent.prototype, "isPlayingOrDragging", null);
__decorate([
    mobx_1.observable
], TimelineComponent.prototype, "startTooltipVisible", void 0);
__decorate([
    mobx_1.observable
], TimelineComponent.prototype, "endTooltipVisible", void 0);
__decorate([
    mobx_1.observable
], TimelineComponent.prototype, "lastUpdatedTooltip", void 0);
__decorate([
    mobx_1.action.bound
], TimelineComponent.prototype, "togglePlay", null);
TimelineComponent = __decorate([
    mobx_react_1.observer
], TimelineComponent);
exports.TimelineComponent = TimelineComponent;
const TimelineHandle = ({ type, offsetPercent, tooltipContent, tooltipVisible, tooltipZIndex, }) => {
    return (React.createElement("div", { className: classnames_1.default("handle", type), style: {
            left: `${offsetPercent}%`,
        } },
        React.createElement(react_1.default, { content: tooltipContent, visible: tooltipVisible, zIndex: tooltipZIndex },
            React.createElement("div", { className: "icon" }))));
};
//# sourceMappingURL=TimelineComponent.js.map