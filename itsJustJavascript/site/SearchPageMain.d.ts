import React from "react";
import { SiteSearchResults } from "./searchClient";
export declare class SearchPageMain extends React.Component {
    query: string;
    lastQuery?: string;
    results?: SiteSearchResults;
    runSearch(query: string): Promise<void>;
    onSearch(query: string): void;
    componentDidMount(): void;
    onSearchInput(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
export declare function runSearchPage(): void;
//# sourceMappingURL=SearchPageMain.d.ts.map