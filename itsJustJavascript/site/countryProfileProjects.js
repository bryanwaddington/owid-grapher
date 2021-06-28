"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryProfileSpecs = exports.countryProfileDefaultCountryPlaceholder = void 0;
var CountryProfileProject;
(function (CountryProfileProject) {
    CountryProfileProject["coronavirus"] = "coronavirus";
    CountryProfileProject["co2"] = "co2";
    CountryProfileProject["energy"] = "energy";
})(CountryProfileProject || (CountryProfileProject = {}));
exports.countryProfileDefaultCountryPlaceholder = "{DEFAULT_COUNTRY_ENTITY_SELECT}";
const countryProfileProjectConfigurations = [
    {
        project: CountryProfileProject.coronavirus,
        pageTitle: "Coronavirus Pandemic",
        landingPageSlug: "coronavirus",
    },
    {
        project: CountryProfileProject.co2,
        pageTitle: "CO2",
        landingPageSlug: "co2-and-other-greenhouse-gas-emissions",
    },
    {
        project: CountryProfileProject.energy,
        pageTitle: "Energy",
        landingPageSlug: "energy",
    },
];
exports.countryProfileSpecs = countryProfileProjectConfigurations.map((config) => {
    return Object.assign(Object.assign({}, config), { rootPath: `${config.project}/country`, genericProfileSlug: `${config.project}-country-profile` });
});
//# sourceMappingURL=countryProfileProjects.js.map