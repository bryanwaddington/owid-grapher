import capitalize from "lodash/capitalize";
import chunk from "lodash/chunk";
import clone from "lodash/clone";
import cloneDeep from "lodash/cloneDeep";
import compact from "lodash/compact";
import countBy from "lodash/countBy";
import debounce from "lodash/debounce";
import difference from "lodash/difference";
import extend from "lodash/extend";
import findIndex from "lodash/findIndex";
import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import identity from "lodash/identity";
import invert from "lodash/invert";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import keyBy from "lodash/keyBy";
import max from "lodash/max";
import maxBy from "lodash/maxBy";
import memoize from "lodash/memoize";
import min from "lodash/min";
import minBy from "lodash/minBy";
import noop from "lodash/noop";
import omit from "lodash/omit";
import once from "lodash/once";
import orderBy from "lodash/orderBy";
import partition from "lodash/partition";
import pick from "lodash/pick";
import range from "lodash/range";
import reverse from "lodash/reverse";
import sample from "lodash/sample";
import sampleSize from "lodash/sampleSize";
import sortBy from "lodash/sortBy";
import startCase from "lodash/startCase";
import sum from "lodash/sum";
import sumBy from "lodash/sumBy";
import takeWhile from "lodash/takeWhile";
import throttle from "lodash/throttle";
import toString from "lodash/toString";
import union from "lodash/union";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import uniqWith from "lodash/uniqWith";
import upperFirst from "lodash/upperFirst";
import without from "lodash/without";
export { capitalize, chunk, clone, cloneDeep, compact, countBy, debounce, difference, extend, findIndex, flatten, groupBy, identity, invert, isEmpty, isEqual, isNumber, isString, keyBy, max, maxBy, memoize, min, minBy, noop, omit, once, orderBy, partition, pick, range, reverse, sample, sampleSize, sortBy, startCase, sum, sumBy, takeWhile, throttle, toString, union, uniq, uniqBy, uniqWith, upperFirst, without, };
import { pairs } from "d3-array";
export { pairs };
import { SortOrder, Integer, Time, ScaleType } from "./owidTypes";
import { PointVector } from "./PointVector";
export declare type SVGElement = any;
export declare type VNode = any;
export declare type NoUndefinedValues<T> = {
    [P in keyof T]: Required<NonNullable<T[P]>>;
};
export declare const d3Format: (specifier: string) => (n: number | {
    valueOf(): number;
}) => string;
export declare const getRelativeMouse: (node: SVGElement, event: TouchEvent | {
    clientX: number;
    clientY: number;
}) => PointVector;
export declare const exposeInstanceOnWindow: (component: any, name?: string, alsoOnTopWindow?: boolean | undefined) => void;
export declare const makeSafeForCSS: (name: string) => string;
export declare function formatDay(dayAsYear: number, options?: {
    format?: string;
}): string;
export declare const formatYear: (year: number) => string;
export declare const numberMagnitude: (num: number) => number;
export declare const roundSigFig: (num: number, sigfigs?: number) => number;
export declare const first: <T>(arr: readonly T[]) => T | undefined;
export declare const last: <T>(arr: readonly T[]) => T | undefined;
export declare const excludeUndefined: <T>(arr: (T | undefined)[]) => T[];
export declare const firstOfNonEmptyArray: <T>(arr: T[]) => T;
export declare const lastOfNonEmptyArray: <T>(arr: T[]) => T;
interface ObjectLiteral {
    [key: string]: any;
}
export declare const mapToObjectLiteral: (map: Map<string, any>) => ObjectLiteral;
export declare function next<T>(set: T[], current: T): T;
export declare const previous: <T>(set: T[], current: T) => T;
export declare const domainExtent: (numValues: number[], scaleType: ScaleType, maxValueMultiplierForPadding?: number) => [number, number];
interface Point {
    timeValue: Time;
    entityName?: string;
    x?: number;
    y?: number;
}
export declare const cagr: (startValue: number, endValue: number, yearsElapsed: number) => number;
export declare const makeAnnotationsSlug: (columnSlug: string) => string;
export declare const relativeMinAndMax: (points: Point[], property: "x" | "y") => [number, number];
export declare const isVisible: (elm: HTMLElement | null) => boolean;
export declare const slugify: (str: string) => string;
export declare const slugifySameCase: (str: string) => string;
export declare const guid: () => number;
export declare const TESTING_ONLY_reset_guid: () => number;
export declare const pointsToPath: (points: Array<[number, number]>) => string;
export declare const sortedFindClosestIndex: (array: number[], value: number, startIndex?: number, endIndex?: number) => number;
export declare const sortedFindClosest: (array: number[], value: number, startIndex?: number | undefined, endIndex?: number | undefined) => number | undefined;
export declare const isMobile: () => boolean;
export declare const isTouchDevice: () => boolean;
export interface Json {
    [x: string]: any;
}
export declare const csvEscape: (value: any) => any;
export declare const arrToCsvRow: (arr: string[]) => string;
export declare const urlToSlug: (url: string) => string;
export declare const trimObject: <Obj>(obj: Obj, trimStringEmptyStrings?: boolean) => NoUndefinedValues<Obj>;
export declare const fetchText: (url: string) => Promise<string>;
export declare const getCountryCodeFromNetlifyRedirect: () => Promise<string | undefined>;
export declare const stripHTML: (html: string) => string;
export declare const getRandomNumberGenerator: (min?: Integer, max?: Integer, seed?: number) => () => Integer;
export declare const sampleFrom: <T>(collection: T[], howMany: number, seed: number) => T[];
export declare const makeGrid: (pieces: number) => {
    columns: number;
    rows: number;
};
export declare const findClosestTimeIndex: (times: Time[], targetTime: Time, tolerance?: number | undefined) => Time | undefined;
export declare const findClosestTime: (times: Time[], targetTime: Time, tolerance?: number | undefined) => Time | undefined;
export declare const es6mapValues: <K, V, M>(input: Map<K, V>, mapper: (value: V, key: K) => M) => Map<K, M>;
interface DataValue {
    time: Time | undefined;
    value: number | string | undefined;
}
export declare const valuesByEntityAtTimes: (valueByEntityAndTime: Map<string, Map<number, string | number>>, targetTimes: Time[], tolerance?: number) => Map<string, DataValue[]>;
export declare const valuesByEntityWithinTimes: (valueByEntityAndTimes: Map<string, Map<number, string | number>>, range: (number | undefined)[]) => Map<string, DataValue[]>;
export declare const getStartEndValues: (values: DataValue[]) => (DataValue | undefined)[];
export declare function dateDiffInDays(a: Date, b: Date): number;
export declare const diffDateISOStringInDays: (a: string, b: string) => number;
export declare const addDays: (date: Date, days: number) => Date;
export declare function retryPromise<T>(promiseGetter: () => Promise<T>, maxRetries?: number): Promise<T>;
export declare function parseIntOrUndefined(s: string | undefined): number | undefined;
export declare const anyToString: (value: any) => string;
export declare function scrollIntoViewIfNeeded(containerEl: HTMLElement, focusedEl: HTMLElement): void;
export declare function rollingMap<T, U>(array: T[], mapper: (a: T, b: T) => U): U[];
export declare function groupMap<T, K>(array: T[], accessor: (v: T) => K): Map<K, T[]>;
export declare function keyMap<Key, Value>(array: Value[], accessor: (v: Value) => Key): Map<Key, Value>;
export declare const linkify: (str: string) => string;
export declare const oneOf: <T>(value: any, options: T[], defaultOption: T) => T;
export declare const intersectionOfSets: <T>(sets: Set<T>[]) => Set<T>;
export declare const intersection: <T>(...arrs: T[][]) => T[];
export declare function sortByUndefinedLast<T>(array: T[], accessor: (t: T) => string | number | undefined, order?: SortOrder): any;
export declare function getAttributesOfHTMLElement(el: HTMLElement): {
    [key: string]: string;
};
export declare const mapNullToUndefined: <T>(array: (T | null | undefined)[]) => (T | undefined)[];
export declare const lowerCaseFirstLetterUnlessAbbreviation: (str: string) => string;
/**
 * Use with caution - please note that this sort function only sorts on numeric data, and that sorts
 * **in-place** and **not stable**.
 * If you need a more general sort function that is stable and leaves the original array untouched,
 * please use lodash's `sortBy` instead. This function is faster, though.
 */
export declare const sortNumeric: <T>(arr: T[], sortByFn?: (el: T) => number, sortOrder?: SortOrder) => T[];
export declare const mapBy: <T, K, V>(arr: T[], keyAccessor: (t: T) => K, valueAccessor: (t: T) => V) => Map<K, V>;
export declare const findIndexFast: (array: any[], predicate: (value: any, index: number) => boolean, fromIndex?: number, toIndex?: number) => number;
export declare const logMe: (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) => TypedPropertyDescriptor<any>;
export declare function getClosestTimePairs(sortedTimesA: Time[], sortedTimesB: Time[], maxDiff?: Integer): [number, number][];
export declare const omitUndefinedValues: <T>(object: T) => NoUndefinedValues<T>;
export declare const isInIFrame: () => boolean;
export declare const differenceObj: <A extends Record<string, any>, B extends Record<string, any>>(obj: A, defaultObj: B) => Partial<A>;
export declare const findDOMParent: (el: HTMLElement, condition: (el: HTMLElement) => boolean) => HTMLElement | null;
export declare const wrapInDiv: (el: Element, classes?: string[] | undefined) => Element;
//# sourceMappingURL=Util.d.ts.map