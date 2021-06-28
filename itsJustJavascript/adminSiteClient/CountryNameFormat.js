"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryDefByKey = exports.CountryNameFormatDefs = exports.CountryNameFormat = void 0;
const Util_1 = require("../clientUtils/Util");
// export type CountryNameFormatType = 'NonStandardCountryName' | 'OurWorldInDataName' | 'IsoAlpha2' | 'IsoAlpha3' | 'ImfCode' | 'MarcCode' | 'CowLetter' | 'CowCode' | 'UnctadCode' | 'NCDCode' | 'KansasCode' | 'PennCode' | 'ContinentName' | 'ContinentCode'
class CountryNameFormat {
}
exports.CountryNameFormat = CountryNameFormat;
CountryNameFormat.NonStandardCountryName = "NonStandardCountryName";
CountryNameFormat.OurWorldInDataName = "OurWorldInDataName";
CountryNameFormat.IsoAlpha2 = "IsoAlpha2";
CountryNameFormat.IsoAlpha3 = "IsoAlpha3";
CountryNameFormat.ImfCode = "ImfCode";
CountryNameFormat.CowLetter = "CowLetter";
CountryNameFormat.CowCode = "CowCode";
CountryNameFormat.UnctadCode = "UnctadCode";
CountryNameFormat.MarcCode = "MarcCode";
CountryNameFormat.NCDCode = "NCDCode";
CountryNameFormat.KansasCode = "KansasCode";
CountryNameFormat.PennCode = "PennCode";
CountryNameFormat.ContinentName = "ContinentName";
CountryNameFormat.ContinentCode = "ContinentCode";
exports.CountryNameFormatDefs = [
    {
        key: CountryNameFormat.NonStandardCountryName,
        label: "Non-Standard Country Name",
        use_as_input: true,
        use_as_output: false,
    },
    {
        key: CountryNameFormat.OurWorldInDataName,
        label: "Our World In Data Name",
        use_as_input: true,
        column_name: "owid_name",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.IsoAlpha2,
        label: "ISO 3166-1 ALPHA-2 CODE",
        use_as_input: true,
        column_name: "iso_alpha2",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.IsoAlpha3,
        label: "ISO 3166-1 ALPHA-3 CODE",
        use_as_input: true,
        column_name: "iso_alpha3",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.ImfCode,
        label: "IMF code",
        use_as_input: true,
        column_name: "imf_code",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.CowLetter,
        label: "COW Letters",
        use_as_input: true,
        column_name: "cow_letter",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.CowCode,
        label: "COW Codes",
        use_as_input: true,
        column_name: "cow_code",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.UnctadCode,
        label: "Unctad 3-Letter Codes",
        use_as_input: true,
        column_name: "unctad_code",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.MarcCode,
        label: "MARC Codes",
        use_as_input: true,
        column_name: "marc_code",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.NCDCode,
        label: "National Capabilities Codes",
        use_as_input: true,
        column_name: "ncd_code",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.KansasCode,
        label: "Kansas Event Data System, Cameo Country Codes",
        use_as_input: true,
        column_name: "kansas_code",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.PennCode,
        label: "Penn World Table",
        use_as_input: true,
        column_name: "penn_code",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.ContinentName,
        label: "Continent Name",
        use_as_input: false,
        column_name: "continent_name",
        use_as_output: true,
    },
    {
        key: CountryNameFormat.ContinentCode,
        label: "Continent Code",
        use_as_input: false,
        column_name: "continent_code",
        use_as_output: true,
    },
];
exports.CountryDefByKey = Util_1.keyBy(exports.CountryNameFormatDefs, "key");
//# sourceMappingURL=CountryNameFormat.js.map