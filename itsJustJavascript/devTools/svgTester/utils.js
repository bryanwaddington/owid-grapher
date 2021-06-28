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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayVerifyResultsAndGetExitCode = exports.prepareVerifyRun = exports.renderAndVerifySvg = exports.writeResultsCsvFile = exports.getReferenceCsvContentMap = exports.logDifferencesToConsole = exports.loadGrapherConfigAndData = exports.loadReferenceSvg = exports.readGzippedJsonFile = exports.renderSvgAndSave = exports.processSvgAndCalculateHash = exports.renderSvg = exports.saveGrapherSchemaAndData = exports.writeToGzippedFile = exports.getGrapherIdListFromString = exports.sortAndPartitionDirectories = exports.decideDirectoriesToVerify = exports.verifySvg = exports.logIfVerbose = exports.finished = exports.SVG_CSV_HEADER = void 0;
const stream = __importStar(require("stream"));
const path = __importStar(require("path"));
const Variable_1 = require("../../db/model/Variable");
const GrapherImageBaker_1 = require("../../baker/GrapherImageBaker");
const zlib_1 = require("zlib");
const fs = __importStar(require("fs-extra"));
const get_stream_1 = __importDefault(require("get-stream"));
const md5_1 = __importDefault(require("md5"));
const util = __importStar(require("util"));
const Util_1 = require("../../clientUtils/Util");
const lodash_1 = __importDefault(require("lodash"));
const CONFIG_FILENAME = "config.json.gz";
const RESULTS_FILENAME = "results.csv";
const DATA_FILENAME = "data.json.gz";
exports.SVG_CSV_HEADER = `grapherId,slug,chartType,md5,svgFilename`;
exports.finished = util.promisify(stream.finished); // (A)
const resultOk = (value) => ({
    kind: "ok",
    value: value,
});
const resultError = (error) => ({
    kind: "error",
    error: error,
});
function logIfVerbose(verbose, message, param) {
    if (verbose)
        if (param)
            console.log(message, param);
        else
            console.log(message);
}
exports.logIfVerbose = logIfVerbose;
function findFirstDiffIndex(a, b) {
    var i = 0;
    while (i < a.length && i < b.length && a[i] === b[i])
        i++;
    if (a.length === b.length && a.length === i) {
        console.warn("No difference found!");
    }
    return i;
}
function verifySvg(newSvg, newSvgRecord, referenceSvgRecord, referenceSvgsPath, verbose) {
    return __awaiter(this, void 0, void 0, function* () {
        logIfVerbose(verbose, `verifying ${newSvgRecord.chartId}`);
        if (newSvgRecord.md5 === referenceSvgRecord.md5) {
            // if the md5 hash is unchanged then there is no difference
            return resultOk(null);
        }
        const referenceSvg = yield loadReferenceSvg(referenceSvgsPath, referenceSvgRecord);
        const preparedNewSvg = prepareSvgForComparision(newSvg);
        const preparedReferenceSvg = prepareSvgForComparision(referenceSvg);
        const firstDiffIndex = findFirstDiffIndex(preparedNewSvg, preparedReferenceSvg);
        logIfVerbose(verbose, `${newSvgRecord.chartId} had differences`);
        return resultError({
            chartId: newSvgRecord.chartId,
            startIndex: firstDiffIndex,
            referenceSvgFragment: preparedReferenceSvg.substr(firstDiffIndex - 20, 40),
            newSvgFragment: preparedNewSvg.substr(firstDiffIndex - 20, 40),
        });
    });
}
exports.verifySvg = verifySvg;
function decideDirectoriesToVerify(grapherIds, inDir, reverseDirectories, numPartitions = 1, partition = 1) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let directories = [];
        if (grapherIds.length === 0) {
            // If no grapher ids were given scan all directories in the inDir folder
            const dir = yield fs.opendir(inDir);
            try {
                for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                    const entry = dir_1_1.value;
                    if (entry.isDirectory()) {
                        directories.push(entry.name);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (dir_1_1 && !dir_1_1.done && (_a = dir_1.return)) yield _a.call(dir_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            // if grapher ids were given check which ones exist in inDir and filter to those
            // -> if by doing so we drop some, warn the user
            directories = grapherIds.map((id) => id.toString());
            const allDirsCount = directories.length;
            directories = directories.filter((item) => fs.existsSync(path.join(inDir, item)));
            if (directories.length < allDirsCount) {
                console.warn(`${allDirsCount} grapher ids were given but only ${directories.length} existed as directories`);
            }
        }
        // Sort directories numerically (this assumes every dir == a grapher id and those are numeric)
        const directoriesToProcess = sortAndPartitionDirectories(directories, reverseDirectories, inDir, numPartitions, partition);
        return directoriesToProcess;
    });
}
exports.decideDirectoriesToVerify = decideDirectoriesToVerify;
function sortAndPartitionDirectories(directories, reverseDirectories, inDir, numPartitions, partition) {
    directories.sort((a, b) => parseInt(a) - parseInt(b));
    if (reverseDirectories) {
        directories.reverse();
    }
    const paths = directories.map((name) => path.join(inDir, name));
    const directoriesToProcess = [];
    // Pick ever numPartition-tht element, using partition as the offset
    for (let i = 0; i < paths.length; i++) {
        if (i % numPartitions === partition - 1) {
            directoriesToProcess.push(paths[i]);
        }
    }
    return directoriesToProcess;
}
exports.sortAndPartitionDirectories = sortAndPartitionDirectories;
/** Turn a list of comma separated numbers and ranges into an array of numbers */
function getGrapherIdListFromString(rawGrapherIds) {
    return rawGrapherIds.split(",").flatMap((item) => {
        if (item.includes("-")) {
            const subparts = item.split("-");
            if (subparts.length !== 2) {
                console.warn(`Invalid graphid range: ${item}`);
                return [];
            }
            else {
                const first = parseInt(subparts[0]);
                const second = parseInt(subparts[1]);
                return lodash_1.default.range(first, second + 1);
            }
        }
        else {
            const parsed = parseInt(item);
            if (isNaN(parsed)) {
                return [];
            }
            else {
                return [parsed];
            }
        }
    });
}
exports.getGrapherIdListFromString = getGrapherIdListFromString;
function writeToGzippedFile(data, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = JSON.stringify(data);
        const writeStream = fs.createWriteStream(filename);
        const gzipStream = zlib_1.createGzip();
        gzipStream.pipe(writeStream);
        gzipStream.write(json);
        gzipStream.end();
        return exports.finished(writeStream);
    });
}
exports.writeToGzippedFile = writeToGzippedFile;
function saveGrapherSchemaAndData(config, outDir) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const dataDir = path.join(outDir, (_b = (_a = config.id) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "");
        if (!fs.existsSync(dataDir))
            fs.mkdirSync(dataDir);
        const configPath = path.join(dataDir, CONFIG_FILENAME);
        const promise1 = writeToGzippedFile(config, configPath);
        const dataPath = path.join(dataDir, DATA_FILENAME);
        const grapher = GrapherImageBaker_1.initGrapherForSvgExport(config);
        const variableIds = grapher.dimensions.map((d) => d.variableId);
        const promise2 = Variable_1.getVariableData(variableIds).then((vardata) => writeToGzippedFile(vardata, dataPath));
        yield Promise.allSettled([promise1, promise2]);
    });
}
exports.saveGrapherSchemaAndData = saveGrapherSchemaAndData;
function renderSvg(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        const [config, data] = yield loadGrapherConfigAndData(dir);
        // Graphers sometimes need to generate ids (incrementing numbers). For this
        // they keep a stateful variable in clientutils. To minimize differences
        // between consecutive runs we reset this id here before every export
        Util_1.TESTING_ONLY_reset_guid();
        const grapher = GrapherImageBaker_1.initGrapherForSvgExport(config);
        const { width, height } = grapher.idealBounds;
        const outFilename = GrapherImageBaker_1.buildSvgOutFilename(config.slug, config.version, width, height);
        grapher.receiveLegacyData(data);
        const svg = grapher.staticSVG;
        const svgRecord = {
            chartId: config.id,
            slug: config.slug,
            chartType: config.type,
            md5: processSvgAndCalculateHash(svg),
            svgFilename: outFilename,
        };
        return Promise.resolve([svg, svgRecord]);
    });
}
exports.renderSvg = renderSvg;
const replaceRegexes = [/-select-[0-9]+-input/g];
/** Some fragments of the svgs are non-deterministic. This function is used to
    delete all such fragments */
function prepareSvgForComparision(svg) {
    let current = svg;
    for (const replaceRegex of replaceRegexes) {
        current = svg.replace(replaceRegex, "");
    }
    return current;
}
/** Remove all non-deterministic parts of the svg and then calculate an md5 hash */
function processSvgAndCalculateHash(svg) {
    const processed = prepareSvgForComparision(svg);
    return md5_1.default(processed);
}
exports.processSvgAndCalculateHash = processSvgAndCalculateHash;
function renderSvgAndSave(dir, outDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const [svg, svgRecord] = yield renderSvg(dir);
        const outPath = path.join(outDir, svgRecord.svgFilename);
        yield fs.writeFile(outPath, svg);
        return Promise.resolve(svgRecord);
    });
}
exports.renderSvgAndSave = renderSvgAndSave;
function readGzippedJsonFile(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const readStream = fs.createReadStream(filename);
        const gzipStream = zlib_1.createGunzip();
        readStream.pipe(gzipStream);
        const content = yield get_stream_1.default(gzipStream);
        return JSON.parse(content);
    });
}
exports.readGzippedJsonFile = readGzippedJsonFile;
function loadReferenceSvg(referenceDir, referenceSvgRecord) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!referenceDir)
            throw "RefereneDir was empty in loadReferenceSvg";
        if (!referenceSvgRecord)
            throw "reference svg record was not defined";
        if (!referenceSvgRecord.svgFilename)
            throw "reference svg record.svgfilename was not defined";
        const referenceFilename = path.join(referenceDir, referenceSvgRecord.svgFilename);
        if (!fs.existsSync(referenceFilename))
            throw `Input directory does not exist ${referenceFilename}`;
        const svg = yield fs.readFile(referenceFilename, "utf-8");
        return svg;
    });
}
exports.loadReferenceSvg = loadReferenceSvg;
function loadGrapherConfigAndData(inputDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(inputDir))
            throw `Input directory does not exist ${inputDir}`;
        const configPath = path.join(inputDir, CONFIG_FILENAME);
        const config = (yield readGzippedJsonFile(configPath));
        const dataPath = path.join(inputDir, DATA_FILENAME);
        const data = yield readGzippedJsonFile(dataPath);
        return Promise.resolve([config, data]);
    });
}
exports.loadGrapherConfigAndData = loadGrapherConfigAndData;
function logDifferencesToConsole(svgRecord, validationResult) {
    console.warn(`Svg was different for ${svgRecord.chartId}. The difference starts at character ${validationResult.error.startIndex}.
Reference: ${validationResult.error.referenceSvgFragment}
Current  : ${validationResult.error.newSvgFragment}`);
}
exports.logDifferencesToConsole = logDifferencesToConsole;
function getReferenceCsvContentMap(referenceDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield fs.readFile(path.join(referenceDir, RESULTS_FILENAME), "utf-8");
        const csvContentArray = results
            .split("\n")
            .splice(1)
            .map((line) => {
            const items = line.split(",");
            const chartId = parseInt(items[0]);
            return [
                chartId,
                {
                    chartId: chartId,
                    slug: items[1],
                    chartType: items[2],
                    md5: items[3],
                    svgFilename: items[4],
                },
            ];
        });
        const csvContentMap = new Map(csvContentArray);
        return csvContentMap;
    });
}
exports.getReferenceCsvContentMap = getReferenceCsvContentMap;
function writeResultsCsvFile(outDir, svgRecords) {
    return __awaiter(this, void 0, void 0, function* () {
        const resultsPath = path.join(outDir, RESULTS_FILENAME);
        const csvFileStream = fs.createWriteStream(resultsPath);
        csvFileStream.write(exports.SVG_CSV_HEADER + "\n");
        for (const row of svgRecords) {
            const line = `${row.chartId},${row.slug},${row.chartType},${row.md5},${row.svgFilename}`;
            csvFileStream.write(line + "\n");
        }
        csvFileStream.end();
        yield exports.finished(csvFileStream);
        csvFileStream.close();
    });
}
exports.writeResultsCsvFile = writeResultsCsvFile;
function renderAndVerifySvg({ dir, referenceEntry, referenceDir, outDir, verbose, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dir)
            throw "Dir was not defined";
        if (!referenceEntry)
            throw "ReferenceEntry was not defined";
        if (!referenceDir)
            throw "ReferenceDir was not defined";
        if (!outDir)
            throw "outdir was not defined";
        const [svg, svgRecord] = yield renderSvg(dir);
        const validationResult = yield verifySvg(svg, svgRecord, referenceEntry, referenceDir, verbose);
        // verifySvg returns a Result type - if it is success we don't care any further
        // but if there was an error then we write the svg and a message to stderr
        switch (validationResult.kind) {
            case "error":
                logDifferencesToConsole(svgRecord, validationResult);
                const outputPath = path.join(outDir, svgRecord.svgFilename);
                yield fs.writeFile(outputPath, svg);
        }
        return Promise.resolve(validationResult);
    });
}
exports.renderAndVerifySvg = renderAndVerifySvg;
function prepareVerifyRun(rawGrapherIds, inDir, reverseDirectories, referenceDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const grapherIds = getGrapherIdListFromString(rawGrapherIds);
        const directoriesToProcess = yield decideDirectoriesToVerify(grapherIds, inDir, reverseDirectories);
        const csvContentMap = yield getReferenceCsvContentMap(referenceDir);
        return { directoriesToProcess, csvContentMap };
    });
}
exports.prepareVerifyRun = prepareVerifyRun;
function displayVerifyResultsAndGetExitCode(validationResults, verbose, directoriesToProcess) {
    let returnCode;
    const errorResults = validationResults.filter((result) => result.kind === "error");
    if (errorResults.length === 0) {
        logIfVerbose(verbose, `There were no differences in all ${directoriesToProcess.length} graphs processed`);
        returnCode = 0;
    }
    else {
        console.warn(`${errorResults.length} graphs had differences: ${errorResults
            .map((err) => err.error.chartId)
            .join()}`);
        for (const result of errorResults) {
            console.log("", result.error.chartId); // write to stdout one grapher id per file for easy piping to other processes
        }
        returnCode = errorResults.length;
    }
    return returnCode;
}
exports.displayVerifyResultsAndGetExitCode = displayVerifyResultsAndGetExitCode;
//# sourceMappingURL=utils.js.map