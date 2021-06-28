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
const minimist_1 = __importDefault(require("minimist"));
const utils = __importStar(require("./utils"));
const fs = __importStar(require("fs-extra"));
function main(parsedArgs) {
    var e_1, _a;
    var _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const inDir = (_b = parsedArgs["i"]) !== null && _b !== void 0 ? _b : "grapherData";
        const outDir = (_c = parsedArgs["o"]) !== null && _c !== void 0 ? _c : "grapherSvgs";
        const numPartitions = (_d = parsedArgs["n"]) !== null && _d !== void 0 ? _d : 1;
        const partition = (_e = parsedArgs["p"]) !== null && _e !== void 0 ? _e : 1;
        if (partition <= 0)
            throw "Partition must be >= 1";
        if (partition > numPartitions)
            throw "Partition must be <= numPartitions";
        if (numPartitions <= 0)
            throw "numPartitions must be >= 1";
        if (numPartitions > 1000)
            throw "numPartitions must be <= 1000";
        if (!fs.existsSync(inDir))
            throw `Input directory does not exist ${inDir}`;
        if (!fs.existsSync(outDir))
            fs.mkdirSync(outDir, { recursive: true });
        const dir = yield fs.opendir(inDir);
        const directories = [];
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
        const directoriesToProcess = utils.sortAndPartitionDirectories(directories, false, inDir, numPartitions, partition);
        const svgRecords = [];
        for (const dir of directoriesToProcess) {
            const svgRecord = yield utils.renderSvgAndSave(dir, outDir);
            svgRecords.push(svgRecord);
        }
        yield utils.writeResultsCsvFile(outDir, svgRecords);
    });
}
const parsedArgs = minimist_1.default(process.argv.slice(2));
if (parsedArgs["h"]) {
    console.log(`export-graphs.js - utility to export grapher svg renderings and a summary csv file

Usage:
    export-graphs.js (-i DIR) (-o DIR)

Options:
    -i DIR         Input directory containing the data. [default: grapherData]
    -o DIR         Output directory that will contain the csv file and one svg file per grapher [default: grapherSvgs]
    -n PARTITIONS  Number of partitions - if specified then only 1/PARTITIONS of directories will be processed [default: 1]
    -p PARTITION   Partition to process [ 1 - PARTITIONS ]. Specifies the partition to process in this run. [default: 1]
    `);
}
else {
    try {
        main(parsedArgs);
        process.exitCode = 0;
    }
    catch (error) {
        console.error("Encountered an error", error);
        process.exitCode = 23;
    }
}
//# sourceMappingURL=export-graphs.js.map