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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bakeCountries = exports.countryProfilePage = exports.denormalizeLatestCountryData = exports.countriesIndexPage = void 0;
const react_1 = __importDefault(require("react"));
const db = __importStar(require("../db/db"));
const CountriesIndexPage_1 = require("../site/CountriesIndexPage");
const lodash = __importStar(require("lodash"));
const CountryProfilePage_1 = require("../site/CountryProfilePage");
const Variable_1 = require("../db/model/Variable");
const countries_1 = require("../clientUtils/countries");
const OwidTable_1 = require("../coreTable/OwidTable");
const owidTypes_1 = require("../clientUtils/owidTypes");
const siteRenderers_1 = require("./siteRenderers");
const countriesIndexPage = (baseUrl) => siteRenderers_1.renderToHtmlPage(react_1.default.createElement(CountriesIndexPage_1.CountriesIndexPage, { countries: countries_1.countries, baseUrl: baseUrl }));
exports.countriesIndexPage = countriesIndexPage;
const cache = new Map();
// Cache the result of an operation by a key for the duration of the process
function bakeCache(cacheKey, retriever) {
    if (cache.has(cacheKey))
        return cache.get(cacheKey);
    const result = retriever();
    cache.set(cacheKey, result);
    return result;
}
// Find the charts that will be shown on the country profile page (if they have that country)
// TODO: make this page per variable instead
const countryIndicatorGraphers = () => __awaiter(void 0, void 0, void 0, function* () {
    return bakeCache(countryIndicatorGraphers, () => __awaiter(void 0, void 0, void 0, function* () {
        const graphers = (yield db
            .knexTable("charts")
            .whereRaw("publishedAt is not null and is_indexable is true")).map((c) => JSON.parse(c.config));
        return graphers.filter((grapher) => {
            var _a;
            return grapher.hasChartTab &&
                grapher.type === "LineChart" &&
                ((_a = grapher.dimensions) === null || _a === void 0 ? void 0 : _a.length) === 1;
        });
    }));
});
const countryIndicatorVariables = () => __awaiter(void 0, void 0, void 0, function* () {
    return bakeCache(countryIndicatorVariables, () => __awaiter(void 0, void 0, void 0, function* () {
        const variableIds = (yield countryIndicatorGraphers()).map((c) => c.dimensions[0].variableId);
        return Variable_1.Variable.rows(yield db.knexTable(Variable_1.Variable.table).whereIn("id", variableIds));
    }));
});
const denormalizeLatestCountryData = (variableIds) => __awaiter(void 0, void 0, void 0, function* () {
    const entities = (yield db
        .knexTable("entities")
        .select("id", "code")
        .whereRaw("validated is true and code is not null"));
    const entitiesByCode = lodash.keyBy(entities, (e) => e.code);
    const entitiesById = lodash.keyBy(entities, (e) => e.id);
    const entityIds = countries_1.countries.map((c) => entitiesByCode[c.code].id);
    if (!variableIds)
        variableIds = (yield countryIndicatorVariables()).map((v) => v.id);
    const dataValuesQuery = db
        .knexTable("data_values")
        .select("variableId", "entityId", "value", "year")
        .whereIn("variableId", variableIds)
        .whereRaw(`entityId in (?)`, [entityIds])
        .andWhere("year", ">", 2010)
        .andWhere("year", "<", 2020)
        .orderBy("year", "DESC");
    let dataValues = (yield dataValuesQuery);
    dataValues = lodash.uniqBy(dataValues, (dv) => `${dv.variableId}-${dv.entityId}`);
    const rows = dataValues.map((dv) => ({
        variable_id: dv.variableId,
        country_code: entitiesById[dv.entityId].code,
        year: dv.year,
        value: dv.value,
    }));
    db.knex().transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        // Remove existing values
        yield t
            .table("country_latest_data")
            .whereIn("variable_id", variableIds)
            .delete();
        // Insert new ones
        yield t.table("country_latest_data").insert(rows);
    }));
});
exports.denormalizeLatestCountryData = denormalizeLatestCountryData;
const countryIndicatorLatestData = (countryCode) => __awaiter(void 0, void 0, void 0, function* () {
    const dataValuesByEntityId = yield bakeCache(countryIndicatorLatestData, () => __awaiter(void 0, void 0, void 0, function* () {
        const dataValues = (yield db
            .knexTable("country_latest_data")
            .select("variable_id AS variableId", "country_code AS code", "year", "value"));
        return lodash.groupBy(dataValues, (dv) => dv.code);
    }));
    return dataValuesByEntityId[countryCode];
});
const countryProfilePage = (countrySlug, baseUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const country = countries_1.getCountry(countrySlug);
    if (!country)
        throw new owidTypes_1.JsonError(`No such country ${countrySlug}`, 404);
    const graphers = yield countryIndicatorGraphers();
    const variables = yield countryIndicatorVariables();
    const variablesById = lodash.keyBy(variables, (v) => v.id);
    const dataValues = yield countryIndicatorLatestData(country.code);
    const valuesByVariableId = lodash.groupBy(dataValues, (v) => v.variableId);
    let indicators = [];
    for (const grapher of graphers) {
        const firstDimension = grapher.dimensions[0];
        const vid = firstDimension && firstDimension.variableId;
        const values = valuesByVariableId[vid];
        if (values && values.length) {
            const latestValue = values[0];
            const variable = variablesById[vid];
            // todo: this is a lot of setup to get formatValueShort. Maybe cleanup?
            const table = new OwidTable_1.OwidTable([], [
                {
                    slug: vid.toString(),
                    unit: variable.unit,
                    display: variable.display,
                },
            ]);
            const column = table.get(vid.toString());
            let value;
            value = parseFloat(latestValue.value);
            if (isNaN(value))
                value = latestValue.value;
            else if (variable.display.conversionFactor)
                value *= variable.display.conversionFactor;
            indicators.push({
                year: latestValue.year,
                value: column.formatValueShort(value),
                name: grapher.title,
                slug: `/grapher/${grapher.slug}?tab=chart&country=${country.code}`,
                variantName: grapher.variantName,
            });
        }
    }
    indicators = lodash.sortBy(indicators, (i) => i.name.trim());
    return siteRenderers_1.renderToHtmlPage(react_1.default.createElement(CountryProfilePage_1.CountryProfilePage, { indicators: indicators, country: country, baseUrl: baseUrl }));
});
exports.countryProfilePage = countryProfilePage;
const bakeCountries = (baker) => __awaiter(void 0, void 0, void 0, function* () {
    const html = yield exports.countriesIndexPage(baker.baseUrl);
    yield baker.writeFile("/countries.html", html);
    yield baker.ensureDir("/country");
    for (const country of countries_1.countries) {
        const path = `/country/${country.slug}.html`;
        const html = yield exports.countryProfilePage(country.slug, baker.baseUrl);
        yield baker.writeFile(path, html);
    }
    baker.progressBar.tick({ name: "✅ baked countries" });
});
exports.bakeCountries = bakeCountries;
//# sourceMappingURL=countryProfiles.js.map