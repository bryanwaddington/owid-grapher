import * as React from "react";
import { DatasetListItem } from "./DatasetList";
import { ChartListItem } from "./ChartList";
import { Tag } from "./TagBadge";
import { AdminAppContextType } from "./AdminAppContext";
interface TagPageData {
    id: number;
    parentId?: number;
    name: string;
    specialType?: string;
    updatedAt: string;
    datasets: DatasetListItem[];
    charts: ChartListItem[];
    children: Tag[];
    possibleParents: Tag[];
    isBulkImport: boolean;
}
export declare class TagEditPage extends React.Component<{
    tagId: number;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    tag?: TagPageData;
    render(): JSX.Element;
    getData(tagId: number): Promise<void>;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: any): void;
}
export {};
//# sourceMappingURL=TagEditPage.d.ts.map