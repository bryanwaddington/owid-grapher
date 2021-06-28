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
exports.DatasetEditPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const lodash = __importStar(require("lodash"));
const react_router_dom_1 = require("react-router-dom");
const filenamify_1 = __importDefault(require("filenamify"));
const timeago_js_1 = require("timeago.js");
const LegacyVariableCode_1 = require("../grapher/core/LegacyVariableCode");
const AdminLayout_1 = require("./AdminLayout");
const Link_1 = require("./Link");
const Forms_1 = require("./Forms");
const ChartList_1 = require("./ChartList");
const Grapher_1 = require("../grapher/core/Grapher");
const GrapherFigureView_1 = require("../site/GrapherFigureView");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const VariableList_1 = require("./VariableList");
const AdminAppContext_1 = require("./AdminAppContext");
const js_base64_1 = require("js-base64");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faDownload_1 = require("@fortawesome/free-solid-svg-icons/faDownload");
const faUpload_1 = require("@fortawesome/free-solid-svg-icons/faUpload");
const faGithub_1 = require("@fortawesome/free-brands-svg-icons/faGithub");
const owidTypes_1 = require("../clientUtils/owidTypes");
class VariableEditable {
    constructor(json) {
        this.name = "";
        this.unit = "";
        this.shortUnit = "";
        this.description = "";
        this.display = new LegacyVariableCode_1.LegacyVariableDisplayConfig();
        for (const key in this) {
            if (key === "display")
                lodash.extend(this.display, json.display);
            else
                this[key] = json[key];
        }
    }
}
__decorate([
    mobx_1.observable
], VariableEditable.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], VariableEditable.prototype, "unit", void 0);
__decorate([
    mobx_1.observable
], VariableEditable.prototype, "shortUnit", void 0);
__decorate([
    mobx_1.observable
], VariableEditable.prototype, "description", void 0);
__decorate([
    mobx_1.observable
], VariableEditable.prototype, "display", void 0);
let VariableEditRow = class VariableEditRow extends React.Component {
    UNSAFE_componentWillMount() {
        this.UNSAFE_componentWillReceiveProps();
    }
    UNSAFE_componentWillReceiveProps() {
        this.newVariable = new VariableEditable(this.props.variable);
    }
    get isModified() {
        return (JSON.stringify(this.newVariable) !==
            JSON.stringify(new VariableEditable(this.props.variable)));
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const { variable } = this.props;
            const json = yield this.context.admin.requestJSON(`/api/variables/${variable.id}`, { variable: this.newVariable }, "PUT");
            if (json.success) {
                mobx_1.runInAction(() => {
                    Object.assign(this.props.variable, this.newVariable);
                });
            }
        });
    }
    get grapherConfig() {
        return {
            yAxis: { min: 0 },
            map: { variableId: this.props.variable.id },
            tab: "map",
            hasMapTab: true,
            dimensions: [
                {
                    property: "y",
                    variableId: this.props.variable.id,
                    display: lodash.clone(this.newVariable.display),
                },
            ],
        };
    }
    grapherIsReady(grapher) {
        // XXX refactor this with EditorBasicTab
        if (!grapher.mappableData.length)
            return;
        grapher.tab = GrapherConstants_1.GrapherTabOption.chart;
        grapher.hasMapTab = false;
        const { selection } = grapher;
        const { availableEntityNames } = selection;
        if (grapher.isScatter || grapher.isSlopeChart) {
            selection.clearSelection();
        }
        else if (grapher.yColumns.length > 1) {
            const entity = selection.availableEntityNameSet.has(GrapherConstants_1.WorldEntityName)
                ? GrapherConstants_1.WorldEntityName
                : lodash.sample(availableEntityNames);
            selection.selectEntity(entity);
            grapher.addCountryMode = GrapherConstants_1.EntitySelectionMode.SingleEntity;
        }
        else {
            grapher.addCountryMode = GrapherConstants_1.EntitySelectionMode.MultipleEntities;
            if (grapher.filledDimensions[0].column.uniqTimesAsc.length === 1) {
                grapher.type = GrapherConstants_1.ChartTypeName.DiscreteBar;
                selection.setSelectedEntities(availableEntityNames.length > 15
                    ? lodash.sampleSize(availableEntityNames, 8)
                    : availableEntityNames);
            }
            else {
                selection.setSelectedEntities(availableEntityNames.length > 10
                    ? lodash.sampleSize(availableEntityNames, 3)
                    : availableEntityNames);
            }
        }
    }
    componentDidMount() {
        this.grapher = new Grapher_1.Grapher(Object.assign(Object.assign({}, this.grapherConfig), { isEmbeddedInAnOwidPage: true }));
        this.dispose2 = mobx_1.when(() => this.grapher !== undefined && this.grapher.isReady, () => this.grapherIsReady(this.grapher));
        this.dispose = mobx_1.autorun(() => {
            const grapher = this.grapher;
            const display = lodash.clone(this.newVariable.display);
            if (grapher) {
                mobx_1.runInAction(() => (grapher.dimensions[0].display = display));
            }
        });
    }
    componentWillUnmount() {
        this.dispose();
        this.dispose2();
    }
    render() {
        const { isBulkImport } = this.props;
        const { newVariable } = this;
        // Todo: can we reuse code from VariableEditPage?
        return (React.createElement("div", { className: "VariableEditRow row" },
            React.createElement(react_router_dom_1.Prompt, { when: this.isModified, message: "Are you sure you want to leave? Unsaved changes will be lost." }),
            React.createElement("div", { className: "col" },
                React.createElement("form", { onSubmit: (e) => {
                        e.preventDefault();
                        this.save();
                    } },
                    React.createElement("section", null,
                        React.createElement(Forms_1.BindString, { label: "Name", field: "name", store: newVariable, helpText: "The full name of the variable e.g. Top marginal income tax rate", disabled: isBulkImport }),
                        React.createElement(Forms_1.BindString, { label: "Display name", field: "name", store: newVariable.display, helpText: "How the variable should be named on charts" }),
                        React.createElement(Forms_1.FieldsRow, null,
                            React.createElement(Forms_1.BindString, { label: "Unit of measurement", field: "unit", store: newVariable.display, placeholder: newVariable.unit }),
                            React.createElement(Forms_1.BindString, { label: "Short (axis) unit", field: "shortUnit", store: newVariable.display, placeholder: newVariable.shortUnit })),
                        React.createElement(Forms_1.FieldsRow, null,
                            React.createElement(Forms_1.BindFloat, { label: "Number of decimal places", field: "numDecimalPlaces", store: newVariable.display, helpText: `A negative number here will round integers` }),
                            React.createElement(Forms_1.BindFloat, { label: "Unit conversion factor", field: "conversionFactor", store: newVariable.display, helpText: `Multiply all values by this amount` })),
                        React.createElement(Forms_1.FieldsRow, null,
                            React.createElement(Forms_1.Toggle, { value: newVariable.display.yearIsDay === true, onValue: (value) => (newVariable.display.yearIsDay = value), label: "Treat year column as day series" }),
                            React.createElement(Forms_1.BindString, { label: "Zero Day as YYYY-MM-DD", field: "zeroDay", store: newVariable.display, disabled: !newVariable.display.yearIsDay, placeholder: newVariable.display.yearIsDay
                                    ? owidTypes_1.EPOCH_DATE
                                    : "", helpText: `The day series starts on this date.` })),
                        React.createElement(Forms_1.BindString, { label: "Description", field: "description", store: newVariable, helpText: "Any further useful information about this variable", textarea: true }),
                        React.createElement(Forms_1.BindString, { field: "entityAnnotationsMap", placeholder: "Entity: note", store: newVariable.display, label: "Entity annotations", textarea: true, disabled: isBulkImport, helpText: "Additional text to show next to entity labels. Each note should be in a separate line." })),
                    React.createElement("input", { type: "submit", className: "btn btn-success", value: "Update variable" }))),
            this.grapher && (React.createElement("div", { className: "col" },
                React.createElement(GrapherFigureView_1.GrapherFigureView, { grapher: this.grapher }),
                React.createElement(Link_1.Link, { className: "btn btn-secondary pull-right", to: `/charts/create/${js_base64_1.Base64.encode(JSON.stringify(this.grapher.object))}` }, "Edit as new chart")))));
    }
};
VariableEditRow.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable.ref
], VariableEditRow.prototype, "grapher", void 0);
__decorate([
    mobx_1.observable
], VariableEditRow.prototype, "newVariable", void 0);
__decorate([
    mobx_1.computed
], VariableEditRow.prototype, "isModified", null);
__decorate([
    mobx_1.computed
], VariableEditRow.prototype, "grapherConfig", null);
__decorate([
    mobx_1.action.bound
], VariableEditRow.prototype, "grapherIsReady", null);
VariableEditRow = __decorate([
    mobx_react_1.observer
], VariableEditRow);
class DatasetEditable {
    constructor(json) {
        this.name = "";
        this.description = "";
        this.isPrivate = false;
        this.source = {
            id: -1,
            name: "",
            dataPublishedBy: "",
            dataPublisherSource: "",
            link: "",
            retrievedDate: "",
            additionalInfo: "",
        };
        this.tags = [];
        for (const key in this) {
            if (key in json) {
                if (key === "tags")
                    this.tags = lodash.clone(json.tags);
                else
                    this[key] = json[key];
            }
        }
    }
}
__decorate([
    mobx_1.observable
], DatasetEditable.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], DatasetEditable.prototype, "description", void 0);
__decorate([
    mobx_1.observable
], DatasetEditable.prototype, "isPrivate", void 0);
__decorate([
    mobx_1.observable
], DatasetEditable.prototype, "source", void 0);
__decorate([
    mobx_1.observable
], DatasetEditable.prototype, "tags", void 0);
let DatasetTagEditor = class DatasetTagEditor extends React.Component {
    onSaveTags(tags) {
        this.props.newDataset.tags = tags;
    }
    render() {
        const { newDataset, availableTags } = this.props;
        return (React.createElement("div", { className: "form-group" },
            React.createElement("label", null, "Tags"),
            React.createElement(Forms_1.EditableTags, { tags: newDataset.tags, suggestions: availableTags, onSave: this.onSaveTags })));
    }
};
__decorate([
    mobx_1.action.bound
], DatasetTagEditor.prototype, "onSaveTags", null);
DatasetTagEditor = __decorate([
    mobx_react_1.observer
], DatasetTagEditor);
let DatasetEditor = class DatasetEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.isDeleted = false;
        // HACK (Mispy): Force variable refresh when dataset metadata is updated
        this.timesUpdated = 0;
    }
    // Store the original dataset to determine when it is modified
    UNSAFE_componentWillMount() {
        this.UNSAFE_componentWillReceiveProps();
    }
    UNSAFE_componentWillReceiveProps() {
        this.newDataset = new DatasetEditable(this.props.dataset);
        this.isDeleted = false;
    }
    get isModified() {
        return (JSON.stringify(this.newDataset) !==
            JSON.stringify(new DatasetEditable(this.props.dataset)));
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dataset } = this.props;
            const json = yield this.context.admin.requestJSON(`/api/datasets/${dataset.id}`, { dataset: this.newDataset }, "PUT");
            if (json.success) {
                mobx_1.runInAction(() => {
                    Object.assign(this.props.dataset, this.newDataset);
                    this.timesUpdated += 1;
                });
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dataset } = this.props;
            if (!window.confirm(`Really delete the dataset ${dataset.name}? This action cannot be undone!`))
                return;
            const json = yield this.context.admin.requestJSON(`/api/datasets/${dataset.id}`, {}, "DELETE");
            if (json.success) {
                this.isDeleted = true;
            }
        });
    }
    republishCharts() {
        return __awaiter(this, void 0, void 0, function* () {
            const { dataset } = this.props;
            if (!window.confirm(`Are you sure you want to republish all charts in ${dataset.name}?`)) {
                return;
            }
            yield this.context.admin.requestJSON(`/api/datasets/${dataset.id}/charts`, { republish: true }, "POST");
        });
    }
    get gitHistoryUrl() {
        return `https://github.com/${this.context.admin.settings.GITHUB_USERNAME}/owid-datasets/tree/master/datasets/${encodeURIComponent(filenamify_1.default(this.props.dataset.name))}`;
    }
    get zipFileUrl() {
        return "/";
    }
    uploadZip(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.requestJSON(`/api/datasets/${this.props.dataset.id}/uploadZip`, file, "PUT");
            if (json.success) {
                this.props.dataset.zipFile = { filename: file.name };
            }
        });
    }
    onChooseZip(ev) {
        if (!ev.target.files)
            return;
        const file = ev.target.files[0];
        this.uploadZip(file);
    }
    startChooseZip() {
        const input = document.createElement("input");
        input.type = "file";
        input.addEventListener("change", this.onChooseZip);
        input.click();
    }
    render() {
        if (this.isDeleted)
            return React.createElement(react_router_dom_1.Redirect, { to: "/datasets" });
        const { dataset } = this.props;
        const { newDataset, timesUpdated } = this;
        const isBulkImport = dataset.namespace !== "owid";
        return (React.createElement("main", { className: "DatasetEditPage" },
            React.createElement(react_router_dom_1.Prompt, { when: this.isModified, message: "Are you sure you want to leave? Unsaved changes will be lost." }),
            React.createElement("section", null,
                React.createElement("h1", null, dataset.name),
                React.createElement("p", null,
                    "Uploaded ",
                    timeago_js_1.format(dataset.dataEditedAt),
                    " by",
                    " ",
                    dataset.dataEditedByUserName),
                React.createElement(Link_1.Link, { native: true, to: `/datasets/${dataset.id}.csv`, className: "btn btn-primary" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDownload_1.faDownload }),
                    " Download CSV"),
                !isBulkImport && !dataset.isPrivate && (React.createElement("a", { href: this.gitHistoryUrl, target: "_blank", className: "btn btn-secondary", rel: "noopener" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faGithub_1.faGithub }),
                    " View on GitHub")),
                dataset.zipFile && (React.createElement(Link_1.Link, { native: true, to: `/datasets/${dataset.id}/downloadZip`, className: "btn btn-secondary" },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faDownload_1.faDownload }),
                    " ",
                    "additional-material.zip")),
                !isBulkImport && (React.createElement("button", { className: "btn btn-secondary", onClick: this.startChooseZip },
                    React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faUpload_1.faUpload }),
                    " ",
                    dataset.zipFile ? "Overwrite Zip" : "Upload Zip"))),
            React.createElement("section", null,
                React.createElement("h3", null, "Dataset metadata"),
                React.createElement("form", { onSubmit: (e) => {
                        e.preventDefault();
                        this.save();
                    } },
                    isBulkImport ? (React.createElement("p", null, "This dataset came from an automated import, so we can't change the original metadata manually.")) : (React.createElement("p", null, "The core metadata for the dataset. It's important to keep this in a standardized style across datasets.")),
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col" },
                            React.createElement(Forms_1.BindString, { field: "name", store: newDataset, label: "Name", disabled: isBulkImport, helpText: "Short name for this dataset, followed by the source and year. Example: Government Revenue Data \u2013 ICTD (2016)" }),
                            React.createElement(Forms_1.BindString, { field: "additionalInfo", store: newDataset.source, label: "Description", textarea: true, disabled: isBulkImport, helpText: "Describe the dataset and the methodology used in its construction. This can be as long and detailed as you like.", rows: 10 }),
                            React.createElement(Forms_1.BindString, { field: "link", store: newDataset.source, label: "Link", disabled: isBulkImport, helpText: "Link to the publication from which we retrieved this data" }),
                            React.createElement(Forms_1.BindString, { field: "retrievedDate", store: newDataset.source, label: "Retrieved", disabled: isBulkImport, helpText: "Date when this data was obtained by us" }),
                            React.createElement(DatasetTagEditor, { newDataset: newDataset, availableTags: dataset.availableTags, isBulkImport: isBulkImport }),
                            React.createElement(Forms_1.Toggle, { label: "Is publishable (include in exported OWID collection)", value: !newDataset.isPrivate, onValue: (v) => (newDataset.isPrivate = !v), disabled: isBulkImport })),
                        React.createElement("div", { className: "col" },
                            React.createElement(Forms_1.BindString, { field: "name", store: newDataset.source, label: "Source Name", disabled: isBulkImport, helpText: `Source name displayed on charts using this dataset. For academic papers, the name of the source should be "Authors (year)" e.g. Arroyo-Abad and Lindert (2016). For institutional projects or reports, the name should be "Institution, Project (year or vintage)" e.g. U.S. Bureau of Labor Statistics, Consumer Expenditure Survey (2015 release). For data that we have modified extensively, the name should be "Our World in Data based on Author (year)" e.g. Our World in Data based on Atkinson (2002) and Sen (2000).` }),
                            React.createElement(Forms_1.BindString, { field: "dataPublishedBy", store: newDataset.source, label: "Data published by", disabled: isBulkImport, helpText: `For academic papers this should be a complete reference. For institutional projects, detail the project or report. For data we have modified extensively, list OWID as the publishers and provide the name of the person in charge of the calculation.` }),
                            React.createElement(Forms_1.BindString, { field: "dataPublisherSource", store: newDataset.source, label: "Data publisher's source", disabled: isBulkImport, helpText: `Basic indication of how the publisher collected this data e.g. surveys data. Anything longer than a line should go in the dataset description.` }),
                            React.createElement(Forms_1.BindString, { field: "description", store: newDataset, label: "Internal notes", textarea: true, disabled: isBulkImport }))),
                    !isBulkImport && (React.createElement("input", { type: "submit", className: "btn btn-success", value: "Update dataset" })))),
            React.createElement("section", null,
                React.createElement("h3", null, "Variables"),
                dataset.variables.length >= 12 ? (React.createElement(VariableList_1.VariableList, { variables: dataset.variables })) : (dataset.variables.map((variable) => (React.createElement(VariableEditRow, { key: `${variable.id}-${timesUpdated}`, variable: variable, isBulkImport: isBulkImport }))))),
            React.createElement("section", null,
                React.createElement("button", { className: "btn btn-primary float-right", onClick: () => this.republishCharts() }, "Republish all charts"),
                React.createElement("h3", null, "Charts"),
                React.createElement(ChartList_1.ChartList, { charts: dataset.charts })),
            !isBulkImport && (React.createElement("section", null,
                React.createElement("h3", null, "Danger zone"),
                React.createElement("p", null, "Delete this dataset and all variables it contains. If there are any charts using this data, you must delete them individually first."),
                React.createElement("div", { className: "card-footer" },
                    React.createElement("button", { className: "btn btn-danger", onClick: () => this.delete() }, "Delete dataset"))))));
    }
};
DatasetEditor.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], DatasetEditor.prototype, "newDataset", void 0);
__decorate([
    mobx_1.observable
], DatasetEditor.prototype, "isDeleted", void 0);
__decorate([
    mobx_1.observable
], DatasetEditor.prototype, "timesUpdated", void 0);
__decorate([
    mobx_1.computed
], DatasetEditor.prototype, "isModified", null);
__decorate([
    mobx_1.computed
], DatasetEditor.prototype, "gitHistoryUrl", null);
__decorate([
    mobx_1.computed
], DatasetEditor.prototype, "zipFileUrl", null);
__decorate([
    mobx_1.action.bound
], DatasetEditor.prototype, "onChooseZip", null);
__decorate([
    mobx_1.action.bound
], DatasetEditor.prototype, "startChooseZip", null);
DatasetEditor = __decorate([
    mobx_react_1.observer
], DatasetEditor);
let DatasetEditPage = class DatasetEditPage extends React.Component {
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, { title: this.dataset && this.dataset.name }, this.dataset && React.createElement(DatasetEditor, { dataset: this.dataset })));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON(`/api/datasets/${this.props.datasetId}.json`);
            mobx_1.runInAction(() => {
                this.dataset = json.dataset;
            });
        });
    }
    componentDidMount() {
        this.UNSAFE_componentWillReceiveProps();
    }
    UNSAFE_componentWillReceiveProps() {
        this.getData();
    }
};
DatasetEditPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], DatasetEditPage.prototype, "dataset", void 0);
DatasetEditPage = __decorate([
    mobx_react_1.observer
], DatasetEditPage);
exports.DatasetEditPage = DatasetEditPage;
//# sourceMappingURL=DatasetEditPage.js.map