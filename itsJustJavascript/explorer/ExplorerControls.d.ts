import React from "react";
import { ExplorerChoice } from "./ExplorerConstants";
export declare class ExplorerControlBar extends React.Component<{
    isMobile?: boolean;
    showControls?: boolean;
    closeControls?: () => void;
}> {
    render(): JSX.Element;
}
export declare class ExplorerControlPanel extends React.Component<{
    choice: ExplorerChoice;
    explorerSlug?: string;
    onChange?: (value: string) => void;
    isMobile: boolean;
}> {
    private renderCheckboxOrRadio;
    private get options();
    private renderDropdown;
    private customOnChange;
    private renderColumn;
    render(): JSX.Element | JSX.Element[];
}
//# sourceMappingURL=ExplorerControls.d.ts.map