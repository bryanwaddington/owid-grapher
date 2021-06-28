"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAlgolia = void 0;
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const clientSettings_1 = require("../../settings/clientSettings");
const serverSettings_1 = require("../../settings/serverSettings");
const countries_1 = require("../../clientUtils/countries");
// This function initializes and applies settings to the Algolia search indices
// Algolia settings should be configured here rather than   in the Algolia dashboard UI, as then
// they are recorded and transferrable across dev/prod instances
const configureAlgolia = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = algoliasearch_1.default(clientSettings_1.ALGOLIA_ID, serverSettings_1.ALGOLIA_SECRET_KEY);
    const chartsIndex = client.initIndex("charts");
    yield chartsIndex.setSettings({
        searchableAttributes: [
            "title",
            "unordered(variantName)",
            "unordered(subtitle)",
            "unordered(_tags)",
            "unordered(availableEntities)",
        ],
        ranking: ["exact", "typo", "attribute", "words", "proximity", "custom"],
        customRanking: ["asc(numDimensions)", "asc(titleLength)"],
        attributesToSnippet: ["subtitle:24"],
        attributeForDistinct: "id",
        alternativesAsExact: [
            "ignorePlurals",
            "singleWordSynonym",
            "multiWordsSynonym",
        ],
        exactOnSingleWordQuery: "none",
        disableExactOnAttributes: ["_tags"],
        optionalWords: ["vs"],
        removeStopWords: ["en"],
    });
    const pagesIndex = client.initIndex("pages");
    yield pagesIndex.setSettings({
        searchableAttributes: [
            "unordered(title)",
            "unordered(content)",
            "unordered(_tags)",
            "unordered(authors)",
        ],
        ranking: ["exact", "typo", "attribute", "words", "proximity", "custom"],
        customRanking: ["desc(importance)"],
        attributesToSnippet: ["content:24"],
        attributeForDistinct: "slug",
        alternativesAsExact: [
            "ignorePlurals",
            "singleWordSynonym",
            "multiWordsSynonym",
        ],
        attributesForFaceting: ["searchable(_tags)", "searchable(authors)"],
        exactOnSingleWordQuery: "none",
        disableExactOnAttributes: ["_tags"],
        removeStopWords: ["en"],
    });
    const synonyms = [
        ["kids", "children"],
        ["pork", "pigmeat"],
        ["atomic", "nuclear"],
        ["pop", "population"],
        ["cheese", "dairy"],
        ["gdp", "economic growth"],
        ["overpopulation", "population growth"],
        ["covid", "covid-19", "coronavirus", "corona"],
        ["flu", "influenza"],
        ["co2", "CO₂", "carbon dioxide"],
        ["ch4", "CH₄", "methane"],
        ["n2o", "N₂O", "nitrous oxide"],
        ["NOx", "NOₓ", "nitrogen dioxide"],
        ["price", "cost"],
        ["vaccine", "vaccination", "vacuna"],
        ["ghg", "greenhouse gas"],
    ];
    // Send all our country variant names to algolia as synonyms
    for (const country of countries_1.countries) {
        if (country.variantNames)
            synonyms.push([country.name].concat(country.variantNames));
    }
    const algoliaSynonyms = synonyms.map((s) => {
        return {
            objectID: s.join("-"),
            type: "synonym",
            synonyms: s,
        };
    });
    yield pagesIndex.saveSynonyms(algoliaSynonyms, {
        replaceExistingSynonyms: true,
    });
    yield chartsIndex.saveSynonyms(algoliaSynonyms, {
        replaceExistingSynonyms: true,
    });
});
exports.configureAlgolia = configureAlgolia;
if (require.main === module)
    exports.configureAlgolia();
//# sourceMappingURL=configureAlgolia.js.map