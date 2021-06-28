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
exports.makeSitemap = void 0;
const Post_1 = require("../db/model/Post");
const Chart_1 = require("../db/model/Chart");
const serverSettings_1 = require("../settings/serverSettings");
const moment_1 = __importDefault(require("moment"));
const db = __importStar(require("../db/db"));
const countries_1 = require("../clientUtils/countries");
const url_join_1 = __importDefault(require("url-join"));
const countryProfileProjects_1 = require("../site/countryProfileProjects");
const xmlify = (url) => {
    if (url.lastmod)
        return `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
    </url>`;
    return `    <url>
        <loc>${url.loc}</loc>
    </url>`;
};
const makeSitemap = () => __awaiter(void 0, void 0, void 0, function* () {
    const posts = (yield db
        .knexTable(Post_1.Post.table)
        .where({ status: "publish" })
        .select("slug", "updated_at"));
    const charts = (yield db
        .knexTable(Chart_1.Chart.table)
        .select(db.knexRaw(`updatedAt, config->>"$.slug" AS slug`))
        .whereRaw('config->"$.isPublished" = true'));
    let urls = countries_1.countries.map((c) => ({
        loc: url_join_1.default(serverSettings_1.BAKED_BASE_URL, "country", c.slug),
    }));
    urls = urls
        .concat(...countryProfileProjects_1.countryProfileSpecs.map((spec) => {
        return countries_1.countries.map((c) => ({
            loc: url_join_1.default(serverSettings_1.BAKED_BASE_URL, spec.rootPath, c.slug),
        }));
    }))
        .concat(posts.map((p) => ({
        loc: url_join_1.default(serverSettings_1.BAKED_BASE_URL, p.slug),
        lastmod: moment_1.default(p.updated_at).format("YYYY-MM-DD"),
    })))
        .concat(charts.map((c) => ({
        loc: url_join_1.default(serverSettings_1.BAKED_GRAPHER_URL, c.slug),
        lastmod: moment_1.default(c.updatedAt).format("YYYY-MM-DD"),
    })));
    const sitemap = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => xmlify(url)).join("\n")}
</urlset>`;
    return sitemap;
});
exports.makeSitemap = makeSitemap;
//# sourceMappingURL=sitemap.js.map