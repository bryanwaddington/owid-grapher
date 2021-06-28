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
exports.syncDatasetToGitRepo = exports.removeDatasetFromGitRepo = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const Dataset_1 = require("../db/model/Dataset");
const Source_1 = require("../db/model/Source");
const serverSettings_1 = require("../settings/serverSettings");
const serverSettings_2 = require("../settings/serverSettings");
const filenamify_1 = __importDefault(require("filenamify"));
const execWrapper_1 = require("../db/execWrapper");
const owidTypes_1 = require("../clientUtils/owidTypes");
const datasetToReadme = (dataset) => __awaiter(void 0, void 0, void 0, function* () {
    const source = yield Source_1.Source.findOne({ datasetId: dataset.id });
    return `# ${dataset.name}\n\n${(source && source.description && source.description.additionalInfo) ||
        ""}`;
});
function removeDatasetFromGitRepo(datasetName, namespace, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { commitName, commitEmail } = options;
        const repoDir = path.join(serverSettings_1.GIT_DATASETS_DIR, namespace);
        if (!fs.existsSync(path.join(repoDir, ".git"))) {
            return;
        }
        if (!fs.existsSync(`${repoDir}/datasets/${datasetName}`)) {
            return;
        }
        yield execWrapper_1.execFormatted(`cd %s && rm -rf %s && git add -A %s && (git diff-index --quiet HEAD || (git commit -m %s --quiet --author="${commitName || serverSettings_2.GIT_DEFAULT_USERNAME} <${commitEmail || serverSettings_2.GIT_DEFAULT_EMAIL}>" && git push))`, [
            repoDir,
            `${repoDir}/datasets/${datasetName}`,
            `${repoDir}/datasets/${datasetName}`,
            `Removing ${datasetName}`,
        ]);
    });
}
exports.removeDatasetFromGitRepo = removeDatasetFromGitRepo;
function syncDatasetToGitRepo(datasetId, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { oldDatasetName, commitName, commitEmail, commitOnly } = options;
        const oldDatasetFilename = oldDatasetName
            ? filenamify_1.default(oldDatasetName)
            : undefined;
        const datasetRepo = options.transaction
            ? options.transaction.manager.getRepository(Dataset_1.Dataset)
            : Dataset_1.Dataset.getRepository();
        const dataset = yield datasetRepo.findOne({ id: datasetId });
        if (!dataset)
            throw new owidTypes_1.JsonError(`No such dataset ${datasetId}`, 404);
        if (dataset.isPrivate)
            // Private dataset doesn't go in git repo
            return removeDatasetFromGitRepo(oldDatasetName || dataset.name, dataset.namespace, options);
        // Not doing bulk imports for now
        if (dataset.namespace !== "owid")
            return;
        // Base repository directory for this dataspace
        const repoDir = path.join(serverSettings_1.GIT_DATASETS_DIR, dataset.namespace);
        if (!fs.existsSync(path.join(repoDir, ".git"))) {
            yield fs.mkdirp(repoDir);
            yield execWrapper_1.execFormatted(`cd %s && git init && git config user.name %s && git config user.email %s`, [repoDir, serverSettings_2.GIT_DEFAULT_USERNAME, serverSettings_2.GIT_DEFAULT_EMAIL]);
        }
        // Output dataset to temporary directory
        const tmpDatasetDir = path.join(serverSettings_1.TMP_DIR, dataset.filename);
        yield fs.mkdirp(tmpDatasetDir);
        yield Promise.all([
            fs.writeFile(path.join(tmpDatasetDir, `${dataset.filename}.csv`), yield dataset.toCSV()),
            fs.writeFile(path.join(tmpDatasetDir, `datapackage.json`), JSON.stringify(yield dataset.toDatapackage(), null, 2)),
            fs.writeFile(path.join(tmpDatasetDir, `README.md`), yield datasetToReadme(dataset)),
        ]);
        const datasetsDir = path.join(repoDir, "datasets");
        yield fs.mkdirp(datasetsDir);
        const finalDatasetDir = path.join(datasetsDir, dataset.filename);
        const isNew = !fs.existsSync(finalDatasetDir);
        yield execWrapper_1.execFormatted(`cd %s && rm -rf %s && mv %s %s && git add -A %s`, [
            repoDir,
            finalDatasetDir,
            tmpDatasetDir,
            finalDatasetDir,
            finalDatasetDir,
        ]);
        if (oldDatasetFilename && oldDatasetFilename !== dataset.filename) {
            const oldDatasetDir = path.join(datasetsDir, oldDatasetFilename);
            yield execWrapper_1.execFormatted(`cd %s && rm -rf %s && git add -A %s`, [
                repoDir,
                oldDatasetDir,
                oldDatasetDir,
            ]);
        }
        const commitMsg = isNew
            ? `Adding ${dataset.filename}`
            : `Updating ${dataset.filename}`;
        yield execWrapper_1.execFormatted(`cd %s && (git diff-index --quiet HEAD || (git commit -m %s --quiet --author="${commitName || serverSettings_2.GIT_DEFAULT_USERNAME} <${commitEmail || serverSettings_2.GIT_DEFAULT_EMAIL}>"${commitOnly ? "" : " && git push))"}`, [repoDir, commitMsg]);
    });
}
exports.syncDatasetToGitRepo = syncDatasetToGitRepo;
//# sourceMappingURL=gitDataExport.js.map