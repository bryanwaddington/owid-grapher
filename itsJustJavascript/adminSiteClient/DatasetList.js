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
exports.DatasetList = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const timeago_js_1 = require("timeago.js");
const lodash = __importStar(require("lodash"));
const decko_1 = require("decko");
const Link_1 = require("./Link");
const AdminAppContext_1 = require("./AdminAppContext");
const Forms_1 = require("./Forms");
let DatasetRow = class DatasetRow extends React.Component {
    saveTags(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dataset } = this.props;
            const json = yield this.context.admin.requestJSON(`/api/datasets/${dataset.id}/setTags`, { tagIds: tags.map((t) => t.id) }, "POST");
            if (json.success) {
                dataset.tags = tags;
            }
        });
    }
    onSaveTags(tags) {
        this.saveTags(tags);
    }
    render() {
        const { dataset, searchHighlight, availableTags } = this.props;
        const highlight = searchHighlight || lodash.identity;
        return (React.createElement("tr", null,
            React.createElement("td", null, dataset.namespace),
            React.createElement("td", null,
                dataset.isPrivate ? (React.createElement("span", { className: "text-secondary" }, "Unpublished: ")) : (""),
                React.createElement(Link_1.Link, { to: `/datasets/${dataset.id}` }, highlight(dataset.name))),
            React.createElement("td", null, highlight(dataset.description)),
            React.createElement("td", null,
                React.createElement(Forms_1.EditableTags, { tags: dataset.tags, suggestions: availableTags, onSave: this.onSaveTags, disabled: dataset.namespace !== "owid" })),
            React.createElement("td", null,
                timeago_js_1.format(dataset.dataEditedAt),
                " by",
                " ",
                highlight(dataset.dataEditedByUserName))));
    }
};
DatasetRow.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.action.bound
], DatasetRow.prototype, "onSaveTags", null);
DatasetRow = __decorate([
    mobx_react_1.observer
], DatasetRow);
let DatasetList = class DatasetList extends React.Component {
    constructor() {
        super(...arguments);
        this.availableTags = [];
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON("/api/tags.json");
            this.availableTags = json.tags;
        });
    }
    componentDidMount() {
        this.getTags();
    }
    render() {
        const { props } = this;
        return (React.createElement("table", { className: "table table-bordered" },
            React.createElement("thead", null,
                React.createElement("tr", null,
                    React.createElement("th", null, "Dataspace"),
                    React.createElement("th", null, "Dataset"),
                    React.createElement("th", null, "Notes"),
                    React.createElement("th", null, "Tags"),
                    React.createElement("th", null, "Uploaded"))),
            React.createElement("tbody", null, props.datasets.map((dataset) => (React.createElement(DatasetRow, { dataset: dataset, availableTags: this.availableTags, key: dataset.id, searchHighlight: props.searchHighlight }))))));
    }
};
DatasetList.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], DatasetList.prototype, "availableTags", void 0);
__decorate([
    decko_1.bind
], DatasetList.prototype, "getTags", null);
DatasetList = __decorate([
    mobx_react_1.observer
], DatasetList);
exports.DatasetList = DatasetList;
//# sourceMappingURL=DatasetList.js.map