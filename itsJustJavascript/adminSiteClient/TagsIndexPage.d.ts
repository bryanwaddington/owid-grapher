import * as React from "react";
import * as lodash from "lodash";
import { AdminAppContextType } from "./AdminAppContext";
interface TagListItem {
    id: number;
    name: string;
    parentId: number;
    specialType?: string;
}
export declare class TagsIndexPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    tags: TagListItem[];
    isAddingTag: boolean;
    addTagParentId?: number;
    get categoriesById(): lodash.Dictionary<TagListItem>;
    get parentCategories(): {
        id: number;
        name: string;
        specialType?: string;
        children: TagListItem[];
    }[];
    onNewTag(parentId?: number): void;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
}
export {};
//# sourceMappingURL=TagsIndexPage.d.ts.map