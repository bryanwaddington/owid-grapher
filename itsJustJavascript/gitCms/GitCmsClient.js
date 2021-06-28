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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitCmsClient = void 0;
const GitCmsConstants_1 = require("./GitCmsConstants");
// todo: clarify what is going on here. i already forget.
const validateFilePath = (path) => {
    if (path.includes("~"))
        throw new Error(`Filenames with ~ not supported`);
};
class GitCmsClient {
    constructor(basePath) {
        this.basePath = basePath;
    }
    pullFromGithub() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.basePath}${GitCmsConstants_1.GIT_CMS_PULL_ROUTE}`, {
                method: "POST",
            });
            return (yield response.json());
        });
    }
    readRemoteFiles(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.post(GitCmsConstants_1.GIT_CMS_GLOB_ROUTE, request));
        });
    }
    post(route, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.basePath}${route}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });
            return yield response.json();
        });
    }
    deleteRemoteFile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            validateFilePath(request.filepath);
            return (yield this.post(GitCmsConstants_1.GIT_CMS_DELETE_ROUTE, request));
        });
    }
    readRemoteFile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            validateFilePath(request.filepath);
            return (yield this.post(GitCmsConstants_1.GIT_CMS_READ_ROUTE, request));
        });
    }
    writeRemoteFile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            validateFilePath(request.filepath);
            return (yield this.post(GitCmsConstants_1.GIT_CMS_WRITE_ROUTE, request));
        });
    }
}
exports.GitCmsClient = GitCmsClient;
//# sourceMappingURL=GitCmsClient.js.map