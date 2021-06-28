#! /usr/bin/env jest
"use strict";
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
const fs_extra_1 = __importDefault(require("fs-extra"));
const DeployQueueServer_1 = require("./DeployQueueServer");
const serverSettings_1 = require("../settings/serverSettings");
describe("parseQueueContent", () => {
    const server = new DeployQueueServer_1.DeployQueueServer();
    it("parses newline delimited JSON objects", () => __awaiter(void 0, void 0, void 0, function* () {
        const output = server.parseQueueContent([
            `{"authorName": "Tester", "message": "Updated chart test-chart-please-ignore"}`,
            `{"authorName": "Tester", "message": "something one"}`,
            ``,
            `invalid json`,
            `{"authorName": "Tester", "message": "something two"}`,
        ].join("\n"));
        expect(output[0].authorName).toEqual("Tester");
        expect(output[0].message).toEqual("Updated chart test-chart-please-ignore");
        expect(output[1].message).toEqual("something one");
        expect(output[2].message).toEqual("something two");
    }));
});
// todo: pretty sure Spyon is an antipattern. Create a deploy class that takes an interface with the subset of fs instead, and then can pass
// a tiny mock FS for testing.
describe("getDeploys", () => {
    const server = new DeployQueueServer_1.DeployQueueServer();
    it("is empty when nothing is in the queues", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(fs_extra_1.default, "readFile").mockImplementation((() => __awaiter(void 0, void 0, void 0, function* () {
            return ``;
        })));
        expect(yield server.getDeploys()).toEqual([]);
    }));
    it("parses queued deploy file", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(fs_extra_1.default, "readFile").mockImplementation(((path) => __awaiter(void 0, void 0, void 0, function* () {
            if (path === serverSettings_1.DEPLOY_QUEUE_FILE_PATH)
                return [
                    `{"message": "test1"}`,
                    `{"message": "test2"}`,
                ].join("\n");
            if (path === serverSettings_1.DEPLOY_PENDING_FILE_PATH)
                return ``;
            return ``;
        })));
        expect(yield server.getDeploys()).toEqual([
            {
                status: "queued",
                changes: [{ message: "test2" }, { message: "test1" }],
            },
        ]);
    }));
    it("parses pending deploy file", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(fs_extra_1.default, "pathExists").mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return true; }));
        jest.spyOn(fs_extra_1.default, "readFile").mockImplementation(((path) => __awaiter(void 0, void 0, void 0, function* () {
            if (path === serverSettings_1.DEPLOY_QUEUE_FILE_PATH)
                return [
                    `{"message": "test1"}`,
                    `{"message": "test2"}`,
                ].join("\n");
            if (path === serverSettings_1.DEPLOY_PENDING_FILE_PATH)
                return [
                    `{"message": "test3"}`,
                    `{"message": "test4"}`,
                ].join("\n");
            return ``;
        })));
        expect(yield server.getDeploys()).toEqual([
            {
                status: "queued",
                changes: [{ message: "test2" }, { message: "test1" }],
            },
            {
                status: "pending",
                changes: [{ message: "test4" }, { message: "test3" }],
            },
        ]);
    }));
});
//# sourceMappingURL=DeployQueueServer.test.js.map