/// <reference types="lodash" />
export interface GlossaryItem {
    term: string;
    slug: string;
    excerpt: string;
}
export interface GlossaryGroup {
    slug: string;
    excerpt: string;
    terms: string[];
}
export declare const getMutableGlossary: (glossary: GlossaryGroup[]) => GlossaryItem[];
export declare const prepareGlossary: ((glossary: GlossaryGroup[]) => GlossaryItem[]) & import("lodash").MemoizedFunction;
export declare const sortGlossary: (glossary: GlossaryItem[]) => GlossaryItem[];
export declare const glossary: GlossaryGroup[];
//# sourceMappingURL=glossary.d.ts.map