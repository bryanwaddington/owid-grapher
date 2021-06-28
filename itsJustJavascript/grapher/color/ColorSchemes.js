"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorSchemes = void 0;
const CustomSchemes_1 = require("./CustomSchemes");
const ColorBrewerSchemes_1 = require("./ColorBrewerSchemes");
const ColorScheme_1 = require("./ColorScheme");
const initAllSchemes = () => {
    const schemes = [...ColorBrewerSchemes_1.ColorBrewerSchemes, ...CustomSchemes_1.CustomColorSchemes];
    // NB: Temporarily switch to any typing to build the ColorScheme map. Ideally it would just be an enum, but in TS in enums you can only have primitive values.
    // There is another way to do it with static classes, but that's also not great. If you are adding a color scheme, just make sure to add it's name to the ColorSchemeName enum.
    const colorSchemes = {};
    schemes.forEach((scheme) => {
        var _a;
        colorSchemes[scheme.name] = new ColorScheme_1.ColorScheme((_a = scheme.displayName) !== null && _a !== void 0 ? _a : scheme.name, scheme.colorSets, scheme.singleColorScale, scheme.isDistinct);
    });
    return colorSchemes;
};
exports.ColorSchemes = initAllSchemes();
//# sourceMappingURL=ColorSchemes.js.map