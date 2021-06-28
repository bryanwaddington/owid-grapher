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
exports.OwidAdminApp = void 0;
const React = __importStar(require("react"));
const simple_git_1 = __importDefault(require("simple-git"));
const express_1 = __importDefault(require("express"));
require("express-async-errors"); // todo: why the require?
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("reflect-metadata");
const serverSettings_1 = require("../settings/serverSettings");
const db = __importStar(require("../db/db"));
const wpdb = __importStar(require("../db/wpdb"));
const IndexPage_1 = require("./IndexPage");
const authentication_1 = require("./authentication");
const apiRouter_1 = require("./apiRouter");
const testPageRouter_1 = require("./testPageRouter");
const adminRouter_1 = require("./adminRouter");
const serverUtil_1 = require("./serverUtil");
const publicApiRouter_1 = require("./publicApiRouter");
const mockSiteRouter_1 = require("./mockSiteRouter");
const GitCmsConstants_1 = require("../gitCms/GitCmsConstants");
const expressErrorSlack = require("express-error-slack"); // todo: why the require?
class OwidAdminApp {
    constructor(options) {
        this.app = express_1.default();
        this.gitCmsBranchName = "";
        this.errorHandler = (err, req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!res.headersSent) {
                res.status(err.status || 500);
                res.send({
                    error: {
                        message: err.stack || err,
                        status: err.status || 500,
                    },
                });
            }
            else {
                res.write(JSON.stringify({
                    error: {
                        message: err.stack || err,
                        status: err.status || 500,
                    },
                }));
                res.end();
            }
        });
        this.connectToDatabases = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield db.getConnection();
            }
            catch (error) {
                // grapher database is in fact required, but we will not fail now in case it
                // comes online later
                if (!this.options.quiet) {
                    console.error(error);
                    console.warn("Could not connect to grapher database. Continuing without DB...");
                }
            }
            if (wpdb.isWordpressDBEnabled) {
                try {
                    yield wpdb.singleton.connect();
                }
                catch (error) {
                    if (!this.options.quiet) {
                        console.error(error);
                        console.warn("Could not connect to Wordpress database. Continuing without Wordpress...");
                    }
                }
            }
            else if (!this.options.quiet) {
                console.log("WORDPRESS_DB_NAME is not configured -- continuing without Wordpress DB");
            }
            if (!wpdb.isWordpressAPIEnabled && !this.options.quiet) {
                console.log("WORDPRESS_API_URL is not configured -- continuing without Wordpress API");
            }
        });
        this.options = options;
    }
    getGitCmsBranchName() {
        return __awaiter(this, void 0, void 0, function* () {
            const git = simple_git_1.default({
                baseDir: this.options.gitCmsDir,
                binary: "git",
                maxConcurrentProcesses: 1,
            });
            const branches = yield git.branchLocal();
            const gitCmsBranchName = yield branches.current;
            return gitCmsBranchName;
        });
    }
    stopListening() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.server)
                return;
            this.server.close();
        });
    }
    startListening(adminServerPort, adminServerHost) {
        return __awaiter(this, void 0, void 0, function* () {
            this.gitCmsBranchName = yield this.getGitCmsBranchName();
            const { app } = this;
            // since the server is running behind a reverse proxy (nginx), we need to "trust"
            // the X-Forwarded-For header in order to get the real request IP
            // https://expressjs.com/en/guide/behind-proxies.html
            app.set("trust proxy", true);
            // Parse cookies https://github.com/expressjs/cookie-parser
            app.use(cookie_parser_1.default());
            app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
            app.use("/admin/login", authentication_1.authCloudflareSSOMiddleware);
            // Require authentication (only for /admin requests)
            app.use(authentication_1.authMiddleware);
            app.use("/api", publicApiRouter_1.publicApiRouter.router);
            app.use("/admin/api", apiRouter_1.apiRouter.router);
            app.use("/admin/test", testPageRouter_1.testPageRouter);
            app.use("/admin/assets", express_1.default.static("itsJustJavascript/webpack"));
            app.use("/admin/storybook", express_1.default.static(".storybook/build"));
            app.use("/admin", adminRouter_1.adminRouter);
            // Default route: single page admin app
            app.get("/admin/*", (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.send(serverUtil_1.renderToHtmlPage(React.createElement(IndexPage_1.IndexPage, { username: res.locals.user.fullName, isSuperuser: res.locals.user.isSuperuser, gitCmsBranchName: this.gitCmsBranchName })));
            }));
            // Send errors to Slack
            // The middleware passes all errors onto the next error-handling middleware
            if (this.options.slackErrorsWebHookUrl)
                app.use(expressErrorSlack({
                    webhookUri: this.options.slackErrorsWebHookUrl,
                }));
            // todo: we probably always want to have this, and can remove the isDev
            if (this.options.isDev)
                app.use("/", mockSiteRouter_1.mockSiteRouter);
            // Give full error messages, including in production
            app.use(this.errorHandler);
            yield this.connectToDatabases();
            this.server = yield this.listenPromise(app, adminServerPort, adminServerHost);
            this.server.timeout = 5 * 60 * 1000; // Increase server timeout for long-running uploads
            if (!this.options.quiet)
                console.log(`owid-admin server started on http://${adminServerHost}:${adminServerPort}`);
        });
    }
    // Server.listen does not seem to have an async/await form yet.
    // https://github.com/expressjs/express/pull/3675
    // https://github.com/nodejs/node/issues/21482
    listenPromise(app, adminServerPort, adminServerHost) {
        return new Promise((resolve) => {
            const server = app.listen(adminServerPort, adminServerHost, () => {
                resolve(server);
            });
        });
    }
}
exports.OwidAdminApp = OwidAdminApp;
if (!module.parent)
    new OwidAdminApp({
        slackErrorsWebHookUrl: serverSettings_1.SLACK_ERRORS_WEBHOOK_URL,
        gitCmsDir: GitCmsConstants_1.GIT_CMS_DIR,
        isDev: serverSettings_1.ENV === "development",
    }).startListening(serverSettings_1.ADMIN_SERVER_PORT, serverSettings_1.ADMIN_SERVER_HOST);
//# sourceMappingURL=app.js.map