"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryStandardizerPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const csv_parse_1 = __importDefault(require("csv-parse"));
const unidecode_1 = __importDefault(require("unidecode"));
const fuzzyset_1 = __importDefault(require("fuzzyset"));
const AdminLayout_1 = require("./AdminLayout");
const Forms_1 = require("./Forms");
const CountryNameFormat_1 = require("../adminSiteClient/CountryNameFormat");
const Util_1 = require("../clientUtils/Util");
const AdminAppContext_1 = require("./AdminAppContext");
const faDownload_1 = require("@fortawesome/free-solid-svg-icons/faDownload");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
class CSV {
    constructor() {
        this.autoMatchedCount = 0;
        this.findSimilarCountries = true;
        this.countryEntriesMap = new Map();
        this.rows = [];
        this.mapCountriesInputToOutput = {};
    }
    get allCountries() {
        const standardNames = Object.values(this.mapCountriesInputToOutput).filter((value) => value !== undefined);
        return Util_1.uniq(Util_1.sortBy(standardNames));
    }
    get countryColumnIndex() {
        const { rows } = this;
        if (rows.length === 0) {
            return -1;
        }
        return rows[0].findIndex((columnName) => columnName.toLowerCase() === "country");
    }
    get showDownloadOption() {
        const { rows, validationError } = this;
        if (rows.length > 0 && validationError === undefined) {
            return true;
        }
        return false;
    }
    get numCountries() {
        return this.rows.length - 1;
    }
    get validationError() {
        const { parseError } = this;
        if (parseError !== undefined) {
            return `Could not parse file (error: ${parseError}). Check if it is a valid CSV file.`;
        }
        const { rows, countryColumnIndex } = this;
        if (rows.length === 0)
            return undefined;
        if (countryColumnIndex < 0) {
            return "Could not find a column name with the header 'Country'";
        }
        return undefined;
    }
    onFileUpload(filename, rows, err, similarityMatch) {
        this.filename = filename;
        if (err) {
            this.parseError = err.message;
            this.rows = [];
        }
        else {
            this.parseError = undefined;
            this.rows = rows;
        }
        this.findSimilarCountries = similarityMatch;
        this.parseCSV();
    }
    onFormatChange(countryMap, findSimilarCountries) {
        this.mapCountriesInputToOutput = countryMap;
        this.findSimilarCountries = findSimilarCountries;
        this.parseCSV();
    }
    parseCSV() {
        const { rows, countryColumnIndex, mapCountriesInputToOutput, findSimilarCountries, } = this;
        if (countryColumnIndex < 0) {
            this.countryEntriesMap = new Map();
            this.autoMatchedCount = 0;
            return;
        }
        const entriesByCountry = new Map();
        const countries = rows
            .slice(1) // remove header row
            .map((row) => unidecode_1.default(row[countryColumnIndex]))
            .filter((country) => country !== "" && country !== undefined); // exclude empty strings
        // for fuzzy-match, use the input and output values as target to improve matching potential
        const inputCountries = Object.keys(mapCountriesInputToOutput).filter((key) => mapCountriesInputToOutput[key] !== undefined);
        const outputCountries = inputCountries.map((key) => mapCountriesInputToOutput[key]);
        const fuzz = fuzzyset_1.default(inputCountries.concat(outputCountries));
        let autoMatched = 0;
        countries.map((country) => {
            const outputCountry = mapCountriesInputToOutput[country.toLowerCase()];
            let approximatedMatches = [];
            if (outputCountry === undefined) {
                if (findSimilarCountries) {
                    approximatedMatches = fuzz
                        .get(country)
                        .map((fuzzyMatch) => mapCountriesInputToOutput[fuzzyMatch[1]] ||
                        fuzzyMatch[1]);
                    approximatedMatches = approximatedMatches.filter((key) => key !== undefined);
                }
            }
            else {
                autoMatched += 1;
            }
            const entry = {
                originalName: country,
                standardizedName: outputCountry || undefined,
                approximatedMatches: approximatedMatches,
                selectedMatch: "",
                customName: "",
            };
            entriesByCountry.set(country, entry);
        });
        this.countryEntriesMap = entriesByCountry;
        this.autoMatchedCount = autoMatched;
    }
}
__decorate([
    mobx_1.observable
], CSV.prototype, "filename", void 0);
__decorate([
    mobx_1.observable
], CSV.prototype, "rows", void 0);
__decorate([
    mobx_1.observable
], CSV.prototype, "countryEntriesMap", void 0);
__decorate([
    mobx_1.observable
], CSV.prototype, "mapCountriesInputToOutput", void 0);
__decorate([
    mobx_1.observable
], CSV.prototype, "autoMatchedCount", void 0);
__decorate([
    mobx_1.observable
], CSV.prototype, "parseError", void 0);
__decorate([
    mobx_1.observable
], CSV.prototype, "findSimilarCountries", void 0);
__decorate([
    mobx_1.computed
], CSV.prototype, "allCountries", null);
__decorate([
    mobx_1.computed
], CSV.prototype, "countryColumnIndex", null);
__decorate([
    mobx_1.computed
], CSV.prototype, "showDownloadOption", null);
__decorate([
    mobx_1.computed
], CSV.prototype, "numCountries", null);
__decorate([
    mobx_1.computed
], CSV.prototype, "validationError", null);
__decorate([
    mobx_1.action.bound
], CSV.prototype, "onFileUpload", null);
__decorate([
    mobx_1.action.bound
], CSV.prototype, "onFormatChange", null);
__decorate([
    mobx_1.action.bound
], CSV.prototype, "parseCSV", null);
let CountryEntryRowRenderer = class CountryEntryRowRenderer extends React.Component {
    get defaultOption() {
        return "Select one";
    }
    get isMatched() {
        const { entry } = this.props;
        if (entry.standardizedName || entry.selectedMatch || entry.customName)
            return true;
        else
            return false;
    }
    get defaultValue() {
        const { entry } = this.props;
        if (entry.selectedMatch !== undefined &&
            entry.selectedMatch.length > 0) {
            return entry.selectedMatch;
        }
        return this.defaultOption;
    }
    onEntrySelected(selectedName) {
        const { entry, onUpdate } = this.props;
        onUpdate(selectedName, entry.originalName, false);
    }
    render() {
        const { entry, allCountries, onUpdate } = this.props;
        const { defaultOption, defaultValue, isMatched } = this;
        const optgroups = [];
        if (entry.approximatedMatches.length > 0) {
            const options = entry.approximatedMatches.map((countryName) => ({
                value: countryName,
                label: countryName,
            }));
            optgroups.push({ title: "Likely matches", options: options });
        }
        optgroups.push({
            title: "All standard names",
            options: allCountries.map((countryName) => ({
                value: countryName,
                label: countryName,
            })),
        });
        return (React.createElement("tr", null,
            React.createElement("td", null,
                React.createElement("span", { style: { color: isMatched ? "black" : "red" } }, entry.originalName)),
            React.createElement("td", null, entry.standardizedName),
            React.createElement("td", null,
                React.createElement(Forms_1.SelectGroupsField, { value: defaultValue, onValue: this.onEntrySelected, options: [
                        { value: defaultOption, label: defaultOption },
                    ], groups: optgroups })),
            React.createElement("td", null,
                React.createElement("input", { type: "text", className: "form-control", value: entry.customName, onChange: (e) => onUpdate(e.currentTarget.value, entry.originalName, true) }))));
    }
};
__decorate([
    mobx_1.observable
], CountryEntryRowRenderer.prototype, "selectedStandardName", void 0);
__decorate([
    mobx_1.computed
], CountryEntryRowRenderer.prototype, "defaultOption", null);
__decorate([
    mobx_1.computed
], CountryEntryRowRenderer.prototype, "isMatched", null);
__decorate([
    mobx_1.computed
], CountryEntryRowRenderer.prototype, "defaultValue", null);
__decorate([
    mobx_1.action.bound
], CountryEntryRowRenderer.prototype, "onEntrySelected", null);
CountryEntryRowRenderer = __decorate([
    mobx_react_1.observer
], CountryEntryRowRenderer);
let CountryStandardizerPage = class CountryStandardizerPage extends React.Component {
    constructor() {
        super(...arguments);
        this.countryList = [];
        this.inputFormat = CountryNameFormat_1.CountryNameFormat.NonStandardCountryName;
        this.outputFormat = CountryNameFormat_1.CountryNameFormat.OurWorldInDataName;
        this.csv = new CSV();
        this.showAllRows = false;
    }
    get shouldSaveSelection() {
        if (this.inputFormat === CountryNameFormat_1.CountryNameFormat.NonStandardCountryName &&
            this.outputFormat === CountryNameFormat_1.CountryNameFormat.OurWorldInDataName) {
            return true;
        }
        return false;
    }
    get displayMatchStatus() {
        const { autoMatchedCount, numCountries, showDownloadOption } = this.csv;
        if (!showDownloadOption)
            return React.createElement("div", null);
        const columnName = CountryNameFormat_1.CountryDefByKey[this.outputFormat].label;
        let text = "";
        let banner = "";
        if (autoMatchedCount === numCountries) {
            banner = "alert-success";
            text = " All countries were auto-matched!";
        }
        else {
            banner = "alert-warning";
            text =
                " Some countries could not be matched. Either select a similar candidate from the dropdown (which will be saved back in the database) or enter a custom name.";
        }
        text +=
            " The file you will download has a new column with the header '" +
                columnName +
                "'.";
        return (React.createElement("div", { className: "alert " + banner, role: "alert" },
            React.createElement("strong", null, "Status:"),
            text));
    }
    onInputFormat(format) {
        this.inputFormat = format;
    }
    onOutputFormat(format) {
        this.outputFormat = format;
    }
    onChooseCSV({ target }) {
        const file = target.files && target.files[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const csv = e.target.result;
            csv_parse_1.default(csv, {
                relax_column_count: true,
                skip_empty_lines: true,
                rtrim: true,
            }, (err, rows) => {
                this.csv.onFileUpload(file.name, rows, err, this.shouldSaveSelection);
            });
        };
        reader.readAsText(file);
    }
    componentDidMount() {
        // Fetch mapping from server when the input or output format changes
        this.dispose = mobx_1.reaction(() => [this.inputFormat, this.outputFormat], () => this.fetchCountryMap());
        this.fetchCountryMap();
    }
    componentWillUnmount() {
        this.dispose();
    }
    fetchCountryMap() {
        return __awaiter(this, void 0, void 0, function* () {
            const { inputFormat, outputFormat } = this;
            const { admin } = this.context;
            const results = yield admin.getJSON(`/api/countries.json?input=${inputFormat}&output=${outputFormat}`);
            mobx_1.runInAction(() => {
                const countryMap = {};
                results.countries.forEach((countryFormat) => {
                    if (countryFormat.input === null)
                        return;
                    countryMap[countryFormat.input.toLowerCase()] = Util_1.toString(countryFormat.output);
                });
                this.csv.onFormatChange(countryMap, this.shouldSaveSelection);
            });
        });
    }
    get csvDataUri() {
        return window.URL.createObjectURL(this.outputCSV);
    }
    get csvFilename() {
        const { csv } = this;
        if (csv.filename === undefined)
            return "";
        return csv.filename.replace(".csv", "_country_standardized.csv");
    }
    get downloadTooltip() {
        const { shouldSaveSelection } = this;
        if (shouldSaveSelection) {
            return "Downloading will save any custom selection for future ease";
        }
        return "";
    }
    get fileUploadLabel() {
        const { csv } = this;
        if (csv === undefined || csv.filename === undefined) {
            return "Choose CSV file";
        }
        return csv.filename;
    }
    get outputCSV() {
        const { csv } = this;
        if (csv === undefined || csv.validationError !== undefined)
            return undefined;
        const columnName = CountryNameFormat_1.CountryDefByKey[this.outputFormat].label;
        const columnIndex = csv.countryColumnIndex + 1;
        const outputRows = [];
        // add a new column with the output country name
        csv.rows.forEach((row, rowIndex) => {
            let columnValue = "";
            if (rowIndex === 0) {
                // Don't map header row
                columnValue = columnName;
            }
            else {
                // prioritize user selected name
                const entry = csv.countryEntriesMap.get(unidecode_1.default(row[csv.countryColumnIndex]));
                if (entry !== undefined) {
                    if (entry.customName !== undefined &&
                        entry.customName.length > 0) {
                        columnValue = entry.customName;
                    }
                    else if (entry.standardizedName !== undefined) {
                        columnValue = entry.standardizedName;
                    }
                    else if (entry.selectedMatch !== undefined &&
                        entry.selectedMatch.length > 0) {
                        columnValue = entry.selectedMatch;
                    }
                }
            }
            const newRow = row.slice(0);
            newRow.splice(columnIndex, 0, columnValue);
            outputRows.push(newRow);
        });
        const strRows = outputRows.map((row) => row.map((val) => Util_1.csvEscape(val)).join(","));
        return new Blob([strRows.join("\n")], { type: "text/csv" });
    }
    onUpdateRow(value, inputCountry, isCustom) {
        const { csv } = this;
        const entry = csv.countryEntriesMap.get(inputCountry);
        console.log("updating " + inputCountry + " with " + value);
        if (isCustom) {
            entry.customName = value === undefined ? "" : value;
        }
        else {
            entry.selectedMatch = value;
        }
    }
    // IE11 compatibility
    onDownload(ev) {
        const { shouldSaveSelection } = this;
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(this.outputCSV, this.csvFilename);
            ev.preventDefault();
        }
        if (shouldSaveSelection) {
            this.onSave();
        }
    }
    onToggleRows() {
        this.showAllRows = !this.showAllRows;
    }
    onSave() {
        const { csv } = this;
        const countries = {};
        let needToSave = false;
        csv.countryEntriesMap.forEach((entry) => {
            // ignore if there was a user entered a new name
            if (entry.customName !== undefined && entry.customName.length > 0) {
                console.log("not saving custom-name for entry " + entry.originalName);
            }
            else if (entry.selectedMatch !== undefined &&
                entry.selectedMatch.length > 0) {
                needToSave = true;
                countries[entry.originalName] = entry.selectedMatch;
            }
        });
        if (needToSave) {
            this.context.admin.requestJSON(`/api/countries`, { countries: countries }, "POST");
        }
    }
    get entriesToShow() {
        if (this.csv === undefined)
            return [];
        const countries = [];
        this.csv.countryEntriesMap.forEach((entry) => {
            if (this.showAllRows) {
                countries.push(entry);
            }
            else if (entry.standardizedName === undefined) {
                countries.push(entry);
            }
        });
        return countries;
    }
    render() {
        const { csv, entriesToShow } = this;
        const { showDownloadOption, validationError } = csv;
        const allowedInputFormats = CountryNameFormat_1.CountryNameFormatDefs.filter((c) => c.use_as_input);
        const allowedOutputFormats = CountryNameFormat_1.CountryNameFormatDefs.filter((c) => c.use_as_output);
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "CountryStandardizer" },
            React.createElement("main", { className: "CountryStandardizerPage" },
                React.createElement("section", null,
                    React.createElement("h3", null, "Country Standardizer Tool"),
                    React.createElement("p", null, "Upload a CSV file with countries. Select the current input and desired output format. The tool will attempt to find a match automatically for all entries. If not, you will be able to select a similar entry or use a new name. After which, you can download the file that has a new column for your output countries."),
                    React.createElement("div", { className: "form-group" },
                        React.createElement("div", { className: "custom-file" },
                            React.createElement("input", { type: "file", className: "custom-file-input", id: "customFile", onChange: this.onChooseCSV }),
                            React.createElement("label", { htmlFor: "customFile", className: "custom-file-label" }, this.fileUploadLabel)),
                        React.createElement("small", { id: "custom-file-help-block", className: "text-muted form-text" }, "Country has to be saved under a column named 'Country'")),
                    React.createElement(Forms_1.SelectField, { label: "Input Format", value: this.inputFormat, onValue: this.onInputFormat, options: allowedInputFormats.map((def) => def.key), optionLabels: allowedInputFormats.map((def) => def.label), helpText: "Choose the current format of the country names. If input format is other than the default, the tool won't attempt to find similar countries when there is no exact match.", "data-step": "1" }),
                    React.createElement(Forms_1.SelectField, { label: "Output Format", value: this.outputFormat, onValue: this.onOutputFormat, options: allowedOutputFormats.map((def) => def.key), optionLabels: allowedOutputFormats.map((def) => def.label), helpText: "Choose the desired format of the country names. If the chosen format is other than OWID name, the tool won't attempt to find similar countries when there is no exact match." }),
                    React.createElement("div", { className: "topbar" },
                        showDownloadOption ? (React.createElement("a", { href: this.csvDataUri, download: this.csvFilename, className: "btn btn-secondary", onClick: this.onDownload, title: this.downloadTooltip },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDownload_1.faDownload }),
                            " ",
                            "Download ",
                            this.csvFilename)) : (React.createElement("button", { className: "btn btn-secondary", disabled: true },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDownload_1.faDownload }),
                            " No file to download (upload a CSV to start)")),
                        React.createElement("label", null,
                            React.createElement("input", { type: "checkbox", checked: this.showAllRows, onChange: this.onToggleRows }),
                            " ",
                            "Show All Rows")),
                    validationError !== undefined ? (React.createElement("div", { className: "alert alert-danger", role: "alert" },
                        React.createElement("strong", null, "CSV Error:"),
                        " ",
                        validationError)) : (React.createElement("div", null)),
                    this.displayMatchStatus),
                React.createElement("div", null,
                    React.createElement("table", { className: "table table-bordered" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Original Name"),
                                React.createElement("th", null, "Standardized Name"),
                                React.createElement("th", null, "Potential Candidates (select below)"),
                                React.createElement("th", null, "Or enter a Custom Name"))),
                        React.createElement("tbody", null, entriesToShow.map((entry, i) => (React.createElement(CountryEntryRowRenderer, { key: i, entry: entry, allCountries: this.csv.allCountries, onUpdate: this.onUpdateRow })))))))));
    }
};
CountryStandardizerPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], CountryStandardizerPage.prototype, "countryList", void 0);
__decorate([
    mobx_1.observable
], CountryStandardizerPage.prototype, "inputFormat", void 0);
__decorate([
    mobx_1.observable
], CountryStandardizerPage.prototype, "outputFormat", void 0);
__decorate([
    mobx_1.observable
], CountryStandardizerPage.prototype, "csv", void 0);
__decorate([
    mobx_1.observable
], CountryStandardizerPage.prototype, "showAllRows", void 0);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "shouldSaveSelection", null);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "displayMatchStatus", null);
__decorate([
    mobx_1.action.bound
], CountryStandardizerPage.prototype, "onInputFormat", null);
__decorate([
    mobx_1.action.bound
], CountryStandardizerPage.prototype, "onOutputFormat", null);
__decorate([
    mobx_1.action.bound
], CountryStandardizerPage.prototype, "onChooseCSV", null);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "csvDataUri", null);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "csvFilename", null);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "downloadTooltip", null);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "fileUploadLabel", null);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "outputCSV", null);
__decorate([
    mobx_1.action.bound
], CountryStandardizerPage.prototype, "onUpdateRow", null);
__decorate([
    mobx_1.action.bound
], CountryStandardizerPage.prototype, "onDownload", null);
__decorate([
    mobx_1.action.bound
], CountryStandardizerPage.prototype, "onToggleRows", null);
__decorate([
    mobx_1.action.bound
], CountryStandardizerPage.prototype, "onSave", null);
__decorate([
    mobx_1.computed
], CountryStandardizerPage.prototype, "entriesToShow", null);
CountryStandardizerPage = __decorate([
    mobx_react_1.observer
], CountryStandardizerPage);
exports.CountryStandardizerPage = CountryStandardizerPage;
//# sourceMappingURL=CountryStandardizerPage.js.map