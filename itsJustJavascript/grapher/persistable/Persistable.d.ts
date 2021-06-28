export interface Persistable {
    toObject(): any;
    updateFromObject(obj: any): any;
}
export declare function objectWithPersistablesToObject<T>(objWithPersistables: T, keysToSerialize?: string[]): T;
export declare function updatePersistables(target: any, obj: any): void;
export declare function deleteRuntimeAndUnchangedProps<T>(changedObj: T, defaultObject: T): T;
//# sourceMappingURL=Persistable.d.ts.map