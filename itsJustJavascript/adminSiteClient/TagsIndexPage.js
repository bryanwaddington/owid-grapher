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
exports.TagsIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const lodash = __importStar(require("lodash"));
const react_router_dom_1 = require("react-router-dom");
const AdminLayout_1 = require("./AdminLayout");
const Forms_1 = require("./Forms");
const TagBadge_1 = require("./TagBadge");
const AdminAppContext_1 = require("./AdminAppContext");
let AddTagModal = class AddTagModal extends React.Component {
    constructor() {
        super(...arguments);
        this.tagName = "";
    }
    get tag() {
        if (!this.tagName)
            return undefined;
        return {
            parentId: this.props.parentId,
            name: this.tagName,
        };
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tag) {
                const resp = yield this.context.admin.requestJSON("/api/tags/new", { tag: this.tag }, "POST");
                if (resp.success) {
                    this.newTagId = resp.tagId;
                }
            }
        });
    }
    onTagName(tagName) {
        this.tagName = tagName;
    }
    render() {
        return (React.createElement(Forms_1.Modal, { onClose: this.props.onClose },
            React.createElement("form", { onSubmit: (e) => {
                    e.preventDefault();
                    this.submit();
                } },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("h5", { className: "modal-title" }, "Add category")),
                React.createElement("div", { className: "modal-body" },
                    React.createElement(Forms_1.TextField, { label: "Category Name", value: this.tagName, onValue: this.onTagName, autofocus: true, required: true })),
                React.createElement("div", { className: "modal-footer" },
                    React.createElement("input", { type: "submit", className: "btn btn-primary", value: "Add tag" }))),
            this.newTagId !== undefined && (React.createElement(react_router_dom_1.Redirect, { to: `/tags/${this.newTagId}` }))));
    }
};
AddTagModal.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], AddTagModal.prototype, "tagName", void 0);
__decorate([
    mobx_1.observable
], AddTagModal.prototype, "newTagId", void 0);
__decorate([
    mobx_1.computed
], AddTagModal.prototype, "tag", null);
__decorate([
    mobx_1.action.bound
], AddTagModal.prototype, "onTagName", null);
AddTagModal = __decorate([
    mobx_react_1.observer
], AddTagModal);
let TagsIndexPage = class TagsIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.isAddingTag = false;
    }
    get categoriesById() {
        return lodash.keyBy(this.tags, (t) => t.id);
    }
    get parentCategories() {
        const parentCategories = this.tags
            .filter((c) => !c.parentId)
            .map((c) => ({
            id: c.id,
            name: c.name,
            specialType: c.specialType,
            children: this.tags.filter((c2) => c2.parentId === c.id),
        }));
        return parentCategories;
    }
    onNewTag(parentId) {
        this.addTagParentId = parentId;
        this.isAddingTag = true;
    }
    render() {
        const { parentCategories } = this;
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Categories" },
            React.createElement("main", { className: "TagsIndexPage" },
                React.createElement(Forms_1.FieldsRow, null,
                    React.createElement("span", null,
                        "Showing ",
                        this.tags.length,
                        " tags")),
                React.createElement("p", null, "Tags are a way of organizing data. Each chart and dataset can be assigned any number of tags. A tag may be listed under another parent tag."),
                React.createElement("div", { className: "cardHolder" },
                    React.createElement("section", null,
                        React.createElement("h4", null, "Top-Level Categories"),
                        parentCategories.map((parent) => (React.createElement(TagBadge_1.TagBadge, { key: parent.id, tag: parent }))),
                        React.createElement("button", { className: "btn btn-default", onClick: () => this.onNewTag() }, "+ New Tag")),
                    parentCategories.map((parent) => (React.createElement("section", { key: `${parent.id}-section` },
                        React.createElement("h4", null, parent.name),
                        parent.specialType === "systemParent" && (React.createElement("p", null, "These are special categories that are assigned automatically.")),
                        parent.children.map((tag) => (React.createElement(TagBadge_1.TagBadge, { key: tag.id, tag: tag }))),
                        React.createElement("button", { className: "btn btn-default", onClick: () => this.onNewTag(parent.id) }, "+ New Tag")))))),
            this.isAddingTag && (React.createElement(AddTagModal, { parentId: this.addTagParentId, onClose: mobx_1.action(() => (this.isAddingTag = false)) }))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON("/api/tags.json");
            mobx_1.runInAction(() => {
                this.tags = json.tags;
            });
        });
    }
    componentDidMount() {
        this.getData();
    }
};
TagsIndexPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], TagsIndexPage.prototype, "tags", void 0);
__decorate([
    mobx_1.observable
], TagsIndexPage.prototype, "isAddingTag", void 0);
__decorate([
    mobx_1.observable
], TagsIndexPage.prototype, "addTagParentId", void 0);
__decorate([
    mobx_1.computed
], TagsIndexPage.prototype, "categoriesById", null);
__decorate([
    mobx_1.computed
], TagsIndexPage.prototype, "parentCategories", null);
__decorate([
    mobx_1.action.bound
], TagsIndexPage.prototype, "onNewTag", null);
TagsIndexPage = __decorate([
    mobx_react_1.observer
], TagsIndexPage);
exports.TagsIndexPage = TagsIndexPage;
//# sourceMappingURL=TagsIndexPage.js.map