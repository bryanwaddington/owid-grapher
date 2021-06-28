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
exports.bakeAllChangedGrapherPagesVariablesPngSvgAndDeleteRemovedGraphers = exports.grapherSlugToHtmlPage = void 0;
const React = __importStar(require("react"));
const Chart_1 = require("../db/model/Chart");
const GrapherPage_1 = require("../site/GrapherPage");
const siteRenderers_1 = require("../baker/siteRenderers");
const Post_1 = require("../db/model/Post");
const Util_1 = require("../clientUtils/Util");
const isPresent_1 = require("../clientUtils/isPresent");
const wpdb_1 = require("../db/wpdb");
const Variable_1 = require("../db/model/Variable");
const fs = __importStar(require("fs-extra"));
const serializers_1 = require("../clientUtils/serializers");
const lodash = __importStar(require("lodash"));
const GrapherImageBaker_1 = require("./GrapherImageBaker");
const serverSettings_1 = require("../settings/serverSettings");
const ProgressBar = require("progress");
const db = __importStar(require("../db/db"));
const glob = __importStar(require("glob"));
const owidTypes_1 = require("../clientUtils/owidTypes");
const ExplorerRedirects_1 = require("../explorerAdmin/ExplorerRedirects");
const grapherConfigToHtmlPage = (grapher) => __awaiter(void 0, void 0, void 0, function* () {
    const postSlug = Util_1.urlToSlug(grapher.originUrl || "");
    const post = postSlug ? yield Post_1.Post.bySlug(postSlug) : undefined;
    const relatedCharts = post && wpdb_1.isWordpressDBEnabled
        ? yield wpdb_1.getRelatedCharts(post.id)
        : undefined;
    const relatedArticles = grapher.slug && wpdb_1.isWordpressAPIEnabled
        ? yield wpdb_1.getRelatedArticles(grapher.slug)
        : undefined;
    return siteRenderers_1.renderToHtmlPage(React.createElement(GrapherPage_1.GrapherPage, { grapher: grapher, post: post, relatedCharts: relatedCharts, relatedArticles: relatedArticles, baseUrl: serverSettings_1.BAKED_BASE_URL, baseGrapherUrl: serverSettings_1.BAKED_GRAPHER_URL }));
});
const grapherSlugToHtmlPage = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const entity = yield Chart_1.Chart.getBySlug(slug);
    if (!entity)
        throw new owidTypes_1.JsonError("No such chart", 404);
    return grapherConfigToHtmlPage(entity.config);
});
exports.grapherSlugToHtmlPage = grapherSlugToHtmlPage;
const bakeVariableData = (bakedSiteDir, variableIds, outPath) => __awaiter(void 0, void 0, void 0, function* () {
    yield fs.mkdirp(`${bakedSiteDir}/grapher/data/variables/`);
    const vardata = yield Variable_1.getVariableData(variableIds);
    yield fs.writeFile(outPath, JSON.stringify(vardata));
    console.log(outPath);
    return vardata;
});
const bakeGrapherPageAndVariablesPngAndSVGIfChanged = (bakedSiteDir, grapher) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const htmlPath = `${bakedSiteDir}/grapher/${grapher.slug}.html`;
    let isSameVersion = false;
    try {
        // If the chart is the same version, we can potentially skip baking the data and exports (which is by far the slowest part)
        const html = yield fs.readFile(htmlPath, "utf8");
        const savedVersion = serializers_1.deserializeJSONFromHTML(html);
        isSameVersion = (savedVersion === null || savedVersion === void 0 ? void 0 : savedVersion.version) === grapher.version;
    }
    catch (err) {
        if (err.code !== "ENOENT")
            console.error(err);
    }
    // Always bake the html for every chart; it's cheap to do so
    const outPath = `${bakedSiteDir}/grapher/${grapher.slug}.html`;
    yield fs.writeFile(outPath, yield grapherConfigToHtmlPage(grapher));
    console.log(outPath);
    const variableIds = lodash.uniq((_a = grapher.dimensions) === null || _a === void 0 ? void 0 : _a.map((d) => d.variableId));
    if (!variableIds.length)
        return;
    // Make sure we bake the variables successfully before outputing the chart html
    const vardataPath = `${bakedSiteDir}/grapher/data/variables/${variableIds.join("+")}.json`;
    if (!isSameVersion || !fs.existsSync(vardataPath))
        yield bakeVariableData(bakedSiteDir, variableIds, vardataPath);
    try {
        yield fs.mkdirp(`${bakedSiteDir}/grapher/exports/`);
        const svgPath = `${bakedSiteDir}/grapher/exports/${grapher.slug}.svg`;
        const pngPath = `${bakedSiteDir}/grapher/exports/${grapher.slug}.png`;
        if (!isSameVersion ||
            !fs.existsSync(svgPath) ||
            !fs.existsSync(pngPath)) {
            const vardata = JSON.parse(yield fs.readFile(vardataPath, "utf8"));
            yield GrapherImageBaker_1.bakeGraphersToPngs(`${bakedSiteDir}/grapher/exports`, grapher, vardata, serverSettings_1.OPTIMIZE_SVG_EXPORTS);
            console.log(svgPath);
            console.log(pngPath);
        }
    }
    catch (err) {
        console.error(err);
    }
});
const deleteOldGraphers = (bakedSiteDir, newSlugs) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete any that are missing from the database
    const oldSlugs = glob
        .sync(`${bakedSiteDir}/grapher/*.html`)
        .map((slug) => slug.replace(`${bakedSiteDir}/grapher/`, "").replace(".html", ""));
    const toRemove = Util_1.without(oldSlugs, ...newSlugs);
    for (const slug of toRemove) {
        console.log(`DELETING ${slug}`);
        try {
            const paths = [
                `${bakedSiteDir}/grapher/${slug}.html`,
                `${bakedSiteDir}/grapher/exports/${slug}.png`,
            ]; //, `${BAKED_SITE_DIR}/grapher/exports/${slug}.svg`]
            yield Promise.all(paths.map((p) => fs.unlink(p)));
            paths.map((p) => console.log(p));
        }
        catch (err) {
            console.error(err);
        }
    }
});
const bakeAllChangedGrapherPagesVariablesPngSvgAndDeleteRemovedGraphers = (bakedSiteDir) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield db.queryMysql(`SELECT id, config FROM charts WHERE JSON_EXTRACT(config, "$.isPublished")=true ORDER BY JSON_EXTRACT(config, "$.slug") ASC`);
    const newSlugs = [];
    yield fs.mkdirp(bakedSiteDir + "/grapher");
    const progressBar = new ProgressBar("BakeGrapherPageVarPngAndSVGIfChanged [:bar] :current/:total :elapseds :rate/s :etas :name\n", {
        width: 20,
        total: rows.length + 1,
    });
    for (const row of rows) {
        const grapher = JSON.parse(row.config);
        grapher.id = row.id;
        newSlugs.push(grapher.slug);
        // Avoid baking paths that have an Explorer redirect.
        // Redirects take precedence.
        if (ExplorerRedirects_1.isPathRedirectedToExplorer(`/grapher/${grapher.slug}`)) {
            progressBar.tick({ name: `✅ ${grapher.slug}` });
            continue;
        }
        yield bakeGrapherPageAndVariablesPngAndSVGIfChanged(bakedSiteDir, grapher);
        progressBar.tick({ name: `✅ ${grapher.slug}` });
    }
    yield deleteOldGraphers(bakedSiteDir, newSlugs.filter(isPresent_1.isPresent));
    progressBar.tick({ name: `✅ Deleted old graphers` });
});
exports.bakeAllChangedGrapherPagesVariablesPngSvgAndDeleteRemovedGraphers = bakeAllChangedGrapherPagesVariablesPngSvgAndDeleteRemovedGraphers;
//# sourceMappingURL=GrapherBaker.js.map