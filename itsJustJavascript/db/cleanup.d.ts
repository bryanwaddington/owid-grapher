declare type Handler = () => any;
export declare const cleanup: () => Promise<Handler[]>;
export declare const exit: () => Promise<never>;
export declare const registerExitHandler: (fn: Handler) => number;
export {};
//# sourceMappingURL=cleanup.d.ts.map