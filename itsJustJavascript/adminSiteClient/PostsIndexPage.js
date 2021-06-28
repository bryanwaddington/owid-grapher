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
exports.PostsIndexPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const timeago_js_1 = require("timeago.js");
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const lodash = __importStar(require("lodash"));
const FuzzySearch_1 = require("../grapher/controls/FuzzySearch");
const AdminLayout_1 = require("./AdminLayout");
const Forms_1 = require("./Forms");
const AdminAppContext_1 = require("./AdminAppContext");
const clientSettings_1 = require("../settings/clientSettings");
let PostRow = class PostRow extends React.Component {
    saveTags(tags) {
        return __awaiter(this, void 0, void 0, function* () {
            const { post } = this.props;
            const json = yield this.context.admin.requestJSON(`/api/posts/${post.id}/setTags`, { tagIds: tags.map((t) => t.id) }, "POST");
            if (json.success) {
                mobx_1.runInAction(() => (post.tags = tags));
            }
        });
    }
    onSaveTags(tags) {
        this.saveTags(tags);
    }
    render() {
        const { post, highlight, availableTags } = this.props;
        return (React.createElement("tr", null,
            React.createElement("td", null, highlight(post.title) || "(no title)"),
            React.createElement("td", null, highlight(post.authors.join(", "))),
            React.createElement("td", null, post.type),
            React.createElement("td", null, post.status),
            React.createElement("td", { style: { minWidth: "380px" } },
                React.createElement(Forms_1.EditableTags, { tags: post.tags, suggestions: availableTags, onSave: this.onSaveTags })),
            React.createElement("td", null, timeago_js_1.format(post.updatedAt)),
            React.createElement("td", null,
                React.createElement("a", { href: `${clientSettings_1.WORDPRESS_URL}/wp/wp-admin/post.php?post=${post.id}&action=edit`, className: "btn btn-primary" }, "Edit"))));
    }
};
PostRow.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.action.bound
], PostRow.prototype, "onSaveTags", null);
PostRow = __decorate([
    mobx_react_1.observer
], PostRow);
let PostsIndexPage = class PostsIndexPage extends React.Component {
    constructor() {
        super(...arguments);
        this.posts = [];
        this.maxVisibleRows = 50;
        this.availableTags = [];
    }
    get searchIndex() {
        const searchIndex = [];
        for (const post of this.posts) {
            searchIndex.push({
                post: post,
                term: fuzzysort_1.default.prepare(post.title + " " + post.authors.join(", ")),
            });
        }
        return searchIndex;
    }
    get postsToShow() {
        const { searchInput, searchIndex, maxVisibleRows } = this;
        if (searchInput) {
            const results = fuzzysort_1.default.go(searchInput, searchIndex, {
                limit: 50,
                key: "term",
            });
            return lodash.uniq(results.map((result) => result.obj.post));
        }
        else {
            return this.posts.slice(0, maxVisibleRows);
        }
    }
    get numTotalRows() {
        return this.posts.length;
    }
    onSearchInput(input) {
        this.searchInput = input;
    }
    onShowMore() {
        this.maxVisibleRows += 100;
    }
    render() {
        const { postsToShow, searchInput, numTotalRows } = this;
        const highlight = (text) => {
            var _a;
            if (this.searchInput) {
                const html = (_a = FuzzySearch_1.highlight(fuzzysort_1.default.single(this.searchInput, text))) !== null && _a !== void 0 ? _a : text;
                return React.createElement("span", { dangerouslySetInnerHTML: { __html: html } });
            }
            else
                return text;
        };
        return (React.createElement(AdminLayout_1.AdminLayout, { title: "Posts" },
            React.createElement("main", { className: "PostsIndexPage" },
                React.createElement(Forms_1.FieldsRow, null,
                    React.createElement("span", null,
                        "Showing ",
                        postsToShow.length,
                        " of ",
                        numTotalRows,
                        " posts"),
                    React.createElement(Forms_1.SearchField, { placeholder: "Search all posts...", value: searchInput, onValue: this.onSearchInput, autofocus: true })),
                React.createElement("table", { className: "table table-bordered" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Title"),
                            React.createElement("th", null, "Authors"),
                            React.createElement("th", null, "Type"),
                            React.createElement("th", null, "Status"),
                            React.createElement("th", null, "Tags"),
                            React.createElement("th", null, "Last Updated"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, postsToShow.map((post) => (React.createElement(PostRow, { key: post.id, post: post, highlight: highlight, availableTags: this.availableTags }))))),
                !searchInput && (React.createElement("button", { className: "btn btn-secondary", onClick: this.onShowMore }, "Show more posts...")))));
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { admin } = this.context;
            if (admin.currentRequests.length > 0)
                return;
            const json = yield admin.getJSON("/api/posts.json");
            mobx_1.runInAction(() => {
                this.posts = json.posts;
            });
        });
    }
    getTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.context.admin.getJSON("/api/tags.json");
            mobx_1.runInAction(() => (this.availableTags = json.tags));
        });
    }
    componentDidMount() {
        this.getData();
        this.getTags();
    }
};
PostsIndexPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable
], PostsIndexPage.prototype, "posts", void 0);
__decorate([
    mobx_1.observable
], PostsIndexPage.prototype, "maxVisibleRows", void 0);
__decorate([
    mobx_1.observable
], PostsIndexPage.prototype, "searchInput", void 0);
__decorate([
    mobx_1.observable
], PostsIndexPage.prototype, "availableTags", void 0);
__decorate([
    mobx_1.computed
], PostsIndexPage.prototype, "searchIndex", null);
__decorate([
    mobx_1.computed
], PostsIndexPage.prototype, "postsToShow", null);
__decorate([
    mobx_1.computed
], PostsIndexPage.prototype, "numTotalRows", null);
__decorate([
    mobx_1.action.bound
], PostsIndexPage.prototype, "onSearchInput", null);
__decorate([
    mobx_1.action.bound
], PostsIndexPage.prototype, "onShowMore", null);
PostsIndexPage = __decorate([
    mobx_react_1.observer
], PostsIndexPage);
exports.PostsIndexPage = PostsIndexPage;
//# sourceMappingURL=PostsIndexPage.js.map