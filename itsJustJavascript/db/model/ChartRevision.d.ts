import { BaseEntity } from "typeorm";
import { Chart } from "./Chart";
import { User } from "./User";
export declare class ChartRevision extends BaseEntity {
    id: number;
    chartId: number;
    config: any;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    chart: Chart;
}
//# sourceMappingURL=ChartRevision.d.ts.map