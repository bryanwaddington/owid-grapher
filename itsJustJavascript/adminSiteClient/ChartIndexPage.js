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
exports.ChartIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const Forms_1 = require("./Forms");
const AdminLayout_1 = require("./AdminLayout");
const Util_1 = require("../clientUtils/Util");
const FuzzySearch_1 = require("../grapher/controls/FuzzySearch");
const ChartList_1 = require("./ChartList");
const AdminAppContext_1 = require("./AdminAppContext");
let ChartIndexPage = class ChartIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.maxVisibleCharts = 50;
        this.charts = [];
    }
    get numTotalCharts() {
        return this.charts.length;
    }
    get searchIndex() {
        const searchIndex = [];
        for (const chart of this.charts) {
            searchIndex.push({
                chart: chart,
                term: fuzzysort_1.default.prepare(`${chart.title} ${chart.variantName || ""} ${chart.internalNotes || ""} ${chart.publishedBy} ${chart.lastEditedBy}`),
            });
        }
        return searchIndex;
    }
    get chartsToShow() {
        const { searchInput, searchIndex, maxVisibleCharts } = this;
        if (searchInput) {
            const results = fuzzysort_1.default.go(searchInput, searchIndex, {
                limit: 50,
                key: "term",
            });
            return Util_1.uniq(results.map((result) => result.obj.chart));
        }
        else {
            return this.charts.slice(0, maxVisibleCharts);
        }
    }
    onSearchInput(input) {
        this.searchInput = input;
    }
    onShowMore() {
        this.maxVisibleCharts += 100;
    }
    render() {
        const { chartsToShow, searchInput, numTotalCharts } = this;
        const highlight = (text) => {
            var _a;
            if (this.searchInput) {
                const html = (_a = FuzzySearch_1.highlight(fuzzysort_1.default.single(this.searchInput, text))) !== null && _a !== void 0 ? _a : text;
                return React.createElement("span", { dangerouslySetInnerHTML: { __html: html } });
            }
            else
                return text;
        };
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Charts" },
            React.createElement("main", { className: "ChartIndexPage" },
                React.createElement("div", { className: "topRow" },
                    React.createElement("span", null,
                        "Showing ",
                        chartsToShow.length,
                        " of ",
                        numTotalCharts,
                        " ",
                        "charts"),
                    React.createElement(Forms_1.TextField, { placeholder: "Search all charts...", value: searchInput, onValue: this.onSearchInput, autofocus: true })),
                React.createElement(ChartList_1.ChartList, { charts: chartsToShow, searchHighlight: highlight, onDelete: mobx_1.action((c) => this.charts.splice(this.charts.indexOf(c), 1)) }),
                !searchInput && (React.createElement("button", { className: "btn btn-secondary", onClick: this.onShowMore }, "Show more charts...")))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin } = this.context;
            const json = yield admin.getJSON("/api/charts.json");
            mobx_1.runInAction(() => {
                this.charts = json.charts;
            });
        });
    }
    componentDidMount() {
        this.getData();
    }
};
ChartIndexPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], ChartIndexPage.prototype, "searchInput", void 0);
__decorate([
    mobx_1.observable
], ChartIndexPage.prototype, "maxVisibleCharts", void 0);
__decorate([
    mobx_1.observable
], ChartIndexPage.prototype, "charts", void 0);
__decorate([
    mobx_1.computed
], ChartIndexPage.prototype, "numTotalCharts", null);
__decorate([
    mobx_1.computed
], ChartIndexPage.prototype, "searchIndex", null);
__decorate([
    mobx_1.computed
], ChartIndexPage.prototype, "chartsToShow", null);
__decorate([
    mobx_1.action.bound
], ChartIndexPage.prototype, "onSearchInput", null);
__decorate([
    mobx_1.action.bound
], ChartIndexPage.prototype, "onShowMore", null);
ChartIndexPage = __decorate([
    mobx_react_1.observer
], ChartIndexPage);
exports.ChartIndexPage = ChartIndexPage;
//# sourceMappingURL=ChartIndexPage.js.map