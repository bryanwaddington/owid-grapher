import { QueryBuilder } from "knex";
import { PostRow } from "../../clientUtils/owidTypes";
export declare namespace Post {
    const table = "posts";
    const select: <K extends keyof PostRow>(...args: K[]) => {
        from: (query: QueryBuilder) => Promise<Pick<PostRow, K>[]>;
    };
    const tagsByPostId: () => Promise<Map<number, {
        id: number;
        name: string;
    }[]>>;
    const setTags: (postId: number, tagIds: number[]) => Promise<void>;
    const bySlug: (slug: string) => Promise<PostRow | undefined>;
}
//# sourceMappingURL=Post.d.ts.map