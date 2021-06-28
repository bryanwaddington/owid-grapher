"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionProperty = exports.ScatterPointLabelStrategy = exports.WorldEntityName = exports.ScaleType = exports.GrapherTabOption = exports.ThereWasAProblemLoadingThisChart = exports.SeriesStrategy = exports.FacetAxisRange = exports.FacetStrategy = exports.BASE_FONT_SIZE = exports.StackMode = exports.EntitySelectionMode = exports.CookieKey = exports.GRAPHER_IS_IN_IFRAME_CLASS = exports.GRAPHER_PAGE_BODY_CLASS = exports.GRAPHER_EMBEDDED_FIGURE_ATTR = exports.ChartTypeName = void 0;
var ChartTypeName;
(function (ChartTypeName) {
    ChartTypeName["LineChart"] = "LineChart";
    ChartTypeName["ScatterPlot"] = "ScatterPlot";
    ChartTypeName["TimeScatter"] = "TimeScatter";
    ChartTypeName["StackedArea"] = "StackedArea";
    ChartTypeName["DiscreteBar"] = "DiscreteBar";
    ChartTypeName["StackedDiscreteBar"] = "StackedDiscreteBar";
    ChartTypeName["SlopeChart"] = "SlopeChart";
    ChartTypeName["StackedBar"] = "StackedBar";
    ChartTypeName["WorldMap"] = "WorldMap";
})(ChartTypeName = exports.ChartTypeName || (exports.ChartTypeName = {}));
exports.GRAPHER_EMBEDDED_FIGURE_ATTR = "data-grapher-src";
exports.GRAPHER_PAGE_BODY_CLASS = "StandaloneGrapherOrExplorerPage";
exports.GRAPHER_IS_IN_IFRAME_CLASS = "IsInIframe";
var CookieKey;
(function (CookieKey) {
    CookieKey["isAdmin"] = "isAdmin";
})(CookieKey = exports.CookieKey || (exports.CookieKey = {}));
// We currently have the notion of "modes", where you can either select 1 entity, or select multiple entities, or not change the selection at all.
// Todo: can we remove?
var EntitySelectionMode;
(function (EntitySelectionMode) {
    EntitySelectionMode["MultipleEntities"] = "add-country";
    EntitySelectionMode["SingleEntity"] = "change-country";
    EntitySelectionMode["Disabled"] = "disabled";
})(EntitySelectionMode = exports.EntitySelectionMode || (exports.EntitySelectionMode = {}));
var StackMode;
(function (StackMode) {
    StackMode["absolute"] = "absolute";
    StackMode["relative"] = "relative";
})(StackMode = exports.StackMode || (exports.StackMode = {}));
exports.BASE_FONT_SIZE = 16;
var FacetStrategy;
(function (FacetStrategy) {
    FacetStrategy["country"] = "country";
    FacetStrategy["column"] = "column";
})(FacetStrategy = exports.FacetStrategy || (exports.FacetStrategy = {}));
var FacetAxisRange;
(function (FacetAxisRange) {
    FacetAxisRange["independent"] = "independent";
    FacetAxisRange["shared"] = "shared";
})(FacetAxisRange = exports.FacetAxisRange || (exports.FacetAxisRange = {}));
var SeriesStrategy;
(function (SeriesStrategy) {
    SeriesStrategy["column"] = "column";
    SeriesStrategy["entity"] = "entity";
})(SeriesStrategy = exports.SeriesStrategy || (exports.SeriesStrategy = {}));
exports.ThereWasAProblemLoadingThisChart = `There was a problem loading this chart`;
var GrapherTabOption;
(function (GrapherTabOption) {
    GrapherTabOption["chart"] = "chart";
    GrapherTabOption["map"] = "map";
    GrapherTabOption["sources"] = "sources";
    GrapherTabOption["download"] = "download";
    GrapherTabOption["table"] = "table";
})(GrapherTabOption = exports.GrapherTabOption || (exports.GrapherTabOption = {}));
var ScaleType;
(function (ScaleType) {
    ScaleType["linear"] = "linear";
    ScaleType["log"] = "log";
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
exports.WorldEntityName = "World";
// When a user hovers over a connected series line in a ScatterPlot we show
// a label for each point. By default that value will be from the "year" column
// but by changing this option the column used for the x or y axis could be used instead.
var ScatterPointLabelStrategy;
(function (ScatterPointLabelStrategy) {
    ScatterPointLabelStrategy["year"] = "year";
    ScatterPointLabelStrategy["x"] = "x";
    ScatterPointLabelStrategy["y"] = "y";
})(ScatterPointLabelStrategy = exports.ScatterPointLabelStrategy || (exports.ScatterPointLabelStrategy = {}));
var DimensionProperty;
(function (DimensionProperty) {
    DimensionProperty["y"] = "y";
    DimensionProperty["x"] = "x";
    DimensionProperty["size"] = "size";
    DimensionProperty["color"] = "color";
    DimensionProperty["table"] = "table";
})(DimensionProperty = exports.DimensionProperty || (exports.DimensionProperty = {}));
//# sourceMappingURL=GrapherConstants.js.map