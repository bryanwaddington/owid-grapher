import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
export interface SourcesTabManager {
    adminBaseUrl?: string;
    columnsWithSources: CoreColumn[];
    showAdminControls?: boolean;
}
export declare class SourcesTab extends React.Component<{
    bounds?: Bounds;
    manager: SourcesTabManager;
}> {
    private get bounds();
    private get manager();
    private renderSource;
    render(): JSX.Element;
}
//# sourceMappingURL=SourcesTab.d.ts.map