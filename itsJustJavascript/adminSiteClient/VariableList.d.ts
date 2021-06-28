import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
export interface VariableListItem {
    id: number;
    name: string;
    uploadedAt?: Date;
    uploadedBy?: string;
    isPrivate?: boolean;
}
export declare class VariableList extends React.Component<{
    variables: VariableListItem[];
    searchHighlight?: (text: string) => any;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    render(): JSX.Element;
}
//# sourceMappingURL=VariableList.d.ts.map