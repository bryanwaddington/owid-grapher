"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollDirection = exports.ScrollDirection = exports.useTriggerWhenClickOutside = void 0;
const react_1 = require("react");
const throttle_1 = __importDefault(require("lodash/throttle"));
const useTriggerWhenClickOutside = (container, active, trigger) => {
    react_1.useEffect(() => {
        if (!active)
            return;
        const handleClick = (e) => {
            var _a;
            if (container && !((_a = container.current) === null || _a === void 0 ? void 0 : _a.contains(e.target))) {
                trigger(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [active]);
};
exports.useTriggerWhenClickOutside = useTriggerWhenClickOutside;
var ScrollDirection;
(function (ScrollDirection) {
    ScrollDirection["Up"] = "up";
    ScrollDirection["Down"] = "down";
})(ScrollDirection = exports.ScrollDirection || (exports.ScrollDirection = {}));
const useScrollDirection = () => {
    let lastScrollY = window.pageYOffset;
    const [direction, setDirection] = react_1.useState(null);
    react_1.useEffect(() => {
        const updateDirection = () => {
            const scrollY = window.pageYOffset;
            setDirection(scrollY > lastScrollY
                ? ScrollDirection.Down
                : ScrollDirection.Up);
            lastScrollY = scrollY;
        };
        const updateDirectionThrottled = throttle_1.default(() => {
            updateDirection();
        }, 500);
        document.addEventListener("scroll", updateDirectionThrottled);
        return () => {
            document.removeEventListener("scroll", updateDirectionThrottled);
        };
    });
    return direction;
};
exports.useScrollDirection = useScrollDirection;
//# sourceMappingURL=hooks.js.map