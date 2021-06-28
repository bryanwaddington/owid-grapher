"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorSchemeName = exports.ContinentColors = void 0;
exports.ContinentColors = {
    Africa: "#923E8B",
    Antarctica: "#5887A1",
    Asia: "#2D8587",
    Europe: "#4C5C78",
    "North America": "#E04E4B",
    Oceania: "#A8633C",
    "South America": "#932834",
};
// Note: TypeScript does not currently support extending or merging enums. Ideally we would have 2 enums here (one for custom and one for brewer) and then just merge them.
// https://github.com/microsoft/TypeScript/issues/17592
var ColorSchemeName;
(function (ColorSchemeName) {
    // Brewer schemes:
    ColorSchemeName["YlGn"] = "YlGn";
    ColorSchemeName["YlGnBu"] = "YlGnBu";
    ColorSchemeName["GnBu"] = "GnBu";
    ColorSchemeName["BuGn"] = "BuGn";
    ColorSchemeName["PuBuGn"] = "PuBuGn";
    ColorSchemeName["BuPu"] = "BuPu";
    ColorSchemeName["RdPu"] = "RdPu";
    ColorSchemeName["PuRd"] = "PuRd";
    ColorSchemeName["OrRd"] = "OrRd";
    ColorSchemeName["YlOrRd"] = "YlOrRd";
    ColorSchemeName["YlOrBr"] = "YlOrBr";
    ColorSchemeName["Purples"] = "Purples";
    ColorSchemeName["Blues"] = "Blues";
    ColorSchemeName["Greens"] = "Greens";
    ColorSchemeName["Oranges"] = "Oranges";
    ColorSchemeName["Reds"] = "Reds";
    ColorSchemeName["Greys"] = "Greys";
    ColorSchemeName["PuOr"] = "PuOr";
    ColorSchemeName["BrBG"] = "BrBG";
    ColorSchemeName["PRGn"] = "PRGn";
    ColorSchemeName["PiYG"] = "PiYG";
    ColorSchemeName["RdBu"] = "RdBu";
    ColorSchemeName["RdGy"] = "RdGy";
    ColorSchemeName["RdYlBu"] = "RdYlBu";
    ColorSchemeName["Spectral"] = "Spectral";
    ColorSchemeName["RdYlGn"] = "RdYlGn";
    ColorSchemeName["Accent"] = "Accent";
    ColorSchemeName["Dark2"] = "Dark2";
    ColorSchemeName["Paired"] = "Paired";
    ColorSchemeName["Pastel1"] = "Pastel1";
    ColorSchemeName["Pastel2"] = "Pastel2";
    ColorSchemeName["Set1"] = "Set1";
    ColorSchemeName["Set2"] = "Set2";
    ColorSchemeName["Set3"] = "Set3";
    ColorSchemeName["PuBu"] = "PuBu";
    ColorSchemeName["hsv-RdBu"] = "hsv-RdBu";
    ColorSchemeName["hsv-CyMg"] = "hsv-CyMg";
    // Custom schemes:
    ColorSchemeName["Magma"] = "Magma";
    ColorSchemeName["Inferno"] = "Inferno";
    ColorSchemeName["Plasma"] = "Plasma";
    ColorSchemeName["Viridis"] = "Viridis";
    ColorSchemeName["continents"] = "continents";
    ColorSchemeName["stackedAreaDefault"] = "stackedAreaDefault";
    ColorSchemeName["owid-distinct"] = "owid-distinct";
})(ColorSchemeName = exports.ColorSchemeName || (exports.ColorSchemeName = {}));
//# sourceMappingURL=ColorConstants.js.map