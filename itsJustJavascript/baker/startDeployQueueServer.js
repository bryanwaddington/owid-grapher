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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const serverSettings_1 = require("../settings/serverSettings");
const DeployUtils_1 = require("./DeployUtils");
function main() {
    if (!fs.existsSync(serverSettings_1.DEPLOY_QUEUE_FILE_PATH)) {
        console.error(`No deploy queue file found in: ${serverSettings_1.DEPLOY_QUEUE_FILE_PATH}`);
        process.exit(1);
    }
    // Listen for file changes
    fs.watchFile(serverSettings_1.DEPLOY_QUEUE_FILE_PATH, () => {
        // Start deploy after 10 seconds in order to avoid the quick successive
        // deploys triggered by Wordpress.
        setTimeout(DeployUtils_1.deployIfQueueIsNotEmpty, 10 * 1000);
    });
    DeployUtils_1.deployIfQueueIsNotEmpty();
}
main();
//# sourceMappingURL=startDeployQueueServer.js.map