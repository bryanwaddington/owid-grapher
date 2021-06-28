/// <reference types="react" />
interface TableOfContentsData {
    headings: {
        isSubheading: boolean;
        slug: string;
        text: string;
    }[];
    pageTitle: string;
    hideSubheadings?: boolean;
}
export declare const TableOfContents: ({ headings, pageTitle, hideSubheadings, }: TableOfContentsData) => JSX.Element;
export declare const runTableOfContents: (tocData: TableOfContentsData) => void;
export {};
//# sourceMappingURL=TableOfContents.d.ts.map