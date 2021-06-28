import * as React from "react";
import { DualAxis } from "../axis/Axis";
export interface ComparisonLineConfig {
    label?: string;
    yEquals?: string;
}
export declare class ComparisonLine extends React.Component<{
    dualAxis: DualAxis;
    comparisonLine: ComparisonLineConfig;
}> {
    private renderUid;
    private get controlData();
    private get linePath();
    private get placedLabel();
    render(): JSX.Element;
}
//# sourceMappingURL=ComparisonLine.d.ts.map