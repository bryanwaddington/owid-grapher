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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Deployer_1 = require("./Deployer");
const minimist_1 = __importDefault(require("minimist"));
const os_1 = __importDefault(require("os"));
const path = __importStar(require("path"));
const parsedArgs = minimist_1.default(process.argv.slice(2));
const deployer = new Deployer_1.Deployer({
    target: parsedArgs["_"][0],
    userRunningTheDeploy: os_1.default.userInfo().username,
    owidGrapherRootDir: path.normalize(__dirname + "/../../"),
    skipChecks: parsedArgs["skip-checks"] === true,
    runChecksRemotely: parsedArgs["r"] === true,
});
deployer.deploy();
//# sourceMappingURL=buildAndDeploySite.js.map