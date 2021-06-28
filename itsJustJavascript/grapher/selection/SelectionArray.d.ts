import { EntityCode, EntityId, EntityName } from "../../coreTable/OwidTableConstants";
interface Entity {
    entityName: EntityName;
    entityId?: EntityId;
    entityCode?: EntityCode;
}
export declare class SelectionArray {
    constructor(selectedEntityNames?: EntityName[], availableEntities?: Entity[], entityType?: string);
    entityType: string;
    selectedEntityNames: EntityName[];
    private availableEntities;
    get availableEntityNames(): string[];
    get availableEntityNameSet(): Set<string>;
    get entityNameToIdMap(): Map<string, number | undefined>;
    get entityCodeToNameMap(): Map<string | undefined, string>;
    get entityIdToNameMap(): Map<number | undefined, string>;
    get hasSelection(): boolean;
    get unselectedEntityNames(): string[];
    get numSelectedEntities(): number;
    get selectedSet(): Set<EntityName>;
    get allSelectedEntityIds(): EntityId[];
    setSelectedEntities(entityNames: EntityName[]): this;
    addToSelection(entityNames: EntityName[]): this;
    addAvailableEntityNames(entities: Entity[]): this;
    setSelectedEntitiesByCode(entityCodes: EntityCode[]): this;
    setSelectedEntitiesByEntityId(entityIds: EntityId[]): this;
    selectAll(): this;
    clearSelection(): void;
    toggleSelection(entityName: EntityName): this;
    get numAvailableEntityNames(): number;
    selectEntity(entityName: EntityName): this;
    selectSample(howMany?: number): this;
    deselectEntity(entityName: EntityName): this;
}
export {};
//# sourceMappingURL=SelectionArray.d.ts.map