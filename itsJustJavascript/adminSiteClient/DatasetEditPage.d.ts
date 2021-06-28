import * as React from "react";
import { OwidSource } from "../coreTable/OwidSource";
import { ChartListItem } from "./ChartList";
import { AdminAppContextType } from "./AdminAppContext";
import { LegacyVariableDisplayConfigInterface } from "../clientUtils/LegacyVariableDisplayConfigInterface";
interface VariableEditListItem {
    id: number;
    name: string;
    unit: string;
    shortUnit: string;
    description: string;
    display: LegacyVariableDisplayConfigInterface;
}
interface DatasetPageData {
    id: number;
    name: string;
    description: string;
    namespace: string;
    isPrivate: boolean;
    dataEditedAt: Date;
    dataEditedByUserId: number;
    dataEditedByUserName: string;
    metadataEditedAt: Date;
    metadataEditedByUserId: number;
    metadataEditedByUserName: string;
    availableTags: {
        id: number;
        name: string;
        parentName: string;
    }[];
    tags: {
        id: number;
        name: string;
    }[];
    variables: VariableEditListItem[];
    charts: ChartListItem[];
    source: OwidSource;
    zipFile?: {
        filename: string;
    };
}
export declare class DatasetEditPage extends React.Component<{
    datasetId: number;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    dataset?: DatasetPageData;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(): void;
}
export {};
//# sourceMappingURL=DatasetEditPage.d.ts.map