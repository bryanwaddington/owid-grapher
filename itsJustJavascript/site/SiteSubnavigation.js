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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSubnavigation = exports.subnavs = void 0;
const React = __importStar(require("react"));
const react_fontawesome_1 = require("@fortawesome/react-fontawesome");
const faChevronLeft_1 = require("@fortawesome/free-solid-svg-icons/faChevronLeft");
exports.subnavs = {
    about: [
        // `label` is shown in the UI, `id` is specified as a formatting option
        // on a page (the top html comment in WordPress)
        { label: "About", href: "/about", id: "about" },
        { label: "Team", href: "/team", id: "team" },
        { label: "Organization", href: "/organization", id: "organization" },
        { label: "Funding", href: "/funding", id: "supporters" },
        { label: "FAQs", href: "/faqs", id: "faqs" },
        { label: "Audience & Coverage", href: "/coverage", id: "coverage" },
        {
            label: "History",
            href: "/history-of-our-world-in-data",
            id: "history",
        },
        { label: "Grapher", href: "/owid-grapher", id: "grapher" },
        { label: "Jobs", href: "/jobs", id: "jobs" },
        { label: "Contact", href: "/about#contact", id: "contact" },
    ],
    coronavirus: [
        { label: "Coronavirus", href: "/coronavirus", id: "coronavirus" },
        {
            label: "By country",
            href: "/coronavirus#coronavirus-country-profiles",
            id: "by-country",
            highlight: true,
        },
        {
            label: "Data explorer",
            href: "/coronavirus-data-explorer",
            id: "data-explorer",
            highlight: true,
        },
        { label: "Deaths", href: "/covid-deaths", id: "deaths" },
        { label: "Cases", href: "/covid-cases", id: "cases" },
        { label: "Tests", href: "/coronavirus-testing", id: "testing" },
        {
            label: "Hospitalizations",
            href: "/covid-hospitalizations",
            id: "hospitalizations",
        },
        {
            label: "Vaccinations",
            href: "/covid-vaccinations",
            id: "vaccinations",
        },
        {
            label: "Mortality risk",
            href: "/mortality-risk-covid",
            id: "mortality-risk",
        },
        {
            label: "Excess mortality",
            href: "/excess-mortality-covid",
            id: "excess-mortality",
        },
        {
            label: "Policy responses",
            href: "/policy-responses-covid",
            id: "policy-responses",
        },
        {
            label: "Exemplars",
            href: "/identify-covid-exemplars",
            id: "exemplars",
        },
        { label: "All charts", href: "/coronavirus-data", id: "data" },
    ],
    co2: [
        {
            label: "CO₂ and GHG Emissions",
            href: "/co2-and-other-greenhouse-gas-emissions",
            id: "co2-and-ghg-emissions",
        },
        {
            label: "By country",
            href: "/co2-and-other-greenhouse-gas-emissions#co2-and-greenhouse-gas-emissions-country-profiles",
            id: "by-country",
            highlight: true,
        },
        {
            label: "Data explorer",
            href: "/explorers/co2",
            id: "co2-data-explorer",
        },
        { label: "CO₂ emissions", href: "/co2-emissions", id: "co2-emissions" },
        { label: "CO₂ by fuel", href: "/emissions-by-fuel", id: "by-fuel" },
        {
            label: "GHG emissions",
            href: "/greenhouse-gas-emissions",
            id: "ghg-emissions",
        },
        { label: "By sector", href: "/emissions-by-sector", id: "by-sector" },
        {
            label: "Emissions drivers",
            href: "/emissions-drivers",
            id: "emissions-drivers",
        },
        {
            label: "Atmospheric concentrations",
            href: "/atmospheric-concentrations",
            id: "atm-concentrations",
        },
    ],
    energy: [
        {
            label: "Energy",
            href: "/energy",
            id: "energy",
        },
        {
            label: "By country",
            href: "/energy#energy-country-profiles",
            id: "by-country",
            highlight: true,
        },
        {
            label: "Data explorer",
            href: "/explorers/energy",
            id: "energy-data-explorer",
        },
        { label: "Energy access", href: "/energy-access", id: "energy-access" },
        {
            label: "Production & Consumption",
            href: "/energy-production-consumption",
            id: "production-consumption",
        },
        { label: "Energy mix", href: "/energy-mix", id: "energy-mix" },
        {
            label: "Electricity mix",
            href: "/electricity-mix",
            id: "electricity-mix",
        },
        { label: "Fossil fuels", href: "/fossil-fuels", id: "fossil-fuels" },
        {
            label: "Renewables",
            href: "/renewable-energy",
            id: "renewable-energy",
        },
        { label: "Nuclear", href: "/nuclear-energy", id: "nuclear-energy" },
    ],
    forests: [
        {
            label: "Forests",
            href: "/forests",
            id: "forests",
        },
        {
            label: "Forest area",
            href: "/forest-area",
            id: "forest-area",
        },
        {
            label: "Deforestation",
            href: "/deforestation",
            id: "deforestation",
        },
        {
            label: "Afforestation",
            href: "/afforestation",
            id: "afforestation",
        },
        {
            label: "Drivers of Deforestation",
            href: "/drivers-of-deforestation",
            id: "drivers-of-deforestation",
        },
        {
            label: "Palm oil",
            href: "/palm-oil",
            id: "palm-oil",
        },
        {
            label: "Soy",
            href: "/soy",
            id: "soy",
        },
    ],
    biodiversity: [
        {
            label: "Biodiversity",
            href: "/biodiversity",
            id: "biodiversity",
        },
        {
            label: "Biodiversity and Wildlife",
            href: "/biodiversity-and-wildlife",
            id: "biodiversity-and-wildlife",
        },
        {
            label: "Mammals",
            href: "/mammals",
            id: "mammals",
        },
        {
            label: "Birds",
            href: "/birds",
            id: "birds",
        },
        {
            label: "Fish",
            href: "/fish",
            id: "fish",
        },
        {
            label: "Coral reefs",
            href: "/coral-reefs",
            id: "coral-reefs",
        },
        {
            label: "Living Planet Index",
            href: "/living-planet-index",
            id: "living-planet-index",
        },
        {
            label: "Extinctions",
            href: "/extinctions",
            id: "extinctions",
        },
        {
            label: "Threats to Wildlife",
            href: "/threats-to-wildlife",
            id: "threats-to-wildlife",
        },
        {
            label: "Poaching and Wildlife Trade",
            href: "/poaching-and-wildlife-trade",
            id: "poaching-and-wildlife-trade",
        },
        {
            label: "Habitat Loss",
            href: "/habitat-loss",
            id: "habitat-loss",
        },
        {
            label: "Protected areas and conservation",
            href: "/protected-areas-and-conservation",
            id: "protected-areas-and-conservation",
        },
    ],
};
class SiteSubnavigation extends React.Component {
    render() {
        const { subnavId, subnavCurrentId } = this.props;
        const subnavLinks = exports.subnavs[subnavId];
        return subnavLinks ? (React.createElement("div", { className: "offset-subnavigation" },
            React.createElement("div", { className: "site-subnavigation" },
                React.createElement("div", { className: "site-subnavigation-scroll" },
                    React.createElement("ul", { className: "site-subnavigation-links" }, subnavLinks.map(({ href, label, id, highlight }, idx) => {
                        const classes = [];
                        const dataTrackNote = [
                            subnavId,
                            "subnav",
                            id,
                        ].join("-");
                        if (id === subnavCurrentId)
                            classes.push("current");
                        if (highlight)
                            classes.push("highlight");
                        return (React.createElement("li", { className: (classes.length &&
                                classes.join(" ")) ||
                                "", key: href },
                            React.createElement("a", { href: href, "data-track-note": dataTrackNote },
                                label,
                                idx === 0 && (React.createElement(react_fontawesome_1.FontAwesomeIcon, { icon: faChevronLeft_1.faChevronLeft })))));
                    })))))) : null;
    }
}
exports.SiteSubnavigation = SiteSubnavigation;
//# sourceMappingURL=SiteSubnavigation.js.map