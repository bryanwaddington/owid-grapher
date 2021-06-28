import React from "react";
import { AdminManager } from "./AdminManager";
export declare class ExplorerCreatePage extends React.Component<{
    slug: string;
    gitCmsBranchName: string;
    manager?: AdminManager;
    doNotFetch?: boolean;
}> {
    private get manager();
    private loadingModalOff;
    private loadingModalOn;
    private resetLoadingModal;
    componentDidMount(): void;
    private startPollingLocalStorageForPreviewChanges;
    isReady: boolean;
    componentWillUnmount(): void;
    private gitCmsClient;
    private fetchExplorerProgramOnLoad;
    private setProgram;
    private saveDraft;
    get draftIfAny(): string | null;
    private clearDraft;
    private programOnDisk;
    private program;
    private _save;
    private saveAs;
    private clearChanges;
    private save;
    get isModified(): boolean;
    gitCmsBranchName: string;
    private onSave;
    render(): JSX.Element;
}
//# sourceMappingURL=ExplorerCreatePage.d.ts.map