export interface Country {
    name: string;
    code: string;
    slug: string;
    iso3166?: string;
    variantNames?: string[];
}
export declare const countries: Country[];
export declare const getCountry: (slug: string) => Country | undefined;
export declare const getCountryDetectionRedirects: () => string[];
//# sourceMappingURL=countries.d.ts.map