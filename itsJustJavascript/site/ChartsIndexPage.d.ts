/// <reference types="react" />
export interface ChartIndexItem {
    id: number;
    title: string;
    slug: string;
    variantName?: string;
    tags: {
        id: number;
        name: string;
    }[];
}
export interface TagWithCharts {
    id: number;
    name: string;
    charts: ChartIndexItem[];
}
export declare const ChartsIndexPage: (props: {
    chartItems: ChartIndexItem[];
    baseUrl: string;
}) => JSX.Element;
//# sourceMappingURL=ChartsIndexPage.d.ts.map