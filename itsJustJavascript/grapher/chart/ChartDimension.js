"use strict";
// Todo: remove this.
// Any display changes really can be computed columns. And then charts just need xColumnSlug, sizeColumnSlug, yColumnSlug (or yColumnSlugs) et cetera
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartDimension = void 0;
const mobx_1 = require("mobx");
const Util_1 = require("../../clientUtils/Util");
const LegacyVariableCode_1 = require("../core/LegacyVariableCode");
const Persistable_1 = require("../persistable/Persistable");
// A chart "dimension" represents a binding between a chart
// and a particular variable that it requests as data
class ChartDimensionDefaults {
    constructor() {
        // check on: malaria-deaths-comparisons and computing-efficiency
        this.display = new LegacyVariableCode_1.LegacyVariableDisplayConfig(); // todo: make persistable
        // XXX move this somewhere else, it's only used for scatter x override
        this.targetYear = undefined;
    }
}
__decorate([
    mobx_1.observable
], ChartDimensionDefaults.prototype, "property", void 0);
__decorate([
    mobx_1.observable
], ChartDimensionDefaults.prototype, "variableId", void 0);
__decorate([
    mobx_1.observable
], ChartDimensionDefaults.prototype, "display", void 0);
__decorate([
    mobx_1.observable
], ChartDimensionDefaults.prototype, "targetYear", void 0);
class ChartDimension extends ChartDimensionDefaults {
    constructor(obj, manager) {
        super();
        this.manager = manager;
        if (obj)
            this.updateFromObject(obj);
    }
    get table() {
        return this.manager.table;
    }
    updateFromObject(obj) {
        if (obj.display)
            Persistable_1.updatePersistables(this, { display: obj.display });
        this.targetYear = obj.targetYear;
        this.variableId = obj.variableId;
        this.property = obj.property;
        this.slug = obj.slug;
    }
    toObject() {
        return Util_1.trimObject(Persistable_1.deleteRuntimeAndUnchangedProps({
            property: this.property,
            variableId: this.variableId,
            display: this.display,
            targetYear: this.targetYear,
        }, new ChartDimensionDefaults()));
    }
    get column() {
        return this.table.get(this.columnSlug);
    }
    get columnSlug() {
        var _a;
        return (_a = this.slug) !== null && _a !== void 0 ? _a : this.variableId.toString();
    }
}
__decorate([
    mobx_1.computed
], ChartDimension.prototype, "table", null);
__decorate([
    mobx_1.observable
], ChartDimension.prototype, "slug", void 0);
__decorate([
    mobx_1.computed
], ChartDimension.prototype, "column", null);
__decorate([
    mobx_1.computed
], ChartDimension.prototype, "columnSlug", null);
exports.ChartDimension = ChartDimension;
//# sourceMappingURL=ChartDimension.js.map