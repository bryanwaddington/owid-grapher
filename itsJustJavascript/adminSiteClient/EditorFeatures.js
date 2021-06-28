"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorFeatures = void 0;
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const mobx_1 = require("mobx");
// Responsible for determining what parts of the editor should be shown, based on the
// type of chart being edited
class EditorFeatures {
    constructor(editor) {
        this.editor = editor;
    }
    get grapher() {
        return this.editor.grapher;
    }
    get canCustomizeYAxisScale() {
        return !this.grapher.isStackedArea && !this.grapher.isStackedBar;
    }
    get canCustomizeXAxisScale() {
        return this.grapher.isScatter;
    }
    get canCustomizeYAxisLabel() {
        return this.grapher.isScatter;
    }
    get canCustomizeXAxisLabel() {
        return true;
    }
    get canCustomizeYAxis() {
        return this.canCustomizeYAxisScale || this.canCustomizeYAxisLabel;
    }
    get canCustomizeXAxis() {
        return this.canCustomizeXAxisScale || this.canCustomizeXAxisLabel;
    }
    get canRemovePointsOutsideAxisDomain() {
        return this.grapher.isScatter;
    }
    get timeDomain() {
        return !this.grapher.isDiscreteBar;
    }
    get timelineRange() {
        return !this.grapher.isDiscreteBar;
    }
    get showYearLabels() {
        return this.grapher.isDiscreteBar;
    }
    get hideLegend() {
        return this.grapher.isLineChart || this.grapher.isStackedArea;
    }
    get stackedArea() {
        return this.grapher.isStackedArea;
    }
    get entityType() {
        return ((!this.grapher.isScatter &&
            this.grapher.addCountryMode ===
                GrapherConstants_1.EntitySelectionMode.MultipleEntities) ||
            this.grapher.addCountryMode === GrapherConstants_1.EntitySelectionMode.SingleEntity);
    }
    get relativeModeToggle() {
        return (this.grapher.isStackedArea ||
            this.grapher.isStackedDiscreteBar ||
            this.grapher.isLineChart ||
            this.grapher.isScatter);
    }
    get comparisonLine() {
        return this.grapher.isLineChart || this.grapher.isScatter;
    }
}
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "grapher", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "canCustomizeYAxisScale", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "canCustomizeXAxisScale", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "canCustomizeYAxisLabel", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "canCustomizeXAxisLabel", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "canCustomizeYAxis", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "canCustomizeXAxis", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "canRemovePointsOutsideAxisDomain", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "timeDomain", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "timelineRange", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "showYearLabels", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "hideLegend", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "stackedArea", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "entityType", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "relativeModeToggle", null);
__decorate([
    mobx_1.computed
], EditorFeatures.prototype, "comparisonLine", null);
exports.EditorFeatures = EditorFeatures;
//# sourceMappingURL=EditorFeatures.js.map