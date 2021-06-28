"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("site/owid.scss");
require("grapher/core/grapher.scss");
// From https://fontawesome.com/how-to-use/on-the-web/other-topics/server-side-rendering:
// "If the CSS is missing when this icon displays in the browser it will flash
// from a very large icon down to a properly sized one a moment later."
require("@fortawesome/fontawesome-svg-core/styles.css");
const smooth_scroll_1 = __importDefault(require("smooth-scroll"));
const runChartsIndexPage_1 = require("./runChartsIndexPage");
const SiteHeaderMenus_1 = require("./SiteHeaderMenus");
const SearchPageMain_1 = require("./SearchPageMain");
const NotFoundPageMain_1 = require("./NotFoundPageMain");
const Feedback_1 = require("./Feedback");
const DonateForm_1 = require("./stripe/DonateForm");
const runVariableCountryPage_1 = require("./runVariableCountryPage");
const runCountryProfilePage_1 = require("./runCountryProfilePage");
const CookiePreferencesManager_1 = require("./CookiePreferencesManager");
const blocks_1 = require("./blocks");
const TableOfContents_1 = require("./TableOfContents");
const RelatedCharts_1 = require("./blocks/RelatedCharts");
const Lightbox_1 = require("./Lightbox");
const SiteTools_1 = require("./SiteTools");
const index_1 = require("./covid/index");
const Footnote_1 = require("./Footnote");
const Explorer_1 = require("../explorer/Explorer");
const clientSettings_1 = require("../settings/clientSettings");
const GrapherConstants_1 = require("../grapher/core/GrapherConstants");
const Grapher_1 = require("../grapher/core/Grapher");
const MultiEmbedder_1 = require("../site/multiembedder/MultiEmbedder");
const CoreTable_1 = require("../coreTable/CoreTable");
const SiteAnalytics_1 = require("./SiteAnalytics");
const ProminentLink_1 = require("./blocks/ProminentLink");
window.Grapher = Grapher_1.Grapher;
window.Explorer = Explorer_1.Explorer;
window.CoreTable = CoreTable_1.CoreTable;
window.runChartsIndexPage = runChartsIndexPage_1.runChartsIndexPage;
window.runSearchPage = SearchPageMain_1.runSearchPage;
window.runNotFoundPage = NotFoundPageMain_1.runNotFoundPage;
window.runFeedbackPage = Feedback_1.runFeedbackPage;
window.runDonateForm = DonateForm_1.runDonateForm;
window.runVariableCountryPage = runVariableCountryPage_1.runVariableCountryPage;
window.runCountryProfilePage = runCountryProfilePage_1.runCountryProfilePage;
window.runTableOfContents = TableOfContents_1.runTableOfContents;
window.runRelatedCharts = RelatedCharts_1.runRelatedCharts;
window.MultiEmbedderSingleton = MultiEmbedder_1.MultiEmbedderSingleton;
// Note: do a text search of the project for "runSiteFooterScripts" to find the usage. todo: clean that up.
window.runSiteFooterScripts = () => {
    SiteHeaderMenus_1.runHeaderMenus(clientSettings_1.BAKED_BASE_URL);
    blocks_1.runBlocks();
    Lightbox_1.runLightbox();
    SiteTools_1.runSiteTools();
    CookiePreferencesManager_1.runCookiePreferencesManager();
    index_1.runCovid();
    Footnote_1.runFootnotes();
    if (!document.querySelector(`.${GrapherConstants_1.GRAPHER_PAGE_BODY_CLASS}`)) {
        MultiEmbedder_1.MultiEmbedderSingleton.setUpGlobalEntitySelectorForEmbeds();
        MultiEmbedder_1.MultiEmbedderSingleton.embedAll();
        ProminentLink_1.renderProminentLink(MultiEmbedder_1.MultiEmbedderSingleton.selection);
    }
    else {
        ProminentLink_1.renderProminentLink();
    }
};
const analytics = new SiteAnalytics_1.SiteAnalytics(clientSettings_1.ENV);
analytics.logPageLoad();
(_a = document.querySelector("html")) === null || _a === void 0 ? void 0 : _a.classList.add("js");
if (document.cookie.includes("wordpress") ||
    document.cookie.includes("wp-settings") ||
    document.cookie.includes(GrapherConstants_1.CookieKey.isAdmin)) {
    const adminbar = document.getElementById("wpadminbar");
    if (adminbar)
        adminbar.style.display = "";
}
new smooth_scroll_1.default('a[href*="#"][data-smooth-scroll]', {
    speed: 600,
    durationMax: 800,
    durationMin: 100,
    popstate: false,
});
analytics.startClickTracking();
//# sourceMappingURL=owid.entry.js.map