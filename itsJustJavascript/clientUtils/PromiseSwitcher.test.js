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
const PromiseSwitcher_1 = require("./PromiseSwitcher");
const delayResolve = (result, ms = 10) => new Promise((resolve) => {
    setTimeout(() => resolve(result), ms);
});
const delayReject = (error, ms = 10) => new Promise((_, reject) => {
    setTimeout(() => reject(error), ms);
});
it("handles fulfilling single promise", () => __awaiter(void 0, void 0, void 0, function* () {
    const onResolve = jest.fn(() => undefined);
    const selector = new PromiseSwitcher_1.PromiseSwitcher({ onResolve });
    yield selector.set(Promise.resolve("done"));
    expect(onResolve).toBeCalledWith("done");
    yield selector.set(Promise.resolve("done"));
    expect(onResolve).toBeCalledTimes(2);
}));
it("selecting a new promise while one is pending discards the pending promise", () => __awaiter(void 0, void 0, void 0, function* () {
    const onResolve = jest.fn(() => undefined);
    const selector = new PromiseSwitcher_1.PromiseSwitcher({ onResolve });
    selector.set(delayResolve("first"));
    yield selector.set(Promise.resolve("second"));
    expect(onResolve).toHaveBeenCalledTimes(1);
    expect(onResolve).toHaveBeenCalledWith("second");
}));
it("handles promise rejections", () => __awaiter(void 0, void 0, void 0, function* () {
    const onResolve = jest.fn(() => undefined);
    const onReject = jest.fn(() => undefined);
    const selector = new PromiseSwitcher_1.PromiseSwitcher({ onResolve, onReject });
    yield selector.set(Promise.reject("error"));
    expect(onReject).toHaveBeenCalledWith("error");
    selector.set(delayResolve("success"));
    yield selector.set(Promise.reject("error 2"));
    expect(onResolve).not.toHaveBeenCalled();
    expect(onReject).toHaveBeenCalledTimes(2);
}));
it("handles clearing pending promise", () => __awaiter(void 0, void 0, void 0, function* () {
    const onResolve = jest.fn(() => undefined);
    const onReject = jest.fn(() => undefined);
    const selector = new PromiseSwitcher_1.PromiseSwitcher({ onResolve, onReject });
    const resolve = delayResolve("done");
    selector.set(resolve);
    selector.clear();
    yield resolve;
    expect(onResolve).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
    const reject = delayReject("error");
    selector.set(reject);
    selector.clear();
    try {
        yield reject;
    }
    catch (error) { }
    expect(onResolve).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
}));
//# sourceMappingURL=PromiseSwitcher.test.js.map