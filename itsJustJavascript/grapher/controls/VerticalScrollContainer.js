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
exports.VerticalScrollContainer = void 0;
const react_1 = __importStar(require("react"));
const classnames_1 = __importDefault(require("classnames"));
function useCombinedRefs(...refs) {
    const targetRef = react_1.default.useRef(null);
    react_1.default.useEffect(() => {
        refs.forEach((ref) => {
            if (!ref)
                return;
            if (typeof ref === "function") {
                ref(targetRef.current || null);
            }
            else {
                ref.current = targetRef.current || null;
            }
        });
    }, [refs]);
    return targetRef;
}
exports.VerticalScrollContainer = react_1.default.forwardRef((props, ref) => {
    let { scrollingShadows, scrollLock, className, children, contentsId, style } = props, rest = __rest(props, ["scrollingShadows", "scrollLock", "className", "children", "contentsId", "style"]);
    scrollingShadows = scrollingShadows !== null && scrollingShadows !== void 0 ? scrollingShadows : true;
    scrollLock = scrollLock !== null && scrollLock !== void 0 ? scrollLock : true;
    const scrollContainerRef = useCombinedRefs(ref);
    const [scrollTop, scrollBottom] = useScrollBounds(scrollContainerRef, contentsId);
    if (scrollLock) {
        useScrollLock(scrollContainerRef, { doNotLockIfNoScroll: true });
    }
    return (react_1.default.createElement("div", { className: "VerticalScrollContainerShadows", style: {
            position: "relative",
            height: "100%",
        } },
        scrollingShadows && (react_1.default.createElement(ScrollingShadow, { direction: "down", size: 10, opacity: getShadowOpacity(0.15, 80, scrollTop) })),
        react_1.default.createElement("div", Object.assign({ className: classnames_1.default(className, "VerticalScrollContainer"), style: Object.assign({ overflowY: "auto", position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }, style), ref: scrollContainerRef }, rest), children),
        scrollingShadows && (react_1.default.createElement(ScrollingShadow, { direction: "up", size: 10, opacity: getShadowOpacity(0.15, 80, scrollBottom) }))));
});
function getShadowOpacity(maxOpacity, maxDistance, scrollDistance) {
    const distance = scrollDistance !== undefined ? Math.min(scrollDistance, maxDistance) : 0;
    return (distance / maxDistance) * maxOpacity;
}
const ScrollingShadow = (props) => {
    // "Eased" gradient
    // https://larsenwork.com/easing-gradients/
    const background = `linear-gradient(
        to ${props.direction === "up" ? "bottom" : "top"},
        hsla(0, 0%, 0%, 0) 0%,
        hsla(0, 0%, 0%, 0.104) 25.8%,
        hsla(0, 0%, 0%, 0.45) 60.9%,
        hsla(0, 0%, 0%, 0.825) 88.7%,
        hsl(0, 0%, 0%) 100%
    )`;
    return (react_1.default.createElement("div", { style: {
            position: "absolute",
            left: 0,
            right: 0,
            [props.direction === "up" ? "bottom" : "top"]: 0,
            height: `${props.size}px`,
            background: background,
            opacity: props.opacity,
            pointerEvents: "none",
            zIndex: 10,
        } }));
};
/**
 * A throttled function that returns the available scrollTop and scrollBottom
 * @param ref
 * @param contentsId when this string changes, it's a signal that the contents have re-rendered and
 * the height has likely changed.
 */
function useScrollBounds(ref, contentsId) {
    const [scrollTop, onScrollTop] = react_1.useState(undefined);
    const [scrollBottom, onScrollBottom] = react_1.useState(undefined);
    react_1.useEffect(() => {
        const el = ref.current;
        if (el) {
            let pendingUpdate = false;
            function onScroll() {
                const { scrollTop, scrollHeight, offsetHeight } = el;
                onScrollTop(scrollTop);
                onScrollBottom(scrollHeight - offsetHeight - scrollTop);
                pendingUpdate = false;
            }
            onScroll(); // execute for first time to setState
            const onScrollThrottled = () => {
                if (!pendingUpdate) {
                    window.requestAnimationFrame(onScroll);
                    pendingUpdate = true;
                }
            };
            el.addEventListener("scroll", onScrollThrottled);
            return () => {
                el.removeEventListener("scroll", onScrollThrottled);
            };
        }
        return;
    }, [contentsId]);
    return [scrollTop, scrollBottom];
}
/**
 * React hook to prevent scroll events propagating to parent element.
 * @param ref the ReactRef of the scrolling container
 */
function useScrollLock(ref, opts) {
    react_1.useEffect(() => {
        const el = ref.current;
        const options = Object.assign({ doNotLockIfNoScroll: false }, opts);
        if (el) {
            function onWheel(ev) {
                const el = ref.current;
                if (el) {
                    const delta = ev.deltaY;
                    const up = delta < 0;
                    const { scrollTop, scrollHeight, offsetHeight } = el;
                    if (options.doNotLockIfNoScroll &&
                        scrollHeight <= offsetHeight) {
                        return;
                    }
                    function prevent() {
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
                    if (!up &&
                        delta > scrollHeight - offsetHeight - scrollTop) {
                        // Scrolling down, but this will take us past the bottom.
                        el.scrollTop = scrollHeight;
                        return prevent();
                    }
                    else if (up && -delta > scrollTop) {
                        // Scrolling up, but this will take us past the top.
                        el.scrollTop = 0;
                        return prevent();
                    }
                }
            }
            el.addEventListener("mousewheel", onWheel, {
                // We need to be in non-passive mode to be able to cancel the event
                passive: false,
            });
            return () => {
                if (el) {
                    el.removeEventListener("mousewheel", onWheel);
                }
            };
        }
        return;
    }, []);
}
//# sourceMappingURL=VerticalScrollContainer.js.map