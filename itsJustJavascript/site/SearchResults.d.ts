import { SiteSearchResults, ChartHit, CountryHit, ArticleHit } from "./searchClient";
import React from "react";
export declare class SearchResults extends React.Component<{
    results: SiteSearchResults;
}> {
    get bestChartHit(): ChartHit | undefined;
    get entries(): (CountryHit | ArticleHit)[];
    get blogposts(): (CountryHit | ArticleHit)[];
    get bestChartEntities(): string[];
    get bestChartSlug(): string | undefined;
    render(): JSX.Element;
}
//# sourceMappingURL=SearchResults.d.ts.map