import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
export declare class AdminLayout extends React.Component<{
    noSidebar?: boolean;
    title?: string;
    children: any;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    private showFAQ;
    private showSidebar;
    onToggleFAQ(): void;
    onToggleSidebar(): void;
    private setInitialSidebarState;
    componentDidMount(): void;
    componentDidUpdate(): void;
    get environmentSpan(): JSX.Element;
    render(): JSX.Element;
}
//# sourceMappingURL=AdminLayout.d.ts.map