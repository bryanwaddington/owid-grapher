/// <reference types="lodash" />
import { RelatedChart, CategoryWithEntries, PageType, FullPost, WP_PostType, DocumentNode, PostReference } from "../clientUtils/owidTypes";
export declare const isWordpressAPIEnabled: boolean;
export declare const isWordpressDBEnabled: boolean;
declare class WPDB {
    private conn?;
    private knex;
    private destroyKnex;
    connect(): Promise<void>;
    end(): Promise<void>;
    query(queryStr: string, params?: any[]): Promise<any[]>;
    get(queryStr: string, params?: any[]): Promise<any>;
}
export declare const singleton: WPDB;
export declare const ENTRIES_CATEGORY_ID = 44;
export declare const getAuthorship: () => Promise<Map<number, string[]>>;
export declare const getTagsByPostId: () => Promise<Map<number, string[]>>;
export declare const getDocumentsInfo: (type: WP_PostType, cursor?: string, where?: string) => Promise<DocumentNode[]>;
export declare const getEntriesByCategory: () => Promise<CategoryWithEntries[]>;
export declare const getPageType: (post: FullPost) => Promise<PageType>;
export declare const getPermalinks: () => Promise<{
    get: (ID: number, postName: string) => string;
}>;
export declare const getFeaturedImages: () => Promise<Map<number, string>>;
export declare const getPosts: (postTypes?: string[], limit?: number | undefined) => Promise<any[]>;
export declare const getPostType: (search: number | string) => Promise<string>;
export declare const getPostBySlug: (slug: string) => Promise<any[]>;
export declare const getLatestPostRevision: (id: number) => Promise<any>;
export declare const getRelatedCharts: (postId: number) => Promise<RelatedChart[]>;
export declare const getRelatedArticles: (chartSlug: string) => Promise<PostReference[] | undefined>;
export declare const getBlockContent: (id: number) => Promise<string | undefined>;
export declare const getFullPost: (postApi: any, excludeContent?: boolean | undefined) => Promise<FullPost>;
export declare const getBlogIndex: (() => Promise<FullPost[]>) & import("lodash").MemoizedFunction;
interface TablepressTable {
    tableId: string;
    data: string[][];
}
export declare const getTables: () => Promise<Map<string, TablepressTable>>;
export declare const flushCache: () => void;
export {};
//# sourceMappingURL=wpdb.d.ts.map