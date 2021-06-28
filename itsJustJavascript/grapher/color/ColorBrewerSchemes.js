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
exports.ColorBrewerSchemes = void 0;
const colorbrewer = __importStar(require("colorbrewer"));
const ColorBrewerSchemeIndex = {
    YlGn: { displayName: "Yellow-Green shades", singleColorScale: true },
    YlGnBu: {
        displayName: "Yellow-Green-Blue shades",
        singleColorScale: false,
    },
    GnBu: { displayName: "Green-Blue shades", singleColorScale: true },
    BuGn: { displayName: "Blue-Green shades", singleColorScale: true },
    PuBuGn: {
        displayName: "Purple-Blue-Green shades",
        singleColorScale: false,
    },
    BuPu: { displayName: "Blue-Purple shades", singleColorScale: true },
    RdPu: { displayName: "Red-Purple shades", singleColorScale: true },
    PuRd: { displayName: "Purple-Red shades", singleColorScale: true },
    OrRd: { displayName: "Orange-Red shades", singleColorScale: true },
    YlOrRd: {
        displayName: "Yellow-Orange-Red shades",
        singleColorScale: true,
    },
    YlOrBr: {
        displayName: "Yellow-Orange-Brown shades",
        singleColorScale: true,
    },
    Purples: { displayName: "Purple shades", singleColorScale: true },
    Blues: { displayName: "Blue shades", singleColorScale: true },
    Greens: { displayName: "Green shades", singleColorScale: true },
    Oranges: { displayName: "Orange shades", singleColorScale: true },
    Reds: { displayName: "Red shades", singleColorScale: true },
    Greys: { displayName: "Grey shades", singleColorScale: true },
    PuOr: { displayName: "Purple-Orange", singleColorScale: false },
    BrBG: { displayName: "Brown-Blue-Green", singleColorScale: false },
    PRGn: { displayName: "Purple-Red-Green", singleColorScale: false },
    PiYG: { displayName: "Magenta-Yellow-Green", singleColorScale: false },
    RdBu: { displayName: "Red-Blue", singleColorScale: false },
    RdGy: { displayName: "Red-Grey", singleColorScale: false },
    RdYlBu: { displayName: "Red-Yellow-Blue", singleColorScale: false },
    Spectral: { displayName: "Spectral colors", singleColorScale: false },
    RdYlGn: { displayName: "Red-Yellow-Green", singleColorScale: false },
    Accent: { displayName: "Accents", singleColorScale: false },
    Dark2: { displayName: "Dark colors", singleColorScale: false },
    Paired: { displayName: "Paired colors", singleColorScale: false },
    Pastel1: { displayName: "Pastel 1 colors", singleColorScale: false },
    Pastel2: { displayName: "Pastel 2 colors", singleColorScale: false },
    Set1: { displayName: "Set 1 colors", singleColorScale: false },
    Set2: { displayName: "Set 2 colors", singleColorScale: false },
    Set3: { displayName: "Set 3 colors", singleColorScale: false },
    PuBu: { displayName: "Purple-Blue shades", singleColorScale: true },
    "hsv-RdBu": { displayName: "HSV Red-Blue", singleColorScale: false },
    "hsv-CyMg": { displayName: "HSV Cyan-Magenta", singleColorScale: false },
};
const brewerKeys = Object.keys(colorbrewer);
exports.ColorBrewerSchemes = brewerKeys
    .filter((brewerName) => ColorBrewerSchemeIndex[brewerName])
    .map((brewerName) => {
    const props = ColorBrewerSchemeIndex[brewerName];
    const colorSets = colorbrewer[brewerName];
    const colorSetsArray = [];
    Object.keys(colorSets).forEach((numColors) => (colorSetsArray[+numColors] = colorSets[numColors]));
    return {
        name: brewerName,
        displayName: props.displayName,
        colorSets: colorSetsArray,
        singleColorScale: props.singleColorScale,
    };
});
//# sourceMappingURL=ColorBrewerSchemes.js.map