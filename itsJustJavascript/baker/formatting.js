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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCountryProfile = exports.parseKeyValueArgs = exports.parseDataValueArgs = exports.extractDataValuesConfiguration = exports.dataValueRegex = exports.parseFormattingOptions = exports.extractFormattingOptions = exports.getHtmlContentWithStyles = exports.formatLinks = exports.DEEP_LINK_CLASS = void 0;
const cheerio = __importStar(require("cheerio"));
const countryProfileProjects_1 = require("../site/countryProfileProjects");
const serverSettings_1 = require("../settings/serverSettings");
const DataValue_1 = require("../site/DataValue");
exports.DEEP_LINK_CLASS = "deep-link";
// Standardize urls
const formatLinks = (html) => html
    .replace(new RegExp(serverSettings_1.WORDPRESS_URL, "g"), serverSettings_1.BAKED_BASE_URL)
    .replace(new RegExp("https?://owid.cloud", "g"), serverSettings_1.BAKED_BASE_URL)
    .replace(new RegExp("https?://ourworldindata.org", "g"), serverSettings_1.BAKED_BASE_URL);
exports.formatLinks = formatLinks;
const getHtmlContentWithStyles = (cheerEl) => {
    // Inline styling
    // Get the first root level <style> tag within the content as it gets
    // stripped out by $("body").html() below. Voluntarily limits to 1 as there
    // should not be a need for more.
    const style = cheerEl("style").length === 1
        ? `<style>${cheerEl("style").html()}</style>`
        : "";
    // This is effectively a hack within a hack, as style tags are technically
    // not allowed in the body (of the main article)
    return `${style}${cheerEl("body").html()}`;
};
exports.getHtmlContentWithStyles = getHtmlContentWithStyles;
const extractFormattingOptions = (html) => {
    const formattingOptionsMatch = html.match(/<!--\s*formatting-options\s+(.*)\s*-->/);
    return formattingOptionsMatch
        ? exports.parseFormattingOptions(formattingOptionsMatch[1])
        : {};
};
exports.extractFormattingOptions = extractFormattingOptions;
// Converts "toc:false raw somekey:somevalue" to { toc: false, raw: true, somekey: "somevalue" }
// If only the key is specified, the value is assumed to be true (e.g. "raw" above)
const parseFormattingOptions = (text) => {
    return exports.parseKeyValueArgs(text);
};
exports.parseFormattingOptions = parseFormattingOptions;
exports.dataValueRegex = new RegExp(`{{\\s*${DataValue_1.DATA_VALUE}\\s*(.+?)\\s*}}`, "g");
const extractDataValuesConfiguration = (html) => __awaiter(void 0, void 0, void 0, function* () {
    const dataValueSeparator = /\s*\|\s*/;
    const dataValuesConfigurations = new Map();
    const dataValueMatches = html.matchAll(exports.dataValueRegex);
    for (const match of dataValueMatches) {
        const dataValueConfigurationString = match[1];
        const [queryArgsString, template] = dataValueConfigurationString.split(dataValueSeparator);
        const queryArgs = exports.parseDataValueArgs(queryArgsString);
        dataValuesConfigurations.set(dataValueConfigurationString, {
            queryArgs,
            template,
        });
    }
    return dataValuesConfigurations;
});
exports.extractDataValuesConfiguration = extractDataValuesConfiguration;
const parseDataValueArgs = (rawArgsString) => {
    return Object.fromEntries(Object.entries(exports.parseKeyValueArgs(rawArgsString)).map(([k, v]) => [
        k,
        Number(v),
    ]));
};
exports.parseDataValueArgs = parseDataValueArgs;
const parseKeyValueArgs = (text) => {
    const options = {};
    text.split(/\s+/)
        // filter out empty strings
        .filter((s) => s && s.length > 0)
        .forEach((option) => {
        // using regex instead of split(":") to handle ":" in value
        // e.g. {{LastUpdated timestampUrl:https://...}}
        const optionRegex = /([^:]+):?(.*)/;
        const [, name, value] = option.match(optionRegex);
        let parsedValue;
        if (value === "" || value === "true")
            parsedValue = true;
        else if (value === "false")
            parsedValue = false;
        else
            parsedValue = value;
        options[name] = parsedValue;
    });
    return options;
};
exports.parseKeyValueArgs = parseKeyValueArgs;
const formatCountryProfile = (post, country) => {
    // Localize country selector
    const htmlWithLocalizedCountrySelector = post.html.replace(countryProfileProjects_1.countryProfileDefaultCountryPlaceholder, country.code);
    const cheerioEl = cheerio.load(htmlWithLocalizedCountrySelector);
    // Inject country names on h3 headings which have been already identified as subsections
    // (filtering them out based on whether they have a deep link anchor attached to them)
    cheerioEl(`h3 a.${exports.DEEP_LINK_CLASS}`).each((_, deepLinkAnchor) => {
        const $deepLinkAnchor = cheerioEl(deepLinkAnchor);
        $deepLinkAnchor.after(`${country.name}: `);
    });
    return Object.assign(Object.assign({}, post), { html: exports.getHtmlContentWithStyles(cheerioEl) });
};
exports.formatCountryProfile = formatCountryProfile;
//# sourceMappingURL=formatting.js.map