"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCountryProfilePage = void 0;
const fuzzysort_1 = __importDefault(require("fuzzysort"));
const Util_1 = require("../clientUtils/Util");
const mobx_1 = require("mobx");
const FuzzySearch_1 = require("../grapher/controls/FuzzySearch");
const SiteAnalytics_1 = require("./SiteAnalytics");
function encodeHashSafe(s) {
    return encodeURIComponent(s.replace(/ /g, "-"));
}
function decodeHashSafe(s) {
    return decodeURIComponent(s).replace(/-/g, " ");
}
class ChartFilter {
    constructor() {
        this.chartItems = [];
        this.chartItemsByTitle = {};
        this.results = [];
        this.sections = [];
        this.query = "";
        this.analytics = new SiteAnalytics_1.SiteAnalytics();
        this.searchInput = document.querySelector(".chartsSearchInput");
        this.sections = Array.from(document.querySelectorAll(".CountryProfilePage main section"));
        const lis = Array.from(document.querySelectorAll(".CountryProfilePage main li"));
        this.chartItems = lis.map((li) => ({
            title: li.firstChild.textContent.replace(/₂/g, "2"),
            li: li,
            ul: li.closest("ul"),
        }));
        this.chartItemsByTitle = Util_1.keyBy(this.chartItems, "title");
        this.strings = this.chartItems.map((c) => fuzzysort_1.default.prepare(c.title));
    }
    get searchStrings() {
        return this.chartItems.map((c) => fuzzysort_1.default.prepare(c.title));
    }
    get searchResults() {
        return fuzzysort_1.default.go(this.query, this.searchStrings, { threshold: -150 });
    }
    get resultsByTitle() {
        return Util_1.keyBy(this.searchResults, "target");
    }
    logSearchQuery() {
        this.analytics.logChartsPageSearchQuery(this.query);
    }
    onSearchInput() {
        this.query = this.searchInput.value;
        if (this.timeout !== undefined) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(this.logSearchQuery, 500);
    }
    /*@action.bound onKeydown(ev: KeyboardEvent) {
        if (ev.keyCode === 13 && this.query && this.searchResults.length) {
            const href = this.chartItemsByTitle[this.searchResults[0].target].li.children[0].getAttribute('href') as string
            window.location.assign(href)
        }
    }*/
    render() {
        var _a;
        history.replaceState(null, document.title, window.location.pathname +
            (this.query ? `#search=${encodeHashSafe(this.query)}` : ""));
        if (!this.query) {
            for (const section of this.sections) {
                section.style.display = "";
            }
            for (const c of this.chartItems) {
                c.ul.append(c.li);
                c.li.style.display = "";
                c.li.children[0].children[0].innerHTML = c.title;
            }
            return;
        }
        /*for (let i = this.searchResults.length-1; i >= 0; i--) {
            const c = this.chartItemsByTitle[this.searchResults[i].target]
            c.ul.prepend(c.li)
        }*/
        for (const c of this.chartItems) {
            const res = this.resultsByTitle[c.title];
            if (!res) {
                c.li.style.display = "none";
            }
            else {
                c.li.style.display = "";
                c.li.children[0].children[0].innerHTML =
                    (_a = FuzzySearch_1.highlight(res)) !== null && _a !== void 0 ? _a : "";
            }
        }
        // Ensure tag headings are only shown if they have charts under them
        for (const section of this.sections) {
            if (!Array.from(section.querySelectorAll("li")).some((li) => li.style.display !== "none")) {
                section.style.display = "none";
            }
            else {
                section.style.display = "";
            }
        }
    }
    run() {
        this.searchInput.addEventListener("input", this.onSearchInput);
        //this.searchInput.addEventListener('keydown', this.onKeydown)
        mobx_1.autorun(() => this.render());
        const m = window.location.hash.match(/search=(.+)/);
        if (m) {
            this.searchInput.value = decodeHashSafe(m[1]);
        }
        this.query = this.searchInput.value;
    }
}
__decorate([
    mobx_1.observable
], ChartFilter.prototype, "query", void 0);
__decorate([
    mobx_1.computed
], ChartFilter.prototype, "searchStrings", null);
__decorate([
    mobx_1.computed
], ChartFilter.prototype, "searchResults", null);
__decorate([
    mobx_1.computed
], ChartFilter.prototype, "resultsByTitle", null);
__decorate([
    mobx_1.action.bound
], ChartFilter.prototype, "logSearchQuery", null);
__decorate([
    mobx_1.action.bound
], ChartFilter.prototype, "onSearchInput", null);
__decorate([
    mobx_1.action.bound
], ChartFilter.prototype, "run", null);
function runCountryProfilePage() {
    const searcher = new ChartFilter();
    searcher.run();
}
exports.runCountryProfilePage = runCountryProfilePage;
//# sourceMappingURL=runCountryProfilePage.js.map