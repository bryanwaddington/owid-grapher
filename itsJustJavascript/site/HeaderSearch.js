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
exports.HeaderSearch = void 0;
const React = __importStar(require("react"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const SearchResults_1 = require("./SearchResults");
const searchClient_1 = require("./searchClient");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faSearch_1 = require("@fortawesome/free-solid-svg-icons/faSearch");
class HeaderSearchResults extends React.Component {
    componentDidMount() {
        document.body.style.overflowY = "hidden";
    }
    componentWillUnmount() {
        document.body.style.overflowY = "";
    }
    render() {
        return React.createElement(SearchResults_1.SearchResults, { results: this.props.results });
    }
}
let HeaderSearch = class HeaderSearch extends React.Component {
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
    onSearch(e) {
        const value = e.currentTarget.value;
        this.lastQuery = value;
        if (value) {
            this.runSearch(value);
        }
        else {
            this.results = undefined;
        }
    }
    render() {
        const { results } = this;
        return (React.createElement("form", { action: "/search", method: "GET", className: "HeaderSearch" },
            React.createElement("input", { type: "search", name: "q", onChange: (e) => this.onSearch(e), placeholder: "Search...", autoFocus: this.props.autoFocus }),
            React.createElement("div", { className: "icon" },
                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearch_1.faSearch })),
            results && React.createElement(HeaderSearchResults, { results: results })));
    }
};
__decorate([
    mobx_1.observable.ref
], HeaderSearch.prototype, "results", void 0);
__decorate([
    mobx_1.action.bound
], HeaderSearch.prototype, "onSearch", null);
HeaderSearch = __decorate([
    mobx_react_1.observer
], HeaderSearch);
exports.HeaderSearch = HeaderSearch;
//# sourceMappingURL=HeaderSearch.js.map