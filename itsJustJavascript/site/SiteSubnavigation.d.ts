import * as React from "react";
import { SubNavId } from "../clientUtils/owidTypes";
export interface SubnavItem {
    label: string;
    href: string;
    id: string;
    highlight?: boolean;
    parentId?: string;
}
export declare const subnavs: {
    [key in SubNavId]: SubnavItem[];
};
export declare class SiteSubnavigation extends React.Component<{
    subnavId: SubNavId;
    subnavCurrentId?: string;
}> {
    render(): JSX.Element | null;
}
//# sourceMappingURL=SiteSubnavigation.d.ts.map