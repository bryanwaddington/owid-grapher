"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DualAxis = exports.VerticalAxis = exports.HorizontalAxis = void 0;
const d3_scale_1 = require("d3-scale");
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
const Bounds_1 = require("../../clientUtils/Bounds");
const TextWrap_1 = require("../text/TextWrap");
const owidTypes_1 = require("../../clientUtils/owidTypes");
class AbstractAxis {
    constructor(config) {
        this.hideFractionalTicks = false;
        this.hideGridlines = false;
        this.range = [0, 0];
        this.config = config;
        this.domain = [config.domain[0], config.domain[1]];
    }
    get hideAxis() {
        return this.config.hideAxis;
    }
    // This will expand the domain but never shrink.
    // This will change the min unless the user's min setting is less
    // This will change the max unless the user's max setting is greater
    // Undefined values are ignored
    updateDomainPreservingUserSettings(domain) {
        this.domain = [
            domain[0] !== undefined
                ? Math.min(this.domain[0], domain[0])
                : this.domain[0],
            domain[1] !== undefined
                ? Math.max(this.domain[1], domain[1])
                : this.domain[1],
        ];
        return this;
    }
    get fontSize() {
        return this.config.fontSize;
    }
    get scaleType() {
        var _a;
        return (_a = this._scaleType) !== null && _a !== void 0 ? _a : (this.config.scaleType || owidTypes_1.ScaleType.linear);
    }
    set scaleType(value) {
        this._scaleType = value;
    }
    get label() {
        var _a;
        return (_a = this._label) !== null && _a !== void 0 ? _a : this.config.label;
    }
    set label(value) {
        this._label = value;
    }
    get canChangeScaleType() {
        return this.config.canChangeScaleType;
    }
    // todo: refactor. switch to a parent pattern?
    _update(parentAxis) {
        this.formatColumn = parentAxis.formatColumn;
        this.domain = parentAxis.domain.slice();
        this.hideFractionalTicks = parentAxis.hideFractionalTicks;
        this.hideGridlines = parentAxis.hideGridlines;
        this.range = parentAxis.range.slice();
        this._scaleType = parentAxis._scaleType;
        this._label = parentAxis._label;
        return this;
    }
    get d3_scale() {
        const d3Scale = this.scaleType === owidTypes_1.ScaleType.log ? d3_scale_1.scaleLog : d3_scale_1.scaleLinear;
        return d3Scale().domain(this.domain).range(this.range);
    }
    get rangeSize() {
        return Math.abs(this.range[1] - this.range[0]);
    }
    get rangeMax() {
        return Math.max(this.range[1], this.range[0]);
    }
    get rangeMin() {
        return Math.min(this.range[1], this.range[0]);
    }
    // When this is a log axis, only show so many grid lines because otherwise the chart would get
    // too overwhelming. Different for mobile because screens are usually smaller.
    get maxLogLines() {
        return Util_1.isMobile() ? 8 : 10;
    }
    getTickValues() {
        const { scaleType, d3_scale, maxLogLines } = this;
        let ticks;
        if (scaleType === owidTypes_1.ScaleType.log) {
            // This is a wild heuristic that decides how many tick lines and grid lines we want to
            // show for log charts.
            //
            // It tries to achive multiple goals:
            // * make it obvious for the user which values they're looking at
            // * ideally, make it very clear that this is a log axis by looking like log paper
            // * (but) don't overwhelm the user
            // * avoid cases where only one tick is shown for the whole axis (we had those!)
            //
            // This code roughly works as follows:
            // First, we let d3 generate ticks for the axis. d3 gives values of the form `y * 10^x`,
            // with 0 < y < 10.
            // We then assign priorities to these values:
            // * priority 1 (highest) to values of the form `1 * 10^x` (e.g. 100)
            // * priority 2 to values of the form `2 * 10^x` or `5 * 10^x` (e.g. 5, 2000)
            // * priority 3 (lowest) to all other ("in-between") values (e.g. 70, 300)
            //
            // We then decide depending on the number of tick candidates what to do:
            // * if we have less than `maxLogLines`, just show all
            // * if we have betwenn `maxLogLines` and `2 * maxLogLines`, show all "in-between" lines
            //   as faint grid lines without labels to give the chart that log paper look.
            //   We also show all priority 1 and 2 lines with labels, because there aren't too many
            //   of them.
            // * otherwise, remove priority 3 and, if necessary, priority 2 labels until we're below
            //   `maxLogLines` labels overall
            //
            // -@MarcelGerber, 2020-08-07
            const tickCandidates = d3_scale.ticks(maxLogLines);
            ticks = tickCandidates.map((value) => {
                // 10^x
                if (Math.fround(Math.log10(value)) % 1 === 0)
                    return { value, priority: 1 };
                // 5 * 10^x
                else if (Math.fround(Math.log10(value * 2)) % 1 === 0)
                    return { value, priority: 2 };
                // 2 * 10^x
                else if (Math.fround(Math.log10(value / 2)) % 1 === 0)
                    return { value, priority: 2 };
                return { value, priority: 3 };
            });
            if (ticks.length > maxLogLines) {
                if (ticks.length <= 2 * maxLogLines) {
                    // Convert all "in-between" lines to faint grid lines without labels
                    ticks = ticks.map((tick) => {
                        if (tick.priority === 3)
                            tick = Object.assign(Object.assign({}, tick), { faint: true, gridLineOnly: true });
                        return tick;
                    });
                }
                else {
                    // Remove some tickmarks again because the chart would get too overwhelming
                    // otherwise
                    for (let priority = 3; priority > 1; priority--) {
                        if (ticks.length > maxLogLines)
                            ticks = ticks.filter((tick) => tick.priority < priority);
                    }
                }
            }
        }
        else {
            // Only use priority 2 here because we want the start / end ticks
            // to be priority 1
            ticks = d3_scale.ticks(6).map((tickValue) => ({
                value: tickValue,
                priority: 2,
            }));
        }
        if (this.hideFractionalTicks)
            ticks = ticks.filter((t) => t.value % 1 === 0);
        return Util_1.uniq(ticks);
    }
    getTickFormattingOptions() {
        // The chart's tick formatting function is used by default to format axis ticks. This means
        // that the chart's `numDecimalPlaces` is also used by default to format the axis ticks.
        //
        // However, the author-specified decimal places are not always appropriate for rendering
        // ticks, because:
        // 1. Subsets of the data may require higher fidelity, e.g. users can use the timeline to
        //    end up in a subset of the dataset where values happen to be much lower than usual.
        // 2. Ticks may be rendered at granularities that may not exist in the data, e.g. the data
        //    may only contain 0 and 1, but we may show ticks in between those values.
        //
        // Therefore, when formatting ticks, we determine the `numDecimalPlaces` automatically, by
        // finding the smallest difference between any pair of ticks and making sure that we have
        // sufficient decimal places to express the difference to the first significant figure (the
        // first non-zero digit).
        //
        // One significant figure is sufficient because we use D3's ticks() and that creates
        // "uniformly-spaced, nicely-rounded values [...] where each value is a power of ten
        // multiplied by 1, 2 or 5"
        // See: https://github.com/d3/d3-array/blob/master/README.md#ticks
        //
        // -@danielgavrilov, 2020-05-27
        const tickValues = this.getTickValues();
        const minDist = Util_1.min(Util_1.rollingMap(tickValues, (a, b) => Math.abs(a.value - b.value)));
        if (minDist === undefined)
            return {};
        // Find the decimal places required to reach the first non-zero digit
        const dp = Math.ceil(-Math.log10(minDist));
        if (isFinite(dp) && dp >= 0)
            return { numDecimalPlaces: dp };
        return {};
    }
    getFormattedTicks() {
        // todo: pass in first or last?
        return this.getTickValues().map((tickmark) => this.formatTick(tickmark.value));
    }
    place(value) {
        if (!this.range) {
            console.error("Can't place value on scale without a defined output range");
            return value;
        }
        else if (this.scaleType === owidTypes_1.ScaleType.log && value <= 0) {
            console.error(`Can't have ${value} which is <= 0 on a log scale`);
            return value;
        }
        return parseFloat(this.d3_scale(value).toFixed(1));
    }
    get tickFontSize() {
        return 0.9 * this.fontSize;
    }
    doIntersect(bounds, bounds2) {
        return bounds.intersects(bounds2);
    }
    get ticks() {
        const { tickPlacements } = this;
        for (let i = 0; i < tickPlacements.length; i++) {
            for (let j = i + 1; j < tickPlacements.length; j++) {
                const t1 = tickPlacements[i], t2 = tickPlacements[j];
                if (t1 === t2 || t1.isHidden || t2.isHidden)
                    continue;
                if (this.doIntersect(t1.bounds, t2.bounds))
                    t2.isHidden = true;
            }
        }
        return Util_1.sortBy(tickPlacements.filter((t) => !t.isHidden).map((t) => t.tick));
    }
    formatTick(tick, formattingOptionsOverride) {
        var _a, _b;
        const tickFormattingOptions = Object.assign(Object.assign({}, this.getTickFormattingOptions()), formattingOptionsOverride);
        return ((_b = (_a = this.formatColumn) === null || _a === void 0 ? void 0 : _a.formatForTick(tick, tickFormattingOptions)) !== null && _b !== void 0 ? _b : tick.toString());
    }
    // calculates coordinates for ticks, sorted by priority
    get tickPlacements() {
        return Util_1.sortBy(this.baseTicks, (tick) => tick.priority).map((tick) => {
            const bounds = Bounds_1.Bounds.forText(this.formatTick(tick.value, {
                isFirstOrLastTick: tick.isFirstOrLastTick,
            }), {
                fontSize: this.tickFontSize,
            });
            return {
                tick: tick.value,
                bounds: bounds.extend(this.placeTick(tick.value, bounds)),
                isHidden: false,
            };
        });
    }
    get labelFontSize() {
        return 0.7 * this.fontSize;
    }
    get baseTicks() {
        return this.getTickValues().filter((tick) => !tick.gridLineOnly);
    }
    get labelTextWrap() {
        const text = this.label;
        return text
            ? new TextWrap_1.TextWrap({
                maxWidth: this.labelWidth,
                fontSize: this.labelFontSize,
                text,
            })
            : undefined;
    }
}
__decorate([
    mobx_1.observable.ref
], AbstractAxis.prototype, "domain", void 0);
__decorate([
    mobx_1.observable
], AbstractAxis.prototype, "formatColumn", void 0);
__decorate([
    mobx_1.observable
], AbstractAxis.prototype, "hideFractionalTicks", void 0);
__decorate([
    mobx_1.observable
], AbstractAxis.prototype, "hideGridlines", void 0);
__decorate([
    mobx_1.observable.struct
], AbstractAxis.prototype, "range", void 0);
__decorate([
    mobx_1.observable
], AbstractAxis.prototype, "_scaleType", void 0);
__decorate([
    mobx_1.observable
], AbstractAxis.prototype, "_label", void 0);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "hideAxis", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "scaleType", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "label", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "canChangeScaleType", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "d3_scale", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "rangeSize", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "rangeMax", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "rangeMin", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "maxLogLines", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "tickFontSize", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "ticks", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "tickPlacements", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "labelFontSize", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "baseTicks", null);
__decorate([
    mobx_1.computed
], AbstractAxis.prototype, "labelTextWrap", null);
const labelPadding = 5;
class HorizontalAxis extends AbstractAxis {
    // todo: test/refactor
    clone() {
        return new HorizontalAxis(this.config)._update(this);
    }
    get labelOffset() {
        return this.labelTextWrap
            ? this.labelTextWrap.height + labelPadding * 2
            : 0;
    }
    get labelWidth() {
        return this.rangeSize;
    }
    get height() {
        const { labelOffset } = this;
        const firstFormattedTick = this.getFormattedTicks()[0];
        const fontSize = this.tickFontSize;
        return (Bounds_1.Bounds.forText(firstFormattedTick, {
            fontSize,
        }).height +
            labelOffset +
            5);
    }
    get baseTicks() {
        let ticks = this.getTickValues().filter((tick) => !tick.gridLineOnly);
        const { domain } = this;
        // Make sure the start and end values are present, if they're whole numbers
        const startEndPrio = this.scaleType === owidTypes_1.ScaleType.log ? 2 : 1;
        if (domain[0] % 1 === 0)
            ticks = [
                {
                    value: domain[0],
                    priority: startEndPrio,
                    isFirstOrLastTick: true,
                },
                ...ticks,
            ];
        if (domain[1] % 1 === 0 && this.hideFractionalTicks)
            ticks = [
                ...ticks,
                {
                    value: domain[1],
                    priority: startEndPrio,
                    isFirstOrLastTick: true,
                },
            ];
        return Util_1.uniq(ticks);
    }
    placeTick(tickValue, bounds) {
        const { labelOffset } = this;
        return {
            x: this.place(tickValue) - bounds.width / 2,
            y: bounds.bottom - labelOffset,
        };
    }
    // Add some padding before checking for intersection
    doIntersect(bounds, bounds2) {
        return bounds.intersects(bounds2.padWidth(-5));
    }
}
__decorate([
    mobx_1.computed
], HorizontalAxis.prototype, "labelOffset", null);
__decorate([
    mobx_1.computed
], HorizontalAxis.prototype, "labelWidth", null);
__decorate([
    mobx_1.computed
], HorizontalAxis.prototype, "height", null);
__decorate([
    mobx_1.computed
], HorizontalAxis.prototype, "baseTicks", null);
exports.HorizontalAxis = HorizontalAxis;
class VerticalAxis extends AbstractAxis {
    get labelWidth() {
        return this.height;
    }
    // todo: test/refactor
    clone() {
        return new VerticalAxis(this.config)._update(this);
    }
    get labelOffset() {
        return this.labelTextWrap ? this.labelTextWrap.height + 10 : 0;
    }
    get width() {
        const { labelOffset } = this;
        const longestTick = Util_1.maxBy(this.getFormattedTicks(), (tick) => tick.length);
        return (Bounds_1.Bounds.forText(longestTick, { fontSize: this.tickFontSize }).width +
            labelOffset +
            5);
    }
    get height() {
        return this.rangeSize;
    }
    placeTick(tickValue) {
        return {
            y: this.place(tickValue),
            // x placement doesn't really matter here, so we're using
            // 1 for simplicity
            x: 1,
        };
    }
}
__decorate([
    mobx_1.computed
], VerticalAxis.prototype, "labelWidth", null);
__decorate([
    mobx_1.computed
], VerticalAxis.prototype, "labelOffset", null);
__decorate([
    mobx_1.computed
], VerticalAxis.prototype, "width", null);
__decorate([
    mobx_1.computed
], VerticalAxis.prototype, "height", null);
exports.VerticalAxis = VerticalAxis;
// DualAxis has the important task of coordinating two axes so that they work together!
// There is a *two-way dependency* between the bounding size of each axis.
// e.g. if the y axis becomes wider because a label is present, the x axis then has less
// space to work with, and vice versa
class DualAxis {
    constructor(props) {
        this.props = props;
    }
    get horizontalAxis() {
        const axis = this.props.horizontalAxis.clone();
        axis.range = this.innerBounds.xRange();
        return axis;
    }
    get verticalAxis() {
        const axis = this.props.verticalAxis.clone();
        axis.range = this.innerBounds.yRange();
        return axis;
    }
    // We calculate an initial height from the range of the input bounds
    get horizontalAxisHeight() {
        const axis = this.props.horizontalAxis.clone();
        axis.range = [0, this.bounds.width];
        return axis.hideAxis ? 0 : axis.height;
    }
    // We calculate an initial width from the range of the input bounds
    get verticalAxisWidth() {
        const axis = this.props.verticalAxis.clone();
        axis.range = [0, this.bounds.height];
        return axis.hideAxis ? 0 : axis.width;
    }
    // Now we can determine the "true" inner bounds of the dual axis
    get innerBounds() {
        return this.bounds
            .padBottom(this.horizontalAxisHeight)
            .padLeft(this.verticalAxisWidth);
    }
    get bounds() {
        var _a;
        return (_a = this.props.bounds) !== null && _a !== void 0 ? _a : Bounds_1.DEFAULT_BOUNDS;
    }
}
__decorate([
    mobx_1.computed
], DualAxis.prototype, "horizontalAxis", null);
__decorate([
    mobx_1.computed
], DualAxis.prototype, "verticalAxis", null);
__decorate([
    mobx_1.computed
], DualAxis.prototype, "horizontalAxisHeight", null);
__decorate([
    mobx_1.computed
], DualAxis.prototype, "verticalAxisWidth", null);
__decorate([
    mobx_1.computed
], DualAxis.prototype, "innerBounds", null);
__decorate([
    mobx_1.computed
], DualAxis.prototype, "bounds", null);
exports.DualAxis = DualAxis;
//# sourceMappingURL=Axis.js.map