/// <reference types="react" />
export declare enum PreferenceType {
    Analytics = "a",
    Marketing = "m"
}
export declare enum Action {
    Accept = 0,
    TogglePreference = 1,
    Reset = 2
}
export interface Preference {
    type: PreferenceType;
    value: boolean;
}
export declare const POLICY_DATE: number;
export declare const DATE_FORMAT = "YYYYMMDD";
interface State {
    date?: number;
    preferences: Preference[];
}
export declare const CookiePreferencesManager: ({ initialState, }: {
    initialState: State;
}) => JSX.Element;
export declare const parseRawCookieValue: (cookieValue?: string | undefined) => {
    preferences: Preference[];
    date: number;
} | undefined;
export declare const parsePreferences: (preferences?: string | undefined) => Preference[];
export declare const isValidPreference: ({ type, value }: Preference) => boolean;
export declare const parseDate: (date?: string | undefined) => number | undefined;
export declare const getPreferenceValue: (type: PreferenceType, preferences: Preference[]) => boolean;
export declare const updatePreference: (type: PreferenceType, value: boolean, preferences: Preference[]) => Preference[];
export declare const arePreferencesOutdated: (preferencesDate: number | undefined, policyDate: number) => boolean;
export declare const serializeState: (state: State) => string;
export declare const getTodayDate: () => string;
export declare const runCookiePreferencesManager: () => void;
export {};
//# sourceMappingURL=CookiePreferencesManager.d.ts.map