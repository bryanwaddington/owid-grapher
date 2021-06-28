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
exports.siteSearch = void 0;
const lite_1 = __importDefault(require("algoliasearch/lite"));
const countries_1 = require("../clientUtils/countries");
const clientSettings_1 = require("../settings/clientSettings");
let algolia;
const getClient = () => {
    if (!algolia)
        algolia = lite_1.default(clientSettings_1.ALGOLIA_ID, clientSettings_1.ALGOLIA_SEARCH_KEY);
    return algolia;
};
const siteSearch = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Some special ad hoc handling of country names for chart query
    // This is especially important for "uk" and "us" since algolia otherwise isn't too sure what to do with them
    let chartQuery = query.trim();
    const matchCountries = [];
    for (const country of countries_1.countries) {
        const variants = [country.name, ...((_a = country.variantNames) !== null && _a !== void 0 ? _a : [])];
        for (const variant of variants) {
            const r = new RegExp(`\\b(${variant})\\b`, "gi");
            const newQuery = chartQuery.replace(r, "");
            if (newQuery !== chartQuery) {
                matchCountries.push(country);
                if (newQuery.trim().length)
                    chartQuery = newQuery;
            }
        }
    }
    // "HACK" use undocumented (legacy?) multi-queries capability of search()
    // instead of multipleQueries() here to benefit from optimized algoliasearch/lite
    // see https://github.com/owid/owid-grapher/pull/461#discussion_r433791078
    const json = yield getClient().search([
        {
            indexName: "pages",
            query: query,
            params: {
                attributesToRetrieve: [
                    "objectID",
                    "postId",
                    "slug",
                    "title",
                    "type",
                    "code",
                    "content",
                ],
                attributesToSnippet: ["content:24"],
                distinct: true,
                hitsPerPage: 10,
            },
        },
        {
            indexName: "charts",
            query: chartQuery,
            params: {
                attributesToRetrieve: [
                    "chartId",
                    "slug",
                    "title",
                    "variantName",
                ],
                attributesToSnippet: ["subtitle:24"],
                attributesToHighlight: ["availableEntities"],
                hitsPerPage: 10,
                removeStopWords: true,
                replaceSynonymsInHighlight: false,
            },
        },
    ]);
    return {
        pages: json.results[0].hits,
        charts: json.results[1].hits,
        countries: matchCountries,
    };
});
exports.siteSearch = siteSearch;
//# sourceMappingURL=searchClient.js.map