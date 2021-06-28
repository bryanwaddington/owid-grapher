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
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
function main(parsedArgs) {
    var e_1, _a;
    var _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        // perpare and check arguments
        const referenceDir = (_b = parsedArgs["r"]) !== null && _b !== void 0 ? _b : "grapherSvgs";
        const differencesDir = (_c = parsedArgs["d"]) !== null && _c !== void 0 ? _c : "differentGrapherSvgs";
        const outFile = (_d = parsedArgs["o"]) !== null && _d !== void 0 ? _d : "differences.html";
        if (!fs.existsSync(referenceDir))
            throw `Reference directory does not exist ${referenceDir}`;
        if (!fs.existsSync(differencesDir))
            throw `Differences directory does not exist ${differencesDir}`;
        const dir = yield fs.opendir(differencesDir);
        const files = [];
        try {
            for (var dir_1 = __asyncValues(dir), dir_1_1; dir_1_1 = yield dir_1.next(), !dir_1_1.done;) {
                const entry = dir_1_1.value;
                if (entry.isFile() && entry.name.endsWith("svg")) {
                    files.push(entry.name);
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
        const sections = files.map((file) => createSection(file, referenceDir, differencesDir));
        yield fs.writeFile(outFile, createHtml(sections.join("\n")));
    });
}
const parsedArgs = minimist_1.default(process.argv.slice(2));
if (parsedArgs["h"]) {
    console.log(`create-compare-views.js - utility to create a simple HTML view from a folder of svgs that have differences vs the reference ones

Usage:
    create-compare-views.js (-d DIR) (-r DIR) (-o FILE)

Options:
    -r DIR   Input directory containing the reference svg files [default: grapherSvgs]
    -d DIR   Input directory with the svgs that were found to be different [default: differentGrapherSvgs]
    -o FILE  HTML Output filename to generate [default: differences.html]
    `);
}
else {
    main(parsedArgs);
}
function createSection(filename, referenceDir, differencesDir) {
    const referenceFilename = path.join(referenceDir, filename);
    const differencesFilename = path.join(differencesDir, filename);
    return `<section>
        <div class="svg reference">
            <img src="${referenceFilename}" alt="">
        </div>
        <div class="svg current">
            <img src="${differencesFilename}" alt="">
        </div>
    </section>`;
}
function createHtml(content) {
    return `<!doctype html>

<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Comparision</title>
    <style>
        section {
            display: flex;
        }

        .svg {
            max-width: 50%;
        }

        .svg img {
            width: 100%;
        }
    </style>
</head>

<body>
    ${content}
</body>

</html>`;
}
//# sourceMappingURL=create-compare-view.js.map