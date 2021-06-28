import * as React from "react";
import { Bounds } from "../clientUtils/Bounds";
import { Grapher } from "../grapher/core/Grapher";
export declare class GrapherFigureView extends React.Component<{
    grapher: Grapher;
}> {
    base: React.RefObject<HTMLDivElement>;
    bounds?: Bounds;
    calcBounds(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=GrapherFigureView.d.ts.map