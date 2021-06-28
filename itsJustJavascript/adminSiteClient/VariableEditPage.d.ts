import * as React from "react";
import { LegacyVariableConfig } from "../grapher/core/LegacyVariableCode";
import { ChartListItem } from "./ChartList";
import { AdminAppContextType } from "./AdminAppContext";
interface VariablePageData extends Omit<LegacyVariableConfig, "source"> {
    datasetNamespace: string;
    charts: ChartListItem[];
    source: {
        id: number;
        name: string;
    };
}
export declare class VariableEditPage extends React.Component<{
    variableId: number;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    variable?: VariablePageData;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(): void;
}
export {};
//# sourceMappingURL=VariableEditPage.d.ts.map