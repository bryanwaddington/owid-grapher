import * as React from "react";
import { AdminAppContextType } from "./AdminAppContext";
interface Post {
    id: number;
    title: string;
    slug: string;
    publishedAt?: string;
    updatedAt: string;
    content: string;
}
export declare class PostEditorPage extends React.Component<{
    postId?: number;
}> {
    static contextType: React.Context<AdminAppContextType>;
    context: AdminAppContextType;
    post?: Post;
    fetchPost(): Promise<void>;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=PostEditorPage.d.ts.map