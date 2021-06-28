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
exports.runCookiePreferencesManager = exports.getTodayDate = exports.serializeState = exports.arePreferencesOutdated = exports.updatePreference = exports.getPreferenceValue = exports.parseDate = exports.isValidPreference = exports.parsePreferences = exports.parseRawCookieValue = exports.CookiePreferencesManager = exports.DATE_FORMAT = exports.POLICY_DATE = exports.Action = exports.PreferenceType = void 0;
const react_dom_1 = __importDefault(require("react-dom"));
const React = __importStar(require("react"));
const react_1 = require("react");
const Cookies = __importStar(require("js-cookie"));
const CookiePreferences_1 = require("../site/blocks/CookiePreferences");
const CookieNotice_1 = require("../site/CookieNotice");
const moment_1 = __importDefault(require("moment"));
var PreferenceType;
(function (PreferenceType) {
    PreferenceType["Analytics"] = "a";
    PreferenceType["Marketing"] = "m";
})(PreferenceType = exports.PreferenceType || (exports.PreferenceType = {}));
var Action;
(function (Action) {
    Action[Action["Accept"] = 0] = "Accept";
    Action[Action["TogglePreference"] = 1] = "TogglePreference";
    Action[Action["Reset"] = 2] = "Reset";
})(Action = exports.Action || (exports.Action = {}));
exports.POLICY_DATE = 20201009;
exports.DATE_FORMAT = "YYYYMMDD";
const COOKIE_NAME = "cookie_preferences";
const PREFERENCES_SEPARATOR = "|";
const DATE_SEPARATOR = "-";
const PREFERENCE_KEY_VALUE_SEPARATOR = ":";
const defaultState = {
    preferences: [
        {
            type: PreferenceType.Analytics,
            value: true,
        },
    ],
};
const CookiePreferencesManager = ({ initialState = defaultState, }) => {
    const [state, dispatch] = react_1.useReducer(reducer, initialState);
    // Reset state
    react_1.useEffect(() => {
        if (exports.arePreferencesOutdated(state.date, exports.POLICY_DATE)) {
            dispatch({ type: Action.Reset });
        }
    }, [state.date]);
    // Commit state
    react_1.useEffect(() => {
        if (state.date) {
            Cookies.set(COOKIE_NAME, exports.serializeState(state), {
                expires: 365 * 3,
            });
        }
    }, [state]);
    return (React.createElement("div", { "data-test-policy-date": exports.POLICY_DATE, className: "cookie-manager" },
        React.createElement(CookieNotice_1.CookieNotice, { accepted: !!state.date, outdated: exports.arePreferencesOutdated(state.date, exports.POLICY_DATE), dispatch: dispatch }),
        React.createElement(CookiePreferences_1.CookiePreferences, { preferences: state.preferences, date: state.date, dispatch: dispatch })));
};
exports.CookiePreferencesManager = CookiePreferencesManager;
const reducer = (state, { type: actionType, payload }) => {
    switch (actionType) {
        case Action.Accept: {
            return {
                date: payload.date,
                preferences: exports.updatePreference(PreferenceType.Analytics, true, state.preferences),
            };
        }
        case Action.TogglePreference:
            return {
                date: payload.date,
                preferences: exports.updatePreference(payload.preferenceType, !exports.getPreferenceValue(payload.preferenceType, state.preferences), state.preferences),
            };
        case Action.Reset:
            return defaultState;
        default:
            return state;
    }
};
const getInitialState = () => {
    var _a;
    return (_a = exports.parseRawCookieValue(Cookies.get(COOKIE_NAME))) !== null && _a !== void 0 ? _a : defaultState;
};
const parseRawCookieValue = (cookieValue) => {
    if (!cookieValue)
        return;
    const [preferencesRaw, dateRaw] = cookieValue.split(DATE_SEPARATOR);
    const date = exports.parseDate(dateRaw);
    if (!date)
        return;
    const preferences = exports.parsePreferences(preferencesRaw);
    if (!preferences.length)
        return;
    return {
        preferences,
        date,
    };
};
exports.parseRawCookieValue = parseRawCookieValue;
const parsePreferences = (preferences) => {
    if (!preferences)
        return [];
    return preferences
        .split(PREFERENCES_SEPARATOR)
        .map((preference) => {
        const [type, , value] = preference; // only supports 1 digit values
        return {
            type: type,
            value: value === "1",
        };
    })
        .filter((preference) => exports.isValidPreference(preference));
};
exports.parsePreferences = parsePreferences;
const isValidPreference = ({ type, value }) => {
    return (Object.values(PreferenceType).includes(type) &&
        typeof value === "boolean");
};
exports.isValidPreference = isValidPreference;
const parseDate = (date) => {
    if (!date)
        return;
    return moment_1.default(date, exports.DATE_FORMAT, true).isValid()
        ? parseInt(date, 10)
        : undefined;
};
exports.parseDate = parseDate;
const getPreferenceValue = (type, preferences) => {
    var _a, _b;
    return ((_b = (_a = preferences.find((preference) => {
        return preference.type === type;
    })) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : false);
};
exports.getPreferenceValue = getPreferenceValue;
const updatePreference = (type, value, preferences) => {
    return preferences.map((preference) => {
        if (preference.type !== type)
            return preference;
        return Object.assign(Object.assign({}, preference), { value });
    });
};
exports.updatePreference = updatePreference;
const arePreferencesOutdated = (preferencesDate, policyDate) => {
    if (!preferencesDate)
        return false;
    return preferencesDate < policyDate;
};
exports.arePreferencesOutdated = arePreferencesOutdated;
const serializeState = (state) => {
    const serializedPreferences = state.preferences
        .map((preference) => {
        return `${preference.type}${PREFERENCE_KEY_VALUE_SEPARATOR}${preference.value ? 1 : 0}`;
    })
        .join(PREFERENCES_SEPARATOR);
    return `${serializedPreferences}${DATE_SEPARATOR}${state.date}`;
};
exports.serializeState = serializeState;
const getTodayDate = () => moment_1.default().format(exports.DATE_FORMAT);
exports.getTodayDate = getTodayDate;
const runCookiePreferencesManager = () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    react_dom_1.default.render(React.createElement(exports.CookiePreferencesManager, { initialState: getInitialState() }), div);
};
exports.runCookiePreferencesManager = runCookiePreferencesManager;
//# sourceMappingURL=CookiePreferencesManager.js.map