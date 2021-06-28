import { BaseEntity } from "typeorm";
import { Chart } from "./Chart";
import { Dataset } from "./Dataset";
import { ChartRevision } from "./ChartRevision";
export declare class User extends BaseEntity {
    id: number;
    email: string;
    password: string;
    fullName: string;
    isActive: boolean;
    isSuperuser: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;
    lastSeen: Date;
    lastEditedCharts: Chart[];
    publishedCharts: Chart[];
    editedCharts: ChartRevision[];
    createdDatasets: Dataset[];
    setPassword(password: string): Promise<void>;
}
//# sourceMappingURL=User.d.ts.map