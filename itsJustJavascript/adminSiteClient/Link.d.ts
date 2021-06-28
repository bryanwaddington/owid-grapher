import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    replace?: boolean;
    native?: boolean;
}
export declare class Link extends React.Component<LinkProps> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Link.d.ts.map