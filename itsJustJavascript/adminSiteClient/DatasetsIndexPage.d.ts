import * as React from "react";
import { DatasetListItem } from "./DatasetList";
import { AdminAppContextType } from "./AdminAppContext";
interface Searchable {
    dataset: DatasetListItem;
    term?: Fuzzysort.Prepared;
}
export declare class DatasetsIndexPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    datasets: DatasetListItem[];
    maxVisibleRows: number;
    searchInput?: string;
    get searchIndex(): Searchable[];
    get datasetsToShow(): DatasetListItem[];
    get namespaces(): string[];
    get numTotalRows(): number;
    onSearchInput(input: string): void;
    onShowMore(): void;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
}
export {};
//# sourceMappingURL=DatasetsIndexPage.d.ts.map