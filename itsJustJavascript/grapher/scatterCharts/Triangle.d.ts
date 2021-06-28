import * as React from "react";
declare type TriangleProps = Readonly<{
    cx: number;
    cy: number;
    r: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    transform?: string;
}> & React.SVGProps<SVGPolygonElement>;
export declare class Triangle extends React.Component<TriangleProps> {
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Triangle.d.ts.map