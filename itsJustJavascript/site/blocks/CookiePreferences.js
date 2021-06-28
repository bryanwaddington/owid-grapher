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
exports.CookiePreferences = void 0;
const moment_1 = __importDefault(require("moment"));
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const CookiePreferencesManager_1 = require("../../site/CookiePreferencesManager");
const slugify_1 = __importDefault(require("slugify"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faCheck_1 = require("@fortawesome/free-solid-svg-icons/faCheck");
const SiteAnalytics_1 = require("../../site/SiteAnalytics");
const ANALYTICS_ACTION = "cookie-preferences";
const analytics = new SiteAnalytics_1.SiteAnalytics();
// Note: CookiePreferences has been designed to be rendered through a portal
// only. When this becomes limiting (e.g. cookies preferences rendered both in
// the content and in the cookie bar), then at least two things need to be taken
// care of:
// - unique IDs for input elements in CookiePreference
// - support for in-place rendering
const CookiePreference = ({ title, name, consent, disabled, toggleConsent, children, }) => {
    const id = `cookie-preference-${slugify_1.default(name, { lower: true })}`;
    const onChange = () => {
        toggleConsent();
        analytics.logSiteClick(ANALYTICS_ACTION, `${consent ? "Refuse" : "Accept"} ${name}`);
    };
    return (React.createElement("div", { className: "cookie-preference" },
        React.createElement("input", { id: id, type: "checkbox", onChange: onChange, checked: consent, disabled: disabled, "data-test": `${name}-preference` }),
        React.createElement("label", { htmlFor: id }, title),
        React.createElement("div", { className: "description" }, children)));
};
const CookiePreferences = ({ preferences, date, dispatch, }) => {
    const cookiePreferencesDomSlot = document.querySelector(".wp-block-cookie-preferences");
    if (!cookiePreferencesDomSlot)
        return null;
    return ReactDOM.createPortal(React.createElement("div", { "data-test": "cookie-preferences", className: "cookie-preferences" },
        React.createElement(CookiePreference, { title: "Necessary cookies", name: "necessary", consent: true, disabled: true }, "The website cannot function properly without these cookies. If you wish, you can disable cookies completely in your browser preferences."),
        React.createElement(CookiePreference, { title: "Analytics cookies", name: "analytics", consent: CookiePreferencesManager_1.getPreferenceValue(CookiePreferencesManager_1.PreferenceType.Analytics, preferences), toggleConsent: () => dispatch({
                type: CookiePreferencesManager_1.Action.TogglePreference,
                payload: {
                    preferenceType: CookiePreferencesManager_1.PreferenceType.Analytics,
                    date: CookiePreferencesManager_1.getTodayDate(),
                },
            }) }, "We use these cookies to monitor and improve website performance."),
        date ? (React.createElement("div", { className: "last-updated" },
            "Preferences last updated:",
            " ",
            moment_1.default(date, CookiePreferencesManager_1.DATE_FORMAT).format("LL"))) : (React.createElement("button", { className: "owid-button", onClick: () => dispatch({
                type: CookiePreferencesManager_1.Action.Accept,
                payload: { date: CookiePreferencesManager_1.getTodayDate() },
            }), "data-test": "accept", "data-track-note": ANALYTICS_ACTION },
            React.createElement("span", { className: "icon" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faCheck_1.faCheck })),
            "I agree"))), cookiePreferencesDomSlot);
};
exports.CookiePreferences = CookiePreferences;
//# sourceMappingURL=CookiePreferences.js.map