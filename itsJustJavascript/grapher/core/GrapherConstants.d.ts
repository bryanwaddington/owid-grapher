import { Color } from "../../coreTable/CoreTableConstants";
export declare enum ChartTypeName {
    LineChart = "LineChart",
    ScatterPlot = "ScatterPlot",
    TimeScatter = "TimeScatter",
    StackedArea = "StackedArea",
    DiscreteBar = "DiscreteBar",
    StackedDiscreteBar = "StackedDiscreteBar",
    SlopeChart = "SlopeChart",
    StackedBar = "StackedBar",
    WorldMap = "WorldMap"
}
export declare const GRAPHER_EMBEDDED_FIGURE_ATTR = "data-grapher-src";
export declare const GRAPHER_PAGE_BODY_CLASS = "StandaloneGrapherOrExplorerPage";
export declare const GRAPHER_IS_IN_IFRAME_CLASS = "IsInIframe";
export declare enum CookieKey {
    isAdmin = "isAdmin"
}
export declare enum EntitySelectionMode {
    MultipleEntities = "add-country",
    SingleEntity = "change-country",
    Disabled = "disabled"
}
export declare enum StackMode {
    absolute = "absolute",
    relative = "relative"
}
export declare const BASE_FONT_SIZE = 16;
export declare enum FacetStrategy {
    country = "country",
    column = "column"
}
export declare enum FacetAxisRange {
    independent = "independent",
    shared = "shared"
}
export declare enum SeriesStrategy {
    column = "column",
    entity = "entity"
}
export declare const ThereWasAProblemLoadingThisChart = "There was a problem loading this chart";
export declare type SeriesColorMap = Map<SeriesName, Color>;
export declare enum GrapherTabOption {
    chart = "chart",
    map = "map",
    sources = "sources",
    download = "download",
    table = "table"
}
export declare enum ScaleType {
    linear = "linear",
    log = "log"
}
export interface HighlightToggleConfig {
    description: string;
    paramStr: string;
}
export interface RelatedQuestionsConfig {
    text: string;
    url: string;
}
export declare const WorldEntityName = "World";
export declare enum ScatterPointLabelStrategy {
    year = "year",
    x = "x",
    y = "y"
}
export declare enum DimensionProperty {
    y = "y",
    x = "x",
    size = "size",
    color = "color",
    table = "table"
}
export interface EntitySelection {
    entityId: number;
    index: number;
    color?: string;
}
export declare type SeriesName = string;
//# sourceMappingURL=GrapherConstants.d.ts.map