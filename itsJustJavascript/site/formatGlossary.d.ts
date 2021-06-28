/// <reference types="react" />
/// <reference types="cheerio" />
import { GlossaryItem } from "./glossary";
export declare const FORBIDDEN_TAGS: string[];
export declare const GlossaryLink: ({ slug, excerpt, match, }: {
    slug: string;
    excerpt: string;
    match: string;
}) => JSX.Element;
export declare const formatGlossaryTerms: ($: CheerioStatic, $contents: Cheerio, mutableGlossary: GlossaryItem[]) => void;
export declare const _linkGlossaryTermsInText: (srcText: string | undefined, glossary: GlossaryItem[]) => string;
//# sourceMappingURL=formatGlossary.d.ts.map