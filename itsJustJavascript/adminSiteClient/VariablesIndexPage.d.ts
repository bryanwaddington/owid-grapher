import * as React from "react";
import { IReactionDisposer } from "mobx";
import { VariableListItem } from "./VariableList";
import { AdminAppContextType } from "./AdminAppContext";
export declare class VariablesIndexPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    variables: VariableListItem[];
    maxVisibleRows: number;
    numTotalRows?: number;
    searchInput?: string;
    highlightSearch?: string;
    get variablesToShow(): VariableListItem[];
    onShowMore(): void;
    render(): JSX.Element;
    getData(): Promise<void>;
    dispose: IReactionDisposer;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
//# sourceMappingURL=VariablesIndexPage.d.ts.map