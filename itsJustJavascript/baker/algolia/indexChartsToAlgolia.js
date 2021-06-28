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
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const lodash = __importStar(require("lodash"));
const db = __importStar(require("../../db/db"));
const clientSettings_1 = require("../../settings/clientSettings");
const serverSettings_1 = require("../../settings/serverSettings");
const configureAlgolia_1 = require("./configureAlgolia");
const indexChartsToAlgolia = () => __awaiter(void 0, void 0, void 0, function* () {
    yield configureAlgolia_1.configureAlgolia();
    const allCharts = yield db.queryMysql(`
        SELECT id, publishedAt, updatedAt, JSON_LENGTH(config->"$.dimensions") AS numDimensions, config->>"$.type" AS type, config->>"$.slug" AS slug, config->>"$.title" AS title, config->>"$.subtitle" AS subtitle, config->>"$.variantName" AS variantName, config->>"$.data.availableEntities" as availableEntitiesStr
        FROM charts
        WHERE publishedAt IS NOT NULL
        AND is_indexable IS TRUE
    `);
    const chartTags = yield db.queryMysql(`
        SELECT ct.chartId, ct.tagId, t.name as tagName FROM chart_tags ct
        JOIN charts c ON c.id=ct.chartId
        JOIN tags t ON t.id=ct.tagId
    `);
    for (const c of allCharts) {
        c.tags = [];
    }
    const chartsById = lodash.keyBy(allCharts, (c) => c.id);
    const chartsToIndex = [];
    for (const ct of chartTags) {
        const c = chartsById[ct.chartId];
        if (c) {
            c.tags.push({ id: ct.tagId, name: ct.tagName });
            chartsToIndex.push(c);
        }
    }
    const client = algoliasearch_1.default(clientSettings_1.ALGOLIA_ID, serverSettings_1.ALGOLIA_SECRET_KEY);
    const index = client.initIndex("charts");
    const records = [];
    for (const c of chartsToIndex) {
        if (!c.tags)
            continue;
        records.push({
            objectID: c.id,
            chartId: c.id,
            slug: c.slug,
            title: c.title,
            variantName: c.variantName,
            subtitle: c.subtitle,
            _tags: c.tags.map((t) => t.name),
            availableEntities: JSON.parse(c.availableEntitiesStr),
            publishedAt: c.publishedAt,
            updatedAt: c.updatedAt,
            numDimensions: parseInt(c.numDimensions),
            titleLength: c.title.length,
        });
    }
    yield index.replaceAllObjects(records);
    yield db.closeTypeOrmAndKnexConnections();
});
indexChartsToAlgolia();
//# sourceMappingURL=indexChartsToAlgolia.js.map