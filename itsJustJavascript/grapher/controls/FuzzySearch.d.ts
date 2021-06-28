export declare class FuzzySearch<T> {
    strings: (Fuzzysort.Prepared | undefined)[];
    datamap: any;
    constructor(data: T[], key: string);
    search(input: string): T[];
    single(input: string, target: string): Fuzzysort.Result | null;
    highlight(input: string, target: string): string;
}
export declare function highlight(result: Fuzzysort.Result | null): string | null;
//# sourceMappingURL=FuzzySearch.d.ts.map