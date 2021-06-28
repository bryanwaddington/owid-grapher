import { CoreColumnStore } from "./CoreTableConstants";
import { CoreColumnDef } from "./CoreColumnDef";
import { ErrorValue, MissingValuePlaceholder } from "./ErrorValues";
export declare const insertMissingValuePlaceholders: (values: number[], times: number[]) => (number | MissingValuePlaceholder)[];
export declare function computeRollingAverage(numbers: (number | undefined | null | ErrorValue)[], windowSize: number, align?: "right" | "center"): (number | ErrorValue)[];
export declare const AvailableTransforms: string[];
export declare const applyTransforms: (columnStore: CoreColumnStore, defs: CoreColumnDef[]) => CoreColumnStore;
//# sourceMappingURL=Transforms.d.ts.map