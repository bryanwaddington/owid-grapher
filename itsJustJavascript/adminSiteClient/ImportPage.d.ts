import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
interface ImportPageData {
    datasets: {
        id: number;
        name: string;
    }[];
    tags: {
        id: number;
        name: string;
        parent: string;
    }[];
    existingEntities: string[];
}
export declare class ImportPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    importData?: ImportPageData;
    getData(): Promise<void>;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=ImportPage.d.ts.map