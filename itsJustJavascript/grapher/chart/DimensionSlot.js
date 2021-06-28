"use strict";
// todo: remove
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionSlot = void 0;
const mobx_1 = require("mobx");
const GrapherConstants_1 = require("../core/GrapherConstants");
const Util_1 = require("../../clientUtils/Util");
class DimensionSlot {
    constructor(grapher, property) {
        this.grapher = grapher;
        this.property = property;
    }
    get name() {
        const names = {
            y: this.grapher.isDiscreteBar ? "X axis" : "Y axis",
            x: "X axis",
            size: "Size",
            color: "Color",
            filter: "Filter",
        };
        return names[this.property] || "";
    }
    get allowMultiple() {
        return (this.property === GrapherConstants_1.DimensionProperty.y &&
            this.grapher.supportsMultipleYColumns);
    }
    get isOptional() {
        return this.allowMultiple;
    }
    get dimensions() {
        return this.grapher.dimensions.filter((d) => d.property === this.property);
    }
    get dimensionsOrderedAsInPersistedSelection() {
        var _a, _b;
        const legacyConfig = this.grapher.legacyConfigAsAuthored;
        const variableIDsInSelectionOrder = Util_1.excludeUndefined((_b = (_a = legacyConfig.selectedData) === null || _a === void 0 ? void 0 : _a.map((item) => { var _a, _b; return (_b = (_a = legacyConfig.dimensions) === null || _a === void 0 ? void 0 : _a[item.index]) === null || _b === void 0 ? void 0 : _b.variableId; })) !== null && _b !== void 0 ? _b : []);
        return Util_1.sortBy(this.grapher.filledDimensions || [], (dim) => Util_1.findIndex(variableIDsInSelectionOrder, (variableId) => dim.variableId === variableId)).filter((dim) => dim.property === this.property);
    }
}
__decorate([
    mobx_1.computed
], DimensionSlot.prototype, "name", null);
__decorate([
    mobx_1.computed
], DimensionSlot.prototype, "allowMultiple", null);
__decorate([
    mobx_1.computed
], DimensionSlot.prototype, "isOptional", null);
__decorate([
    mobx_1.computed
], DimensionSlot.prototype, "dimensions", null);
__decorate([
    mobx_1.computed
], DimensionSlot.prototype, "dimensionsOrderedAsInPersistedSelection", null);
exports.DimensionSlot = DimensionSlot;
//# sourceMappingURL=DimensionSlot.js.map