"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnGrammar = void 0;
const CoreColumnDef_1 = require("../coreTable/CoreColumnDef");
const Transforms_1 = require("../coreTable/Transforms");
const BinningStrategy_1 = require("../grapher/color/BinningStrategy");
const ColorConstants_1 = require("../grapher/color/ColorConstants");
const GridLangConstants_1 = require("../gridLang/GridLangConstants");
exports.ColumnGrammar = {
    slug: Object.assign(Object.assign({}, GridLangConstants_1.SlugDeclarationCellDef), { keyword: "slug" }),
    name: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "name", description: "This is the name that may appear on the y or x axis of a chart" }),
    type: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "type", description: `The column type reveals how to interpret the data, whether as a string or number for example, and how to display it, like whether to show a % or $.`, terminalOptions: Object.values(CoreColumnDef_1.ColumnTypeNames).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })) }),
    transform: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "transform", description: `An advanced option. Available transforms are: ${Transforms_1.AvailableTransforms.join(", ")}` }),
    tolerance: Object.assign(Object.assign({}, GridLangConstants_1.IntegerCellDef), { keyword: "tolerance", description: "Set this to interpolate missing values as long as they are within this range of an actual value." }),
    description: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "description", description: "Describe the column" }),
    unit: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "unit", description: "Unit of measurement" }),
    shortUnit: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "shortUnit", description: "Short (axis) unit" }),
    notes: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "notes", description: "Any internal notes." }),
    annotationsColumnSlug: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "annotationsColumnSlug", description: "Column that contains the annotations for this column, if any." }),
    sourceName: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "sourceName", description: "Source name displayed on charts using this dataset. For academic papers, the name of the source should be 'Authors (year)' e.g. Arroyo-Abad and Lindert (2016). For institutional projects or reports, the name should be 'Institution, Project (year or vintage)' e.g. U.S. Bureau of Labor Statistics, Consumer Expenditure Survey (2015 release). For data that we have modified extensively, the name should be 'Our World in Data based on Author (year)' e.g. Our World in Data based on Atkinson (2002) and Sen (2000)." }),
    sourceLink: Object.assign(Object.assign({}, GridLangConstants_1.UrlCellDef), { keyword: "sourceLink", description: "Link to the publication from which we retrieved this data" }),
    dataPublishedBy: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "dataPublishedBy", description: "For academic papers this should be a complete reference. For institutional projects, detail the project or report. For data we have modified extensively, list OWID as the publishers and provide the name of the person in charge of the calculation." }),
    dataPublisherSource: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "dataPublisherSource", description: "Basic indication of how the publisher collected this data e.g. surveys data. Anything longer than a line should go in the dataset description." }),
    retrievedDate: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "retrievedDate", description: "Date when this data was obtained by us" }),
    additionalInfo: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "additionalInfo", description: "Describe the dataset and the methodology used in its construction. This can be as long and detailed as you like." }),
    color: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "color", description: "Default color for column" }),
    colorScaleScheme: Object.assign(Object.assign({}, GridLangConstants_1.EnumCellDef), { keyword: "colorScaleScheme", terminalOptions: Object.values(ColorConstants_1.ColorSchemeName).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })), description: "The color scheme to use" }),
    colorScaleInvert: Object.assign(Object.assign({}, GridLangConstants_1.BooleanCellDef), { keyword: "colorScaleInvert", description: "Invert the color scale?" }),
    colorScaleBinningStrategy: Object.assign(Object.assign({}, GridLangConstants_1.EnumCellDef), { keyword: "colorScaleBinningStrategy", terminalOptions: Object.values(BinningStrategy_1.BinningStrategy).map((keyword) => ({
            keyword,
            description: "",
            cssClass: "",
        })), description: "The binning strategy to use" }),
    colorScaleNoDataLabel: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "colorScaleNoDataLabel", description: "Custom label for the 'No data' bin" }),
    colorScaleLegendDescription: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "colorScaleLegendDescription", description: "Legend title for ScatterPlot" }),
    colorScaleEqualSizeBins: Object.assign(Object.assign({}, GridLangConstants_1.BooleanCellDef), { keyword: "colorScaleEqualSizeBins", description: "Disable visual scaling of the bins based on values?" }),
    colorScaleNumericMinValue: Object.assign(Object.assign({}, GridLangConstants_1.NumericCellDef), { keyword: "colorScaleNumericMinValue", description: "Minimum value of the first bin (leaving blank will infer the minimum from the data)" }),
    colorScaleNumericBins: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "colorScaleNumericBins", description: [
            "Custom numeric bins",
            "  Format: [binMax],[color],[label]; [binMax],[color],[label]; ...",
            "  Example: 0.1,#ccc,example label; 0.2,,; 0.3,,prev has no label",
        ].join("\n") }),
    colorScaleCategoricalBins: Object.assign(Object.assign({}, GridLangConstants_1.StringCellDef), { keyword: "colorScaleCategoricalBins", description: [
            "Custom categorical bins",
            "  Format: [data value],[color],[label]; [data value],[color],[label]; ...",
            "  Example: one,#ccc,uno; two,,dos",
        ].join("\n") }),
};
//# sourceMappingURL=ColumnGrammar.js.map