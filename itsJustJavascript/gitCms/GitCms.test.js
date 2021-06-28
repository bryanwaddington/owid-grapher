#! /usr/bin/env jest
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
const GitCmsClient_1 = require("./GitCmsClient");
const GitCmsServer_1 = require("./GitCmsServer");
const fs_extra_1 = require("fs-extra");
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const nodeFetch = __importStar(require("node-fetch"));
describe("client/server integration tests", () => {
    const baseDir = __dirname + "/integrationTestTempDirectoryOkToDelete";
    // Arrange
    const testPort = 3456;
    const expressApp = express_1.default();
    expressApp.use(bodyParser.json());
    const server = new GitCmsServer_1.GitCmsServer({ baseDir });
    server.verbose = false;
    server.addToRouter(expressApp);
    const expressServer = expressApp.listen(testPort);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // todo: whats a better pattern?
        const glob = global;
        glob.fetch = nodeFetch;
        yield server.createDirAndInitIfNeeded();
    }));
    afterAll(() => {
        const glob = global;
        glob.fetch = undefined;
        expressServer.close();
        fs_extra_1.removeSync(baseDir);
    });
    const client = new GitCmsClient_1.GitCmsClient(`http://localhost:${testPort}`);
    const filepath = "foo.txt";
    const content = "bar";
    expect(server).toBeTruthy();
    it("can write a file", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.writeRemoteFile({
            filepath,
            content,
            commitMessage: "created file",
        });
        expect(response.success).toBeTruthy();
    }));
    it("fails write gracefully when given a bad path", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.writeRemoteFile({
            filepath: "../badpath",
            content,
            commitMessage: "test writing a bad path",
        });
        expect(response.success).toBeFalsy();
    }));
    it("can read a file", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.readRemoteFile({ filepath });
        expect(response.success).toBeTruthy();
        expect(response.content).toEqual(content);
    }));
    it("can read multiple files", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.readRemoteFiles({
            glob: "*.txt",
            folder: "",
        });
        expect(response.success).toBeTruthy();
        expect(response.files.length).toEqual(1);
        expect(response.files[0].content).toEqual(content);
    }));
    it("can fail reading gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.readRemoteFile({
            filepath: "fail.txt",
        });
        expect(response.success).toBeFalsy();
    }));
    it("can delete a file", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.deleteRemoteFile({ filepath });
        expect(response.success).toBeTruthy();
    }));
    it("can fail delete gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield client.deleteRemoteFile({
            filepath,
        });
        expect(response.success).toBeFalsy();
    }));
});
//# sourceMappingURL=GitCms.test.js.map