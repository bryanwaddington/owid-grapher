/// <reference types="cheerio" />
import { DataValueConfiguration, DataValueQueryArgs, FormattedPost, FormattingOptions, KeyValueProps } from "../clientUtils/owidTypes";
import { Country } from "../clientUtils/countries";
export declare const DEEP_LINK_CLASS = "deep-link";
export declare const formatLinks: (html: string) => string;
export declare const getHtmlContentWithStyles: (cheerEl: CheerioStatic) => string;
export declare const extractFormattingOptions: (html: string) => FormattingOptions;
export declare const parseFormattingOptions: (text: string) => FormattingOptions;
export declare const dataValueRegex: RegExp;
export declare const extractDataValuesConfiguration: (html: string) => Promise<Map<string, DataValueConfiguration>>;
export declare const parseDataValueArgs: (rawArgsString: string) => DataValueQueryArgs;
export declare const parseKeyValueArgs: (text: string) => KeyValueProps;
export declare const formatCountryProfile: (post: FormattedPost, country: Country) => FormattedPost;
//# sourceMappingURL=formatting.d.ts.map