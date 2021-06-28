import * as React from "react";
import { IReactionDisposer } from "mobx";
import { Grapher } from "../grapher/core/Grapher";
import { Admin } from "./Admin";
import { ChartEditor, EditorDatabase, Log, PostReference, ChartRedirect, ChartEditorManager } from "./ChartEditor";
import { AdminAppContextType } from "./AdminAppContext";
import { VisionDeficiency } from "./VisionDeficiencies";
export declare class ChartEditorPage extends React.Component<{
    grapherId?: number;
    newGrapherIndex?: number;
    grapherConfig?: any;
}> implements ChartEditorManager {
    grapher: Grapher;
    database: EditorDatabase;
    logs: Log[];
    references: PostReference[];
    redirects: ChartRedirect[];
    grapherElement?: JSX.Element;
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    simulateVisionDeficiency?: VisionDeficiency;
    fetchGrapher(): Promise<void>;
    private _isDbSet;
    private _isGrapherSet;
    get isReady(): boolean;
    private loadGrapherJson;
    private setDb;
    fetchData(): Promise<void>;
    fetchLogs(): Promise<void>;
    fetchRefs(): Promise<void>;
    fetchRedirects(): Promise<void>;
    get admin(): Admin;
    get editor(): ChartEditor | undefined;
    refresh(): void;
    dispose: IReactionDisposer;
    componentDidMount(): void;
    UNSAFE_componentWillReceiveProps(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    renderReady(editor: ChartEditor): JSX.Element;
}
//# sourceMappingURL=ChartEditorPage.d.ts.map