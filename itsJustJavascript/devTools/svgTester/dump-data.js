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
const GrapherImageBaker_1 = require("../../baker/GrapherImageBaker");
const db_1 = require("../../db/db");
const fs = __importStar(require("fs-extra"));
const minimist_1 = __importDefault(require("minimist"));
const utils = __importStar(require("./utils"));
function main(parsedArgs) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const outDir = (_a = parsedArgs["o"]) !== null && _a !== void 0 ? _a : "grapherData";
        if (!fs.existsSync(outDir))
            fs.mkdirSync(outDir);
        const { graphersBySlug } = yield GrapherImageBaker_1.getPublishedGraphersBySlug(false);
        const allGraphers = [...graphersBySlug.values()];
        for (const grapher of allGraphers) {
            yield utils.saveGrapherSchemaAndData(grapher, outDir);
        }
        yield db_1.closeTypeOrmAndKnexConnections();
    });
}
const parsedArgs = minimist_1.default(process.argv.slice(2));
if (parsedArgs["h"]) {
    console.log(`dump-data.js - utility to export configs and data for all graphers.

Usage:
    dump-data.js (-o DIR)

Options:
    -o DIR   Output directory. Inside it one dir per grapher will be created. [default: grapherData]
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
//# sourceMappingURL=dump-data.js.map