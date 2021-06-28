/// <reference types="react" />
export interface CountryProfileIndicator {
    name: string;
    slug: string;
    value: string;
    year: number;
    variantName?: string;
}
export interface Stat {
    value: number;
    year: number;
}
export interface CountryProfileKeyStats {
    population: Stat;
}
export interface CountryProfilePageProps {
    country: {
        name: string;
        slug: string;
        code: string;
    };
    indicators: CountryProfileIndicator[];
    baseUrl: string;
}
export declare const CountryProfilePage: (props: CountryProfilePageProps) => JSX.Element;
//# sourceMappingURL=CountryProfilePage.d.ts.map