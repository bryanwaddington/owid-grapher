import { TimeRange } from "./CoreTableConstants";
import { LegacyVariableDisplayConfigInterface } from "../clientUtils/LegacyVariableDisplayConfigInterface";
import { OwidTable } from "./OwidTable";
import { OwidColumnDef } from "./OwidTableConstants";
interface SynthOptions {
    entityCount: number;
    entityNames: string[];
    timeRange: TimeRange;
    columnDefs: OwidColumnDef[];
}
export declare const SynthesizeNonCountryTable: (options?: Partial<SynthOptions> | undefined, seed?: number) => OwidTable;
export declare enum SampleColumnSlugs {
    Population = "Population",
    GDP = "GDP",
    LifeExpectancy = "LifeExpectancy",
    Fruit = "Fruit",
    Vegetables = "Vegetables",
    Disasters = "Disasters"
}
export declare const SynthesizeGDPTable: (options?: Partial<SynthOptions> | undefined, seed?: number, display?: LegacyVariableDisplayConfigInterface | undefined) => OwidTable;
export declare const SynthesizeFruitTable: (options?: Partial<SynthOptions> | undefined, seed?: number) => OwidTable;
export declare const SynthesizeFruitTableWithNonPositives: (options?: Partial<SynthOptions> | undefined, howManyNonPositives?: number, seed?: number) => OwidTable;
export declare const SynthesizeFruitTableWithStringValues: (options?: Partial<SynthOptions> | undefined, howMany?: number, seed?: number) => OwidTable;
export {};
//# sourceMappingURL=OwidTableSynthesizers.d.ts.map