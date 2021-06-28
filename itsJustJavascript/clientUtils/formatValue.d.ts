export interface TickFormattingOptions {
    numDecimalPlaces?: number;
    unit?: string;
    noTrailingZeroes?: boolean;
    noSpaceUnit?: boolean;
    numberPrefixes?: boolean;
    shortNumberPrefixes?: boolean;
    showPlus?: boolean;
    isFirstOrLastTick?: boolean;
}
export declare function formatValue(value: number, options: TickFormattingOptions): string;
//# sourceMappingURL=formatValue.d.ts.map