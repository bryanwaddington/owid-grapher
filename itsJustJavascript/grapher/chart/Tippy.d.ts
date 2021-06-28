import * as React from "react";
import { TippyProps } from "@tippyjs/react";
interface CustomTippyProps extends TippyProps {
    lazy?: boolean;
}
export declare const Tippy: (props: CustomTippyProps) => JSX.Element;
export declare const LazyTippy: (props: TippyProps) => React.ReactElement;
interface TippyIfInteractiveProps extends CustomTippyProps {
    isInteractive: boolean;
}
export declare const TippyIfInteractive: (props: TippyIfInteractiveProps) => JSX.Element;
export {};
//# sourceMappingURL=Tippy.d.ts.map