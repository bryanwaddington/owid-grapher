"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.runSearchPage = exports.SearchPageMain = void 0;
const react_dom_1 = __importDefault(require("react-dom"));
const react_1 = __importDefault(require("react"));
const UrlUtils_1 = require("../clientUtils/urls/UrlUtils");
const searchClient_1 = require("./searchClient");
const SearchResults_1 = require("../site/SearchResults");
const mobx_react_1 = require("mobx-react");
const mobx_1 = require("mobx");
let SearchPageMain = class SearchPageMain extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.query = UrlUtils_1.getWindowQueryParams().q || "";
    }
    runSearch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield searchClient_1.siteSearch(query);
            if (this.lastQuery !== query) {
                // Don't need this result anymore
                return;
            }
            mobx_1.runInAction(() => (this.results = results));
        });
    }
    onSearch(query) {
        this.lastQuery = query;
        if (query) {
            this.runSearch(query);
        }
        else {
            this.results = undefined;
        }
    }
    componentDidMount() {
        const input = document.querySelector(".SearchPage > main > form input");
        input.value = this.query;
        input.focus();
        this.onSearch(this.query);
    }
    // dispose?: IReactionDisposer
    // componentDidMount() {
    //     this.dispose = autorun(() => this.onSearch(this.query))
    // }
    // componentWillUnmount() {
    //     if (this.dispose) this.dispose()
    // }
    onSearchInput(e) {
        this.query = e.currentTarget.value;
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null, this.results && react_1.default.createElement(SearchResults_1.SearchResults, { results: this.results })));
    }
};
__decorate([
    mobx_1.observable
], SearchPageMain.prototype, "query", void 0);
__decorate([
    mobx_1.observable.ref
], SearchPageMain.prototype, "results", void 0);
__decorate([
    mobx_1.action.bound
], SearchPageMain.prototype, "onSearch", null);
__decorate([
    mobx_1.action.bound
], SearchPageMain.prototype, "onSearchInput", null);
SearchPageMain = __decorate([
    mobx_react_1.observer
], SearchPageMain);
exports.SearchPageMain = SearchPageMain;
function runSearchPage() {
    react_dom_1.default.render(react_1.default.createElement(SearchPageMain, null), document.querySelector(".searchResults"));
}
exports.runSearchPage = runSearchPage;
//# sourceMappingURL=SearchPageMain.js.map