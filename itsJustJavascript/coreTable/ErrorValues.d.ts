/**
 * Previously when we get a blank for a value, or a string where we expect a number, etc,
 * we parse things as simply undefineds or nulls or NaN. Since authors are uploading data
 * from our sources at runtime, and errors in source data are extremely common, it may be helpful
 * to parse those invalid values into specific types, to provide better error message and perhaps
 * in the future suggested autocorrections or workarounds.
 *
 * For a good read on the "Errors are values" pattern: https://blog.golang.org/errors-are-values
 */
export declare abstract class ErrorValue {
    toString(): string;
    toErrorString(): string;
}
declare class NaNButShouldBeNumber extends ErrorValue {
}
export declare class DroppedForTesting extends ErrorValue {
}
declare class InvalidOnALogScale extends ErrorValue {
}
declare class UndefinedButShouldBeNumber extends ErrorValue {
}
declare class NullButShouldBeNumber extends ErrorValue {
}
declare class BlankButShouldBeNumber extends ErrorValue {
}
declare class UndefinedButShouldBeString extends ErrorValue {
}
declare class NullButShouldBeString extends ErrorValue {
}
declare class NotAParseableNumberButShouldBeNumber extends ErrorValue {
}
export declare class DivideByZeroError extends ErrorValue {
}
declare class NoValueWithinTolerance extends ErrorValue {
}
declare class NoMatchingValueAfterJoin extends ErrorValue {
}
export declare class ValueTooLow extends ErrorValue {
}
declare class NoValueToCompareAgainst extends ErrorValue {
}
declare class FilteredValue extends ErrorValue {
}
declare class NoValueForInterpolation extends ErrorValue {
}
declare class InvalidQuarterValue extends ErrorValue {
}
export declare class MissingValuePlaceholder extends ErrorValue {
}
export declare const ErrorValueTypes: {
    NaNButShouldBeNumber: NaNButShouldBeNumber;
    DroppedForTesting: DroppedForTesting;
    InvalidOnALogScale: InvalidOnALogScale;
    UndefinedButShouldBeNumber: UndefinedButShouldBeNumber;
    NullButShouldBeNumber: NullButShouldBeNumber;
    BlankButShouldBeNumber: BlankButShouldBeNumber;
    UndefinedButShouldBeString: UndefinedButShouldBeString;
    NullButShouldBeString: NullButShouldBeString;
    MissingValuePlaceholder: MissingValuePlaceholder;
    NotAParseableNumberButShouldBeNumber: NotAParseableNumberButShouldBeNumber;
    DivideByZeroError: DivideByZeroError;
    NoValueWithinTolerance: NoValueWithinTolerance;
    NoMatchingValueAfterJoin: NoMatchingValueAfterJoin;
    ValueTooLow: ValueTooLow;
    NoValueToCompareAgainst: NoValueToCompareAgainst;
    FilteredValue: FilteredValue;
    NoValueForInterpolation: NoValueForInterpolation;
    InvalidQuarterValue: InvalidQuarterValue;
};
export declare const isNotErrorValue: <TYPE>(item: ErrorValue | TYPE) => item is TYPE;
export declare const defaultIfErrorValue: <TYPE>(item: ErrorValue | TYPE, defaultValue?: TYPE | undefined) => TYPE | undefined;
export {};
//# sourceMappingURL=ErrorValues.d.ts.map