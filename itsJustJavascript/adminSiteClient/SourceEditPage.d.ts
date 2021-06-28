import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
import { VariableListItem } from "./VariableList";
interface SourcePageData {
    id: number;
    name: string;
    updatedAt: string;
    namespace: string;
    description: {
        dataPublishedBy?: string;
        dataPublisherSource?: string;
        link?: string;
        retrievedDate?: string;
        additionalInfo?: string;
    };
    variables: VariableListItem[];
}
export declare class SourceEditPage extends React.Component<{
    sourceId: number;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    source?: SourcePageData;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(): void;
}
export {};
//# sourceMappingURL=SourceEditPage.d.ts.map