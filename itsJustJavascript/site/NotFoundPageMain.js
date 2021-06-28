"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runNotFoundPage = void 0;
const SiteAnalytics_1 = require("./SiteAnalytics");
const analytics = new SiteAnalytics_1.SiteAnalytics();
function runNotFoundPage() {
    const query = window.location.pathname.split("/");
    const searchInput = document.getElementById("search_q");
    if (searchInput && query.length)
        searchInput.value = decodeURIComponent(query[query.length - 1]).replace(/[\-_\+|]/g, " ");
    analytics.logPageNotFoundError(window.location.href);
}
exports.runNotFoundPage = runNotFoundPage;
//# sourceMappingURL=NotFoundPageMain.js.map