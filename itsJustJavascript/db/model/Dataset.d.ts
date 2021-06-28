/// <reference types="node" />
import { BaseEntity } from "typeorm";
import { Writable } from "stream";
import { User } from "./User";
export declare class Dataset extends BaseEntity {
    id: number;
    name: string;
    namespace: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    metadataEditedAt: Date;
    metadataEditedByUserId: number;
    dataEditedAt: Date;
    dataEditedByUserId: number;
    isPrivate: boolean;
    createdByUser: User;
    static writeCSV(datasetId: number, stream: Writable): Promise<void>;
    static setTags(datasetId: number, tagIds: number[]): Promise<void>;
    toCSV(): Promise<string>;
    get filename(): string;
    get slug(): string;
    toDatapackage(): Promise<any>;
}
//# sourceMappingURL=Dataset.d.ts.map