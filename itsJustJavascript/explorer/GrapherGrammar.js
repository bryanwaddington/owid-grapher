"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrapherGrammar = void 0;
const GridLangConstants_1 = require("../gridLang/GridLangConstants");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const ColorSchemes_1 = require("../grapher/color/ColorSchemes");
exports.GrapherGrammar = {
    title: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "title", description: "Chart title", valuePlaceholder: "Life Expectancy around the world." }),
    subtitle: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "subtitle", description: "Chart subtitle", valuePlaceholder: "Life Expectancy has risen over time." }),
    ySlugs: Object.assign(Object.assign({}, GridLangConstants_1.SlugsDeclarationCellDef), { description: "ColumnSlug(s) for the yAxis", keyword: "ySlugs" }),
    type: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "type", description: `The type of chart to show such as LineChart or ScatterPlot.`, terminalOptions: Object.values(GrapherConstants_1.ChartTypeName).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })) }),
    grapherId: Object.assign(Object.assign({}, GridLangConstants_1.IntegerCellDef), { description: "ID of a legacy Grapher to load", keyword: "grapherId" }),
    tableSlug: Object.assign(Object.assign({}, GridLangConstants_1.SlugDeclarationCellDef), { description: "Slug of the table to use.", keyword: "tableSlug" }),
    hasMapTab: Object.assign(Object.assign({}, GridLangConstants_1.BooleanCellDef), { keyword: "hasMapTab", description: "Show the map tab?" }),
    tab: Object.assign(Object.assign({}, GridLangConstants_1.EnumCellDef), { keyword: "tab", description: "Which tab to show by default", terminalOptions: Object.values(GrapherConstants_1.GrapherTabOption).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })) }),
    hasChartTab: Object.assign(Object.assign({}, GridLangConstants_1.BooleanCellDef), { keyword: "hasChartTab", description: "Show the chart tab?" }),
    xSlug: Object.assign(Object.assign({}, GridLangConstants_1.SlugDeclarationCellDef), { description: "ColumnSlug for the xAxis", keyword: "xSlug" }),
    colorSlug: Object.assign(Object.assign({}, GridLangConstants_1.SlugDeclarationCellDef), { description: "ColumnSlug for the color", keyword: "colorSlug" }),
    sizeSlug: Object.assign(Object.assign({}, GridLangConstants_1.SlugDeclarationCellDef), { description: "ColumnSlug for the size of points on scatters", keyword: "sizeSlug" }),
    tableSlugs: Object.assign(Object.assign({}, GridLangConstants_1.SlugsDeclarationCellDef), { description: "ColumnSlug(s) for the Table tab. If not specified all active slugs will be used.", keyword: "tableSlugs" }),
    sourceDesc: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "sourceDesc", description: "Short comma-separated list of source names" }),
    facet: Object.assign(Object.assign({}, GridLangConstants_1.EnumCellDef), { description: "Facet by column or entities", keyword: "facet", terminalOptions: Object.values(GrapherConstants_1.FacetStrategy).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })) }),
    hideTitleAnnotation: Object.assign(Object.assign({}, GridLangConstants_1.BooleanCellDef), { description: "Hide automatic time/entity", keyword: "hideTitleAnnotation" }),
    backgroundSeriesLimit: Object.assign(Object.assign({}, GridLangConstants_1.IntegerCellDef), { description: "Set this to limit the number of background series shown on ScatterPlots.", keyword: "backgroundSeriesLimit" }),
    yScaleToggle: Object.assign(Object.assign({}, GridLangConstants_1.BooleanCellDef), { keyword: "yScaleToggle", description: "Set to 'true' if the user can change the yAxis" }),
    yAxisMin: Object.assign(Object.assign({}, GridLangConstants_1.NumericCellDef), { keyword: "yAxisMin", description: "Set the minimum value for the yAxis" }),
    facetYRange: Object.assign(Object.assign({}, GridLangConstants_1.EnumCellDef), { keyword: "facetYRange", description: "Whether facets axes default to shared or independent range", terminalOptions: Object.keys(GrapherConstants_1.FacetAxisRange).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })) }),
    baseColorScheme: Object.assign(Object.assign({}, GridLangConstants_1.EnumCellDef), { keyword: "baseColorScheme", description: "The default color scheme if no color overrides are specified", terminalOptions: Object.keys(ColorSchemes_1.ColorSchemes).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })) }),
    note: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "note", description: "Chart footnote" }),
};
//# sourceMappingURL=GrapherGrammar.js.map