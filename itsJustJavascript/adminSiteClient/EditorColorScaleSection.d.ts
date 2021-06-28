import * as React from "react";
import { ColorScale } from "../grapher/color/ColorScale";
interface EditorColorScaleSectionFeatures {
    visualScaling: boolean;
    legendDescription: boolean;
}
export declare class EditorColorScaleSection extends React.Component<{
    scale: ColorScale;
    features: EditorColorScaleSectionFeatures;
}> {
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=EditorColorScaleSection.d.ts.map