"use strict";
// todo: remove file
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyVariableDisplayConfig = void 0;
const mobx_1 = require("mobx");
const Persistable_1 = require("../persistable/Persistable");
class LegacyVariableDisplayConfigDefaults {
    constructor() {
        this.name = undefined;
        this.unit = undefined;
        this.shortUnit = undefined;
        this.isProjection = undefined;
        this.conversionFactor = undefined;
        this.numDecimalPlaces = undefined;
        this.tolerance = undefined;
        this.yearIsDay = undefined;
        this.zeroDay = undefined;
        this.entityAnnotationsMap = undefined;
        this.includeInTable = true;
        this.color = undefined;
    }
}
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "unit", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "shortUnit", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "isProjection", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "conversionFactor", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "numDecimalPlaces", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "tolerance", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "yearIsDay", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "zeroDay", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "entityAnnotationsMap", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "includeInTable", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "tableDisplay", void 0);
__decorate([
    mobx_1.observable
], LegacyVariableDisplayConfigDefaults.prototype, "color", void 0);
class LegacyVariableDisplayConfig extends LegacyVariableDisplayConfigDefaults {
    updateFromObject(obj) {
        if (obj)
            Persistable_1.updatePersistables(this, obj);
    }
    toObject() {
        return Persistable_1.deleteRuntimeAndUnchangedProps(Persistable_1.objectWithPersistablesToObject(this), new LegacyVariableDisplayConfigDefaults());
    }
    constructor(obj) {
        super();
        if (obj)
            this.updateFromObject(obj);
    }
}
exports.LegacyVariableDisplayConfig = LegacyVariableDisplayConfig;
//# sourceMappingURL=LegacyVariableCode.js.map