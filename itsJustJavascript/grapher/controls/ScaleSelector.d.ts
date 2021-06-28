import * as React from "react";
import { ScaleType } from "../core/GrapherConstants";
export interface ScaleSelectorManager {
    scaleType?: ScaleType;
}
export declare class ScaleSelector extends React.Component<{
    manager?: ScaleSelectorManager;
    prefix?: string;
}> {
    private onClick;
    render(): JSX.Element;
}
//# sourceMappingURL=ScaleSelector.d.ts.map