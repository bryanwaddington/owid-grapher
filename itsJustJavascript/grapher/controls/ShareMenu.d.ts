import React from "react";
export interface ShareMenuManager {
    slug?: string;
    currentTitle?: string;
    canonicalUrl?: string;
    embedUrl?: string;
    embedDialogAdditionalElements?: React.ReactElement;
    editUrl?: string;
    addPopup: (popup: any) => void;
    removePopup: (popup: any) => void;
}
interface ShareMenuProps {
    manager: ShareMenuManager;
    onDismiss: () => void;
}
interface ShareMenuState {
    copied: boolean;
}
export declare class ShareMenu extends React.Component<ShareMenuProps, ShareMenuState> {
    dismissable: boolean;
    constructor(props: ShareMenuProps);
    get manager(): ShareMenuManager;
    get title(): string;
    get isDisabled(): boolean;
    get canonicalUrl(): string | undefined;
    dismiss(): void;
    onClickSomewhere(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onEmbed(): void;
    onNavigatorShare(): Promise<void>;
    onCopy(): void;
    get twitterHref(): string;
    get facebookHref(): string;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=ShareMenu.d.ts.map