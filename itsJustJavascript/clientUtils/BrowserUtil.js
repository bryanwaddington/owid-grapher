"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSafari = exports.prefersReducedMotion = void 0;
// Taken from https://since1979.dev/respecting-prefers-reduced-motion-with-javascript-and-react/
const prefersReducedMotion = () => {
    var _a;
    return typeof window !== "undefined" &&
        ((_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, "(prefers-reduced-motion: reduce)").matches);
};
exports.prefersReducedMotion = prefersReducedMotion;
// Detects desktop Safari, iOS Safari, and iOS Chrome/Firefox based on Safari
exports.isSafari = typeof navigator !== "undefined" &&
    navigator.vendor !== "" &&
    navigator.vendor.indexOf("Apple") > -1;
//# sourceMappingURL=BrowserUtil.js.map