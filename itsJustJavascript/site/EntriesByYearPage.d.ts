/// <reference types="react" />
import { PostRow } from "../clientUtils/owidTypes";
declare type Entry = Pick<PostRow, "title" | "slug" | "published_at">;
export declare const EntriesByYearPage: (props: {
    entries: Entry[];
    baseUrl: string;
}) => JSX.Element;
export declare const EntriesForYearPage: (props: {
    entries: Entry[];
    year: number;
    baseUrl: string;
}) => JSX.Element;
export {};
//# sourceMappingURL=EntriesByYearPage.d.ts.map