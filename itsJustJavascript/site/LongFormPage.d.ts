/// <reference types="react" />
import { FormattedPost, FormattingOptions, PageType } from "../clientUtils/owidTypes";
export interface PageOverrides {
    pageTitle?: string;
    citationTitle?: string;
    citationSlug?: string;
    citationCanonicalUrl?: string;
    citationAuthors?: string[];
    publicationDate?: Date;
    canonicalUrl?: string;
    excerpt?: string;
}
export declare const LongFormPage: (props: {
    pageType: PageType;
    post: FormattedPost;
    overrides?: PageOverrides;
    formattingOptions: FormattingOptions;
    baseUrl: string;
}) => JSX.Element;
//# sourceMappingURL=LongFormPage.d.ts.map