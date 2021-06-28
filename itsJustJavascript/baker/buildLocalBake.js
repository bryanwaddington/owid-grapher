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
const SiteBaker_1 = require("./SiteBaker");
const fs = __importStar(require("fs-extra"));
const path_1 = require("path");
const bakeDomainToFolder = (baseUrl = "http://localhost:3000/", dir = "localBake") => __awaiter(void 0, void 0, void 0, function* () {
    dir = path_1.normalize(dir);
    fs.mkdirp(dir);
    const baker = new SiteBaker_1.SiteBaker(dir, baseUrl);
    console.log(`Baking site sans Wordpress with baseUrl '${baseUrl}' to dir '${dir}'`);
    yield baker.bakeNonWordpressPages();
});
const args = minimist_1.default(process.argv.slice(2));
const theArgs = args._;
// Usage: yarn buildLocalBake http://localhost:3000/ localBake
// todo: can we just make all paths relative? why do we need absolute baked base url?
bakeDomainToFolder(theArgs[0], theArgs[1]);
//# sourceMappingURL=buildLocalBake.js.map