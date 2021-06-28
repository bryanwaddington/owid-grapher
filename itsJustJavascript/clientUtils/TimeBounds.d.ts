import { Time } from "./owidTypes";
/**
 * An unbounded value (±Infinity) or a concrete point in time (year or date).
 */
export declare type TimeBound = number;
export declare type TimeBounds = [TimeBound, TimeBound];
/**
 * The two special TimeBound values: unbounded left & unbounded right.
 */
export declare enum TimeBoundValue {
    negativeInfinity = -Infinity,
    positiveInfinity = Infinity
}
export declare const timeFromTimebounds: (timeBound: TimeBound, fallbackTime: Time) => number;
export declare const isNegativeInfinity: (timeBound: TimeBound) => timeBound is TimeBoundValue;
export declare const isPositiveInfinity: (timeBound: TimeBound) => timeBound is TimeBoundValue;
export declare const minTimeBoundFromJSONOrNegativeInfinity: (minTime: TimeBound | string | undefined) => TimeBound;
export declare const maxTimeBoundFromJSONOrPositiveInfinity: (maxTime: TimeBound | string | undefined) => TimeBound;
export declare const minTimeToJSON: (bound: TimeBound | undefined) => string | number | undefined;
export declare const maxTimeToJSON: (bound: TimeBound | undefined) => string | number | undefined;
export declare const timeBoundToTimeBoundString: (timeBound: TimeBound, isDate: boolean) => string;
export declare const getTimeDomainFromQueryString: (time: string) => [number, number];
//# sourceMappingURL=TimeBounds.d.ts.map