import { LegacyGrapherInterface } from "../core/GrapherInterface";
import { LegacyVariablesAndEntityKey, LegacyChartDimensionInterface } from "./LegacyVariableCode";
import { OwidTable } from "../../coreTable/OwidTable";
export declare const legacyToOwidTableAndDimensions: (json: LegacyVariablesAndEntityKey, grapherConfig: Partial<LegacyGrapherInterface>) => {
    dimensions: LegacyChartDimensionInterface[];
    table: OwidTable;
};
//# sourceMappingURL=LegacyToOwidTable.d.ts.map