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
exports.MultiEmbedderSingleton = exports.shouldProgressiveEmbed = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const Util_1 = require("../../clientUtils/Util");
const isPresent_1 = require("../../clientUtils/isPresent");
const GrapherConstants_1 = require("../../grapher/core/GrapherConstants");
const serializers_1 = require("../../clientUtils/serializers");
const Grapher_1 = require("../../grapher/core/Grapher");
const Explorer_1 = require("../../explorer/Explorer");
const ExplorerConstants_1 = require("../../explorer/ExplorerConstants");
const GlobalEntitySelectorConstants_1 = require("../../grapher/controls/globalEntitySelector/GlobalEntitySelectorConstants");
const Url_1 = require("../../clientUtils/urls/Url");
const SelectionArray_1 = require("../../grapher/selection/SelectionArray");
const EntityUrlBuilder_1 = require("../../grapher/core/EntityUrlBuilder");
const GlobalEntitySelector_1 = require("../../grapher/controls/globalEntitySelector/GlobalEntitySelector");
const mobx_1 = require("mobx");
const AnnotatingDataValue_1 = require("../AnnotatingDataValue");
const figuresFromDOM = (container = document, selector) => Array.from(container.querySelectorAll(`*[${selector}]`)).filter(isPresent_1.isPresent);
// Determine whether this device is powerful enough to handle
// loading a bunch of inline interactive charts
// 680px is also used in CSS – keep it in sync if you change this
const shouldProgressiveEmbed = () => !Util_1.isMobile() ||
    window.screen.width > 680 ||
    pageContainsGlobalEntitySelector();
exports.shouldProgressiveEmbed = shouldProgressiveEmbed;
const pageContainsGlobalEntitySelector = () => globalEntitySelectorElement() !== null;
const globalEntitySelectorElement = () => document.querySelector(GlobalEntitySelectorConstants_1.GLOBAL_ENTITY_SELECTOR_ELEMENT);
class MultiEmbedder {
    constructor() {
        this.selection = new SelectionArray_1.SelectionArray();
        this.graphersAndExplorersToUpdate = new Set();
        if (typeof window !== "undefined" && "IntersectionObserver" in window) {
            this.figuresObserver = new IntersectionObserver(this.onIntersecting.bind(this), {
                rootMargin: "200%",
            });
        }
        else {
            console.warn("IntersectionObserver not available; interactive embeds won't load on this page");
        }
    }
    /**
     * Finds all <figure data-grapher-src="..."> and <figure
     * data-explorer-src="..."> elements in the document and loads the
     * iframeless interactive charts when the user's viewport approaches them.
     * Uses an IntersectionObserver (see constructor).
     *
     * BEWARE: this method is hardcoded in some scripts, make sure to check
     * thoroughly before making any changes.
     */
    embedAll() {
        this.observeFigures();
    }
    /**
     * Make the embedder aware of new <figure> elements that are injected into the DOM.
     *
     * Use this when you programmatically create/replace charts.
     */
    observeFigures(container = document) {
        const figures = figuresFromDOM(container, GrapherConstants_1.GRAPHER_EMBEDDED_FIGURE_ATTR).concat(figuresFromDOM(container, ExplorerConstants_1.EXPLORER_EMBEDDED_FIGURE_SELECTOR));
        figures.forEach((figure) => {
            var _a;
            (_a = this.figuresObserver) === null || _a === void 0 ? void 0 : _a.observe(figure);
        });
    }
    onIntersecting(entries) {
        return __awaiter(this, void 0, void 0, function* () {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.renderInteractiveFigure(entry.target);
                }
            });
        });
    }
    renderInteractiveFigure(figure, annotation) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const isExplorer = figure.hasAttribute(ExplorerConstants_1.EXPLORER_EMBEDDED_FIGURE_SELECTOR);
            const dataSrc = figure.getAttribute(isExplorer
                ? ExplorerConstants_1.EXPLORER_EMBEDDED_FIGURE_SELECTOR
                : GrapherConstants_1.GRAPHER_EMBEDDED_FIGURE_ATTR);
            if (!dataSrc)
                return;
            const hasPreview = isExplorer ? false : !!figure.querySelector("img");
            if (!exports.shouldProgressiveEmbed() && hasPreview)
                return;
            // Stop observing visibility as soon as possible, that is not before
            // shouldProgressiveEmbed gets a chance to reevaluate a possible change
            // in screen size on mobile (i.e. after a rotation). Stopping before
            // shouldProgressiveEmbed would prevent rendering interactive charts
            // when going from portrait to landscape mode (without page reload).
            (_a = this.figuresObserver) === null || _a === void 0 ? void 0 : _a.unobserve(figure);
            const { fullUrl, queryStr } = Url_1.Url.fromURL(dataSrc);
            const common = {
                isEmbeddedInAnOwidPage: true,
                queryStr,
            };
            const html = yield Util_1.fetchText(fullUrl);
            if (isExplorer) {
                const props = Object.assign(Object.assign(Object.assign({}, common), serializers_1.deserializeJSONFromHTML(html, ExplorerConstants_1.EMBEDDED_EXPLORER_DELIMITER)), { grapherConfigs: serializers_1.deserializeJSONFromHTML(html, ExplorerConstants_1.EMBEDDED_EXPLORER_GRAPHER_CONFIGS), queryStr, selection: new SelectionArray_1.SelectionArray(this.selection.selectedEntityNames) });
                if (props.selection)
                    this.graphersAndExplorersToUpdate.add(props.selection);
                react_dom_1.default.render(react_1.default.createElement(Explorer_1.Explorer, Object.assign({}, props)), figure);
            }
            else {
                figure.classList.remove("grapherPreview");
                const config = Object.assign(Object.assign(Object.assign({}, serializers_1.deserializeJSONFromHTML(html)), common), { manager: {
                        selection: new SelectionArray_1.SelectionArray(this.selection.selectedEntityNames),
                    }, annotation });
                if ((_b = config.manager) === null || _b === void 0 ? void 0 : _b.selection)
                    this.graphersAndExplorersToUpdate.add(config.manager.selection);
                const grapherInstance = Grapher_1.Grapher.renderGrapherIntoContainer(config, figure);
                if (!grapherInstance)
                    return;
                AnnotatingDataValue_1.hydrateAnnotatingDataValue(grapherInstance, figure);
            }
        });
    }
    setUpGlobalEntitySelectorForEmbeds() {
        const element = globalEntitySelectorElement();
        if (!element)
            return;
        const embeddedDefaultCountriesParam = element.getAttribute(GlobalEntitySelectorConstants_1.GLOBAL_ENTITY_SELECTOR_DEFAULT_COUNTRY);
        const [defaultEntityNames, windowEntityNames] = [
            Url_1.Url.fromQueryParams({
                country: embeddedDefaultCountriesParam || undefined,
            }),
            Url_1.getWindowUrl(),
        ]
            .map(EntityUrlBuilder_1.migrateSelectedEntityNamesParam)
            .map(EntityUrlBuilder_1.getSelectedEntityNamesParam);
        this.selection = new SelectionArray_1.SelectionArray(windowEntityNames !== null && windowEntityNames !== void 0 ? windowEntityNames : defaultEntityNames);
        GlobalEntitySelector_1.hydrateGlobalEntitySelectorIfAny(this.selection, this.graphersAndExplorersToUpdate);
    }
}
__decorate([
    mobx_1.action.bound
], MultiEmbedder.prototype, "renderInteractiveFigure", null);
exports.MultiEmbedderSingleton = new MultiEmbedder();
//# sourceMappingURL=MultiEmbedder.js.map