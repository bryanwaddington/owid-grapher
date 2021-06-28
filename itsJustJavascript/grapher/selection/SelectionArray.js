"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionArray = void 0;
const Util_1 = require("../../clientUtils/Util");
const isPresent_1 = require("../../clientUtils/isPresent");
const mobx_1 = require("mobx");
class SelectionArray {
    constructor(selectedEntityNames = [], availableEntities = [], entityType = "country") {
        this.selectedEntityNames = selectedEntityNames.slice();
        this.availableEntities = availableEntities.slice();
        this.entityType = entityType;
    }
    get availableEntityNames() {
        return this.availableEntities.map((entity) => entity.entityName);
    }
    get availableEntityNameSet() {
        return new Set(this.availableEntityNames);
    }
    get entityNameToIdMap() {
        return Util_1.mapBy(this.availableEntities, (e) => e.entityName, (e) => e.entityId);
    }
    get entityCodeToNameMap() {
        return Util_1.mapBy(this.availableEntities, (e) => e.entityCode, (e) => e.entityName);
    }
    get entityIdToNameMap() {
        return Util_1.mapBy(this.availableEntities, (e) => e.entityId, (e) => e.entityName);
    }
    get hasSelection() {
        return this.selectedEntityNames.length > 0;
    }
    get unselectedEntityNames() {
        return Util_1.difference(this.availableEntityNames, this.selectedEntityNames);
    }
    get numSelectedEntities() {
        return this.selectedEntityNames.length;
    }
    get selectedSet() {
        return new Set(this.selectedEntityNames);
    }
    get allSelectedEntityIds() {
        const map = this.entityNameToIdMap;
        return this.selectedEntityNames
            .map((name) => map.get(name))
            .filter(isPresent_1.isPresent);
    }
    // Clears and sets selected entities
    setSelectedEntities(entityNames) {
        this.clearSelection();
        return this.addToSelection(entityNames);
    }
    addToSelection(entityNames) {
        this.selectedEntityNames = this.selectedEntityNames.concat(entityNames);
        return this;
    }
    addAvailableEntityNames(entities) {
        this.availableEntities.push(...entities);
        return this;
    }
    setSelectedEntitiesByCode(entityCodes) {
        const map = this.entityCodeToNameMap;
        const codesInData = entityCodes.filter((code) => map.has(code));
        return this.setSelectedEntities(codesInData.map((code) => map.get(code)));
    }
    setSelectedEntitiesByEntityId(entityIds) {
        const map = this.entityIdToNameMap;
        return this.setSelectedEntities(entityIds.map((id) => map.get(id)));
    }
    selectAll() {
        return this.addToSelection(this.unselectedEntityNames);
    }
    clearSelection() {
        this.selectedEntityNames = [];
    }
    toggleSelection(entityName) {
        return this.selectedSet.has(entityName)
            ? this.deselectEntity(entityName)
            : this.selectEntity(entityName);
    }
    get numAvailableEntityNames() {
        return this.availableEntityNames.length;
    }
    selectEntity(entityName) {
        if (!this.selectedSet.has(entityName))
            return this.addToSelection([entityName]);
        return this;
    }
    // Mainly for testing
    selectSample(howMany = 1) {
        return this.setSelectedEntities(this.availableEntityNames.slice(0, howMany));
    }
    deselectEntity(entityName) {
        this.selectedEntityNames = this.selectedEntityNames.filter((name) => name !== entityName);
        return this;
    }
}
__decorate([
    mobx_1.observable
], SelectionArray.prototype, "entityType", void 0);
__decorate([
    mobx_1.observable
], SelectionArray.prototype, "selectedEntityNames", void 0);
__decorate([
    mobx_1.observable
], SelectionArray.prototype, "availableEntities", void 0);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "availableEntityNames", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "availableEntityNameSet", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "entityNameToIdMap", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "entityCodeToNameMap", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "entityIdToNameMap", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "hasSelection", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "unselectedEntityNames", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "numSelectedEntities", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "selectedSet", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "allSelectedEntityIds", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "setSelectedEntities", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "addToSelection", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "addAvailableEntityNames", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "setSelectedEntitiesByCode", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "setSelectedEntitiesByEntityId", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "selectAll", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "clearSelection", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "toggleSelection", null);
__decorate([
    mobx_1.computed
], SelectionArray.prototype, "numAvailableEntityNames", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "selectEntity", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "selectSample", null);
__decorate([
    mobx_1.action.bound
], SelectionArray.prototype, "deselectEntity", null);
exports.SelectionArray = SelectionArray;
//# sourceMappingURL=SelectionArray.js.map