"use strict";
// WIP
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
exports.ImportPage = void 0;
const React = __importStar(require("react"));
const Util_1 = require("../clientUtils/Util");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const react_router_dom_1 = require("react-router-dom");
const csv_parse_1 = __importDefault(require("csv-parse"));
const Forms_1 = require("./Forms");
const AdminLayout_1 = require("./AdminLayout");
const AdminAppContext_1 = require("./AdminAppContext");
const faSpinner_1 = require("@fortawesome/free-solid-svg-icons/faSpinner");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
class EditableVariable {
    constructor() {
        this.name = "";
        this.unit = "";
        this.description = "";
        this.coverage = "";
        this.timespan = "";
        this.values = [];
    }
}
__decorate([
    mobx_1.observable
], EditableVariable.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], EditableVariable.prototype, "unit", void 0);
__decorate([
    mobx_1.observable
], EditableVariable.prototype, "description", void 0);
__decorate([
    mobx_1.observable
], EditableVariable.prototype, "coverage", void 0);
__decorate([
    mobx_1.observable
], EditableVariable.prototype, "timespan", void 0);
__decorate([
    mobx_1.observable
], EditableVariable.prototype, "overwriteId", void 0);
__decorate([
    mobx_1.observable
], EditableVariable.prototype, "values", void 0);
class EditableDataset {
    constructor() {
        this.name = "";
        this.description = "";
        this.existingVariables = [];
        this.newVariables = [];
        this.years = [];
        this.entities = [];
        this.source = {
            name: "",
            dataPublishedBy: "",
            dataPublisherSource: "",
            link: "",
            retrievedDate: "",
            additionalInfo: "",
        };
    }
    update(json) {
        for (const key in this) {
            if (key in json)
                this[key] = json[key];
        }
    }
    get isLoading() {
        return this.id && !this.existingVariables.length;
    }
}
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "id", void 0);
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "description", void 0);
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "existingVariables", void 0);
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "newVariables", void 0);
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "years", void 0);
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "entities", void 0);
__decorate([
    mobx_1.observable
], EditableDataset.prototype, "source", void 0);
__decorate([
    mobx_1.computed
], EditableDataset.prototype, "isLoading", null);
let DataPreview = class DataPreview extends React.Component {
    constructor() {
        super(...arguments);
        this.rowOffset = 0;
        this.visibleRows = 10;
    }
    get numRows() {
        return this.props.csv.rows.length;
    }
    onScroll(ev) {
        const { scrollTop, scrollHeight } = ev.currentTarget;
        const { numRows } = this;
        const rowOffset = Math.round((scrollTop / scrollHeight) * numRows);
        ev.currentTarget.scrollTop = Math.round((rowOffset / numRows) * scrollHeight);
        this.rowOffset = rowOffset;
    }
    render() {
        const { rows } = this.props.csv;
        const { rowOffset, visibleRows, numRows } = this;
        const height = 50;
        return (React.createElement("div", { style: { height: height * visibleRows, overflowY: "scroll" }, onScroll: this.onScroll },
            React.createElement("div", { style: {
                    height: height * numRows,
                    paddingTop: height * rowOffset,
                } },
                React.createElement("table", { className: "table", style: { background: "white" } },
                    React.createElement("tbody", null, rows
                        .slice(rowOffset, rowOffset + visibleRows)
                        .map((row, i) => (React.createElement("tr", { key: i },
                        React.createElement("td", null, rowOffset + i + 1),
                        row.map((cell, j) => (React.createElement("td", { key: j, style: { height: height } }, cell)))))))))));
    }
};
__decorate([
    mobx_1.observable
], DataPreview.prototype, "rowOffset", void 0);
__decorate([
    mobx_1.observable
], DataPreview.prototype, "visibleRows", void 0);
__decorate([
    mobx_1.computed
], DataPreview.prototype, "numRows", null);
__decorate([
    mobx_1.action.bound
], DataPreview.prototype, "onScroll", null);
DataPreview = __decorate([
    mobx_react_1.observer
], DataPreview);
let EditVariable = class EditVariable extends React.Component {
    render() {
        const { variable, dataset } = this.props;
        return (React.createElement("li", { className: "EditVariable" },
            React.createElement(Forms_1.FieldsRow, null,
                React.createElement(Forms_1.BindString, { store: variable, field: "name", label: "" }),
                React.createElement("select", { onChange: (e) => {
                        variable.overwriteId = e.target.value
                            ? parseInt(e.target.value)
                            : undefined;
                    }, value: variable.overwriteId || "" },
                    React.createElement("option", { value: "" }, "Create new variable"),
                    dataset.existingVariables.map((v) => (React.createElement("option", { key: v.id, value: v.id },
                        "Overwrite ",
                        v.name)))))));
    }
};
EditVariable = __decorate([
    mobx_react_1.observer
], EditVariable);
let EditVariables = class EditVariables extends React.Component {
    get deletingVariables() {
        const { dataset } = this.props;
        const deletingVariables = [];
        for (const variable of dataset.existingVariables) {
            if (!dataset.newVariables.some((v) => v.overwriteId === variable.id)) {
                deletingVariables.push(variable);
            }
        }
        return deletingVariables;
    }
    render() {
        const { dataset } = this.props;
        return (React.createElement("section", { className: "form-section variables-section" },
            React.createElement("h3", null, "Variables"),
            React.createElement("p", { className: "form-section-desc" }, "These are the variables that will be stored for your dataset."),
            React.createElement("ol", null, dataset.newVariables.map((variable, i) => (React.createElement(EditVariable, { key: i, variable: variable, dataset: dataset })))),
            this.deletingVariables.length > 0 && (React.createElement("div", { className: "alert alert-danger" },
                "Some existing variables are not selected to overwrite and will be deleted:",
                " ",
                this.deletingVariables.map((v) => v.name).join(",")))));
    }
};
__decorate([
    mobx_1.computed
], EditVariables.prototype, "deletingVariables", null);
EditVariables = __decorate([
    mobx_react_1.observer
], EditVariables);
class CSV {
    constructor({ filename = "", rows = [], existingEntities = [] }) {
        this.filename = filename;
        this.rows = rows;
        this.existingEntities = existingEntities;
    }
    static transformSingleLayout(rows, filename) {
        const basename = (filename.match(/(.*?)(.csv)?$/) || [])[1];
        const newRows = [["Entity", "Year", basename]];
        for (let i = 1; i < rows.length; i++) {
            const entity = rows[i][0];
            for (let j = 1; j < rows[0].length; j++) {
                const year = rows[0][j];
                const value = rows[i][j];
                newRows.push([entity, year, value]);
            }
        }
        return newRows;
    }
    get basename() {
        return (this.filename.match(/(.*?)(.csv)?$/) || [])[1];
    }
    get data() {
        const { rows } = this;
        const variables = [];
        const entities = [];
        const years = [];
        const headingRow = rows[0];
        for (const name of headingRow.slice(2)) {
            const variable = new EditableVariable();
            variable.name = name;
            variables.push(variable);
        }
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const entity = row[0], year = row[1];
            entities.push(entity);
            years.push(+year);
            row.slice(2).forEach((value, j) => {
                variables[j].values.push(value);
            });
        }
        return {
            variables: variables,
            entities: entities,
            years: years,
        };
    }
    get validation() {
        const validation = { results: [], passed: false };
        const { rows } = this;
        // Check we actually have enough data
        if (rows[0].length < 3) {
            validation.results.push({
                class: "danger",
                message: `No variables detected. CSV should have at least 3 columns.`,
            });
        }
        // Make sure entities and years are valid
        const invalidLines = [];
        for (let i = 1; i < rows.length; i++) {
            const year = rows[i][1];
            if ((+year).toString() !== year || Util_1.isEmpty(rows[i][0])) {
                invalidLines.push(i + 1);
            }
        }
        if (invalidLines.length) {
            validation.results.push({
                class: "danger",
                message: `Invalid or missing entity/year on lines: ${invalidLines.join(", ")}`,
            });
        }
        // Check for duplicates
        const uniqCheck = {};
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const entity = row[0], year = row[1];
            const key = entity + "-" + year;
            uniqCheck[key] = uniqCheck[key] || 0;
            uniqCheck[key] += 1;
        }
        Object.keys(uniqCheck).forEach((key) => {
            const count = uniqCheck[key];
            if (count > 1) {
                validation.results.push({
                    class: "danger",
                    message: `Duplicates detected: ${count} instances of ${key}.`,
                });
            }
        });
        // Warn about non-numeric data
        const nonNumeric = [];
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            for (let j = 2; j < row.length; j++) {
                if (row[j] !== "" &&
                    (isNaN(parseFloat(row[j])) || !row[j].match(/^[0-9.-]+$/)))
                    nonNumeric.push(`${i + 1} '${row[j]}'`);
            }
        }
        if (nonNumeric.length)
            validation.results.push({
                class: "warning",
                message: "Non-numeric data detected on line " +
                    nonNumeric.join(", "),
            });
        // Warn if we're creating novel entities
        const newEntities = Util_1.difference(Util_1.uniq(this.data.entities), this.existingEntities);
        if (newEntities.length >= 1) {
            validation.results.push({
                class: "warning",
                message: `These entities were not found in the database and will be created: ${newEntities.join(", ")}`,
            });
        }
        validation.passed = validation.results.every((result) => result.class !== "danger");
        return validation;
    }
    get isValid() {
        return this.validation.passed;
    }
}
__decorate([
    mobx_1.computed
], CSV.prototype, "basename", null);
__decorate([
    mobx_1.computed
], CSV.prototype, "data", null);
__decorate([
    mobx_1.computed
], CSV.prototype, "validation", null);
__decorate([
    mobx_1.computed
], CSV.prototype, "isValid", null);
let ValidationView = class ValidationView extends React.Component {
    render() {
        const { validation } = this.props;
        return (React.createElement("section", { className: "ValidationView" }, validation.results.map((v, index) => (React.createElement("div", { key: index, className: `alert alert-${v.class}` }, v.message)))));
    }
};
ValidationView = __decorate([
    mobx_react_1.observer
], ValidationView);
let CSVSelector = class CSVSelector extends React.Component {
    onChooseCSV({ target }) {
        const { existingEntities } = this.props;
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
            }, (_, rows) => {
                // TODO error handling
                //console.log("Error?", err)
                if (rows[0][0].toLowerCase() === "year")
                    rows = CSV.transformSingleLayout(rows, file.name);
                this.csv = new CSV({
                    filename: file.name,
                    rows,
                    existingEntities,
                });
                this.props.onCSV(this.csv);
            });
        };
        reader.readAsText(file);
    }
    render() {
        const { csv } = this;
        return (React.createElement("section", null,
            React.createElement("input", { type: "file", onChange: this.onChooseCSV, ref: (e) => (this.fileInput = e) }),
            csv && React.createElement(DataPreview, { csv: csv }),
            csv && React.createElement(ValidationView, { validation: csv.validation })));
    }
    componentDidMount() {
        if (this.fileInput)
            this.fileInput.value = "";
    }
};
__decorate([
    mobx_1.observable
], CSVSelector.prototype, "csv", void 0);
__decorate([
    mobx_1.action.bound
], CSVSelector.prototype, "onChooseCSV", null);
CSVSelector = __decorate([
    mobx_react_1.observer
], CSVSelector);
let Importer = class Importer extends React.Component {
    constructor() {
        super(...arguments);
        this.dataset = new EditableDataset();
        this.disposers = [];
    }
    // First step is user selecting a CSV file
    onCSV(csv) {
        this.csv = csv;
        // Look for an existing dataset that matches this csv filename
        const existingDataset = this.props.datasets.find((d) => d.name === csv.basename);
        if (existingDataset) {
            this.getExistingDataset(existingDataset.id);
        }
    }
    onChooseDataset(datasetId) {
        if (datasetId === -1)
            this.existingDataset = undefined;
        else
            this.getExistingDataset(datasetId);
    }
    // Grab existing dataset info to compare against what we are importing
    getExistingDataset(datasetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON(`/api/importData/datasets/${datasetId}.json`);
            mobx_1.runInAction(() => (this.existingDataset = json.dataset));
        });
    }
    // When we have the csv and have matched against an existing dataset (or decided not to), we can
    // then initialize the dataset model for user customization
    initializeDataset() {
        const { csv, existingDataset } = this;
        if (!csv)
            return;
        const dataset = new EditableDataset();
        if (existingDataset) {
            dataset.name = existingDataset.name;
            dataset.description = existingDataset.description;
            dataset.existingVariables = existingDataset.variables;
        }
        if (!dataset.name)
            dataset.name = csv.basename;
        dataset.newVariables = csv.data.variables.map(Util_1.clone);
        dataset.entities = csv.data.entities;
        dataset.years = csv.data.years;
        if (existingDataset) {
            // Match new variables to existing variables
            dataset.newVariables.forEach((variable) => {
                const match = dataset.existingVariables.filter((v) => v.name === variable.name)[0];
                if (match) {
                    Object.keys(match).forEach((key) => {
                        if (key === "id")
                            variable.overwriteId = match[key];
                        else
                            variable[key] = match[key];
                    });
                }
            });
        }
        this.dataset = dataset;
    }
    onSubmit(e) {
        e.preventDefault();
        this.saveDataset();
    }
    // Commit the import!
    saveDataset() {
        const { newVariables, entities, years } = this.dataset;
        const requestData = {
            dataset: {
                id: this.existingDataset ? this.existingDataset.id : undefined,
                name: this.dataset.name,
                description: this.dataset.description,
            },
            years,
            entities,
            variables: newVariables,
        };
        this.context.admin
            .requestJSON("/api/importDataset", requestData, "POST")
            .then((json) => {
            mobx_1.runInAction(() => {
                this.postImportDatasetId = json.datasetId;
            });
        });
    }
    componentDidMount() {
        this.disposers.push(mobx_1.reaction(() => [this.csv, this.existingDataset], () => this.initializeDataset()));
    }
    componentWillUnmount() {
        for (const dispose of this.disposers)
            dispose();
    }
    render() {
        const { csv, dataset, existingDataset } = this;
        const { datasets, existingEntities } = this.props;
        return (React.createElement("form", { className: "Importer", onSubmit: this.onSubmit },
            React.createElement("h2", null, "Import CSV file"),
            React.createElement("p", null,
                "Examples of valid layouts:",
                " ",
                React.createElement("a", { href: "http://ourworldindata.org/uploads/2016/02/ourworldindata_single-var.png" }, "single variable"),
                ",",
                " ",
                React.createElement("a", { href: "http://ourworldindata.org/uploads/2016/02/ourworldindata_multi-var.png" }, "multiple variables"),
                ".",
                " ",
                React.createElement("span", { className: "form-section-desc" },
                    "CSV files only:",
                    " ",
                    React.createElement("a", { href: "https://ourworldindata.org/how-to-our-world-in-data-guide/#1-2-single-variable-datasets" }, "csv file format guide"),
                    ". Maximum file size: 10MB",
                    " ")),
            React.createElement(CSVSelector, { onCSV: this.onCSV, existingEntities: existingEntities }),
            csv && csv.isValid && (React.createElement("section", null,
                React.createElement("p", { style: {
                        opacity: dataset.id !== undefined ? 1 : 0,
                    }, className: "updateWarning" }, "Overwriting existing dataset"),
                React.createElement(Forms_1.NumericSelectField, { value: existingDataset ? existingDataset.id : -1, onValue: this.onChooseDataset, options: [-1].concat(datasets.map((d) => d.id)), optionLabels: ["Create new dataset"].concat(datasets.map((d) => d.name)) }),
                React.createElement("hr", null),
                React.createElement("h3", null, existingDataset
                    ? `Updating existing dataset`
                    : `Creating new dataset`),
                !existingDataset && (React.createElement("p", null, "Your data will be validated and stored in the database for visualization. After creating the dataset, please fill out the metadata fields and then mark the dataset as \"publishable\" if it should be reused by others.")),
                React.createElement(Forms_1.BindString, { field: "name", store: dataset, helpText: `Dataset name should include a basic description of the variables, followed by the source and year. For example: "Government Revenue Data – ICTD (2016)"` }),
                dataset.isLoading && (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSpinner_1.faSpinner, spin: true })),
                !dataset.isLoading && [
                    React.createElement(EditVariables, { key: "editVariables", dataset: dataset }),
                    React.createElement("input", { key: "submit", type: "submit", className: "btn btn-success", value: existingDataset
                            ? "Update dataset"
                            : "Create dataset" }),
                ],
                this.postImportDatasetId && (React.createElement(react_router_dom_1.Redirect, { to: `/datasets/${this.postImportDatasetId}` }))))));
    }
};
Importer.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], Importer.prototype, "csv", void 0);
__decorate([
    mobx_1.observable.ref
], Importer.prototype, "dataset", void 0);
__decorate([
    mobx_1.observable
], Importer.prototype, "existingDataset", void 0);
__decorate([
    mobx_1.observable
], Importer.prototype, "postImportDatasetId", void 0);
__decorate([
    mobx_1.action.bound
], Importer.prototype, "onCSV", null);
__decorate([
    mobx_1.action.bound
], Importer.prototype, "onChooseDataset", null);
__decorate([
    mobx_1.action.bound
], Importer.prototype, "initializeDataset", null);
__decorate([
    mobx_1.action.bound
], Importer.prototype, "onSubmit", null);
Importer = __decorate([
    mobx_react_1.observer
], Importer);
let ImportPage = class ImportPage extends React.Component {
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON("/api/importData.json");
            mobx_1.runInAction(() => (this.importData = json));
        });
    }
    componentDidMount() {
        this.getData();
    }
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, null,
            React.createElement("main", { className: "ImportPage" }, this.importData && React.createElement(Importer, Object.assign({}, this.importData)))));
    }
};
ImportPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], ImportPage.prototype, "importData", void 0);
ImportPage = __decorate([
    mobx_react_1.observer
], ImportPage);
exports.ImportPage = ImportPage;
//# sourceMappingURL=ImportPage.js.map