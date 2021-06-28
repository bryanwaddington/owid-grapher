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
exports.grapherToSVG = exports.bakeGraphersToSvgs = exports.buildSvgOutFilepath = exports.buildSvgOutFilename = exports.initGrapherForSvgExport = exports.bakeGrapherToSvg = exports.getPublishedGraphersBySlug = exports.getGraphersAndRedirectsBySlug = exports.bakeGraphersToPngs = void 0;
const db = __importStar(require("../db/db"));
const Variable_1 = require("../db/model/Variable");
const fs = __importStar(require("fs-extra"));
const svgo_1 = __importDefault(require("svgo"));
const sharp_1 = __importDefault(require("sharp"));
const path = __importStar(require("path"));
const Grapher_1 = require("../grapher/core/Grapher");
const GrapherBakingUtils_1 = require("./GrapherBakingUtils");
function bakeGraphersToPngs(outDir, jsonConfig, vardata, optimizeSvgs = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const grapher = new Grapher_1.Grapher(Object.assign(Object.assign({}, jsonConfig), { manuallyProvideData: true }));
        grapher.isExportingtoSvgOrPng = true;
        grapher.receiveLegacyData(vardata);
        const outPath = path.join(outDir, grapher.slug);
        let svgCode = grapher.staticSVG;
        if (optimizeSvgs)
            svgCode = yield optimizeSvg(svgCode);
        return Promise.all([
            fs
                .writeFile(`${outPath}.svg`, svgCode)
                .then(() => console.log(`${outPath}.svg`)),
            sharp_1.default(Buffer.from(grapher.staticSVG), { density: 144 })
                .png()
                .resize(grapher.idealBounds.width, grapher.idealBounds.height)
                .flatten({ background: "#ffffff" })
                .toFile(`${outPath}.png`),
        ]);
    });
}
exports.bakeGraphersToPngs = bakeGraphersToPngs;
function getGraphersAndRedirectsBySlug() {
    return __awaiter(this, void 0, void 0, function* () {
        const { graphersBySlug, graphersById } = yield getPublishedGraphersBySlug();
        const redirectQuery = db.queryMysql(`SELECT slug, chart_id FROM chart_slug_redirects`);
        for (const row of yield redirectQuery) {
            const grapher = graphersById.get(row.chart_id);
            if (grapher) {
                graphersBySlug.set(row.slug, grapher);
            }
        }
        return graphersBySlug;
    });
}
exports.getGraphersAndRedirectsBySlug = getGraphersAndRedirectsBySlug;
function getPublishedGraphersBySlug(includePrivate = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const graphersBySlug = new Map();
        const graphersById = new Map();
        // Select all graphers that are published and that do not have the tag Private
        const sql = includePrivate
            ? `SELECT * FROM charts WHERE JSON_EXTRACT(config, "$.isPublished") IS TRUE`
            : `SELECT charts.id as id, charts.config as config FROM charts
LEFT JOIN chart_tags on chart_tags.chartId = charts.id
LEFT JOIN tags on tags.id = chart_tags.tagid
WHERE JSON_EXTRACT(config, "$.isPublished") IS TRUE
AND tags.name != 'Private'`;
        const query = db.queryMysql(sql);
        for (const row of yield query) {
            const grapher = JSON.parse(row.config);
            grapher.id = row.id;
            graphersBySlug.set(grapher.slug, grapher);
            graphersById.set(row.id, grapher);
        }
        return { graphersBySlug, graphersById };
    });
}
exports.getPublishedGraphersBySlug = getPublishedGraphersBySlug;
function bakeGrapherToSvg(jsonConfig, outDir, slug, queryStr = "", optimizeSvgs = false, overwriteExisting = false, verbose = true) {
    return __awaiter(this, void 0, void 0, function* () {
        const grapher = initGrapherForSvgExport(jsonConfig, queryStr);
        const { width, height } = grapher.idealBounds;
        const outPath = buildSvgOutFilepath(slug, outDir, jsonConfig.version, width, height, verbose, queryStr);
        if (fs.existsSync(outPath) && !overwriteExisting)
            return;
        const variableIds = grapher.dimensions.map((d) => d.variableId);
        const vardata = yield Variable_1.getVariableData(variableIds);
        grapher.receiveLegacyData(vardata);
        let svgCode = grapher.staticSVG;
        if (optimizeSvgs)
            svgCode = yield optimizeSvg(svgCode);
        fs.writeFile(outPath, svgCode);
        return svgCode;
    });
}
exports.bakeGrapherToSvg = bakeGrapherToSvg;
function initGrapherForSvgExport(jsonConfig, queryStr = "") {
    const grapher = new Grapher_1.Grapher(Object.assign(Object.assign({}, jsonConfig), { manuallyProvideData: true, queryStr }));
    grapher.isExportingtoSvgOrPng = true;
    return grapher;
}
exports.initGrapherForSvgExport = initGrapherForSvgExport;
function buildSvgOutFilename(slug, version, width, height, queryStr = "") {
    const fileKey = GrapherBakingUtils_1.grapherSlugToExportFileKey(slug, queryStr);
    const outFilename = `${fileKey}_v${version}_${width}x${height}.svg`;
    return outFilename;
}
exports.buildSvgOutFilename = buildSvgOutFilename;
function buildSvgOutFilepath(slug, outDir, version, width, height, verbose, queryStr = "") {
    const outFilename = buildSvgOutFilename(slug, version, width, height, queryStr);
    const outPath = path.join(outDir, outFilename);
    if (verbose)
        console.log(outPath);
    return outPath;
}
exports.buildSvgOutFilepath = buildSvgOutFilepath;
function bakeGraphersToSvgs(grapherUrls, outDir, optimizeSvgs = false) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.mkdirp(outDir);
        const graphersBySlug = yield getGraphersAndRedirectsBySlug();
        return Promise.all(Array.from(grapherUrls).map((grapherUrl) => {
            const { slug, queryStr } = GrapherBakingUtils_1.grapherUrlToSlugAndQueryStr(grapherUrl);
            const jsonConfig = graphersBySlug.get(slug);
            if (jsonConfig) {
                return bakeGrapherToSvg(jsonConfig, outDir, slug, queryStr, optimizeSvgs);
            }
            return undefined;
        }));
    });
}
exports.bakeGraphersToSvgs = bakeGraphersToSvgs;
const svgoConfig = {
    floatPrecision: 2,
    plugins: [
        { collapseGroups: false },
        { removeUnknownsAndDefaults: false },
        { removeViewBox: false },
        { removeXMLNS: false },
    ],
};
const svgoInstance = new svgo_1.default(svgoConfig);
function optimizeSvg(svgString) {
    return __awaiter(this, void 0, void 0, function* () {
        const optimizedSvg = yield svgoInstance.optimize(svgString);
        return optimizedSvg.data;
    });
}
function grapherToSVG(jsonConfig, vardata) {
    return __awaiter(this, void 0, void 0, function* () {
        const grapher = new Grapher_1.Grapher(Object.assign(Object.assign({}, jsonConfig), { manuallyProvideData: true }));
        grapher.isExportingtoSvgOrPng = true;
        grapher.receiveLegacyData(vardata);
        return grapher.staticSVG;
    });
}
exports.grapherToSVG = grapherToSVG;
//# sourceMappingURL=GrapherImageBaker.js.map