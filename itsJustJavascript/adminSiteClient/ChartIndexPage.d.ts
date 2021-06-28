import * as React from "react";
import { ChartListItem } from "./ChartList";
import { AdminAppContextType } from "./AdminAppContext";
interface Searchable {
    chart: ChartListItem;
    term?: Fuzzysort.Prepared;
}
export declare class ChartIndexPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    searchInput?: string;
    maxVisibleCharts: number;
    charts: ChartListItem[];
    get numTotalCharts(): number;
    get searchIndex(): Searchable[];
    get chartsToShow(): ChartListItem[];
    onSearchInput(input: string): void;
    onShowMore(): void;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
}
export {};
//# sourceMappingURL=ChartIndexPage.d.ts.map