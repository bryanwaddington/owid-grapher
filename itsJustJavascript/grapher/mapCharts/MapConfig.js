"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapConfig = void 0;
const mobx_1 = require("mobx");
const MapProjections_1 = require("./MapProjections");
const ColorScaleConfig_1 = require("../color/ColorScaleConfig");
const Persistable_1 = require("../persistable/Persistable");
const TimeBounds_1 = require("../../clientUtils/TimeBounds");
const Util_1 = require("../../clientUtils/Util");
// MapConfig holds the data and underlying logic needed by MapTab.
// It wraps the map property on ChartConfig.
// TODO: migrate database config & only pass legend props
class MapConfigDefaults {
    constructor() {
        this.projection = MapProjections_1.MapProjectionName.World;
        this.colorScale = new ColorScaleConfig_1.ColorScaleConfig();
        // Show the label from colorSchemeLabels in the tooltip instead of the numeric value
        this.tooltipUseCustomLabels = undefined;
    }
}
__decorate([
    mobx_1.observable
], MapConfigDefaults.prototype, "columnSlug", void 0);
__decorate([
    mobx_1.observable
], MapConfigDefaults.prototype, "time", void 0);
__decorate([
    mobx_1.observable
], MapConfigDefaults.prototype, "timeTolerance", void 0);
__decorate([
    mobx_1.observable
], MapConfigDefaults.prototype, "hideTimeline", void 0);
__decorate([
    mobx_1.observable
], MapConfigDefaults.prototype, "projection", void 0);
__decorate([
    mobx_1.observable
], MapConfigDefaults.prototype, "colorScale", void 0);
__decorate([
    mobx_1.observable
], MapConfigDefaults.prototype, "tooltipUseCustomLabels", void 0);
class MapConfig extends MapConfigDefaults {
    updateFromObject(obj) {
        // Migrate variableIds to columnSlugs
        if (obj.variableId && !obj.columnSlug)
            obj.columnSlug = obj.variableId.toString();
        Persistable_1.updatePersistables(this, obj);
        // Migrate "targetYear" to "time"
        // TODO migrate the database property instead
        if (obj.targetYear)
            this.time = TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(obj.targetYear);
        else if (obj.time)
            this.time = TimeBounds_1.maxTimeBoundFromJSONOrPositiveInfinity(obj.time);
    }
    toObject() {
        const obj = Persistable_1.objectWithPersistablesToObject(this);
        Persistable_1.deleteRuntimeAndUnchangedProps(obj, new MapConfigDefaults());
        if (obj.time)
            obj.time = TimeBounds_1.maxTimeToJSON(this.time);
        if (obj.columnSlug) {
            // Restore variableId for legacy for now
            obj.variableId = parseInt(obj.columnSlug);
            delete obj.columnSlug;
        }
        return Util_1.trimObject(obj);
    }
    constructor(obj) {
        super();
        if (obj)
            this.updateFromObject(obj);
    }
}
exports.MapConfig = MapConfig;
//# sourceMappingURL=MapConfig.js.map