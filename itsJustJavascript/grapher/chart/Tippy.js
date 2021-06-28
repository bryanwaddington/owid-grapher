"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TippyIfInteractive = exports.LazyTippy = exports.Tippy = void 0;
const React = __importStar(require("react"));
const react_1 = __importDefault(require("@tippyjs/react"));
const Tippy = (props) => {
    const { lazy } = props, tippyProps = __rest(props, ["lazy"]);
    const TippyInstance = lazy ? exports.LazyTippy : react_1.default;
    return React.createElement(TippyInstance, Object.assign({ theme: "light" }, tippyProps));
};
exports.Tippy = Tippy;
// A Tippy instance that only evaluates `content` when the tooltip is shown.
// Taken from https://gist.github.com/atomiks/520f4b0c7b537202a23a3059d4eec908
// This will hopefully become supported in Tippy itself someday: See https://github.com/atomiks/tippyjs-react/issues/209
const LazyTippy = (props) => {
    const [mounted, setMounted] = React.useState(false);
    const lazyPlugin = {
        fn: () => ({
            onMount: () => setMounted(true),
            onHidden: () => setMounted(false),
        }),
    };
    const computedProps = Object.assign({}, props);
    computedProps.plugins = [lazyPlugin, ...(props.plugins || [])];
    if (props.render) {
        const render = props.render; // let TypeScript safely derive that render is not undefined
        computedProps.render = (...args) => (mounted ? render(...args) : "");
    }
    else {
        computedProps.content = mounted ? props.content : "";
    }
    return React.createElement(exports.Tippy, Object.assign({}, computedProps));
};
exports.LazyTippy = LazyTippy;
// We sometimes need a conditional Tippy instance, i.e. a Tippy that is only hooked up to
// interactive charts (and not in static SVG exports etc.). This is that: If `isInteractive=false`,
// then it bypasses Tippy and just renders the children.
const TippyIfInteractive = (props) => {
    const { isInteractive } = props, tippyProps = __rest(props, ["isInteractive"]);
    if (isInteractive)
        return React.createElement(exports.Tippy, Object.assign({}, tippyProps));
    else
        return React.createElement(React.Fragment, null, props.children);
};
exports.TippyIfInteractive = TippyIfInteractive;
//# sourceMappingURL=Tippy.js.map