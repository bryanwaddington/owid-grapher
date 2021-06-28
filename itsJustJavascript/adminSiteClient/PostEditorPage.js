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
exports.PostEditorPage = void 0;
const React = __importStar(require("react"));
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
const Forms_1 = require("./Forms");
const AdminLayout_1 = require("./AdminLayout");
const AdminAppContext_1 = require("./AdminAppContext");
class PostEditor extends React.Component {
    render() {
        const { post } = this.props;
        return (React.createElement("div", { className: "PostEditor" },
            React.createElement(Forms_1.BindString, { store: post, field: "title" }),
            React.createElement(Forms_1.BindString, { store: post, field: "slug" }),
            React.createElement(Forms_1.BindString, { store: post, field: "content", textarea: true })));
    }
}
let PostEditorPage = class PostEditorPage extends React.Component {
    fetchPost() {
        return __awaiter(this, void 0, void 0, function* () {
            const { postId } = this.props;
            const { admin } = this.context;
            const json = yield admin.getJSON(`/api/posts/${postId}.json`);
            mobx_1.runInAction(() => (this.post = json));
        });
    }
    componentDidMount() {
        this.fetchPost();
    }
    render() {
        return (React.createElement(AdminLayout_1.AdminLayout, null,
            React.createElement("main", { className: "PostEditorPage" }, this.post ? (React.createElement(PostEditor, { post: this.post })) : (React.createElement(Forms_1.LoadingBlocker, null)))));
    }
};
PostEditorPage.contextType = AdminAppContext_1.AdminAppContext;
__decorate([
    mobx_1.observable.ref
], PostEditorPage.prototype, "post", void 0);
PostEditorPage = __decorate([
    mobx_react_1.observer
], PostEditorPage);
exports.PostEditorPage = PostEditorPage;
//# sourceMappingURL=PostEditorPage.js.map