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
const PromiseCache_1 = require("./PromiseCache");
const wait = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});
it("reuses existing promise", () => __awaiter(void 0, void 0, void 0, function* () {
    const cache = new PromiseCache_1.PromiseCache(() => __awaiter(void 0, void 0, void 0, function* () {
        yield wait(10);
    }));
    const firstPromise = cache.get("key");
    const secondPromise = cache.get("key");
    expect(firstPromise).toBe(secondPromise);
    yield firstPromise;
    const thirdPromise = cache.get("key");
    expect(thirdPromise).toBe(firstPromise);
}));
it("promise is discarded if it rejects", () => __awaiter(void 0, void 0, void 0, function* () {
    const cache = new PromiseCache_1.PromiseCache(() => __awaiter(void 0, void 0, void 0, function* () {
        yield wait(10);
        throw new Error("Failed");
    }));
    const firstPromise = cache.get("key");
    const secondPromise = cache.get("key");
    expect(firstPromise).toBe(secondPromise);
    expect(cache.has("key")).toBeTruthy();
    try {
        yield firstPromise;
        fail();
    }
    catch (error) { }
    expect(cache.has("key")).toBeFalsy();
    try {
        yield cache.get("key");
        fail();
    }
    catch (error) { }
    const thirdPromise = cache.get("key");
    expect(thirdPromise).not.toBe(firstPromise);
    try {
        yield thirdPromise;
        fail();
    }
    catch (error) { }
}));
//# sourceMappingURL=PromiseCache.test.js.map