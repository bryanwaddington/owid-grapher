/// <reference types="react" />
import { GrapherInterface } from "../grapher/core/GrapherInterface";
import { PostReference, PostRow, RelatedChart } from "../clientUtils/owidTypes";
export declare const GrapherPage: (props: {
    grapher: GrapherInterface;
    post?: PostRow;
    relatedCharts?: RelatedChart[];
    relatedArticles?: PostReference[];
    baseUrl: string;
    baseGrapherUrl: string;
}) => JSX.Element;
//# sourceMappingURL=GrapherPage.d.ts.map