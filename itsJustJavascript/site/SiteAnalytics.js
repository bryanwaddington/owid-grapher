"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteAnalytics = void 0;
const GrapherAnalytics_1 = require("../grapher/core/GrapherAnalytics"); // todo: make these less tightly coupled
class SiteAnalytics extends GrapherAnalytics_1.GrapherAnalytics {
    logCovidCountryProfileSearch(country) {
        this.logToGA("COVID_COUNTRY_PROFILE_SEARCH", country);
    }
    logPageNotFoundError(url) {
        this.logToAmplitude("NOT_FOUND", { href: url });
        this.logToGA("Errors", "NotFound", url);
    }
    logChartsPageSearchQuery(query) {
        this.logToGA("ChartsPage", "Filter", query);
    }
    logPageLoad() {
        this.logToAmplitude("OWID_PAGE_LOAD");
    }
    logDataValueAnnotate(label) {
        this.logToGA("Hover", "data-value-annotate", label);
    }
}
exports.SiteAnalytics = SiteAnalytics;
//# sourceMappingURL=SiteAnalytics.js.map