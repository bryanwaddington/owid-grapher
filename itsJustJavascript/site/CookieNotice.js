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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieNotice = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const classnames_1 = __importDefault(require("classnames"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faCheck_1 = require("@fortawesome/free-solid-svg-icons/faCheck");
const CookiePreferencesManager_1 = require("./CookiePreferencesManager");
const CookieNotice = ({ accepted, outdated, dispatch, }) => {
    const [mounted, setMounted] = react_1.useState(false);
    react_1.useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 200);
    }, []);
    return (React.createElement("div", { className: classnames_1.default("cookie-notice", {
            open: mounted && (!accepted || outdated),
        }), "data-test": "cookie-notice" },
        React.createElement("div", { className: "wrapper" },
            React.createElement("div", { className: "owid-row" },
                React.createElement("div", { className: "owid-col owid-col--lg-1 explanation" },
                    React.createElement("p", null, "We use cookies to give you the best experience on our website. By continuing without changing your cookie settings, we assume you agree to this.")),
                React.createElement("div", { className: "owid-col owid-col--lg-0 actions" },
                    React.createElement("a", { href: "/privacy-policy", className: "button" }, "Manage preferences"),
                    React.createElement("button", { className: "button accept", onClick: () => dispatch({
                            type: CookiePreferencesManager_1.Action.Accept,
                            payload: { date: CookiePreferencesManager_1.getTodayDate() },
                        }), "data-test": "accept", "data-track-note": "cookie-notice" },
                        React.createElement("span", { className: "icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCheck_1.faCheck })),
                        "I agree"))))));
};
exports.CookieNotice = CookieNotice;
//# sourceMappingURL=CookieNotice.js.map