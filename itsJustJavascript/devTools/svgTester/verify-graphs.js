#! /usr/bin/env node
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
const minimist_1 = __importDefault(require("minimist"));
const utils = __importStar(require("./utils"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const Pool = require("multiprocessing").Pool;
const pool = new Pool();
function main(parsedArgs) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        // perpare and check arguments
        const inDir = (_a = parsedArgs["i"]) !== null && _a !== void 0 ? _a : "grapherData";
        const referenceDir = (_b = parsedArgs["r"]) !== null && _b !== void 0 ? _b : "grapherSvgs";
        const outDir = (_c = parsedArgs["o"]) !== null && _c !== void 0 ? _c : "differentGrapherSvgs";
        const reverseDirectories = (_d = parsedArgs["l"]) !== null && _d !== void 0 ? _d : false;
        const verbose = (_e = parsedArgs["v"]) !== null && _e !== void 0 ? _e : false;
        // minimist turns a single number into a JS number so we do toString to normalize (TS types are misleading)
        const rawGrapherIds = ((_f = parsedArgs["g"]) !== null && _f !== void 0 ? _f : "").toString();
        if (!fs.existsSync(inDir))
            throw `Input directory does not exist ${inDir}`;
        if (!fs.existsSync(referenceDir))
            throw `Reference directory does not exist ${inDir}`;
        if (!fs.existsSync(outDir))
            fs.mkdirSync(outDir);
        // Get the directories to process as a list and the content of the csv file with the md5 hashes etc as a map of grapher id -> SvgResult
        const { directoriesToProcess, csvContentMap, } = yield utils.prepareVerifyRun(rawGrapherIds, inDir, reverseDirectories, referenceDir);
        const verifyJobs = directoriesToProcess.map((dir) => ({
            dir,
            referenceEntry: csvContentMap.get(parseInt(dir)),
            referenceDir,
            outDir,
            verbose,
        }));
        // Parellize the CPU heavy verification using the multiprocessing library. This library stringifies the invocation to other processes
        // so this call uses the intermediate verify-graphs-runner script. This call will then in parallel take the descriptions of the verifyJobs,
        // load the config and data and intialize a grapher, create the default svg output and check if it's md5 hash is the same as the one in
        // the reference csv file (from the csvContentMap lookup above). The entire parallel operation returns a promise containing an array
        // or result values.
        const validationResults = yield pool.map(verifyJobs, path.join(__dirname, "verify-graphs-runner"));
        utils.logIfVerbose(verbose, "Verifications completed");
        const exitCode = utils.displayVerifyResultsAndGetExitCode(validationResults, verbose, directoriesToProcess);
        // This call to exit is necessary for some unknown reason to make sure that the process terminates. It
        // was not required before introducing the multiprocessing library.
        process.exit(exitCode);
    });
}
const parsedArgs = minimist_1.default(process.argv.slice(2));
if (parsedArgs["h"]) {
    console.log(`verify-graphs.js - utility to check if grapher svg renderings have changed vs the reference export

Usage:
    verify-graphs.js (-i DIR) (-o DIR)

Options:
    -i DIR         Input directory containing the data. [default: grapherData]
    -r DIR         Input directory containing the results.csv file to check against [default: grapherSvgs]
    -o DIR         Output directory that will contain the svg files that were different [default: differentGrapherSvgs]
    -g IDS         Manually specify ids to verify (use comma separated ids and ranges, all without spaces. E.g.: 2,4-8,10)
    -l             Reverse the order (start from last). Useful to test different generation order.
    -v             Verbose mode
    `);
}
else {
    try {
        main(parsedArgs);
    }
    catch (error) {
        console.error("Encountered an error", error);
        process.exitCode = -1;
    }
}
//# sourceMappingURL=verify-graphs.js.map