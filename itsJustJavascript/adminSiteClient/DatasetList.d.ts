import * as React from "react";
import { Tag } from "./TagBadge";
import { AdminAppContextType } from "./AdminAppContext";
export interface DatasetListItem {
    id: number;
    name: string;
    namespace: string;
    description: string;
    dataEditedAt: Date;
    dataEditedByUserName: string;
    metadataEditedAt: Date;
    metadataEditedByUserName: string;
    tags: Tag[];
    isPrivate: boolean;
}
export declare class DatasetList extends React.Component<{
    datasets: DatasetListItem[];
    searchHighlight?: (text: string) => any;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    availableTags: Tag[];
    getTags(): Promise<void>;
    componentDidMount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=DatasetList.d.ts.map