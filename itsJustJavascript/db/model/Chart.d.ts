import { BaseEntity } from "typeorm";
import { User } from "./User";
import { ChartRevision } from "./ChartRevision";
export declare class Chart extends BaseEntity {
    id: number;
    config: any;
    lastEditedAt: Date;
    lastEditedByUserId: number;
    publishedAt: Date;
    publishedByUserId: number;
    createdAt: Date;
    updatedAt: Date;
    starred: boolean;
    isExplorable: boolean;
    lastEditedByUser: User;
    publishedByUser: User;
    logs: ChartRevision[];
    static table: string;
    static mapSlugsToIds(): Promise<{
        [slug: string]: number;
    }>;
    static getBySlug(slug: string): Promise<Chart | undefined>;
    static setTags(chartId: number, tagIds: number[]): Promise<void>;
    static assignTagsForCharts(charts: {
        id: number;
        tags: any[];
    }[]): Promise<void>;
    static all(): Promise<ChartRow[]>;
}
interface ChartRow {
    id: number;
    config: any;
}
export declare class OldChart {
    static listFields: string;
    static getBySlug(slug: string): Promise<OldChart>;
    id: number;
    config: any;
    constructor(id: number, config: any);
    getVariableData(): Promise<any>;
}
export declare const getGrapherById: (grapherId: number) => Promise<any>;
export {};
//# sourceMappingURL=Chart.d.ts.map