/**
 * Prevents creating multiple promises for a single key.
 *
 * If an existing promise for a key is pending, that promise will be returned without
 * creating a new one.
 *
 * If a promise throws an error, it will be discarded, and a new one created the next
 * time a key is requested.
 *
 * For now it only supports primitive value keys, but we can extend it if necessary.
 */
export declare class PromiseCache<Key extends string | number | undefined, Result> {
    private createPromiseFromKey;
    constructor(createPromiseFromKey: (key: Key) => Promise<Result>);
    private promisesByKey;
    get(key: Key): Promise<Result>;
    has(key: Key): boolean;
}
//# sourceMappingURL=PromiseCache.d.ts.map