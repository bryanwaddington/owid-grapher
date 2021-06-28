#! /usr/bin/env jest
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CookiePreferencesManager_1 = require("./CookiePreferencesManager");
describe("cookie preferences", () => {
    const preferences = [
        {
            type: CookiePreferencesManager_1.PreferenceType.Analytics,
            value: true,
        },
    ];
    const date = 20201009;
    const serializedState = "a:1-20201009";
    it("parses raw cookie value", () => {
        expect(CookiePreferencesManager_1.parseRawCookieValue()).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue("")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue("abcd")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue("a:1")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue("a:1-46")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue("a:1-2020")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue("1-20201009")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue(":1-20201009")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue("x:1-20201009")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseRawCookieValue(serializedState)).toEqual({
            preferences,
            date,
        });
    });
    it("parses date", () => {
        expect(CookiePreferencesManager_1.parseDate()).toBeUndefined();
        expect(CookiePreferencesManager_1.parseDate("")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseDate("abcd")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseDate("2020")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseDate("20201032")).toBeUndefined();
        expect(CookiePreferencesManager_1.parseDate("20201001")).toEqual(20201001);
    });
    it("parses preferences", () => {
        expect(CookiePreferencesManager_1.parsePreferences()).toEqual([]);
        expect(CookiePreferencesManager_1.parsePreferences("")).toEqual([]);
        expect(CookiePreferencesManager_1.parsePreferences("a:1")).toEqual(preferences);
        expect(CookiePreferencesManager_1.parsePreferences("x:1")).toEqual([]);
        expect(CookiePreferencesManager_1.parsePreferences("a:1|m:0")).toEqual([
            ...preferences,
            { type: CookiePreferencesManager_1.PreferenceType.Marketing, value: false },
        ]);
    });
    it("updates a preference", () => {
        expect(CookiePreferencesManager_1.updatePreference(CookiePreferencesManager_1.PreferenceType.Analytics, false, preferences)).toEqual([
            {
                type: CookiePreferencesManager_1.PreferenceType.Analytics,
                value: false,
            },
        ]);
    });
    it("gets a preference value", () => {
        expect(CookiePreferencesManager_1.getPreferenceValue(CookiePreferencesManager_1.PreferenceType.Analytics, preferences)).toEqual(true);
        expect(CookiePreferencesManager_1.getPreferenceValue(CookiePreferencesManager_1.PreferenceType.Marketing, preferences)).toEqual(false);
    });
    it("serializes state", () => {
        expect(CookiePreferencesManager_1.serializeState({ preferences, date })).toEqual(serializedState);
    });
    it("checks if preferences are outdated", () => {
        expect(CookiePreferencesManager_1.arePreferencesOutdated(date - 1, date)).toEqual(true);
        expect(CookiePreferencesManager_1.arePreferencesOutdated(date, date)).toEqual(false);
        expect(CookiePreferencesManager_1.arePreferencesOutdated(date + 1, date)).toEqual(false);
        expect(CookiePreferencesManager_1.arePreferencesOutdated(undefined, date)).toEqual(false);
    });
});
//# sourceMappingURL=CookiePreferencesManager.test.js.map