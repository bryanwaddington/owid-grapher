import * as db from "../db/db";
export declare function removeDatasetFromGitRepo(datasetName: string, namespace: string, options?: {
    commitName?: string;
    commitEmail?: string;
}): Promise<void>;
export declare function syncDatasetToGitRepo(datasetId: number, options?: {
    transaction?: db.TransactionContext;
    oldDatasetName?: string;
    commitName?: string;
    commitEmail?: string;
    commitOnly?: boolean;
}): Promise<void>;
//# sourceMappingURL=gitDataExport.d.ts.map