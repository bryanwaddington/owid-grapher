import { SerializedGridProgram } from "../clientUtils/owidTypes";
import { ColumnSlug, SortOrder } from "../coreTable/CoreTableConstants";
import { GrapherQueryParams } from "../grapher/core/GrapherInterface";
export declare enum ExplorerControlType {
    Radio = "Radio",
    Checkbox = "Checkbox",
    Dropdown = "Dropdown"
}
export declare const DefaultNewExplorerSlug = "new";
export declare const ExplorerControlTypeRegex: RegExp;
export interface ExplorerChoice {
    title: string;
    displayTitle?: string;
    options: ExplorerChoiceOption[];
    value: string;
    type: ExplorerControlType;
}
export interface ExplorerChoiceOption {
    label: string;
    available: boolean;
    value: string;
    checked?: boolean;
}
export declare type ChoiceName = string;
export declare type ChoiceValue = string;
export interface ExplorerChoiceParams {
    [choiceName: string]: ChoiceValue;
}
export interface ChoiceMap {
    [choiceName: string]: ChoiceValue[];
}
/** Query params available in all explorers */
export interface ExplorerStandardQueryParams extends GrapherQueryParams {
    pickerSort?: SortOrder;
    pickerMetric?: ColumnSlug;
    hideControls?: string;
}
export declare type ExplorerFullQueryParams = ExplorerStandardQueryParams & ExplorerChoiceParams;
export declare const UNSAVED_EXPLORER_DRAFT = "UNSAVED_EXPLORER_DRAFT";
export declare const UNSAVED_EXPLORER_PREVIEW_QUERYPARAMS = "UNSAVED_EXPLORER_PREVIEW_QUERYPARAMS";
export declare const EMBEDDED_EXPLORER_DELIMITER = "\n//EMBEDDED_EXPLORER\n";
export declare const EMBEDDED_EXPLORER_GRAPHER_CONFIGS = "\n//EMBEDDED_EXPLORER_GRAPHER_CONFIGS\n";
export declare const EXPLORER_EMBEDDED_FIGURE_SELECTOR = "data-explorer-src";
export declare const ExplorerContainerId = "ExplorerContainer";
export declare const GetAllExplorersRoute = "allExplorers.json";
export declare const EXPLORERS_ROUTE_FOLDER = "explorers";
export declare const EXPLORERS_GIT_CMS_FOLDER = "explorers";
export declare const EXPLORERS_PREVIEW_ROUTE: string;
export interface ExplorersRouteResponse {
    success: boolean;
    errorMessage?: string;
    needsPull: boolean;
    gitCmsBranchName: string;
    explorers: SerializedGridProgram[];
}
//# sourceMappingURL=ExplorerConstants.d.ts.map