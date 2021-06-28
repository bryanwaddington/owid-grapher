export declare const EPOCH_DATE = "2020-01-21";
export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare type Integer = number;
export declare enum SortOrder {
    asc = "asc",
    desc = "desc"
}
export declare type Year = Integer;
export declare type Color = string;
/**
 * A concrete point in time (year or date). It's always supposed to be a finite number, but we
 * cannot enforce this in TypeScript.
 */
export declare type Time = Integer;
export declare type TimeRange = [Time, Time];
export declare type PrimitiveType = number | string | boolean;
export declare type ValueRange = [number, number];
export declare enum ScaleType {
    linear = "linear",
    log = "log"
}
export interface RelatedChart {
    title: string;
    slug: string;
    variantName?: string | null;
}
export declare type LegacyVariableId = Integer;
export interface FormattedPost {
    id: number;
    postId?: number;
    type: WP_PostType;
    slug: string;
    path: string;
    title: string;
    subtitle?: string | null;
    supertitle?: string | null;
    date: Date;
    modifiedDate: Date;
    lastUpdated?: string | null;
    authors: string[];
    byline?: string | null;
    info?: string | null;
    html: string;
    footnotes: string[];
    references: Record<string, unknown>[];
    excerpt: string;
    imageUrl?: string;
    tocHeadings: {
        text: string;
        slug: string;
        isSubheading: boolean;
    }[];
    relatedCharts?: RelatedChart[];
}
export declare enum SubNavId {
    about = "about",
    biodiversity = "biodiversity",
    coronavirus = "coronavirus",
    co2 = "co2",
    energy = "energy",
    forests = "forests"
}
export interface FormattingOptions {
    toc?: boolean;
    hideAuthors?: boolean;
    bodyClassName?: string;
    subnavId?: SubNavId;
    subnavCurrentId?: string;
    raw?: boolean;
    hideDonateFooter?: boolean;
    footnotes?: boolean;
}
export interface KeyValueProps {
    [key: string]: string | boolean | undefined;
}
export interface DataValueQueryArgs {
    variableId?: number;
    entityId?: number;
    year?: number;
}
export interface DataValueConfiguration {
    queryArgs: DataValueQueryArgs;
    template: string;
}
export interface DataValueResult {
    value: number;
    year: number;
    unit?: string;
    entityName: string;
}
export interface DataValueProps extends DataValueResult {
    template: string;
}
export interface GitCommit {
    author_email: string;
    author_name: string;
    body: string;
    date: string;
    hash: string;
    message: string;
}
export interface SerializedGridProgram {
    slug: string;
    program: string;
    lastCommit?: GitCommit;
}
export interface TocHeading {
    text: string;
    html?: string;
    slug: string;
    isSubheading: boolean;
}
export interface PostRow {
    id: number;
    title: string;
    slug: string;
    type: WP_PostType;
    status: string;
    content: string;
    published_at: Date | null;
    updated_at: Date;
}
export interface EntryMeta {
    slug: string;
    title: string;
    excerpt: string;
    kpi: string;
}
export interface CategoryWithEntries {
    name: string;
    slug: string;
    entries: EntryMeta[];
    subcategories: CategoryWithEntries[];
}
export declare enum WP_PostType {
    Post = "post",
    Page = "page"
}
export declare enum PageType {
    Entry = "ENTRY",
    SubEntry = "SUBENTRY",
    Standard = "STANDARD"
}
export interface EntryNode {
    slug: string;
    title: string;
    excerpt: string | null;
    kpi: string;
}
export interface DocumentNode {
    id: number;
    title: string;
    slug: string;
    content: string | null;
}
export interface CategoryNode {
    name: string;
    slug: string;
    pages: any;
    children: any;
}
export interface PostReference {
    id: number;
    title: string;
    slug: string;
}
export interface FullPost {
    id: number;
    type: WP_PostType;
    slug: string;
    path: string;
    title: string;
    subtitle?: string;
    date: Date;
    modifiedDate: Date;
    authors: string[];
    content: string;
    excerpt?: string;
    imageUrl?: string;
    postId?: number;
    relatedCharts?: RelatedChart[];
    glossary: boolean;
}
export declare class JsonError extends Error {
    status: number;
    constructor(message: string, status?: number);
}
export declare enum DeployStatus {
    queued = "queued",
    pending = "pending"
}
export interface DeployChange {
    timeISOString?: string;
    authorName?: string;
    authorEmail?: string;
    message?: string;
}
export interface Deploy {
    status: DeployStatus;
    changes: DeployChange[];
}
export interface Annotation {
    entityName?: string;
    year?: number;
}
//# sourceMappingURL=owidTypes.d.ts.map