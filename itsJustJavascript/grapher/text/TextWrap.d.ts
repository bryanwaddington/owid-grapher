/// <reference types="react" />
declare type FontSize = number;
interface TextWrapProps {
    text: string;
    maxWidth: number;
    lineHeight?: number;
    fontSize: FontSize;
    fontWeight?: number;
    rawHtml?: boolean;
    /** Wrap URL-like text in <a> tag. Only works when rendering HTML. */
    linkifyText?: boolean;
}
interface WrapLine {
    text: string;
    width: number;
    height: number;
}
export declare class TextWrap {
    props: TextWrapProps;
    constructor(props: TextWrapProps);
    get maxWidth(): number;
    get lineHeight(): number;
    get fontSize(): FontSize;
    get fontWeight(): number | undefined;
    get text(): string;
    get lines(): WrapLine[];
    get height(): number;
    get width(): number;
    get htmlStyle(): any;
    renderHTML(): JSX.Element | null;
    render(x: number, y: number, options?: any): JSX.Element | null;
}
export {};
//# sourceMappingURL=TextWrap.d.ts.map