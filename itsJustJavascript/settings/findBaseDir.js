"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * With our code residing either in some src folder or in the `itsJustJavascript` folder, it's not
 * always straightforward to know where to find a config file like `.env`.
 * Here, we just traverse the directory tree upwards until we find a `package.json` file, which
 * should indicate that we have found the root directory of the `owid-grapher` repo.
 */
function findProjectBaseDir(from) {
    if (!fs_1.default.existsSync)
        return undefined; // if fs.existsSync doesn't exist, we're probably running in the browser
    let dir = path_1.default.dirname(from);
    while (dir.length) {
        if (fs_1.default.existsSync(path_1.default.resolve(dir, "package.json")))
            return dir;
        const parentDir = path_1.default.resolve(dir, "..");
        // break if we have reached the file system root
        if (parentDir === dir)
            break;
        else
            dir = parentDir;
    }
    return undefined;
}
exports.default = findProjectBaseDir;
//# sourceMappingURL=findBaseDir.js.map