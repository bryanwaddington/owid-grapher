import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
interface RedirectListItem {
    id: number;
    slug: string;
    chartId: number;
    chartSlug: string;
}
export declare class RedirectsIndexPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    redirects: RedirectListItem[];
    onDelete(redirect: RedirectListItem): Promise<void>;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
}
export {};
//# sourceMappingURL=RedirectsIndexPage.d.ts.map