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
exports.SourceEditPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const react_router_dom_1 = require("react-router-dom");
const timeago_js_1 = require("timeago.js");
const AdminAppContext_1 = require("./AdminAppContext");
const AdminLayout_1 = require("./AdminLayout");
const Forms_1 = require("./Forms");
const VariableList_1 = require("./VariableList");
class SourceEditable {
    constructor(json) {
        this.name = "";
        this.description = {
            dataPublishedBy: undefined,
            dataPublisherSource: undefined,
            link: undefined,
            retrievedDate: undefined,
            additionalInfo: undefined,
        };
        for (const key in this) {
            if (key === "description")
                Object.assign(this.description, json.description);
            else if (key in json)
                this[key] = json[key];
        }
    }
}
__decorate([
    mobx_1.observable
], SourceEditable.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], SourceEditable.prototype, "description", void 0);
let SourceEditor = class SourceEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.isDeleted = false;
    }
    // Store the original source to determine when it is modified
    UNSAFE_componentWillMount() {
        this.UNSAFE_componentWillReceiveProps();
    }
    UNSAFE_componentWillReceiveProps() {
        this.newSource = new SourceEditable(this.props.source);
        this.isDeleted = false;
    }
    get isModified() {
        return (JSON.stringify(this.newSource) !==
            JSON.stringify(new SourceEditable(this.props.source)));
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const { source } = this.props;
            console.log(this.newSource);
            const json = yield this.context.admin.requestJSON(`/api/sources/${source.id}`, { source: this.newSource }, "PUT");
            if (json.success) {
                Object.assign(this.props.source, this.newSource);
            }
        });
    }
    render() {
        const { source } = this.props;
        const { newSource } = this;
        const isBulkImport = source.namespace !== "owid";
        return (React.createElement("main", { className: "SourceEditPage" },
            React.createElement(react_router_dom_1.Prompt, { when: this.isModified, message: "Are you sure you want to leave? Unsaved changes will be lost." }),
            React.createElement("section", null,
                React.createElement("h1", null,
                    "Source: ",
                    source.name),
                React.createElement("p", null,
                    "Last updated ",
                    timeago_js_1.format(source.updatedAt))),
            React.createElement("section", null,
                React.createElement("form", { onSubmit: (e) => {
                        e.preventDefault();
                        this.save();
                    } },
                    isBulkImport && (React.createElement("p", null, "This source is associated with a bulk import, so we can't change it manually.")),
                    React.createElement(Forms_1.BindString, { field: "name", store: newSource, label: "Name", disabled: true }),
                    React.createElement(Forms_1.BindString, { field: "dataPublishedBy", store: newSource.description, label: "Data published by", disabled: true }),
                    React.createElement(Forms_1.BindString, { field: "dataPublisherSource", store: newSource.description, label: "Data publisher's source", disabled: true }),
                    React.createElement(Forms_1.BindString, { field: "link", store: newSource.description, label: "Link", disabled: true }),
                    React.createElement(Forms_1.BindString, { field: "retrievedDate", store: newSource.description, label: "Retrieved", disabled: true }),
                    React.createElement(Forms_1.BindString, { field: "additionalInfo", store: newSource.description, label: "Additional information", textarea: true, disabled: true }),
                    React.createElement("input", { type: "submit", className: "btn btn-success", value: "Update source", disabled: true }))),
            React.createElement("section", null,
                React.createElement("h3", null, "Variables"),
                React.createElement(VariableList_1.VariableList, { variables: source.variables }))));
    }
};
__decorate([
    mobx_1.observable
], SourceEditor.prototype, "newSource", void 0);
__decorate([
    mobx_1.observable
], SourceEditor.prototype, "isDeleted", void 0);
__decorate([
    mobx_1.computed
], SourceEditor.prototype, "isModified", null);
SourceEditor = __decorate([
    mobx_react_1.observer
], SourceEditor);
let SourceEditPage = class SourceEditPage extends React.Component {
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, { title: this.source && this.source.name }, this.source && React.createElement(SourceEditor, { source: this.source })));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON(`/api/sources/${this.props.sourceId}.json`);
            mobx_1.runInAction(() => {
                this.source = json.source;
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
SourceEditPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], SourceEditPage.prototype, "source", void 0);
SourceEditPage = __decorate([
    mobx_react_1.observer
], SourceEditPage);
exports.SourceEditPage = SourceEditPage;
//# sourceMappingURL=SourceEditPage.js.map