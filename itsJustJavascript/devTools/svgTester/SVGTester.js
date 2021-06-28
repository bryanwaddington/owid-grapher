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
exports.getComparePage = exports.bakeAndSaveResultsFile = exports.svgCompareFormPage = void 0;
const fs = __importStar(require("fs-extra"));
const d3_dsv_1 = require("d3-dsv");
const md5_1 = __importDefault(require("md5"));
const clientSettings_1 = require("../../settings/clientSettings");
const react_1 = __importDefault(require("react"));
const db_1 = require("../../db/db");
const GrapherImageBaker_1 = require("../../baker/GrapherImageBaker");
const header = `bakeOrder,timeToBake,slug,chartType,md5`;
const sampleRow = `1,123,world-pop,LineChart,ee5a6312...`;
const svgResultsPlaceholder = `${header}\n${sampleRow}\n`;
const style = {
    width: 600,
    height: 300,
};
exports.svgCompareFormPage = (react_1.default.createElement("form", { action: "", method: "post" },
    react_1.default.createElement("div", null, "Prod SVG Results CSV"),
    react_1.default.createElement("textarea", { name: "prodResults", placeholder: svgResultsPlaceholder, style: style }),
    react_1.default.createElement("br", null),
    react_1.default.createElement("div", null, "Local SVG Results CSV"),
    react_1.default.createElement("textarea", { name: "localResults", placeholder: svgResultsPlaceholder, style: style }),
    react_1.default.createElement("br", null),
    react_1.default.createElement("button", { type: "submit" }, "Compare")));
function bakeAndSaveResultsFile(bakeLimit = 100000, outDir = __dirname + "/bakedSvgs") {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(outDir))
            fs.mkdirSync(outDir);
        const { graphersBySlug } = yield GrapherImageBaker_1.getPublishedGraphersBySlug();
        const resultsPath = outDir + "/results.csv";
        fs.writeFileSync(resultsPath, header + "\n");
        // eslint-disable-next-line no-console
        console.log(header);
        let bakeOrder = 1;
        for (const [slug, config] of graphersBySlug) {
            if (bakeOrder > bakeLimit)
                break;
            const startTime = Date.now();
            const svg = yield GrapherImageBaker_1.bakeGrapherToSvg(config, outDir, slug, undefined, undefined, true, false);
            const row = {
                bakeOrder,
                timeToBake: Date.now() - startTime,
                slug,
                chartType: config.type,
                md5: md5_1.default(svg),
            };
            const line = `${bakeOrder},${row.timeToBake},${row.slug},${row.chartType},${row.md5}`;
            // eslint-disable-next-line no-console
            console.log(line);
            fs.appendFileSync(resultsPath, line + "\n");
            bakeOrder++;
        }
        yield db_1.closeTypeOrmAndKnexConnections();
    });
}
exports.bakeAndSaveResultsFile = bakeAndSaveResultsFile;
const compareSets = (liveSvgs, localSvgs) => {
    const localSvgMap = new Map();
    localSvgs.forEach((svg) => {
        localSvgMap.set(svg.slug, svg);
    });
    return liveSvgs.map((liveSvg) => {
        const { slug } = liveSvg;
        const localSvg = localSvgMap.get(slug);
        if (!localSvg)
            return {
                missing: slug,
            };
        const changed = liveSvg.md5 !== localSvg.md5;
        const devInteractiveUrl = `${clientSettings_1.BAKED_GRAPHER_URL}/${slug}`;
        const devSvgPath = `${clientSettings_1.BAKED_GRAPHER_URL}/exports/${slug}.svg`;
        const liveInteractiveUrl = `https://ourworldindata.org/grapher/${slug}`;
        const liveSvgUrl = `https://ourworldindata.org/grapher/exports/${slug}.svg`;
        return {
            changed,
            liveSvgUrl,
            liveInteractiveUrl,
            devSvgPath,
            devInteractiveUrl,
        };
    });
};
const getComparePage = (liveRows, devRows) => __awaiter(void 0, void 0, void 0, function* () {
    const live = d3_dsv_1.csvParse(liveRows);
    const dev = d3_dsv_1.csvParse(devRows);
    const files = compareSets(live, dev);
    const missing = files.filter((file) => file.missing);
    const notMissing = files.filter((file) => !file.missing);
    const changed = notMissing.filter((file) => file.changed);
    const rows = changed.map((file) => {
        var _a;
        return (react_1.default.createElement("tr", { key: (_a = file.devSvgPath) !== null && _a !== void 0 ? _a : file.devInteractiveUrl },
            react_1.default.createElement("td", null,
                react_1.default.createElement("a", { href: file.liveSvgUrl },
                    react_1.default.createElement("img", { src: file.liveSvgUrl })),
                react_1.default.createElement("a", { href: file.liveInteractiveUrl }, file.liveInteractiveUrl)),
            react_1.default.createElement("td", null,
                react_1.default.createElement("a", { href: file.devSvgPath },
                    react_1.default.createElement("img", { src: file.devSvgPath })),
                react_1.default.createElement("a", { href: file.devInteractiveUrl }, file.devInteractiveUrl))));
    });
    const summaryMessage = `${changed.length} (${Math.round((100 * changed.length) / notMissing.length)}%) out of ${notMissing.length} are different. ${notMissing.length - changed.length} unchanged. ${missing.length} files on live missing locally.`;
    const missingDivs = missing.map((el) => {
        var _a;
        return (react_1.default.createElement("div", { key: (_a = el.devSvgPath) !== null && _a !== void 0 ? _a : el.devInteractiveUrl },
            "$",
            el.missing));
    });
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", null, summaryMessage),
        react_1.default.createElement("table", null, rows),
        react_1.default.createElement("div", null, missing.length && react_1.default.createElement(react_1.default.Fragment, null, missingDivs))));
});
exports.getComparePage = getComparePage;
//# sourceMappingURL=SVGTester.js.map