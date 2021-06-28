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
exports.TagEditPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const react_router_dom_1 = require("react-router-dom");
const timeago_js_1 = require("timeago.js");
const AdminLayout_1 = require("./AdminLayout");
const Forms_1 = require("./Forms");
const DatasetList_1 = require("./DatasetList");
const ChartList_1 = require("./ChartList");
const TagBadge_1 = require("./TagBadge");
const AdminAppContext_1 = require("./AdminAppContext");
class TagEditable {
    constructor(json) {
        this.name = "";
        for (const key in this) {
            this[key] = json[key];
        }
    }
}
__decorate([
    mobx_1.observable
], TagEditable.prototype, "name", void 0);
__decorate([
    mobx_1.observable
], TagEditable.prototype, "parentId", void 0);
let TagEditor = class TagEditor extends React.Component {
    constructor() {
        super(...arguments);
        this.isDeleted = false;
    }
    // Store the original tag to determine when it is modified
    UNSAFE_componentWillMount() {
        this.UNSAFE_componentWillReceiveProps(this.props);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.newtag = new TagEditable(nextProps.tag);
        this.isDeleted = false;
    }
    get isModified() {
        return (JSON.stringify(this.newtag) !==
            JSON.stringify(new TagEditable(this.props.tag)));
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tag } = this.props;
            const json = yield this.context.admin.requestJSON(`/api/tags/${tag.id}`, { tag: this.newtag }, "PUT");
            if (json.success) {
                mobx_1.runInAction(() => {
                    Object.assign(this.props.tag, this.newtag);
                    this.props.tag.updatedAt = new Date().toString();
                });
            }
        });
    }
    deleteTag() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tag } = this.props;
            if (!window.confirm(`Really delete the category ${tag.name}? This action cannot be undone!`))
                return;
            const json = yield this.context.admin.requestJSON(`/api/tags/${tag.id}/delete`, {}, "DELETE");
            if (json.success) {
                mobx_1.runInAction(() => (this.isDeleted = true));
            }
        });
    }
    onChooseParent(parentId) {
        if (parentId === -1) {
            this.newtag.parentId = undefined;
        }
        else {
            this.newtag.parentId = parentId;
        }
    }
    get parentTag() {
        const { parentId } = this.props.tag;
        return parentId
            ? this.props.tag.possibleParents.find((c) => c.id === parentId)
            : undefined;
    }
    render() {
        const { tag } = this.props;
        const { newtag } = this;
        return (React.createElement("main", { className: "TagEditPage" },
            React.createElement(react_router_dom_1.Prompt, { when: this.isModified, message: "Are you sure you want to leave? Unsaved changes will be lost." }),
            React.createElement("section", null,
                React.createElement("h1", null,
                    "Tag: ",
                    tag.name),
                React.createElement("p", null,
                    "Last updated ",
                    timeago_js_1.format(tag.updatedAt))),
            React.createElement("section", null,
                React.createElement("form", { onSubmit: (e) => {
                        e.preventDefault();
                        this.save();
                    } },
                    React.createElement(Forms_1.BindString, { disabled: tag.isBulkImport, field: "name", store: newtag, label: "Name", helpText: "Category names should ideally be unique across the database and able to be understood without context" }),
                    !tag.isBulkImport && (React.createElement(Forms_1.FieldsRow, null,
                        React.createElement(Forms_1.NumericSelectField, { label: "Parent Category", value: newtag.parentId || -1, options: [-1].concat(tag.possibleParents.map((p) => p.id)), optionLabels: ["None"].concat(tag.possibleParents.map((p) => p.name)), onValue: this.onChooseParent }),
                        React.createElement("div", null,
                            React.createElement("br", null),
                            this.parentTag && (React.createElement(TagBadge_1.TagBadge, { tag: this.parentTag }))))),
                    !tag.isBulkImport && (React.createElement("div", null,
                        React.createElement("input", { type: "submit", className: "btn btn-success", value: "Update category" }),
                        " ",
                        tag.datasets.length === 0 &&
                            tag.children.length === 0 &&
                            !tag.specialType && (React.createElement("button", { className: "btn btn-danger", onClick: () => this.deleteTag() }, "Delete category")))))),
            tag.children.length > 0 && (React.createElement("section", null,
                React.createElement("h3", null, "Subcategories"),
                tag.children.map((c) => (React.createElement(TagBadge_1.TagBadge, { tag: c, key: c.id }))))),
            React.createElement("section", null,
                React.createElement("h3", null, "Datasets"),
                React.createElement(DatasetList_1.DatasetList, { datasets: tag.datasets })),
            React.createElement("section", null,
                React.createElement("h3", null, "Charts"),
                React.createElement(ChartList_1.ChartList, { charts: tag.charts })),
            this.isDeleted && React.createElement(react_router_dom_1.Redirect, { to: `/tags` })));
    }
};
TagEditor.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], TagEditor.prototype, "newtag", void 0);
__decorate([
    mobx_1.observable
], TagEditor.prototype, "isDeleted", void 0);
__decorate([
    mobx_1.computed
], TagEditor.prototype, "isModified", null);
__decorate([
    mobx_1.action.bound
], TagEditor.prototype, "onChooseParent", null);
__decorate([
    mobx_1.computed
], TagEditor.prototype, "parentTag", null);
TagEditor = __decorate([
    mobx_react_1.observer
], TagEditor);
let TagEditPage = class TagEditPage extends React.Component {
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, { title: this.tag && this.tag.name }, this.tag && React.createElement(TagEditor, { tag: this.tag })));
    }
    getData(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON(`/api/tags/${tagId}.json`);
            mobx_1.runInAction(() => {
                this.tag = json.tag;
            });
        });
    }
    componentDidMount() {
        this.getData(this.props.tagId);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.getData(nextProps.tagId);
    }
};
TagEditPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], TagEditPage.prototype, "tag", void 0);
TagEditPage = __decorate([
    mobx_react_1.observer
], TagEditPage);
exports.TagEditPage = TagEditPage;
//# sourceMappingURL=TagEditPage.js.map