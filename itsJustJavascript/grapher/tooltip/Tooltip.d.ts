import * as React from "react";
import { TooltipProps, TooltipManager } from "./TooltipProps";
export declare class TooltipView extends React.Component<{
    tooltipProvider: TooltipManager;
    width: number;
    height: number;
}> {
    private get rendered();
    private base;
    private bounds?;
    private updateBounds;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element | null;
}
export declare class Tooltip extends React.Component<TooltipProps> {
    componentDidMount(): void;
    private connectTooltipToContainer;
    private removeToolTipFromContainer;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): null;
}
//# sourceMappingURL=Tooltip.d.ts.map