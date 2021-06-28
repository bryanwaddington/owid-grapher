import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
export interface NoDataModalManager {
    canChangeEntity?: boolean;
    canAddData?: boolean;
    isSelectingData?: boolean;
    entityType?: string;
}
export declare class NoDataModal extends React.Component<{
    bounds?: Bounds;
    message?: string;
    manager: NoDataModalManager;
}> {
    private onDataSelect;
    private get bounds();
    render(): JSX.Element;
}
//# sourceMappingURL=NoDataModal.d.ts.map