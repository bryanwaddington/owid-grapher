"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseSwitcher = void 0;
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
class PromiseSwitcher {
    constructor(arg) {
        this.onResolve = arg.onResolve;
        this.onReject = arg.onReject;
    }
    set(promise) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.pendingPromise = promise;
            try {
                const result = yield promise;
                if (this.pendingPromise === promise) {
                    (_a = this.onResolve) === null || _a === void 0 ? void 0 : _a.call(this, result);
                }
            }
            catch (error) {
                if (this.pendingPromise === promise) {
                    (_b = this.onReject) === null || _b === void 0 ? void 0 : _b.call(this, error);
                }
            }
        });
    }
    clear() {
        this.pendingPromise = undefined;
    }
}
exports.PromiseSwitcher = PromiseSwitcher;
//# sourceMappingURL=PromiseSwitcher.js.map