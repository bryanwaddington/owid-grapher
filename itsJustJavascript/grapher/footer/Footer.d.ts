import * as React from "react";
import { FooterManager } from "./FooterManager";
export declare class Footer extends React.Component<{
    manager: FooterManager;
    maxWidth?: number;
}> {
    private get maxWidth();
    private get manager();
    private get sourcesText();
    private get noteText();
    private get ccSvg();
    private get originUrlWithProtocol();
    private get finalUrl();
    private get finalUrlText();
    private get licenseSvg();
    private get fontSize();
    private get sources();
    private get note();
    private get license();
    private get isCompact();
    private get paraMargin();
    get height(): number;
    private onSourcesClick;
    renderStatic(targetX: number, targetY: number): JSX.Element | null;
    base: React.RefObject<HTMLDivElement>;
    tooltipTarget?: {
        x: number;
        y: number;
    };
    private onMouseMove;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=Footer.d.ts.map