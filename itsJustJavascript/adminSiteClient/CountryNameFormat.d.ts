/// <reference types="lodash" />
export declare class CountryNameFormat {
    static NonStandardCountryName: string;
    static OurWorldInDataName: string;
    static IsoAlpha2: string;
    static IsoAlpha3: string;
    static ImfCode: string;
    static CowLetter: string;
    static CowCode: string;
    static UnctadCode: string;
    static MarcCode: string;
    static NCDCode: string;
    static KansasCode: string;
    static PennCode: string;
    static ContinentName: string;
    static ContinentCode: string;
}
export declare const CountryNameFormatDefs: ({
    key: string;
    label: string;
    use_as_input: boolean;
    use_as_output: boolean;
    column_name?: undefined;
} | {
    key: string;
    label: string;
    use_as_input: boolean;
    column_name: string;
    use_as_output: boolean;
})[];
export declare const CountryDefByKey: import("lodash").Dictionary<{
    key: string;
    label: string;
    use_as_input: boolean;
    use_as_output: boolean;
    column_name?: undefined;
} | {
    key: string;
    label: string;
    use_as_input: boolean;
    column_name: string;
    use_as_output: boolean;
}>;
//# sourceMappingURL=CountryNameFormat.d.ts.map