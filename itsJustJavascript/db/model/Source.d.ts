import { BaseEntity } from "typeorm";
export declare class Source extends BaseEntity {
    id: number;
    datasetId: number;
    name: string;
    description: any;
    toDatapackage(): any;
}
//# sourceMappingURL=Source.d.ts.map