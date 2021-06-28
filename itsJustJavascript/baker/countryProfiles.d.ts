import { SiteBaker } from "./SiteBaker";
export declare const countriesIndexPage: (baseUrl: string) => string;
export declare const denormalizeLatestCountryData: (variableIds?: number[] | undefined) => Promise<void>;
export declare const countryProfilePage: (countrySlug: string, baseUrl: string) => Promise<string>;
export declare const bakeCountries: (baker: SiteBaker) => Promise<void>;
//# sourceMappingURL=countryProfiles.d.ts.map