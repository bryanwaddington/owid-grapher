declare enum CountryProfileProject {
    coronavirus = "coronavirus",
    co2 = "co2",
    energy = "energy"
}
export declare const countryProfileDefaultCountryPlaceholder = "{DEFAULT_COUNTRY_ENTITY_SELECT}";
interface CountryProfileProjectConfiguration {
    project: CountryProfileProject;
    pageTitle: string;
    landingPageSlug: string;
}
export interface CountryProfileSpec extends CountryProfileProjectConfiguration {
    genericProfileSlug: string;
    rootPath: string;
}
export declare const countryProfileSpecs: CountryProfileSpec[];
export {};
//# sourceMappingURL=countryProfileProjects.d.ts.map