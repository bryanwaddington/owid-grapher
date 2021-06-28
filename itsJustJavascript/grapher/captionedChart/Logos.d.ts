/// <reference types="react" />
export declare enum LogoOption {
    owid = "owid",
    "core+owid" = "core+owid",
    "gv+owid" = "gv+owid"
}
interface LogoProps {
    logo?: LogoOption;
    isLink: boolean;
    fontSize: number;
}
export declare class Logo {
    props: LogoProps;
    constructor(props: LogoProps);
    private get spec();
    private get scale();
    get width(): number;
    get height(): number;
    renderSVG(targetX: number, targetY: number): JSX.Element;
    renderHTML(): JSX.Element;
}
export {};
//# sourceMappingURL=Logos.d.ts.map