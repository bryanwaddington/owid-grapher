"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxisConfig = void 0;
const GrapherConstants_1 = require("../core/GrapherConstants");
const Util_1 = require("../../clientUtils/Util");
const mobx_1 = require("mobx");
const Axis_1 = require("./Axis");
const Persistable_1 = require("../persistable/Persistable");
class AxisConfigDefaults {
    constructor() {
        this.min = undefined;
        this.max = undefined;
        this.scaleType = GrapherConstants_1.ScaleType.linear;
        this.canChangeScaleType = undefined;
        this.label = "";
        this.removePointsOutsideDomain = undefined;
        this.facetAxisRange = GrapherConstants_1.FacetAxisRange.shared;
    }
}
__decorate([
    mobx_1.observable.ref
], AxisConfigDefaults.prototype, "min", void 0);
__decorate([
    mobx_1.observable.ref
], AxisConfigDefaults.prototype, "max", void 0);
__decorate([
    mobx_1.observable.ref
], AxisConfigDefaults.prototype, "scaleType", void 0);
__decorate([
    mobx_1.observable.ref
], AxisConfigDefaults.prototype, "canChangeScaleType", void 0);
__decorate([
    mobx_1.observable
], AxisConfigDefaults.prototype, "label", void 0);
__decorate([
    mobx_1.observable.ref
], AxisConfigDefaults.prototype, "removePointsOutsideDomain", void 0);
__decorate([
    mobx_1.observable.ref
], AxisConfigDefaults.prototype, "facetAxisRange", void 0);
class AxisConfig extends AxisConfigDefaults {
    // todo: test/refactor
    constructor(props, fontSizeManager) {
        super();
        this.hideAxis = false;
        this.updateFromObject(props);
        this.fontSizeManager = fontSizeManager;
    }
    // todo: test/refactor
    updateFromObject(props) {
        if (props)
            Util_1.extend(this, props);
    }
    toObject() {
        const obj = Util_1.trimObject({
            scaleType: this.scaleType,
            label: this.label ? this.label : undefined,
            min: this.min,
            max: this.max,
            canChangeScaleType: this.canChangeScaleType,
            removePointsOutsideDomain: this.removePointsOutsideDomain,
            facetAxisRange: this.facetAxisRange,
        });
        Persistable_1.deleteRuntimeAndUnchangedProps(obj, new AxisConfigDefaults());
        return obj;
    }
    get fontSize() {
        var _a;
        return ((_a = this.fontSizeManager) === null || _a === void 0 ? void 0 : _a.fontSize) || GrapherConstants_1.BASE_FONT_SIZE;
    }
    // A log scale domain cannot have values <= 0, so we double check here
    get constrainedMin() {
        var _a, _b;
        if (this.scaleType === GrapherConstants_1.ScaleType.log && ((_a = this.min) !== null && _a !== void 0 ? _a : 0) <= 0)
            return Infinity;
        return (_b = this.min) !== null && _b !== void 0 ? _b : Infinity;
    }
    // If the author has specified a min/max AND to remove points outside the domain, this should return true
    shouldRemovePoint(value) {
        if (!this.removePointsOutsideDomain)
            return false;
        if (this.min !== undefined && value < this.min)
            return true;
        if (this.max !== undefined && value > this.max)
            return true;
        return false;
    }
    get constrainedMax() {
        var _a;
        if (this.scaleType === GrapherConstants_1.ScaleType.log && (this.max || 0) <= 0)
            return -Infinity;
        return (_a = this.max) !== null && _a !== void 0 ? _a : -Infinity;
    }
    get domain() {
        return [this.constrainedMin, this.constrainedMax];
    }
    // Convert axis configuration to a finalized axis spec by supplying
    // any needed information calculated from the data
    toHorizontalAxis() {
        return new Axis_1.HorizontalAxis(this);
    }
    toVerticalAxis() {
        return new Axis_1.VerticalAxis(this);
    }
}
__decorate([
    mobx_1.observable
], AxisConfig.prototype, "hideAxis", void 0);
__decorate([
    mobx_1.computed
], AxisConfig.prototype, "fontSize", null);
__decorate([
    mobx_1.computed
], AxisConfig.prototype, "constrainedMin", null);
__decorate([
    mobx_1.computed
], AxisConfig.prototype, "constrainedMax", null);
__decorate([
    mobx_1.computed
], AxisConfig.prototype, "domain", null);
exports.AxisConfig = AxisConfig;
//# sourceMappingURL=AxisConfig.js.map