interface PromiseSelectorArg<Result> {
    onResolve?: (result: Result) => void;
    onReject?: (error: any) => void;
}
/**
 * An alternative to cancellable promises. Allows set()-ing a single promise,
 * discarding the results of any previous ones, regardless whether they
 * resolve or reject.
 *
 * The problem it solves:
 *
 * 1. User interacts with UI
 * 2. Request sent to fetch required data: `getViewData().then((data) => updateView(data))`
 * 3. But now what if the user navigates away? When the promise completes, it will
 *    update the view regardless.
 *
 * In order to solve this, we use `switcher = PromiseSwitcher({ onResolve: updateView })`
 * And then send off requests with `switcher.set(getViewData())`
 * If set() is called with a new Promise while the previous is still pending, the
 * pending promise is ignored – it doesn't call `onResolve` or `onReject`.
 *
 */
export declare class PromiseSwitcher<Result> {
    private pendingPromise;
    private onResolve?;
    private onReject?;
    constructor(arg: PromiseSelectorArg<Result>);
    set(promise: Promise<Result>): Promise<void>;
    clear(): void;
}
export {};
//# sourceMappingURL=PromiseSwitcher.d.ts.map