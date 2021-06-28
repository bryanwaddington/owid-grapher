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
exports.mockSiteRouter = void 0;
const express_1 = __importStar(require("express"));
const path = __importStar(require("path"));
const siteRenderers_1 = require("../baker/siteRenderers");
const GrapherBaker_1 = require("../baker/GrapherBaker");
const serverSettings_1 = require("../settings/serverSettings");
const db = __importStar(require("../db/db"));
const serverUtil_1 = require("./serverUtil");
const countryProfiles_1 = require("../baker/countryProfiles");
const sitemap_1 = require("../baker/sitemap");
const Chart_1 = require("../db/model/Chart");
const countryProfileProjects_1 = require("../site/countryProfileProjects");
const ExplorerAdminServer_1 = require("../explorerAdmin/ExplorerAdminServer");
const GrapherImageBaker_1 = require("../baker/GrapherImageBaker");
const Variable_1 = require("../db/model/Variable");
const MultiEmbedderTestPage_1 = require("../site/multiembedder/MultiEmbedderTestPage");
const webpackUtils_1 = require("../site/webpackUtils");
const owidTypes_1 = require("../clientUtils/owidTypes");
const GitCmsConstants_1 = require("../gitCms/GitCmsConstants");
const wpdb_1 = require("../db/wpdb");
require("express-async-errors");
// todo: switch to an object literal where the key is the path and the value is the request handler? easier to test, reflect on, and manipulate
const mockSiteRouter = express_1.Router();
exports.mockSiteRouter = mockSiteRouter;
mockSiteRouter.use(express_1.default.urlencoded({ extended: true }));
mockSiteRouter.use(express_1.default.json());
mockSiteRouter.get("/sitemap.xml", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield sitemap_1.makeSitemap()); }));
mockSiteRouter.get("/atom.xml", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.makeAtomFeed()); }));
mockSiteRouter.get("/entries-by-year", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.entriesByYearPage()); }));
mockSiteRouter.get(`/entries-by-year/:year`, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.entriesByYearPage(parseInt(req.params.year))); }));
mockSiteRouter.get("/grapher/data/variables/:variableIds.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.set("Access-Control-Allow-Origin", "*");
    res.json(yield Variable_1.getVariableData(req.params.variableIds
        .split("+")
        .map((v) => serverUtil_1.expectInt(v))));
}));
mockSiteRouter.get("/grapher/embedCharts.js", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(webpackUtils_1.bakeEmbedSnippet(serverSettings_1.BAKED_BASE_URL)); }));
mockSiteRouter.get("/grapher/latest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const latestRows = yield db.queryMysql(`SELECT config->>"$.slug" AS slug FROM charts where starred=1`);
    if (latestRows.length)
        res.redirect(`${serverSettings_1.BAKED_GRAPHER_URL}/${latestRows[0].slug}`);
    else
        throw new owidTypes_1.JsonError("No latest chart", 404);
}));
const explorerAdminServer = new ExplorerAdminServer_1.ExplorerAdminServer(GitCmsConstants_1.GIT_CMS_DIR, serverSettings_1.BAKED_BASE_URL);
explorerAdminServer.addMockBakedSiteRoutes(mockSiteRouter);
mockSiteRouter.get("/grapher/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // XXX add dev-prod parity for this
    res.set("Access-Control-Allow-Origin", "*");
    res.send(yield GrapherBaker_1.grapherSlugToHtmlPage(req.params.slug));
}));
mockSiteRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.renderFrontPage()); }));
mockSiteRouter.get("/donate", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.renderDonatePage()); }));
mockSiteRouter.get("/charts", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.renderChartsPage()); }));
countryProfileProjects_1.countryProfileSpecs.forEach((spec) => mockSiteRouter.get(`/${spec.rootPath}/:countrySlug`, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.countryProfileCountryPage(spec, req.params.countrySlug)); })));
// Route only available on the dev server
mockSiteRouter.get("/covid", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.renderCovidPage()); }));
mockSiteRouter.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.renderSearchPage()); }));
mockSiteRouter.get("/blog", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.renderBlogByPageNum(1)); }));
mockSiteRouter.get("/blog/page/:pageno", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pagenum = parseInt(req.params.pageno, 10);
    if (!isNaN(pagenum))
        res.send(yield siteRenderers_1.renderBlogByPageNum(isNaN(pagenum) ? 1 : pagenum));
    else
        throw new Error("invalid page number");
}));
mockSiteRouter.get("/headerMenu.json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!wpdb_1.isWordpressAPIEnabled) {
        res.status(404).send(yield siteRenderers_1.renderNotFoundPage());
        return;
    }
    res.send(yield siteRenderers_1.renderMenuJson());
}));
mockSiteRouter.use(
// Not all /app/uploads paths are going through formatting
// and being rewritten as /uploads. E.g. blog index images paths
// on front page.
["/uploads", "/app/uploads"], express_1.default.static(path.join(serverSettings_1.WORDPRESS_DIR, "web/app/uploads"), {
    fallthrough: false,
}));
mockSiteRouter.use("/exports", express_1.default.static(path.join(serverSettings_1.BAKED_SITE_DIR, "exports")));
mockSiteRouter.use("/grapher/exports/:slug.svg", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grapher = yield Chart_1.OldChart.getBySlug(req.params.slug);
    const vardata = yield grapher.getVariableData();
    res.setHeader("Content-Type", "image/svg+xml");
    res.send(yield GrapherImageBaker_1.grapherToSVG(grapher.config, vardata));
}));
mockSiteRouter.use("/", express_1.default.static(path.join(serverSettings_1.BASE_DIR, "public")));
mockSiteRouter.get("/indicator/:variableId/:country", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const variableId = serverUtil_1.expectInt(req.params.variableId);
    res.send(yield siteRenderers_1.pagePerVariable(variableId, req.params.country));
}));
mockSiteRouter.get("/countries", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield countryProfiles_1.countriesIndexPage(serverSettings_1.BAKED_BASE_URL)); }));
mockSiteRouter.get("/country/:countrySlug", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield countryProfiles_1.countryProfilePage(req.params.countrySlug, serverSettings_1.BAKED_BASE_URL)); }));
mockSiteRouter.get("/feedback", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.send(yield siteRenderers_1.feedbackPage()); }));
mockSiteRouter.get("/multiEmbedderTest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(serverUtil_1.renderToHtmlPage(MultiEmbedderTestPage_1.MultiEmbedderTestPage(req.query.globalEntitySelector === "true")));
}));
mockSiteRouter.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.path.replace(/^\//, "").replace("/", "__");
    try {
        res.send(yield siteRenderers_1.renderPageBySlug(slug));
    }
    catch (e) {
        console.error(e);
        res.status(404).send(yield siteRenderers_1.renderNotFoundPage());
    }
}));
//# sourceMappingURL=mockSiteRouter.js.map