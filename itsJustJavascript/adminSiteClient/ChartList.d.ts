import * as React from "react";
import { Tag } from "./TagBadge";
import { AdminAppContextType } from "./AdminAppContext";
import { GrapherInterface } from "../grapher/core/GrapherInterface";
export interface ChartListItem {
    id: GrapherInterface["id"];
    title: GrapherInterface["title"];
    slug: GrapherInterface["slug"];
    type: GrapherInterface["type"];
    internalNotes: GrapherInterface["internalNotes"];
    variantName: GrapherInterface["variantName"];
    isPublished: GrapherInterface["isPublished"];
    tab: GrapherInterface["tab"];
    hasChartTab: GrapherInterface["hasChartTab"];
    hasMapTab: GrapherInterface["hasMapTab"];
    isStarred: boolean;
    lastEditedAt: string;
    lastEditedBy: string;
    publishedAt: string;
    publishedBy: string;
    isExplorable: boolean;
    tags: Tag[];
}
export declare class ChartList extends React.Component<{
    charts: ChartListItem[];
    searchHighlight?: (text: string) => any;
    onDelete?: (chart: ChartListItem) => void;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    availableTags: Tag[];
    onDeleteChart(chart: ChartListItem): Promise<void>;
    onStar(chart: ChartListItem): Promise<void>;
    getTags(): Promise<void>;
    componentDidMount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=ChartList.d.ts.map