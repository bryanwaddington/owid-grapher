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
exports.getGrapherExportsByUrl = exports.bakeGrapherUrls = exports.grapherSlugToExportFileKey = exports.grapherUrlToSlugAndQueryStr = void 0;
const glob = __importStar(require("glob"));
const path = __importStar(require("path"));
const lodash = __importStar(require("lodash"));
const serverSettings_1 = require("../settings/serverSettings");
const db = __importStar(require("../db/db"));
const GrapherImageBaker_1 = require("../baker/GrapherImageBaker");
const slackLog_1 = require("./slackLog");
const Chart_1 = require("../db/model/Chart");
const md5_1 = __importDefault(require("md5"));
const Url_1 = require("../clientUtils/urls/Url");
// Splits a grapher URL like https://ourworldindata.org/grapher/soil-lifespans?tab=chart
// into its slug (soil-lifespans) and queryStr (?tab=chart)
const grapherUrlToSlugAndQueryStr = (grapherUrl) => {
    var _a;
    const url = Url_1.Url.fromURL(grapherUrl);
    const slug = lodash.last((_a = url.pathname) === null || _a === void 0 ? void 0 : _a.split("/"));
    const queryStr = url.queryStr;
    return { slug, queryStr };
};
exports.grapherUrlToSlugAndQueryStr = grapherUrlToSlugAndQueryStr;
// Combines a grapher slug, and potentially its query string, to _part_ of an export file
// name. It's called fileKey and not fileName because the actual export filename also includes
// other parts, like chart version and width/height.
const grapherSlugToExportFileKey = (slug, queryStr) => `${slug}${queryStr ? `-${md5_1.default(queryStr)}` : ""}`;
exports.grapherSlugToExportFileKey = grapherSlugToExportFileKey;
const bakeGrapherUrls = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const currentExports = yield exports.getGrapherExportsByUrl();
    const slugToId = yield Chart_1.Chart.mapSlugsToIds();
    const toBake = [];
    // Check that we need to bake this url, and don't already have an export
    for (const url of urls) {
        const current = currentExports.get(url);
        if (!current) {
            toBake.push(url);
            continue;
        }
        const slug = lodash.last((_a = Url_1.Url.fromURL(url).pathname) === null || _a === void 0 ? void 0 : _a.split("/"));
        if (!slug) {
            slackLog_1.log.warn(`Invalid chart url ${url}`);
            continue;
        }
        const chartId = slugToId[slug];
        if (chartId === undefined) {
            slackLog_1.log.warn(`Couldn't find chart with slug ${slug}`);
            continue;
        }
        const rows = yield db.queryMysql(`SELECT charts.config->>"$.version" AS version FROM charts WHERE charts.id=?`, [chartId]);
        if (!rows.length) {
            slackLog_1.log.warn(`Mysteriously missing chart by id ${chartId}`);
            continue;
        }
        if (rows[0].version > current.version)
            toBake.push(url);
    }
    if (toBake.length > 0) {
        for (const grapherUrls of lodash.chunk(toBake, 5)) {
            yield GrapherImageBaker_1.bakeGraphersToSvgs(grapherUrls, `${serverSettings_1.BAKED_SITE_DIR}/exports`, serverSettings_1.OPTIMIZE_SVG_EXPORTS);
        }
    }
});
exports.bakeGrapherUrls = bakeGrapherUrls;
const getGrapherExportsByUrl = () => __awaiter(void 0, void 0, void 0, function* () {
    // Index the files to see what we have available, using the most recent version
    // if multiple exports exist
    const files = glob.sync(`${serverSettings_1.BAKED_SITE_DIR}/exports/*.svg`);
    const exportsByKey = new Map();
    for (const filepath of files) {
        const filename = path.basename(filepath);
        const [key, version, dims] = filename.toLowerCase().split("_");
        const versionNumber = parseInt(version.split("v")[1]);
        const [width, height] = dims.split("x");
        const current = exportsByKey.get(key);
        if (!current || current.version < versionNumber) {
            exportsByKey.set(key, {
                key: key,
                svgUrl: `${serverSettings_1.BAKED_BASE_URL}/exports/${filename}`,
                version: versionNumber,
                width: parseInt(width),
                height: parseInt(height),
            });
        }
    }
    return {
        get(grapherUrl) {
            const { slug, queryStr } = exports.grapherUrlToSlugAndQueryStr(grapherUrl);
            return exportsByKey.get(exports.grapherSlugToExportFileKey(slug, queryStr).toLowerCase());
        },
    };
});
exports.getGrapherExportsByUrl = getGrapherExportsByUrl;
//# sourceMappingURL=GrapherBakingUtils.js.map