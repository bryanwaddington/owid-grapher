declare type entityControlEvent = "open" | "change" | "close";
declare type countrySelectorEvent = "enter" | "select" | "deselect" | "sortBy" | "sortOrder";
export declare class GrapherAnalytics {
    constructor(environment?: string, version?: string);
    private version;
    private isDev;
    logGrapherViewError(error: any, info: any): void;
    logEntitiesNotFoundError(entities: string[]): void;
    logGrapherTimelinePlay(slug?: string): void;
    logGlobalEntitySelector(action: entityControlEvent, note?: string): void;
    logEntityPickerEvent(pickerSlug: string, action: countrySelectorEvent, note?: string): void;
    logSiteClick(action: string | undefined, label: string): void;
    logKeyboardShortcut(shortcut: string, combo: string): void;
    startClickTracking(): void;
    protected logToAmplitude(name: string, props?: any): void;
    protected logToGA(eventCategory: string, eventAction: string, eventLabel?: string, eventValue?: number): void;
}
export {};
//# sourceMappingURL=GrapherAnalytics.d.ts.map