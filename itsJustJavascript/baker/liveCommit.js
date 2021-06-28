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
const lodash_1 = require("lodash");
const minimist_1 = __importDefault(require("minimist"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const opener_1 = __importDefault(require("opener"));
const timeago = __importStar(require("timeago.js"));
const execWrapper_1 = require("../db/execWrapper");
const DeployTarget_1 = require("./DeployTarget");
/**
 * Retrieves information about the deployed commit on a live or staging server.
 * Usage examples:
 * - `yarn fetchServerStatus` will retrieve information about the deployed commits for _all_ servers, and show a table
 * - `yarn fetchServerStatus live` will retrieve the commit that's live on https://ourworldindata.org and opens it in GitHub
 *   That's equivalent to `yarn fetchServerStatus live --open`
 * - `yarn fetchServerStatus staging --show` will `git show` information about the commit deployed on https://staging-owid.netlify.app
 * - `yarn fetchServerStatus --show --tree` will both show a git tree and a `git show` of the deployed commits on https://ourworldindata.org
 *
 * Note:
 *  For the local git commands to work you need to have that commit on your machine. Run a `git fetch` if you're getting a git error message.
 *  If it still doesn't work, the live commit is not pushed to GitHub yet. That should only happen on a staging server, never on live.
 */
const servers = Object.values(DeployTarget_1.DeployTarget);
const args = minimist_1.default(process.argv.slice(2));
const showTree = args["tree"];
const showCommit = args["show"];
const openInBrowser = args["open"] || !(showCommit || showTree);
const getServerUrl = (server) => server === DeployTarget_1.ProdTarget
    ? "https://ourworldindata.org"
    : `https://${server}-owid.netlify.com`;
const fetchCommitSha = (server) => __awaiter(void 0, void 0, void 0, function* () {
    return node_fetch_1.default(`${getServerUrl(server)}/head.txt`)
        .then((res) => {
        if (res.ok)
            return res;
        throw Error(`Request rejected with status ${res.status}`);
    })
        .then((resp) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            commitSha: yield resp.text(),
        });
    }));
});
const fetchAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const commits = yield Promise.all(servers.map((serverName) => __awaiter(void 0, void 0, void 0, function* () {
        let commitInformation = undefined;
        try {
            commitInformation = yield fetchCommitSha(serverName);
        }
        catch (_a) {
            commitInformation = undefined;
        }
        return Object.assign(Object.assign({ serverName }, commitInformation), { commitDate: undefined, commitAuthor: undefined, commitMessage: undefined });
    })));
    const _fetchGithubCommitInfo = (commitSha) => __awaiter(void 0, void 0, void 0, function* () {
        return yield node_fetch_1.default(`https://api.github.com/repos/owid/owid-grapher/git/commits/${commitSha}`, {
            headers: {
                Accept: "application/vnd.github.v3",
            },
        }).then((response) => response.json());
    });
    // Memoize so as to not fetch information about the same commit twice
    const fetchGithubCommitInfo = lodash_1.memoize(_fetchGithubCommitInfo);
    const commitsWithInformation = yield Promise.all(commits.map((commit) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c, _d, _e;
        if (!commit.commitSha)
            return commit;
        const response = yield fetchGithubCommitInfo(commit.commitSha);
        return Object.assign(Object.assign({}, commit), { commitSha: commit.commitSha.substr(0, 7), commitDate: ((_b = response === null || response === void 0 ? void 0 : response.author) === null || _b === void 0 ? void 0 : _b.date) && new Date(response.author.date), commitAuthor: (_c = response === null || response === void 0 ? void 0 : response.author) === null || _c === void 0 ? void 0 : _c.name, commitMessage: (_e = (_d = response === null || response === void 0 ? void 0 : response.message) === null || _d === void 0 ? void 0 : _d.split("\n")) === null || _e === void 0 ? void 0 : _e[0] });
    })));
    return lodash_1.sortBy(commitsWithInformation, (c) => { var _a; return (_a = c.commitDate) !== null && _a !== void 0 ? _a : 0; }).reverse();
});
if (args._[0]) {
    // fetch information for one specific server
    const server = args._[0];
    fetchCommitSha(server)
        .then((headSha) => __awaiter(void 0, void 0, void 0, function* () {
        if (showTree)
            yield execWrapper_1.execWrapper(`git log -10 --graph --oneline --decorate --color=always ${headSha}`);
        if (showTree && showCommit)
            console.log();
        if (showCommit)
            yield execWrapper_1.execWrapper(`git show --stat --color=always ${headSha}`);
        if (openInBrowser)
            opener_1.default(`https://github.com/owid/owid-grapher/commit/${headSha}`);
    }))
        .catch((err) => console.error(`Could not retrieve commit information from ${getServerUrl(server)}. ${err}`));
}
else {
    // fetch information for _all_ servers
    fetchAll().then((commitInformation) => {
        const data = lodash_1.mapValues(lodash_1.keyBy(commitInformation, (commitInformation) => commitInformation.serverName), (commitInformation) => {
            const { commitSha, commitDate, commitAuthor, commitMessage, } = commitInformation;
            return {
                commitSha,
                commitDate: commitDate && timeago.format(commitDate),
                commitAuthor,
                commitMessage: 
                // truncate to 50 characters
                commitMessage && commitMessage.length > 50
                    ? (commitMessage === null || commitMessage === void 0 ? void 0 : commitMessage.substr(0, 50)) + "…"
                    : commitMessage,
            };
        });
        console.table(data);
    });
}
//# sourceMappingURL=liveCommit.js.map