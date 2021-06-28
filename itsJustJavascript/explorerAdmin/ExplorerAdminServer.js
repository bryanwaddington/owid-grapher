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
exports.ExplorerAdminServer = void 0;
const react_1 = __importDefault(require("react"));
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const db_1 = require("../db/db");
const wpdb_1 = require("../db/wpdb");
const ExplorerProgram_1 = require("../explorer/ExplorerProgram");
const ExplorerPage_1 = require("../site/ExplorerPage");
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
const simple_git_1 = __importDefault(require("simple-git"));
const Util_1 = require("../clientUtils/Util");
const Grapher_1 = require("../grapher/core/Grapher");
const owidTypes_1 = require("../clientUtils/owidTypes");
const server_1 = __importDefault(require("react-dom/server"));
const ExplorerRedirects_1 = require("./ExplorerRedirects");
const ExplorerUrlMigrations_1 = require("../explorer/urlMigrations/ExplorerUrlMigrations");
class ExplorerAdminServer {
    constructor(gitDir, baseUrl) {
        this.gitDir = gitDir;
        this.baseUrl = baseUrl;
    }
    // we store explorers in a subdir of the gitcms for now. idea is we may store other things in there later.
    get absoluteFolderPath() {
        return this.gitDir + "/" + ExplorerConstants_1.EXPLORERS_GIT_CMS_FOLDER + "/";
    }
    get simpleGit() {
        if (!this._simpleGit)
            this._simpleGit = simple_git_1.default({
                baseDir: this.gitDir,
                binary: "git",
                maxConcurrentProcesses: 1,
            });
        return this._simpleGit;
    }
    getAllExplorersCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            // Download all explorers for the admin index page
            try {
                const explorers = yield this.getAllExplorers();
                const branches = yield this.simpleGit.branchLocal();
                const gitCmsBranchName = yield branches.current;
                const needsPull = false; // todo: add
                return {
                    success: true,
                    gitCmsBranchName,
                    needsPull,
                    explorers: explorers.map((explorer) => explorer.toJson()),
                };
            }
            catch (err) {
                console.log(err);
                return {
                    success: false,
                    errorMessage: err,
                };
            }
        });
    }
    addMockBakedSiteRoutes(app) {
        app.get(`/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/:slug`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.set("Access-Control-Allow-Origin", "*");
            const explorers = yield this.getAllPublishedExplorers();
            const explorerProgram = explorers.find((program) => program.slug === req.params.slug);
            if (explorerProgram)
                res.send(yield this.renderExplorerPage(explorerProgram));
            else
                throw new owidTypes_1.JsonError("A published explorer with that slug was not found", 404);
        }));
        app.get("/*", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const explorerRedirect = ExplorerRedirects_1.getExplorerRedirectForPath(req.path);
            // If no explorer redirect exists, continue to next express handler
            if (!explorerRedirect)
                return next();
            const { migrationId, baseQueryStr } = explorerRedirect;
            const { explorerSlug } = ExplorerUrlMigrations_1.explorerUrlMigrationsById[migrationId];
            const program = yield this.getExplorerFromSlug(explorerSlug);
            res.send(yield this.renderExplorerPage(program, {
                explorerUrlMigrationId: migrationId,
                baseQueryStr,
            }));
        }));
    }
    addAdminRoutes(app) {
        app.get("/errorTest.csv", (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Add `table /admin/errorTest.csv?code=404` to test fetch download failures
            const code = req.query.code && !isNaN(parseInt(req.query.code))
                ? req.query.code
                : 400;
            res.status(code);
            return `Simulating code ${code}`;
        }));
        app.get(`/${ExplorerConstants_1.GetAllExplorersRoute}`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.getAllExplorersCommand());
        }));
        app.get(`/${ExplorerConstants_1.EXPLORERS_PREVIEW_ROUTE}/:slug`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const slug = Util_1.slugify(req.params.slug);
            const filename = slug + ExplorerProgram_1.EXPLORER_FILE_SUFFIX;
            if (slug === ExplorerConstants_1.DefaultNewExplorerSlug)
                return res.send(yield this.renderExplorerPage(new ExplorerProgram_1.ExplorerProgram(ExplorerConstants_1.DefaultNewExplorerSlug, "")));
            if (!slug || !fs_extra_1.existsSync(this.absoluteFolderPath + filename))
                return res.send(`File not found`);
            const explorer = yield this.getExplorerFromFile(filename);
            return res.send(yield this.renderExplorerPage(explorer));
        }));
    }
    // todo: make private? once we remove covid legacy stuff?
    getExplorerFromFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPath = this.absoluteFolderPath + filename;
            const content = yield fs_extra_1.readFile(fullPath, "utf8");
            const commits = yield this.simpleGit.log({ file: fullPath, n: 1 });
            return new ExplorerProgram_1.ExplorerProgram(filename.replace(ExplorerProgram_1.EXPLORER_FILE_SUFFIX, ""), content, commits.latest);
        });
    }
    getExplorerFromSlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getExplorerFromFile(`${slug}${ExplorerProgram_1.EXPLORER_FILE_SUFFIX}`);
        });
    }
    renderExplorerPage(program, urlMigrationSpec) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requiredGrapherIds } = program.decisionMatrix;
            let grapherConfigRows = [];
            if (requiredGrapherIds.length)
                grapherConfigRows = yield db_1.queryMysql(`SELECT id, config FROM charts WHERE id IN (?)`, [requiredGrapherIds]);
            const wpContent = program.wpBlockId
                ? yield wpdb_1.getBlockContent(program.wpBlockId)
                : undefined;
            const grapherConfigs = grapherConfigRows.map((row) => {
                const config = JSON.parse(row.config);
                config.id = row.id; // Ensure each grapher has an id
                config.manuallyProvideData = true;
                return new Grapher_1.Grapher(config).toObject();
            });
            return (`<!doctype html>` +
                server_1.default.renderToStaticMarkup(react_1.default.createElement(ExplorerPage_1.ExplorerPage, { grapherConfigs: grapherConfigs, program: program, wpContent: wpContent, baseUrl: this.baseUrl, urlMigrationSpec: urlMigrationSpec })));
        });
    }
    bakeAllPublishedExplorers(outputFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const published = yield this.getAllPublishedExplorers();
            yield this.bakeExplorersToDir(outputFolder, published);
        });
    }
    getAllPublishedExplorers() {
        return __awaiter(this, void 0, void 0, function* () {
            const explorers = yield this.getAllExplorers();
            return explorers.filter((exp) => exp.isPublished);
        });
    }
    getAllExplorers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_extra_1.existsSync(this.absoluteFolderPath))
                return [];
            const files = yield fs_extra_1.readdir(this.absoluteFolderPath);
            const explorerFiles = files.filter((filename) => filename.endsWith(ExplorerProgram_1.EXPLORER_FILE_SUFFIX));
            const explorers = [];
            for (const filename of explorerFiles) {
                const explorer = yield this.getExplorerFromFile(filename);
                explorers.push(explorer);
            }
            return explorers;
        });
    }
    write(outPath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_extra_1.mkdirp(path_1.default.dirname(outPath));
            yield fs_extra_1.writeFile(outPath, content);
            console.log(outPath);
        });
    }
    bakeExplorersToDir(directory, explorers = []) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const explorer of explorers) {
                yield this.write(`${directory}/${explorer.slug}.html`, yield this.renderExplorerPage(explorer));
            }
        });
    }
    bakeAllExplorerRedirects(outputFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            const explorers = yield this.getAllExplorers();
            const redirects = ExplorerRedirects_1.explorerRedirectTable.rows;
            for (const redirect of redirects) {
                const { migrationId, path: redirectPath, baseQueryStr } = redirect;
                const transform = ExplorerUrlMigrations_1.explorerUrlMigrationsById[migrationId];
                if (!transform) {
                    throw new Error(`No explorer URL migration with id '${migrationId}'. Fix the list of explorer redirects and retry.`);
                }
                const { explorerSlug } = transform;
                const program = explorers.find((program) => program.slug === explorerSlug);
                if (!program) {
                    throw new Error(`No explorer with slug '${explorerSlug}'. Fix the list of explorer redirects and retry.`);
                }
                const html = yield this.renderExplorerPage(program, {
                    explorerUrlMigrationId: migrationId,
                    baseQueryStr,
                });
                yield this.write(path_1.default.join(outputFolder, `${redirectPath}.html`), html);
            }
        });
    }
}
exports.ExplorerAdminServer = ExplorerAdminServer;
//# sourceMappingURL=ExplorerAdminServer.js.map