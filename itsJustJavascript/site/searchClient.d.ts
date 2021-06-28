import { Country } from "../clientUtils/countries";
declare type PageHit = ArticleHit | CountryHit;
export interface CountryHit {
    objectID: string;
    type: "country";
    slug: string;
    title: string;
    code: string;
    content: string;
    _highlightResult: any;
    _snippetResult: {
        content: {
            value: string;
        };
    };
}
export interface ArticleHit {
    objectID: string;
    postId: number;
    slug: string;
    title: string;
    type: "post" | "page" | "entry" | "explainer" | "fact";
    content: string;
    _snippetResult: {
        content: {
            value: string;
        };
    };
}
export interface ChartHit {
    chartId: number;
    slug: string;
    title: string;
    subtitle: string;
    variantName: string;
    _snippetResult?: {
        subtitle: {
            value: string;
        };
    };
    _highlightResult?: {
        availableEntities: {
            value: string;
            matchLevel: "none" | "full";
            matchedWords: string[];
        }[];
    };
}
export interface SiteSearchResults {
    pages: PageHit[];
    charts: ChartHit[];
    countries: Country[];
}
export declare const siteSearch: (query: string) => Promise<SiteSearchResults>;
export {};
//# sourceMappingURL=searchClient.d.ts.map