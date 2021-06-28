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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeployQueueServer = void 0;
const owidTypes_1 = require("../clientUtils/owidTypes");
const fs = __importStar(require("fs-extra"));
const serverSettings_1 = require("../settings/serverSettings");
class DeployQueueServer {
    constructor(queueFilePath = serverSettings_1.DEPLOY_QUEUE_FILE_PATH, pendingFilePath = serverSettings_1.DEPLOY_PENDING_FILE_PATH) {
        this.queueFilePath = queueFilePath;
        this.pendingFilePath = pendingFilePath;
    }
    // File manipulation
    readQueuedFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fs.readFile(this.queueFilePath, "utf8");
        });
    }
    readPendingFile() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield fs.pathExists(this.pendingFilePath))
                return yield fs.readFile(this.pendingFilePath, "utf8");
            return undefined;
        });
    }
    readQueuedAndPendingFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const queueContent = yield this.readQueuedFile();
            const pendingContent = yield this.readPendingFile();
            // If any deploys didn't exit cleanly, this.pendingFilePath would exist.
            // Prepend that message to the current deploy.
            return pendingContent
                ? pendingContent + "\n" + queueContent
                : queueContent;
        });
    }
    enqueueChange(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.appendFile(this.queueFilePath, JSON.stringify(item) + "\n");
        });
    }
    clearQueueFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.truncate(this.queueFilePath, 0);
        });
    }
    writePendingFile(content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.writeFile(this.pendingFilePath, content);
        });
    }
    deletePendingFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.unlink(this.pendingFilePath);
        });
    }
    // Parsing queue content
    queueIsEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.readQueuedAndPendingFiles();
            return !res;
        });
    }
    // Parse all lines in file as JSON
    parseQueueContent(content) {
        return content
            .split("\n")
            .map((line) => {
            try {
                return JSON.parse(line);
            }
            catch (err) {
                return null;
            }
        })
            .filter((x) => x);
    }
    getDeploys() {
        return __awaiter(this, void 0, void 0, function* () {
            const [queueContent, pendingContent] = yield Promise.all([
                this.readQueuedFile(),
                this.readPendingFile(),
            ]);
            const deploys = [];
            if (queueContent)
                deploys.push({
                    status: owidTypes_1.DeployStatus.queued,
                    // Changes are always appended. Reversing them means the latest changes are first
                    // (which is what we want in the UI).
                    // We can't sort by time because the presence of "time" is not guaranteed.
                    changes: this.parseQueueContent(queueContent).reverse(),
                });
            if (pendingContent)
                deploys.push({
                    status: owidTypes_1.DeployStatus.pending,
                    changes: this.parseQueueContent(pendingContent).reverse(),
                });
            return deploys;
        });
    }
}
exports.DeployQueueServer = DeployQueueServer;
//# sourceMappingURL=DeployQueueServer.js.map