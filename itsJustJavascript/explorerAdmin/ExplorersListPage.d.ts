import * as React from "react";
import { IReactionDisposer } from "mobx";
import { ExplorerProgram } from "../explorer/ExplorerProgram";
import { AdminManager } from "./AdminManager";
export declare class ExplorersIndexPage extends React.Component<{
    manager?: AdminManager;
}> {
    explorers: ExplorerProgram[];
    needsPull: boolean;
    maxVisibleRows: number;
    numTotalRows?: number;
    searchInput?: string;
    highlightSearch?: string;
    private gitCmsClient;
    get explorersToShow(): ExplorerProgram[];
    onShowMore(): void;
    private pullFromGithub;
    render(): JSX.Element;
    gitCmsBranchName: string;
    isReady: boolean;
    private fetchAllExplorers;
    private get manager();
    private loadingModalOn;
    private resetLoadingModal;
    togglePublishedStatus(filename: string): Promise<void>;
    deleteFile(filename: string): Promise<void>;
    dispose: IReactionDisposer;
    componentDidMount(): void;
    componentWillUnmount(): void;
}
//# sourceMappingURL=ExplorersListPage.d.ts.map