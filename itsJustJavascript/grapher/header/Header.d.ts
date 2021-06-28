import * as React from "react";
import { TextWrap } from "../text/TextWrap";
import { Logo } from "../captionedChart/Logos";
import { HeaderManager } from "./HeaderManager";
export declare class Header extends React.Component<{
    manager: HeaderManager;
    maxWidth?: number;
}> {
    private get manager();
    private get fontSize();
    private get maxWidth();
    private get titleText();
    private get subtitleText();
    get logo(): Logo | undefined;
    private get logoWidth();
    private get logoHeight();
    get title(): TextWrap;
    titleMarginBottom: number;
    get subtitleWidth(): number;
    get subtitle(): TextWrap;
    get height(): number;
    renderStatic(x: number, y: number): JSX.Element | null;
    render(): JSX.Element;
}
//# sourceMappingURL=Header.d.ts.map