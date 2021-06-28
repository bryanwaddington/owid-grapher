/// <reference types="node" />
import { Writable } from "stream";
import { LegacyVariableDisplayConfigInterface } from "../../clientUtils/LegacyVariableDisplayConfigInterface";
import { DataValueQueryArgs, DataValueResult } from "../../clientUtils/owidTypes";
export declare namespace Variable {
    interface Row {
        id: number;
        name: string;
        unit: string;
        description: string;
        columnOrder: number;
        display: LegacyVariableDisplayConfigInterface;
    }
    type Field = keyof Row;
    const table = "variables";
    function rows(plainRows: any): Variable.Row[];
}
export declare function getVariableData(variableIds: number[]): Promise<any>;
export declare function writeVariableCSV(variableIds: number[], stream: Writable): Promise<void>;
export declare const getDataValue: ({ variableId, entityId, year, }: DataValueQueryArgs) => Promise<DataValueResult | undefined>;
//# sourceMappingURL=Variable.d.ts.map