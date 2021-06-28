import * as React from "react";
import { SiteSearchResults } from "./searchClient";
export declare class HeaderSearch extends React.Component<{
    autoFocus?: boolean;
}> {
    results?: SiteSearchResults;
    lastQuery?: string;
    runSearch(query: string): Promise<void>;
    onSearch(e: React.ChangeEvent<HTMLInputElement>): void;
    render(): JSX.Element;
}
//# sourceMappingURL=HeaderSearch.d.ts.map