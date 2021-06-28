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
exports.deployIfQueueIsNotEmpty = exports.tryDeploy = exports.tryBake = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const SiteBaker_1 = require("../baker/SiteBaker");
const slackLog_1 = require("./slackLog");
const DeployQueueServer_1 = require("./DeployQueueServer");
const serverSettings_1 = require("../settings/serverSettings");
const deployQueueServer = new DeployQueueServer_1.DeployQueueServer();
const defaultCommitMessage = () => __awaiter(void 0, void 0, void 0, function* () {
    let message = "Automated update";
    // In the deploy.sh script, we write the current git rev to 'public/head.txt'
    // and want to include it in the deploy commit message
    try {
        const sha = yield fs_extra_1.default.readFile("public/head.txt", "utf8");
        message += `\nowid/owid-grapher@${sha}`;
    }
    catch (err) {
        slackLog_1.log.warn(err);
    }
    return message;
});
/**
 * Initiate a deploy, without any checks. Throws error on failure.
 */
const bakeAndDeploy = (message, email, name) => __awaiter(void 0, void 0, void 0, function* () {
    message = message !== null && message !== void 0 ? message : (yield defaultCommitMessage());
    const baker = new SiteBaker_1.SiteBaker(serverSettings_1.BAKED_SITE_DIR, serverSettings_1.BAKED_BASE_URL);
    try {
        yield baker.bakeAll();
        yield baker.deployToNetlifyAndPushToGitPush(message, email, name);
    }
    catch (err) {
        slackLog_1.log.logErrorAndMaybeSendToSlack(err);
        throw err;
    }
});
const tryBake = () => __awaiter(void 0, void 0, void 0, function* () {
    const baker = new SiteBaker_1.SiteBaker(serverSettings_1.BAKED_SITE_DIR, serverSettings_1.BAKED_BASE_URL);
    try {
        yield baker.bakeAll();
    }
    catch (err) {
        slackLog_1.log.logErrorAndMaybeSendToSlack(err);
    }
    finally {
        baker.endDbConnections();
    }
});
exports.tryBake = tryBake;
/**
 * Try to initiate a deploy and then terminate the baker, allowing a clean exit.
 * Used in CLI.
 */
const tryDeploy = (message, email, name) => __awaiter(void 0, void 0, void 0, function* () {
    message = message !== null && message !== void 0 ? message : (yield defaultCommitMessage());
    const baker = new SiteBaker_1.SiteBaker(serverSettings_1.BAKED_SITE_DIR, serverSettings_1.BAKED_BASE_URL);
    try {
        yield baker.deployToNetlifyAndPushToGitPush(message, email, name);
    }
    catch (err) {
        slackLog_1.log.logErrorAndMaybeSendToSlack(err);
    }
    finally {
        baker.endDbConnections();
    }
});
exports.tryDeploy = tryDeploy;
const generateCommitMsg = (queueItems) => {
    const date = new Date().toISOString();
    const message = queueItems
        .filter((item) => item.message)
        .map((item) => item.message)
        .join("\n");
    const coauthors = queueItems
        .filter((item) => item.authorName)
        .map((item) => {
        return `Co-authored-by: ${item.authorName} <${item.authorEmail}>`;
    })
        .join("\n");
    return `Deploy ${date}\n${message}\n\n\n${coauthors}`;
};
const MAX_SUCCESSIVE_FAILURES = 2;
/** Whether a deploy is currently running */
let deploying = false;
/**
 * Initiate deploy if no other deploy is currently pending, and there are changes
 * in the queue.
 * If there is a deploy pending, another one will be automatically triggered at
 * the end of the current one, as long as there are changes in the queue.
 * If there are no changes in the queue, a deploy won't be initiated.
 */
const deployIfQueueIsNotEmpty = () => __awaiter(void 0, void 0, void 0, function* () {
    if (deploying)
        return;
    deploying = true;
    let failures = 0;
    while (!(yield deployQueueServer.queueIsEmpty()) &&
        failures < MAX_SUCCESSIVE_FAILURES) {
        const deployContent = yield deployQueueServer.readQueuedAndPendingFiles();
        // Truncate file immediately. Ideally this would be an atomic action, otherwise it's
        // possible that another process writes to this file in the meantime...
        yield deployQueueServer.clearQueueFile();
        // Write to `.deploying` file to be able to recover the deploy message
        // in case of failure.
        yield deployQueueServer.writePendingFile(deployContent);
        const message = generateCommitMsg(deployQueueServer.parseQueueContent(deployContent));
        console.log(`Deploying site...\n---\n${message}\n---`);
        try {
            yield bakeAndDeploy(message);
            yield deployQueueServer.deletePendingFile();
        }
        catch (err) {
            failures++;
            // The error is already sent to Slack inside the deploy() function.
            // The deploy will be retried unless we've reached MAX_SUCCESSIVE_FAILURES.
        }
    }
    deploying = false;
});
exports.deployIfQueueIsNotEmpty = deployIfQueueIsNotEmpty;
//# sourceMappingURL=DeployUtils.js.map