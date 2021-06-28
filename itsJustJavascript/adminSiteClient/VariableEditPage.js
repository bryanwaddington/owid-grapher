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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableEditPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const lodash = __importStar(require("lodash"));
const react_router_dom_1 = require("react-router-dom");
const AdminLayout_1 = require("./AdminLayout");
const Link_1 = require("./Link");
const Forms_1 = require("./Forms");
const LegacyVariableCode_1 = require("../grapher/core/LegacyVariableCode");
const Grapher_1 = require("../grapher/core/Grapher");
const GrapherFigureView_1 = require("../site/GrapherFigureView");
const ChartList_1 = require("./ChartList");
const AdminAppContext_1 = require("./AdminAppContext");
const js_base64_1 = require("js-base64");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const owidTypes_1 = require("../clientUtils/owidTypes");
class VariableEditable {
    constructor(json) {
        this.name = "";
        this.unit = "";
        this.shortUnit = "";
        this.description = "";
        this.entityAnnotationsMap = "";
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
], VariableEditable.prototype, "entityAnnotationsMap", void 0);
__decorate([
    mobx_1.observable
], VariableEditable.prototype, "display", void 0);
// XXX refactor with DatasetEditPage
let VariableEditor = class VariableEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.isDeleted = false;
    }
    // Store the original dataset to determine when it is modified
    UNSAFE_componentWillMount() {
        this.UNSAFE_componentWillReceiveProps();
    }
    UNSAFE_componentWillReceiveProps() {
        this.newVariable = new VariableEditable(this.props.variable);
        this.isDeleted = false;
    }
    get isModified() {
        return (JSON.stringify(this.newVariable) !==
            JSON.stringify(new VariableEditable(this.props.variable)));
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { variable } = this.props;
            if (!window.confirm(`Really delete the variable ${variable.name}? This action cannot be undone!`))
                return;
            const json = yield this.context.admin.requestJSON(`/api/variables/${variable.id}`, {}, "DELETE");
            if (json.success) {
                this.isDeleted = true;
            }
        });
    }
    render() {
        const { variable } = this.props;
        const { newVariable } = this;
        const isBulkImport = variable.datasetNamespace !== "owid";
        if (this.isDeleted)
            return React.createElement(react_router_dom_1.Redirect, { to: `/datasets/${variable.datasetId}` });
        return (React.createElement("main", { className: "VariableEditPage" },
            React.createElement(react_router_dom_1.Prompt, { when: this.isModified, message: "Are you sure you want to leave? Unsaved changes will be lost." }),
            React.createElement("ol", { className: "breadcrumb" },
                React.createElement("li", { className: "breadcrumb-item" }, variable.datasetNamespace),
                React.createElement("li", { className: "breadcrumb-item" },
                    React.createElement(Link_1.Link, { to: `/datasets/${variable.datasetId}` }, variable.datasetName)),
                React.createElement("li", { className: "breadcrumb-item active" }, variable.name)),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col" },
                    React.createElement("form", { onSubmit: (e) => {
                            e.preventDefault();
                            this.save();
                        } },
                        React.createElement("section", null,
                            React.createElement("h3", null, "Variable metadata"),
                            isBulkImport ? (React.createElement("p", null, "This variable came from an automated import, so we can't change the original metadata manually.")) : (React.createElement("p", null, "The core metadata for the variable. It's important to keep this consistent.")),
                            React.createElement(Forms_1.BindString, { field: "name", store: newVariable, label: "Variable Name", disabled: isBulkImport }),
                            React.createElement(Forms_1.BindString, { label: "Display name", field: "name", store: newVariable.display }),
                            React.createElement(Forms_1.FieldsRow, null,
                                React.createElement(Forms_1.BindString, { label: "Unit of measurement", field: "unit", store: newVariable.display, placeholder: newVariable.unit }),
                                React.createElement(Forms_1.BindString, { label: "Short (axis) unit", field: "shortUnit", store: newVariable.display, placeholder: newVariable.shortUnit })),
                            React.createElement(Forms_1.FieldsRow, null,
                                React.createElement(Forms_1.BindFloat, { label: "Number of decimal places", field: "numDecimalPlaces", store: newVariable.display, helpText: `A negative number here will round integers` }),
                                React.createElement(Forms_1.BindFloat, { label: "Unit conversion factor", field: "conversionFactor", store: newVariable.display, helpText: `Multiply all values by this amount` })),
                            React.createElement(Forms_1.FieldsRow, null,
                                React.createElement(Forms_1.Toggle, { value: newVariable.display.yearIsDay ===
                                        true, onValue: (value) => (newVariable.display.yearIsDay = value), label: "Treat year column as day series" }),
                                React.createElement(Forms_1.BindString, { label: "Zero Day as YYYY-MM-DD", field: "zeroDay", store: newVariable.display, disabled: !newVariable.display.yearIsDay, placeholder: newVariable.display.yearIsDay
                                        ? owidTypes_1.EPOCH_DATE
                                        : "", helpText: `The day series starts on this date.` })),
                            React.createElement(Forms_1.FieldsRow, null,
                                React.createElement(Forms_1.Toggle, { value: newVariable.display
                                        .includeInTable === true, onValue: (value) => (newVariable.display.includeInTable = value), label: "Include in table" })),
                            React.createElement(Forms_1.BindString, { field: "description", store: newVariable, label: "Description", textarea: true, disabled: isBulkImport }),
                            React.createElement(Forms_1.BindString, { field: "entityAnnotationsMap", placeholder: "Entity: note", store: newVariable.display, label: "Entity annotations", textarea: true, disabled: isBulkImport, helpText: "Additional text to show next to entity labels. Each note should be in a separate line." })),
                        React.createElement("input", { type: "submit", className: "btn btn-success", value: "Update variable" }))),
                this.grapher && (React.createElement("div", { className: "col" },
                    React.createElement("div", { className: "topbar" },
                        React.createElement("h3", null, "Preview"),
                        React.createElement(Link_1.Link, { className: "btn btn-secondary", to: `/charts/create/${js_base64_1.Base64.encode(JSON.stringify(this.grapher.object))}` }, "Edit as new chart")),
                    React.createElement(GrapherFigureView_1.GrapherFigureView, { grapher: this.grapher })))),
            React.createElement("section", null,
                React.createElement("h3", null, "Charts"),
                React.createElement(ChartList_1.ChartList, { charts: variable.charts }))));
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const { variable } = this.props;
            const json = yield this.context.admin.requestJSON(`/api/variables/${variable.id}`, { variable: this.newVariable }, "PUT");
            if (json.success) {
                Object.assign(this.props.variable, this.newVariable);
            }
        });
    }
    get grapherConfig() {
        return {
            yAxis: { min: 0 },
            map: { columnSlug: this.props.variable.id.toString() },
            tab: GrapherConstants_1.GrapherTabOption.map,
            hasMapTab: true,
            dimensions: [
                {
                    property: GrapherConstants_1.DimensionProperty.y,
                    variableId: this.props.variable.id,
                    display: lodash.clone(this.newVariable.display),
                },
            ],
        };
    }
    componentDidMount() {
        this.grapher = new Grapher_1.Grapher(this.grapherConfig);
        this.dispose = mobx_1.autorun(() => {
            if (this.grapher && this.grapherConfig) {
                this.grapher.updateFromObject(this.grapherConfig);
            }
        });
    }
    componentWillUnmount() {
        this.dispose();
    }
};
VariableEditor.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], VariableEditor.prototype, "newVariable", void 0);
__decorate([
    mobx_1.observable
], VariableEditor.prototype, "isDeleted", void 0);
__decorate([
    mobx_1.observable.ref
], VariableEditor.prototype, "grapher", void 0);
__decorate([
    mobx_1.computed
], VariableEditor.prototype, "isModified", null);
__decorate([
    mobx_1.computed
], VariableEditor.prototype, "grapherConfig", null);
VariableEditor = __decorate([
    mobx_react_1.observer
], VariableEditor);
let VariableEditPage = class VariableEditPage extends React.Component {
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, null, this.variable && React.createElement(VariableEditor, { variable: this.variable })));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON(`/api/variables/${this.props.variableId}.json`);
            mobx_1.runInAction(() => {
                this.variable = json.variable;
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
VariableEditPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], VariableEditPage.prototype, "variable", void 0);
VariableEditPage = __decorate([
    mobx_react_1.observer
], VariableEditPage);
exports.VariableEditPage = VariableEditPage;
//# sourceMappingURL=VariableEditPage.js.map