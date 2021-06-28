/// <reference types="react" />
import { SubNavId } from "../../clientUtils/owidTypes";
import { SubnavItem } from "../SiteSubnavigation";
export declare const getSubnavItem: (id: string | undefined, subnavItems: SubnavItem[]) => SubnavItem | undefined;
export declare const getSubnavParent: (currentItem: SubnavItem | undefined, subnavItems: SubnavItem[]) => SubnavItem | undefined;
export declare const getBreadcrumbItems: (subnavCurrentId: string | undefined, subnavItems: SubnavItem[]) => SubnavItem[] | undefined;
export declare const Breadcrumb: ({ subnavId, subnavCurrentId, }: {
    subnavId?: SubNavId | undefined;
    subnavCurrentId?: string | undefined;
}) => JSX.Element | null;
//# sourceMappingURL=Breadcrumb.d.ts.map