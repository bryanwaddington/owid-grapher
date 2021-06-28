import * as React from "react";
interface TextProps extends React.SVGProps<SVGTextElement> {
    x: number;
    y: number;
    fontSize: number;
    children: string;
}
export declare class Text extends React.Component<TextProps> {
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Text.d.ts.map