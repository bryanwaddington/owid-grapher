import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
import { Tag } from "./TagBadge";
interface PostIndexMeta {
    id: number;
    title: string;
    type: string;
    status: string;
    publishedAt: string;
    updatedAt: string;
    excerpt: string;
    slug: string;
    url: string;
    imageUrl: string;
}
interface Searchable {
    post: PostIndexMeta;
    term?: Fuzzysort.Prepared;
}
export declare class NewsletterPage extends React.Component {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    posts: PostIndexMeta[];
    maxVisibleRows: number;
    searchInput?: string;
    availableTags: Tag[];
    get searchIndex(): Searchable[];
    get postsToShow(): PostIndexMeta[];
    get numTotalRows(): number;
    onSearchInput(input: string): void;
    onShowMore(): void;
    render(): JSX.Element;
    getData(): Promise<void>;
    componentDidMount(): void;
}
export {};
//# sourceMappingURL=NewsletterPage.d.ts.map