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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSearchCountry = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_select_1 = __importDefault(require("react-select"));
const countries_1 = require("../clientUtils/countries");
const react_select_2 = require("../clientUtils/react-select");
const Util_1 = require("../clientUtils/Util");
const countryProfileProjects_1 = require("../site/countryProfileProjects");
const SiteAnalytics_1 = require("./SiteAnalytics");
const analytics = new SiteAnalytics_1.SiteAnalytics();
const SearchCountry = (props) => {
    const [isLoading, setIsLoading] = react_1.useState(false);
    const sorted = Util_1.sortBy(countries_1.countries, "name");
    return (react_1.default.createElement(react_select_1.default, { options: sorted.map((c) => {
            return { label: c.name, value: c.slug };
        }), onChange: (selected) => {
            const country = react_select_2.asArray(selected)[0].value;
            analytics.logCovidCountryProfileSearch(country);
            setIsLoading(true);
            window.location.href = `${props.countryProfileRootPath}/${country}`;
        }, isLoading: isLoading, placeholder: "Search for a country..." }));
};
function runSearchCountry() {
    const searchElements = document.querySelectorAll(".wp-block-search-country-profile");
    searchElements.forEach((element) => {
        const project = element.getAttribute("data-project");
        if (project) {
            const profileSpec = countryProfileProjects_1.countryProfileSpecs.find((spec) => spec.project === project);
            if (profileSpec) {
                react_dom_1.default.render(react_1.default.createElement(SearchCountry, { countryProfileRootPath: profileSpec.rootPath }), element);
            }
        }
    });
}
exports.runSearchCountry = runSearchCountry;
exports.default = SearchCountry;
//# sourceMappingURL=SearchCountry.js.map