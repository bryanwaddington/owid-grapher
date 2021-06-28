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
exports.log = void 0;
// Send error to slack webhook, code adapted from express-error-slack https://github.com/chunkai1312/express-error-slack/blob/master/src/sendErrorToSlack.js
const serverSettings_1 = require("../settings/serverSettings");
const Slack = require("slack-node");
const lodash = __importStar(require("lodash"));
const sendErrorToSlack = (err) => __awaiter(void 0, void 0, void 0, function* () {
    const slack = new Slack();
    slack.setWebhook(serverSettings_1.SLACK_ERRORS_WEBHOOK_URL);
    function createCodeBlock(title, code) {
        if (lodash.isEmpty(code))
            return "";
        code =
            typeof code === "string"
                ? code.trim()
                : JSON.stringify(code, null, 2);
        const tripleBackticks = "```";
        return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`;
    }
    const blocks = [{ title: "Stack", code: err.stack }];
    if (err.stderr) {
        blocks.push({
            title: "stderr",
            code: err.stderr,
        });
    }
    const attachment = {
        fallback: `${err.name}: ${err.message}`,
        color: err.status < 500 ? "warning" : "danger",
        //   author_name: req.headers.host,
        title: `${err.name}: ${err.message}`,
        //   fields: [
        //     { title: 'Request URL', value: req.url, short: true },
        //     { title: 'Request Method', value: req.method, short: true },
        //     { title: 'Status Code', value: err.status, short: true },
        //     { title: 'Remote Address', value: getRemoteAddress(req), short: true }
        //   ],
        text: blocks
            .map((data) => createCodeBlock(data.title, data.code))
            .join(""),
        mrkdwn_in: ["text"],
        footer: "sendErrorToSlack",
        ts: Math.floor(Date.now() / 1000),
    };
    slack.webhook({ attachments: [attachment] }, (error) => {
        if (error)
            console.error(error);
    });
});
var log;
(function (log) {
    log.logErrorAndMaybeSendToSlack = (err) => __awaiter(this, void 0, void 0, function* () {
        console.error(err);
        if (serverSettings_1.SLACK_ERRORS_WEBHOOK_URL)
            sendErrorToSlack(err);
    });
    log.warn = (err) => console.warn(err);
})(log = exports.log || (exports.log = {}));
//# sourceMappingURL=slackLog.js.map