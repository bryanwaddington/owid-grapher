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
exports.VariablesIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const lodash = __importStar(require("lodash"));
const AdminLayout_1 = require("./AdminLayout");
const Forms_1 = require("./Forms");
const VariableList_1 = require("./VariableList");
const AdminAppContext_1 = require("./AdminAppContext");
let VariablesIndexPage = class VariablesIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.variables = [];
        this.maxVisibleRows = 50;
    }
    get variablesToShow() {
        return this.variables;
    }
    onShowMore() {
        this.maxVisibleRows += 100;
    }
    render() {
        const { variablesToShow, searchInput, numTotalRows } = this;
        const highlight = (text) => {
            if (this.highlightSearch) {
                const html = text.replace(new RegExp(this.highlightSearch.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i"), (s) => `<b>${s}</b>`);
                return React.createElement("span", { dangerouslySetInnerHTML: { __html: html } });
            }
            else
                return text;
        };
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Variables" },
            React.createElement("main", { className: "DatasetsIndexPage" },
                React.createElement(Forms_1.FieldsRow, null,
                    React.createElement("span", null,
                        "Showing ",
                        variablesToShow.length,
                        " of ",
                        numTotalRows,
                        " ",
                        "variables"),
                    React.createElement(Forms_1.SearchField, { placeholder: "Search all variables...", value: searchInput, onValue: mobx_1.action((v) => (this.searchInput = v)), autofocus: true })),
                React.createElement(VariableList_1.VariableList, { variables: variablesToShow, searchHighlight: highlight }),
                !searchInput && (React.createElement("button", { className: "btn btn-secondary", onClick: this.onShowMore }, "Show more variables...")))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchInput, maxVisibleRows } = this;
            const json = yield this.context.admin.getJSON("/api/variables.json", {
                search: searchInput,
                limit: maxVisibleRows,
            });
            mobx_1.runInAction(() => {
                if (searchInput === this.searchInput) {
                    // Make sure this response is current
                    this.variables = json.variables;
                    this.numTotalRows = json.numTotalRows;
                    this.highlightSearch = searchInput;
                }
            });
        });
    }
    componentDidMount() {
        this.dispose = mobx_1.reaction(() => this.searchInput || this.maxVisibleRows, lodash.debounce(() => this.getData(), 200));
        this.getData();
    }
    componentWillUnmount() {
        this.dispose();
    }
};
VariablesIndexPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], VariablesIndexPage.prototype, "variables", void 0);
__decorate([
    mobx_1.observable
], VariablesIndexPage.prototype, "maxVisibleRows", void 0);
__decorate([
    mobx_1.observable
], VariablesIndexPage.prototype, "numTotalRows", void 0);
__decorate([
    mobx_1.observable
], VariablesIndexPage.prototype, "searchInput", void 0);
__decorate([
    mobx_1.observable
], VariablesIndexPage.prototype, "highlightSearch", void 0);
__decorate([
    mobx_1.computed
], VariablesIndexPage.prototype, "variablesToShow", null);
__decorate([
    mobx_1.action.bound
], VariablesIndexPage.prototype, "onShowMore", null);
VariablesIndexPage = __decorate([
    mobx_react_1.observer
], VariablesIndexPage);
exports.VariablesIndexPage = VariablesIndexPage;
//# sourceMappingURL=VariablesIndexPage.js.map