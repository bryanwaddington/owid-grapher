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
exports.GitCmsServer = void 0;
const serverSettings_1 = require("../settings/serverSettings");
const simple_git_1 = __importDefault(require("simple-git"));
const fs_extra_1 = require("fs-extra");
const GitCmsConstants_1 = require("./GitCmsConstants");
const glob_1 = require("glob");
class GitCmsServer {
    constructor(options) {
        this.verbose = true; // I made this public so you can test quietly
        this._options = options;
    }
    // todo: we should probably use the 'path' lib and standardize things for cross plat
    get baseDir() {
        return this.options.baseDir + "/";
    }
    get options() {
        return this._options;
    }
    get git() {
        if (!this._git)
            this._git = simple_git_1.default({
                baseDir: this.baseDir,
                binary: "git",
                maxConcurrentProcesses: 1,
            });
        return this._git;
    }
    createDirAndInitIfNeeded() {
        return __awaiter(this, void 0, void 0, function* () {
            const { baseDir } = this;
            if (!fs_extra_1.existsSync(baseDir))
                fs_extra_1.mkdirSync(baseDir);
            yield this.git.init();
            // Needed since git won't let you commit if there's no user name config present (i.e. CI), even if you always
            // specify `author=` in every command. See https://stackoverflow.com/q/29685337/10670163 for example.
            yield this.git.addConfig("user.name", serverSettings_1.GIT_DEFAULT_USERNAME);
            yield this.git.addConfig("user.email", serverSettings_1.GIT_DEFAULT_EMAIL);
            return this;
        });
    }
    commitFile(filename, commitMsg, authorName, authorEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.git.add(filename);
            return yield this.git.commit(commitMsg, filename, {
                "--author": `${authorName} <${authorEmail}>`,
            });
        });
    }
    autopush() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.shouldAutoPush)
                this.git.push();
        });
    }
    pullCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.git.pull();
                return {
                    success: true,
                    stdout: JSON.stringify(res.summary, null, 2),
                };
            }
            catch (error) {
                if (this.verbose)
                    console.log(error);
                return { success: false, error };
            }
        });
    }
    readFileCommand(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ensureNoParentLinksInFilePath(filepath);
                const absolutePath = this.baseDir + filepath;
                const exists = fs_extra_1.existsSync(absolutePath);
                if (!exists)
                    throw new Error(`File '${filepath}' not found`);
                const content = yield fs_extra_1.readFile(absolutePath, "utf8");
                return { success: true, content };
            }
            catch (error) {
                if (this.verbose)
                    console.log(error);
                return {
                    success: false,
                    error,
                    content: "",
                };
            }
        });
    }
    globCommand(globStr, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = globStr.replace(/[^a-zA-Z\*]/, "");
            const cwd = this.baseDir + folder;
            const results = glob_1.sync(query, {
                cwd,
            });
            const files = results.map((filename) => {
                return {
                    filename,
                    content: fs_extra_1.readFileSync(cwd + "/" + filename, "utf8"),
                };
            });
            return { success: true, files };
        });
    }
    deleteFileCommand(rawFilepath, authorName = serverSettings_1.GIT_DEFAULT_USERNAME, authorEmail = serverSettings_1.GIT_DEFAULT_EMAIL) {
        return __awaiter(this, void 0, void 0, function* () {
            const filepath = rawFilepath.replace(/\~/g, "/");
            try {
                ensureNoParentLinksInFilePath(filepath);
                const absolutePath = this.baseDir + filepath;
                yield fs_extra_1.unlink(absolutePath);
                yield this.commitFile(filepath, `Deleted ${filepath}`, authorName, authorEmail);
                yield this.autopush();
                return { success: true };
            }
            catch (error) {
                if (this.verbose)
                    console.log(error);
                return { success: false, error };
            }
        });
    }
    writeFileCommand(filename, content, authorName = serverSettings_1.GIT_DEFAULT_USERNAME, authorEmail = serverSettings_1.GIT_DEFAULT_EMAIL, commitMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                ensureNoParentLinksInFilePath(filename);
                const absolutePath = this.baseDir + filename;
                yield fs_extra_1.writeFile(absolutePath, content, "utf8");
                const commitMsg = commitMessage
                    ? commitMessage
                    : fs_extra_1.existsSync(absolutePath)
                        ? `Updating ${filename}`
                        : `Adding ${filename}`;
                yield this.commitFile(filename, commitMsg, authorName, authorEmail);
                yield this.autopush();
                return { success: true };
            }
            catch (error) {
                if (this.verbose)
                    console.log(error);
                return { success: false, error };
            }
        });
    }
    addToRouter(app) {
        const routes = {};
        routes[GitCmsConstants_1.GIT_CMS_PULL_ROUTE] = (req, res) => __awaiter(this, void 0, void 0, function* () { return res.send(yield this.pullCommand()); }); // Pull latest from github
        routes[GitCmsConstants_1.GIT_CMS_GLOB_ROUTE] = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Get multiple file contents
            const request = req.body;
            res.send(yield this.globCommand(request.glob, request.folder));
        });
        routes[GitCmsConstants_1.GIT_CMS_READ_ROUTE] = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const request = req.body;
            res.send(yield this.readFileCommand(request.filepath));
        });
        routes[GitCmsConstants_1.GIT_CMS_WRITE_ROUTE] = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Update/create file, commit, and push(unless on local dev brach)
            const request = req.body;
            const { filepath, content, commitMessage } = request;
            res.send(yield this.writeFileCommand(filepath, content, (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.fullName, // todo: these are specific to our admin app
            (_b = res.locals.user) === null || _b === void 0 ? void 0 : _b.email, commitMessage));
        });
        routes[GitCmsConstants_1.GIT_CMS_DELETE_ROUTE] = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            // Delete file, commit, and and push(unless on local dev brach)
            const request = req.body;
            res.send(yield this.deleteFileCommand(request.filepath, (_c = res.locals.user) === null || _c === void 0 ? void 0 : _c.fullName, (_d = res.locals.user) === null || _d === void 0 ? void 0 : _d.email));
        });
        // Note: these are all POST routes, because we never want to cache any of them (even the 2 read ops)
        Object.keys(routes).forEach((route) => app.post(route, routes[route]));
    }
}
exports.GitCmsServer = GitCmsServer;
const ensureNoParentLinksInFilePath = (filename) => {
    if (filename.includes(".."))
        throw new Error(`Invalid filepath: ${filename}`);
};
//# sourceMappingURL=GitCmsServer.js.map