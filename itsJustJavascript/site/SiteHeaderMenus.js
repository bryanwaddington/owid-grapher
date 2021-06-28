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
exports.runHeaderMenus = void 0;
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const HeaderSearch_1 = require("./HeaderSearch");
const classnames_1 = __importDefault(require("classnames"));
const Util_1 = require("../clientUtils/Util");
const decko_1 = require("decko");
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faSearch_1 = require("@fortawesome/free-solid-svg-icons/faSearch");
const faBars_1 = require("@fortawesome/free-solid-svg-icons/faBars");
const faExternalLinkAlt_1 = require("@fortawesome/free-solid-svg-icons/faExternalLinkAlt");
const faAngleDown_1 = require("@fortawesome/free-solid-svg-icons/faAngleDown");
const faAngleUp_1 = require("@fortawesome/free-solid-svg-icons/faAngleUp");
const faEnvelopeOpenText_1 = require("@fortawesome/free-solid-svg-icons/faEnvelopeOpenText");
const AmazonMenu_1 = require("./AmazonMenu");
const NewsletterSubscription_1 = require("./NewsletterSubscription");
const SiteAnalytics_1 = require("./SiteAnalytics");
const clientSettings_1 = require("../settings/clientSettings");
const analytics = new SiteAnalytics_1.SiteAnalytics(clientSettings_1.ENV);
let Header = class Header extends React.Component {
    constructor() {
        super(...arguments);
        this.dropdownIsOpen = false;
        // Mobile menu toggles
        this.showSearch = false;
        this.showCategories = false;
        this.showNewsletterSubscription = false;
    }
    componentDidMount() {
        this.dispose = mobx_1.reaction(() => this.dropdownIsOpen, () => {
            if (this.dropdownIsOpen)
                this.dropdownLastOpened = Date.now();
        });
    }
    componentWillUnmount() {
        this.dispose();
    }
    onToggleSearch() {
        this.showSearch = !this.showSearch;
    }
    onToggleCategories() {
        this.showCategories = !this.showCategories;
    }
    onToggleNewsletterSubscription() {
        this.showNewsletterSubscription = !this.showNewsletterSubscription;
    }
    setOpen(open) {
        this.dropdownIsOpen = open;
        this.clearOpenTimeout();
        this.clearCloseTimeout();
    }
    scheduleOpenTimeout(delay) {
        this.dropdownOpenTimeoutId = window.setTimeout(() => {
            this.setOpen(true);
            analytics.logSiteClick("header-open-menu", "Articles by topic");
        }, delay);
        this.clearCloseTimeout();
    }
    scheduleCloseTimeout(delay) {
        this.dropdownCloseTimeoutId = window.setTimeout(() => this.setOpen(false), delay);
        this.clearOpenTimeout();
    }
    clearOpenTimeout() {
        if (this.dropdownOpenTimeoutId) {
            clearTimeout(this.dropdownOpenTimeoutId);
            this.dropdownOpenTimeoutId = undefined;
        }
    }
    clearCloseTimeout() {
        if (this.dropdownCloseTimeoutId) {
            clearTimeout(this.dropdownCloseTimeoutId);
            this.dropdownCloseTimeoutId = undefined;
        }
    }
    onDropdownButtonClick(event) {
        event.preventDefault();
        // Only close the menu if it's been open for a while, to avoid accidentally closing it while it's appearing.
        if (this.dropdownIsOpen &&
            this.dropdownLastOpened !== undefined &&
            this.dropdownLastOpened + 500 < Date.now()) {
            this.setOpen(false);
        }
        else {
            this.setOpen(true);
        }
    }
    render() {
        const { categories, baseUrl } = this.props;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "wrapper site-navigation-bar" },
                React.createElement("div", { className: "site-logo" },
                    React.createElement("a", { href: "/", "data-track-note": "header-navigation" },
                        "Our World",
                        React.createElement("br", null),
                        " in Data")),
                React.createElement("nav", { className: "site-navigation" },
                    React.createElement("div", { className: "topics-button-wrapper" },
                        React.createElement("a", { href: "/#entries", className: classnames_1.default("topics-button", {
                                active: this.dropdownIsOpen,
                            }), onMouseEnter: () => this.scheduleOpenTimeout(200), onMouseLeave: () => this.scheduleCloseTimeout(100), onClick: this.onDropdownButtonClick },
                            React.createElement("div", { className: "label" },
                                "Articles ",
                                React.createElement("br", null),
                                React.createElement("strong", null, "by topic")),
                            React.createElement("div", { className: "icon" },
                                React.createElement("svg", { width: "12", height: "6" },
                                    React.createElement("path", { d: "M0,0 L12,0 L6,6 Z", fill: "currentColor" })))),
                        React.createElement(DesktopTopicsMenu, { categories: categories, isOpen: this.dropdownIsOpen, onMouseEnter: () => this.setOpen(true), onMouseLeave: () => this.scheduleCloseTimeout(350) })),
                    React.createElement("div", null,
                        React.createElement("div", { className: "site-primary-navigation" },
                            React.createElement(HeaderSearch_1.HeaderSearch, null),
                            React.createElement("ul", { className: "site-primary-links" },
                                React.createElement("li", null,
                                    React.createElement("a", { href: "/blog", "data-track-note": "header-navigation" }, "Latest")),
                                React.createElement("li", null,
                                    React.createElement("a", { href: "/about", "data-track-note": "header-navigation" }, "About")),
                                React.createElement("li", null,
                                    React.createElement("a", { href: "/donate", "data-track-note": "header-navigation" }, "Donate")))),
                        React.createElement("div", { className: "site-secondary-navigation" },
                            React.createElement("ul", { className: "site-secondary-links" },
                                React.createElement("li", null,
                                    React.createElement("a", { href: "/charts", "data-track-note": "header-navigation" }, "All charts")),
                                React.createElement("li", null,
                                    React.createElement("a", { href: "https://sdg-tracker.org", "data-track-note": "header-navigation" }, "Sustainable Development Goals Tracker")))))),
                React.createElement("div", { className: "header-logos-wrapper" },
                    React.createElement("a", { href: "https://www.oxfordmartin.ox.ac.uk/global-development", className: "oxford-logo" },
                        React.createElement("img", { src: `${baseUrl}/oms-logo.svg`, alt: "Oxford Martin School logo" })),
                    React.createElement("a", { href: "https://global-change-data-lab.org/", className: "gcdl-logo" },
                        React.createElement("img", { src: `${baseUrl}/gcdl-logo.svg`, alt: "Global Change Data Lab logo" }))),
                React.createElement("div", { className: "mobile-site-navigation" },
                    React.createElement("button", { onClick: this.onToggleSearch, "data-track-note": "mobile-search-button" },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faSearch_1.faSearch })),
                    React.createElement("button", { onClick: this.onToggleNewsletterSubscription, "data-track-note": "mobile-newsletter-button" },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faEnvelopeOpenText_1.faEnvelopeOpenText })),
                    React.createElement("button", { onClick: this.onToggleCategories, "data-track-note": "mobile-hamburger-button" },
                        React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faBars_1.faBars })))),
            this.showSearch && (React.createElement("div", { className: "search-dropdown sm-only" },
                React.createElement("form", { id: "search-nav", action: "/search", method: "GET" },
                    React.createElement("input", { type: "search", name: "q", placeholder: "Search...", autoFocus: true })))),
            this.showNewsletterSubscription && (React.createElement("div", { className: "newsletter-subscription" },
                React.createElement("div", { className: "box" },
                    React.createElement(NewsletterSubscription_1.NewsletterSubscriptionForm, { context: NewsletterSubscription_1.NewsletterSubscriptionContext.MobileMenu })))),
            this.showCategories && (React.createElement(MobileTopicsMenu, { categories: this.props.categories }))));
    }
};
__decorate([
    mobx_1.observable.ref
], Header.prototype, "dropdownIsOpen", void 0);
__decorate([
    mobx_1.observable
], Header.prototype, "showSearch", void 0);
__decorate([
    mobx_1.observable
], Header.prototype, "showCategories", void 0);
__decorate([
    mobx_1.observable
], Header.prototype, "showNewsletterSubscription", void 0);
__decorate([
    mobx_1.action.bound
], Header.prototype, "onToggleSearch", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "onToggleCategories", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "onToggleNewsletterSubscription", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "setOpen", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "scheduleOpenTimeout", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "scheduleCloseTimeout", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "clearOpenTimeout", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "clearCloseTimeout", null);
__decorate([
    mobx_1.action.bound
], Header.prototype, "onDropdownButtonClick", null);
Header = __decorate([
    mobx_react_1.observer
], Header);
const renderEntry = (entry) => {
    return (React.createElement("li", { key: entry.slug },
        React.createElement("a", { href: `/${entry.slug}`, className: "item", "data-track-note": "header-navigation" },
            React.createElement("span", { className: "label" }, entry.title))));
};
const allEntries = (category) => {
    // combine "direct" entries and those from subcategories
    return [
        ...category.entries,
        ...Util_1.flatten(category.subcategories.map((subcategory) => subcategory.entries)),
    ];
};
let DesktopTopicsMenu = class DesktopTopicsMenu extends React.Component {
    constructor() {
        super(...arguments);
        this.submenuRef = React.createRef();
    }
    setCategory(category) {
        this.activeCategory = category;
    }
    onActivate(categorySlug) {
        if (!categorySlug)
            return;
        const category = this.props.categories.find((cat) => cat.slug === categorySlug);
        if (category)
            this.setCategory(category);
    }
    onDeactivate(categorySlug) {
        if (!categorySlug)
            return;
        const category = this.props.categories.find((cat) => cat.slug === categorySlug);
        if (category === this.activeCategory)
            this.setCategory(undefined);
    }
    render() {
        const { activeCategory } = this;
        const { categories, isOpen, onMouseEnter, onMouseLeave } = this.props;
        let sizeClass = "";
        if (activeCategory) {
            sizeClass =
                // Count root and subcategories entries
                activeCategory.subcategories.reduce((acc, subcategory) => subcategory.entries.length + acc, activeCategory.entries.length) > 10
                    ? "two-column"
                    : "one-column";
        }
        return (React.createElement("div", { className: classnames_1.default("topics-dropdown", sizeClass, {
                open: isOpen,
            }), onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, "aria-hidden": isOpen },
            React.createElement("div", { className: "menu" },
                React.createElement(AmazonMenu_1.AmazonMenu, { onActivate: this.onActivate, onDeactivate: this.onDeactivate, submenuRect: this.submenuRef.current &&
                        this.submenuRef.current.getBoundingClientRect() },
                    React.createElement("ul", null,
                        categories.map((category) => (React.createElement("li", { key: category.slug, className: category === activeCategory
                                ? "active item"
                                : "item", "data-submenu-id": category.slug },
                            React.createElement("span", { className: "label" }, category.name),
                            React.createElement("span", { className: "icon" },
                                React.createElement("svg", { width: "5", height: "10" },
                                    React.createElement("path", { d: "M0,0 L5,5 L0,10 Z", fill: "currentColor" })))))),
                        React.createElement("hr", null),
                        React.createElement("a", { href: "http://sdg-tracker.org", className: "item", "data-submenu-id": true, "data-track-note": "header-navigation" },
                            React.createElement("span", { className: "label" }, "Sustainable Development Goals Tracker"),
                            React.createElement("span", { className: "icon" },
                                React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faExternalLinkAlt_1.faExternalLinkAlt })))))),
            React.createElement("ul", { className: "submenu", ref: this.submenuRef }, activeCategory &&
                allEntries(activeCategory).map((entry) => renderEntry(entry)))));
    }
};
__decorate([
    mobx_1.observable.ref
], DesktopTopicsMenu.prototype, "activeCategory", void 0);
__decorate([
    mobx_1.action.bound
], DesktopTopicsMenu.prototype, "setCategory", null);
__decorate([
    decko_1.bind
], DesktopTopicsMenu.prototype, "onActivate", null);
__decorate([
    decko_1.bind
], DesktopTopicsMenu.prototype, "onDeactivate", null);
DesktopTopicsMenu = __decorate([
    mobx_react_1.observer
], DesktopTopicsMenu);
let MobileTopicsMenu = class MobileTopicsMenu extends React.Component {
    toggleCategory(category) {
        if (this.activeCategory === category)
            this.activeCategory = undefined;
        else
            this.activeCategory = category;
    }
    render() {
        const { categories } = this.props;
        const { activeCategory } = this;
        return (React.createElement("div", { className: "mobile-topics-dropdown sm-only" },
            React.createElement("ul", null,
                React.createElement("li", { className: "header" },
                    React.createElement("h2", null, "Topics")),
                categories.map((category) => (React.createElement("li", { key: category.slug, className: `category ${activeCategory === category ? "expanded" : ""}` },
                    React.createElement("a", { onClick: () => this.toggleCategory(category) },
                        React.createElement("span", { className: "label-wrapper" },
                            React.createElement("span", { className: "label" }, category.name),
                            React.createElement("span", { className: "entries-muted" }, allEntries(category)
                                .map((entry) => entry.title)
                                .join(", "))),
                        React.createElement("span", { className: "icon" },
                            React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: activeCategory === category
                                    ? faAngleUp_1.faAngleUp
                                    : faAngleDown_1.faAngleDown }))),
                    activeCategory === category && (React.createElement("div", { className: "subcategory-menu" },
                        React.createElement("ul", null, allEntries(category).map((entry) => renderEntry(entry)))))))),
                React.createElement("li", { className: "end-link" },
                    React.createElement("a", { href: "/charts", "data-track-note": "header-navigation" }, "Charts")),
                React.createElement("li", { className: "end-link" },
                    React.createElement("a", { href: "/teaching", "data-track-note": "header-navigation" }, "Teaching Hub")),
                React.createElement("li", { className: "end-link" },
                    React.createElement("a", { href: "https://sdg-tracker.org", "data-track-note": "header-navigation" }, "Sustainable Development Goals Tracker")),
                React.createElement("li", { className: "end-link" },
                    React.createElement("a", { href: "/blog", "data-track-note": "header-navigation" }, "Latest")),
                React.createElement("li", { className: "end-link" },
                    React.createElement("a", { href: "/about", "data-track-note": "header-navigation" }, "About")),
                React.createElement("li", { className: "end-link" },
                    React.createElement("a", { href: "/donate", "data-track-note": "header-navigation" }, "Donate")))));
    }
};
__decorate([
    mobx_1.observable.ref
], MobileTopicsMenu.prototype, "activeCategory", void 0);
__decorate([
    mobx_1.action.bound
], MobileTopicsMenu.prototype, "toggleCategory", null);
MobileTopicsMenu = __decorate([
    mobx_react_1.observer
], MobileTopicsMenu);
let SiteHeaderMenus = class SiteHeaderMenus extends React.Component {
    constructor() {
        super(...arguments);
        this.categories = [];
    }
    onResize() {
        this.width = window.innerWidth;
    }
    getEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield (yield fetch("/headerMenu.json", {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                },
            })).json();
            mobx_1.runInAction(() => (this.categories = json.categories));
        });
    }
    componentDidMount() {
        this.getEntries();
        this.onResize();
        window.addEventListener("resize", this.onResize);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }
    render() {
        return (React.createElement(Header, { categories: this.categories, baseUrl: this.props.baseUrl }));
    }
};
__decorate([
    mobx_1.observable
], SiteHeaderMenus.prototype, "width", void 0);
__decorate([
    mobx_1.observable.ref
], SiteHeaderMenus.prototype, "categories", void 0);
__decorate([
    mobx_1.action.bound
], SiteHeaderMenus.prototype, "onResize", null);
SiteHeaderMenus = __decorate([
    mobx_react_1.observer
], SiteHeaderMenus);
const runHeaderMenus = (baseUrl) => ReactDOM.render(React.createElement(SiteHeaderMenus, { baseUrl: baseUrl }), document.querySelector(".site-header"));
exports.runHeaderMenus = runHeaderMenus;
//# sourceMappingURL=SiteHeaderMenus.js.map