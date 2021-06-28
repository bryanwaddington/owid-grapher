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
exports.Deployer = void 0;
const fs = __importStar(require("fs-extra"));
const prompts = __importStar(require("prompts"));
const ProgressBar = require("progress");
const execWrapper_1 = require("../db/execWrapper");
const child_process_1 = require("child_process");
const simple_git_1 = __importDefault(require("simple-git"));
const ProgressStream_1 = require("./ProgressStream");
const DeployTarget_1 = require("./DeployTarget");
const TEMP_DEPLOY_SCRIPT_PREFIX = `tempDeployScript.`;
const OWID_STAGING_DROPLET_IP = "165.22.127.239";
const OWID_LIVE_DROPLET_IP = "209.97.185.49";
class Deployer {
    constructor(options) {
        this.options = options;
        const { target, skipChecks, runChecksRemotely } = this.options;
        this.stream = new ProgressStream_1.ProgressStream(process.stderr);
        // todo: a smarter way to precompute out the number of steps?
        const testSteps = !skipChecks && !runChecksRemotely ? 1 : 0;
        this.progressBar = new ProgressBar(`Baking and deploying to ${target} [:bar] :current/:total :elapseds :name\n`, {
            total: 24 + testSteps,
            renderThrottle: 0,
            stream: this.stream,
        });
    }
    runAndTick(command) {
        return __awaiter(this, void 0, void 0, function* () {
            yield execWrapper_1.execWrapper(command);
            this.progressBar.tick({ name: `✅  finished ${command}` });
        });
    }
    get isValidTarget() {
        return new Set(Object.values(DeployTarget_1.DeployTarget)).has(this.options.target);
    }
    get targetIsProd() {
        return this.options.target === DeployTarget_1.ProdTarget;
    }
    get targetIpAddress() {
        return this.targetIsProd
            ? OWID_LIVE_DROPLET_IP
            : OWID_STAGING_DROPLET_IP;
    }
    // todo: I have not tested this yet, and would be surprised if it worked on the first attempt.
    runPreDeployChecksRemotely() {
        return __awaiter(this, void 0, void 0, function* () {
            const { owidGrapherRootDir } = this.options;
            const { rsyncTargetDirForTests } = this.pathsOnTarget;
            const RSYNC_TESTS = `rsync -havz --no-perms --progress --delete --include=/test --include=*.test.ts --include=*.test.tsx --exclude-from=${owidGrapherRootDir}/.rsync-ignore`;
            yield execWrapper_1.execWrapper(`${RSYNC_TESTS} ${owidGrapherRootDir} ${this.sshHost}:${rsyncTargetDirForTests}`);
            const script = `cd ${rsyncTargetDirForTests}
yarn install --production=false --frozen-lockfile
yarn testPrettierAll`;
            yield execWrapper_1.execWrapper(`ssh -t ${this.sshHost} 'bash -e -s' ${script}`);
            this.progressBar.tick({
                name: "✅📡 finished running predeploy checks remotely",
            });
        });
    }
    runLiveSafetyChecks() {
        return __awaiter(this, void 0, void 0, function* () {
            const { simpleGit } = this;
            const branches = yield simpleGit.branchLocal();
            const branch = yield branches.current;
            if (branch !== "master")
                this.printAndExit("To deploy to live please run from the master branch.");
            // Making sure we have the latest changes from the upstream
            // Also, will fail if working copy is not clean
            try {
                yield simpleGit.pull("origin", undefined, { "--rebase": "true" });
            }
            catch (err) {
                this.printAndExit(JSON.stringify(err));
            }
            const response = yield prompts.prompt({
                type: "confirm",
                name: "confirmed",
                message: "Are you sure you want to deploy to live?",
            });
            if (!(response === null || response === void 0 ? void 0 : response.confirmed))
                this.printAndExit("Cancelled");
        });
    }
    get simpleGit() {
        if (!this._simpleGit)
            this._simpleGit = simple_git_1.default({
                baseDir: this.options.owidGrapherRootDir,
                binary: "git",
                maxConcurrentProcesses: 1,
            });
        return this._simpleGit;
    }
    get pathsOnTarget() {
        const { target, userRunningTheDeploy } = this.options;
        const owidUserHomeDir = "/home/owid";
        const owidUserHomeTmpDir = `${owidUserHomeDir}/tmp`;
        return {
            owidUserHomeDir,
            owidUserHomeTmpDir,
            rsyncTargetDir: `${owidUserHomeTmpDir}/${target}-${userRunningTheDeploy}`,
            rsyncTargetDirTmp: `${owidUserHomeTmpDir}/${target}-${userRunningTheDeploy}-tmp`,
            rsyncTargetDirForTests: `${owidUserHomeTmpDir}/${target}-tests`,
            finalTargetDir: `${owidUserHomeDir}/${target}`,
            oldRepoBackupDir: `${owidUserHomeTmpDir}/${target}-old`,
            finalDataDir: `${owidUserHomeDir}/${target}-data`,
        };
    }
    get sshHost() {
        return `owid@${this.targetIpAddress}`;
    }
    writeHeadDotText() {
        return __awaiter(this, void 0, void 0, function* () {
            const { simpleGit } = this;
            const { owidGrapherRootDir } = this.options;
            const gitCommitSHA = yield simpleGit.revparse(["HEAD"]);
            // Write the current commit SHA to public/head.txt so we always know which commit is deployed
            fs.writeFileSync(owidGrapherRootDir + "/public/head.txt", gitCommitSHA, "utf8");
            this.progressBar.tick({ name: "✅ finished writing head.txt" });
        });
    }
    // 📡 indicates that a task is running/ran on the remote server
    deploy() {
        return __awaiter(this, void 0, void 0, function* () {
            const { skipChecks, runChecksRemotely } = this.options;
            if (this.targetIsProd)
                yield this.runLiveSafetyChecks();
            else if (!this.isValidTarget)
                this.printAndExit("Please select either live or a valid test target.");
            this.progressBar.tick({
                name: "✅ finished validating deploy arguments",
            });
            // make sure that no old assets are left over from an old deploy
            yield this.runAndTick(`yarn cleanTsc`);
            yield this.runAndTick(`yarn buildTsc`);
            if (runChecksRemotely)
                yield this.runPreDeployChecksRemotely();
            else if (skipChecks) {
                if (this.targetIsProd)
                    this.printAndExit(`Cannot skip checks when deploying to live`);
                this.progressBar.tick({
                    name: "✅ finished checks because we skipped them",
                });
            }
            else {
                yield this.runAndTick(`yarn testPrettierChanged`);
                yield this.runAndTick(`yarn testJest`);
            }
            yield this.writeHeadDotText();
            yield this.ensureTmpDirExistsOnServer();
            yield this.generateShellScriptsAndRunThemOnServer();
            this.progressBar.tick({
                name: `✅ 📡 finished everything`,
            });
            this.stream.replay();
        });
    }
    // todo: the old deploy script would generete BASH on the fly and run it on the server. we should clean that up and remove these shell scripts.
    generateShellScriptsAndRunThemOnServer() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { simpleGit } = this;
            const { target, owidGrapherRootDir } = this.options;
            const { rsyncTargetDirTmp, finalTargetDir, rsyncTargetDir, owidUserHomeTmpDir, owidUserHomeDir, oldRepoBackupDir, finalDataDir, } = this.pathsOnTarget;
            const gitConfig = yield simpleGit.listConfig();
            const gitName = `${gitConfig.all["user.name"]}`;
            const gitEmail = `${gitConfig.all["user.email"]}`;
            const scripts = {
                clearOldTemporaryRepo: `rm -rf ${rsyncTargetDirTmp}`,
                copySyncedRepo: `cp -r ${rsyncTargetDir} ${rsyncTargetDirTmp}`,
                createDataSoftlinks: `mkdir -p ${finalDataDir}/bakedSite && ln -sf ${finalDataDir}/bakedSite ${rsyncTargetDirTmp}/bakedSite`,
                createDatasetSoftlinks: `mkdir -p ${finalDataDir}/datasetsExport && ln -sf ${finalDataDir}/datasetsExport ${rsyncTargetDirTmp}/datasetsExport`,
                createSettingsSoftlinks: `ln -sf ${finalDataDir}/.env ${rsyncTargetDirTmp}/.env`,
                yarn: `cd ${rsyncTargetDirTmp} && yarn install --production --frozen-lockfile`,
                webpack: `cd ${rsyncTargetDirTmp} && yarn buildWebpack`,
                migrateDb: `cd ${rsyncTargetDirTmp} && yarn runDbMigrations`,
                algolia: `cd ${rsyncTargetDirTmp} && node itsJustJavascript/baker/algolia/configureAlgolia.js`,
                createQueueFile: `cd ${rsyncTargetDirTmp} && touch .queue && chmod 0666 .queue`,
                swapFolders: `rm -rf ${oldRepoBackupDir} && mv ${finalTargetDir} ${oldRepoBackupDir} || true && mv ${rsyncTargetDirTmp} ${finalTargetDir}`,
                restartAdminServer: `pm2 restart ${target}`,
                stopDeployQueueServer: `pm2 stop ${target}-deploy-queue`,
                bakeSiteOnStagingServer: `cd ${finalTargetDir} && node itsJustJavascript/baker/bakeSiteOnStagingServer.js`,
                deployToNetlify: `cd ${finalTargetDir} && node itsJustJavascript/baker/deploySiteFromStagingServer.js "${gitEmail}" "${gitName}"`,
                restartQueue: `pm2 start ${target}-deploy-queue`,
            };
            Object.keys(scripts).forEach((name) => {
                const localPath = `${owidGrapherRootDir}/${TEMP_DEPLOY_SCRIPT_PREFIX}${name}.sh`;
                fs.writeFileSync(localPath, scripts[name], "utf8");
                fs.chmodSync(localPath, "755");
            });
            yield this.copyLocalRepoToServerTmpDirectory();
            try {
                for (var _b = __asyncValues(Object.keys(scripts)), _c; _c = yield _b.next(), !_c.done;) {
                    const name = _c.value;
                    yield this.runAndStreamScriptOnRemoteServerViaSSH(`${rsyncTargetDir}/${TEMP_DEPLOY_SCRIPT_PREFIX}${name}.sh`);
                    const localPath = `${owidGrapherRootDir}/${TEMP_DEPLOY_SCRIPT_PREFIX}${name}.sh`;
                    fs.removeSync(localPath);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    printAndExit(message) {
        // eslint-disable-next-line no-console
        console.log(message);
        process.exit();
    }
    ensureTmpDirExistsOnServer() {
        return __awaiter(this, void 0, void 0, function* () {
            const { sshHost } = this;
            const { owidUserHomeTmpDir } = this.pathsOnTarget;
            yield execWrapper_1.execWrapper(`ssh ${sshHost} mkdir -p ${owidUserHomeTmpDir}`);
            this.progressBar.tick({
                name: `✅ 📡 finished ensuring ${owidUserHomeTmpDir} exists on ${sshHost}`,
            });
        });
    }
    copyLocalRepoToServerTmpDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            const { owidGrapherRootDir } = this.options;
            const { rsyncTargetDir } = this.pathsOnTarget;
            const RSYNC = `rsync -havz --no-perms --progress --delete --delete-excluded --exclude-from=${owidGrapherRootDir}/.rsync-ignore`;
            yield execWrapper_1.execWrapper(`${RSYNC} ${owidGrapherRootDir}/ ${this.sshHost}:${rsyncTargetDir}`);
            this.progressBar.tick({
                name: `✅ 📡 finished rsync of ${owidGrapherRootDir} to ${this.sshHost} ${rsyncTargetDir}`,
            });
        });
    }
    runAndStreamScriptOnRemoteServerViaSSH(path) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line no-console
            console.log(`📡 Running ${path} on ${this.sshHost}`);
            const bashTerminateIfAnyNonZero = "bash -e"; // https://stackoverflow.com/questions/9952177/whats-the-meaning-of-the-parameter-e-for-bash-shell-command-line/9952249
            const pseudoTty = "-tt"; // https://stackoverflow.com/questions/7114990/pseudo-terminal-will-not-be-allocated-because-stdin-is-not-a-terminal
            const params = [
                pseudoTty,
                this.sshHost,
                bashTerminateIfAnyNonZero,
                path,
            ];
            const child = child_process_1.spawn(`ssh`, params);
            child.stdout.on("data", (data) => {
                const trimmed = data.toString().trim();
                if (!trimmed)
                    return;
                // eslint-disable-next-line no-console
                console.log(trimmed);
            });
            child.stderr.on("data", (data) => {
                const trimmed = data.toString().trim();
                if (!trimmed)
                    return;
                // eslint-disable-next-line no-console
                console.error(trimmed);
            });
            const exitCode = yield new Promise((resolve) => {
                child.on("close", resolve);
            });
            if (exitCode) {
                // eslint-disable-next-line no-console
                console.log(`Exit code: ${exitCode}`);
            }
            this.progressBar.tick({
                name: `✅ 📡 finished running ${path}`,
            });
        });
    }
}
exports.Deployer = Deployer;
//# sourceMappingURL=Deployer.js.map