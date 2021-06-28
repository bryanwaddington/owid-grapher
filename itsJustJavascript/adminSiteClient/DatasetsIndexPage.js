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
exports.DatasetsIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const lodash = __importStar(require("lodash"));
const AdminLayout_1 = require("./AdminLayout");
const FuzzySearch_1 = require("../grapher/controls/FuzzySearch");
const Forms_1 = require("./Forms");
const DatasetList_1 = require("./DatasetList");
const AdminAppContext_1 = require("./AdminAppContext");
let DatasetsIndexPage = class DatasetsIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.datasets = [];
        this.maxVisibleRows = 50;
    }
    get searchIndex() {
        const searchIndex = [];
        for (const dataset of this.datasets) {
            searchIndex.push({
                dataset: dataset,
                term: fuzzysort_1.default.prepare(dataset.name +
                    " " +
                    dataset.tags.map((t) => t.name).join(" ") +
                    " " +
                    dataset.namespace +
                    " " +
                    dataset.dataEditedByUserName +
                    " " +
                    dataset.description),
            });
        }
        return searchIndex;
    }
    get datasetsToShow() {
        const { searchInput, searchIndex, maxVisibleRows } = this;
        if (searchInput) {
            const results = fuzzysort_1.default.go(searchInput, searchIndex, {
                limit: 50,
                key: "term",
            });
            return lodash.uniq(results.map((result) => result.obj.dataset));
        }
        else {
            return this.datasets.slice(0, maxVisibleRows);
        }
    }
    get namespaces() {
        return lodash.uniq(this.datasets.map((d) => d.namespace));
    }
    get numTotalRows() {
        return this.datasets.length;
    }
    onSearchInput(input) {
        this.searchInput = input;
    }
    onShowMore() {
        this.maxVisibleRows += 100;
    }
    render() {
        const { datasetsToShow, searchInput, numTotalRows } = this;
        const highlight = (text) => {
            var _a;
            if (this.searchInput) {
                const html = (_a = FuzzySearch_1.highlight(fuzzysort_1.default.single(this.searchInput, text))) !== null && _a !== void 0 ? _a : text;
                return React.createElement("span", { dangerouslySetInnerHTML: { __html: html } });
            }
            else
                return text;
        };
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Datasets" },
            React.createElement("main", { className: "DatasetsIndexPage" },
                React.createElement(Forms_1.FieldsRow, null,
                    React.createElement("span", null,
                        "Showing ",
                        datasetsToShow.length,
                        " of ",
                        numTotalRows,
                        " ",
                        "datasets"),
                    React.createElement(Forms_1.SearchField, { placeholder: "Search all datasets...", value: searchInput, onValue: this.onSearchInput, autofocus: true })),
                React.createElement(DatasetList_1.DatasetList, { datasets: datasetsToShow, searchHighlight: highlight }),
                !searchInput && (React.createElement("button", { className: "btn btn-secondary", onClick: this.onShowMore }, "Show more datasets...")))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin } = this.context;
            const json = yield admin.getJSON("/api/datasets.json");
            mobx_1.runInAction(() => {
                this.datasets = json.datasets;
            });
        });
    }
    componentDidMount() {
        this.getData();
    }
};
DatasetsIndexPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], DatasetsIndexPage.prototype, "datasets", void 0);
__decorate([
    mobx_1.observable
], DatasetsIndexPage.prototype, "maxVisibleRows", void 0);
__decorate([
    mobx_1.observable
], DatasetsIndexPage.prototype, "searchInput", void 0);
__decorate([
    mobx_1.computed
], DatasetsIndexPage.prototype, "searchIndex", null);
__decorate([
    mobx_1.computed
], DatasetsIndexPage.prototype, "datasetsToShow", null);
__decorate([
    mobx_1.computed
], DatasetsIndexPage.prototype, "namespaces", null);
__decorate([
    mobx_1.computed
], DatasetsIndexPage.prototype, "numTotalRows", null);
__decorate([
    mobx_1.action.bound
], DatasetsIndexPage.prototype, "onSearchInput", null);
__decorate([
    mobx_1.action.bound
], DatasetsIndexPage.prototype, "onShowMore", null);
DatasetsIndexPage = __decorate([
    mobx_react_1.observer
], DatasetsIndexPage);
exports.DatasetsIndexPage = DatasetsIndexPage;
//# sourceMappingURL=DatasetsIndexPage.js.map