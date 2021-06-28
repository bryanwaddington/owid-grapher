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
exports.ChartList = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const timeago_js_1 = require("timeago.js");
const lodash = __importStar(require("lodash"));
const Link_1 = require("./Link");
const decko_1 = require("decko");
const Forms_1 = require("./Forms");
const AdminAppContext_1 = require("./AdminAppContext");
const clientSettings_1 = require("../settings/clientSettings");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const Util_1 = require("../clientUtils/Util");
function showChartType(chart) {
    var _a;
    const chartType = (_a = chart.type) !== null && _a !== void 0 ? _a : GrapherConstants_1.ChartTypeName.LineChart;
    const displayType = GrapherConstants_1.ChartTypeName[chartType]
        ? Util_1.startCase(GrapherConstants_1.ChartTypeName[chartType])
        : "Unknown";
    if (chart.tab === "map") {
        if (chart.hasChartTab)
            return `Map + ${displayType}`;
        else
            return "Map";
    }
    else {
        if (chart.hasMapTab)
            return `${displayType} + Map`;
        else
            return displayType;
    }
}
let ChartRow = class ChartRow extends React.Component {
    saveTags(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const { chart } = this.props;
            const json = yield this.context.admin.requestJSON(`/api/charts/${chart.id}/setTags`, { tagIds: tags.map((t) => t.id) }, "POST");
            if (json.success) {
                mobx_1.runInAction(() => (chart.tags = tags));
            }
        });
    }
    onSaveTags(tags) {
        this.saveTags(tags);
    }
    render() {
        var _a, _b;
        const { chart, searchHighlight, availableTags } = this.props;
        const highlight = searchHighlight || lodash.identity;
        return (React.createElement("tr", null,
            React.createElement("td", { style: { minWidth: "140px", width: "12.5%" } }, chart.isPublished && (React.createElement("a", { href: `${clientSettings_1.BAKED_GRAPHER_URL}/${chart.slug}` },
                React.createElement("img", { src: `${clientSettings_1.BAKED_GRAPHER_URL}/exports/${chart.slug}.svg`, className: "chartPreview" })))),
            React.createElement("td", { style: { minWidth: "180px" } },
                chart.isPublished ? (React.createElement("a", { href: `${clientSettings_1.BAKED_GRAPHER_URL}/${chart.slug}` }, highlight((_a = chart.title) !== null && _a !== void 0 ? _a : ""))) : (React.createElement("span", null,
                    React.createElement("span", { style: { color: "red" } }, "Draft: "),
                    " ",
                    highlight((_b = chart.title) !== null && _b !== void 0 ? _b : ""))),
                " ",
                chart.variantName ? (React.createElement("span", { style: { color: "#aaa" } },
                    "(",
                    highlight(chart.variantName),
                    ")")) : undefined,
                chart.internalNotes && (React.createElement("div", { className: "internalNotes" }, highlight(chart.internalNotes)))),
            React.createElement("td", { style: { minWidth: "100px" } }, chart.id),
            React.createElement("td", { style: { minWidth: "100px" } }, showChartType(chart)),
            React.createElement("td", { style: { minWidth: "340px" } },
                React.createElement(Forms_1.EditableTags, { tags: chart.tags, suggestions: availableTags, onSave: this.onSaveTags })),
            React.createElement("td", null,
                chart.publishedAt && timeago_js_1.format(chart.publishedAt),
                chart.publishedBy && (React.createElement("span", null,
                    " by ",
                    highlight(chart.publishedBy)))),
            React.createElement("td", null,
                timeago_js_1.format(chart.lastEditedAt),
                " by",
                " ",
                highlight(chart.lastEditedBy)),
            React.createElement("td", null,
                React.createElement(Link_1.Link, { to: `/charts/${chart.id}/edit`, className: "btn btn-primary" }, "Edit")),
            React.createElement("td", null,
                React.createElement("button", { className: "btn btn-danger", onClick: () => this.props.onDelete(chart) }, "Delete"))));
    }
};
ChartRow.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.action.bound
], ChartRow.prototype, "onSaveTags", null);
ChartRow = __decorate([
    mobx_react_1.observer
], ChartRow);
let ChartList = class ChartList extends React.Component {
    constructor() {
        super(...arguments);
        this.availableTags = [];
    }
    onDeleteChart(chart) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!window.confirm(`Delete the chart ${chart.slug}? This action cannot be undone!`))
                return;
            const json = yield this.context.admin.requestJSON(`/api/charts/${chart.id}`, {}, "DELETE");
            if (json.success) {
                if (this.props.onDelete)
                    this.props.onDelete(chart);
                else
                    mobx_1.runInAction(() => this.props.charts.splice(this.props.charts.indexOf(chart), 1));
            }
        });
    }
    onStar(chart) {
        return __awaiter(this, void 0, void 0, function* () {
            if (chart.isStarred)
                return;
            const json = yield this.context.admin.requestJSON(`/api/charts/${chart.id}/star`, {}, "POST");
            if (json.success) {
                mobx_1.runInAction(() => {
                    for (const otherChart of this.props.charts) {
                        if (otherChart === chart) {
                            otherChart.isStarred = true;
                        }
                        else if (otherChart.isStarred) {
                            otherChart.isStarred = false;
                        }
                    }
                });
            }
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON("/api/tags.json");
            mobx_1.runInAction(() => (this.availableTags = json.tags));
        });
    }
    componentDidMount() {
        this.getTags();
    }
    render() {
        const { charts, searchHighlight } = this.props;
        const { availableTags } = this;
        return (React.createElement("table", { className: "table table-bordered" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null),
                    React.createElement("th", null, "Chart"),
                    React.createElement("th", null, "Id"),
                    React.createElement("th", null, "Type"),
                    React.createElement("th", null, "Tags"),
                    React.createElement("th", null, "Published"),
                    React.createElement("th", null, "Last Updated"),
                    React.createElement("th", null),
                    React.createElement("th", null))),
            React.createElement("tbody", null, charts.map((chart) => (React.createElement(ChartRow, { chart: chart, key: chart.id, availableTags: availableTags, searchHighlight: searchHighlight, onDelete: this.onDeleteChart, onStar: this.onStar }))))));
    }
};
ChartList.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], ChartList.prototype, "availableTags", void 0);
__decorate([
    decko_1.bind
], ChartList.prototype, "onDeleteChart", null);
__decorate([
    decko_1.bind
], ChartList.prototype, "onStar", null);
__decorate([
    decko_1.bind
], ChartList.prototype, "getTags", null);
ChartList = __decorate([
    mobx_react_1.observer
], ChartList);
exports.ChartList = ChartList;
//# sourceMappingURL=ChartList.js.map