"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPLORERS_PREVIEW_ROUTE = exports.EXPLORERS_GIT_CMS_FOLDER = exports.EXPLORERS_ROUTE_FOLDER = exports.GetAllExplorersRoute = exports.ExplorerContainerId = exports.EXPLORER_EMBEDDED_FIGURE_SELECTOR = exports.EMBEDDED_EXPLORER_GRAPHER_CONFIGS = exports.EMBEDDED_EXPLORER_DELIMITER = exports.UNSAVED_EXPLORER_PREVIEW_QUERYPARAMS = exports.UNSAVED_EXPLORER_DRAFT = exports.ExplorerControlTypeRegex = exports.DefaultNewExplorerSlug = exports.ExplorerControlType = void 0;
var ExplorerControlType;
(function (ExplorerControlType) {
    ExplorerControlType["Radio"] = "Radio";
    ExplorerControlType["Checkbox"] = "Checkbox";
    ExplorerControlType["Dropdown"] = "Dropdown";
})(ExplorerControlType = exports.ExplorerControlType || (exports.ExplorerControlType = {}));
exports.DefaultNewExplorerSlug = "new";
exports.ExplorerControlTypeRegex = new RegExp(" (" + Object.values(ExplorerControlType).join("|") + ")$");
exports.UNSAVED_EXPLORER_DRAFT = "UNSAVED_EXPLORER_DRAFT";
exports.UNSAVED_EXPLORER_PREVIEW_QUERYPARAMS = "UNSAVED_EXPLORER_PREVIEW_QUERYPARAMS";
exports.EMBEDDED_EXPLORER_DELIMITER = "\n//EMBEDDED_EXPLORER\n";
exports.EMBEDDED_EXPLORER_GRAPHER_CONFIGS = "\n//EMBEDDED_EXPLORER_GRAPHER_CONFIGS\n";
exports.EXPLORER_EMBEDDED_FIGURE_SELECTOR = "data-explorer-src";
exports.ExplorerContainerId = "ExplorerContainer";
exports.GetAllExplorersRoute = "allExplorers.json";
exports.EXPLORERS_ROUTE_FOLDER = "explorers"; // Url path: http://owid.org/{explorers}
exports.EXPLORERS_GIT_CMS_FOLDER = "explorers"; // Disk path: /home/owid/git-content/{explorers}
exports.EXPLORERS_PREVIEW_ROUTE = `${exports.EXPLORERS_ROUTE_FOLDER}/preview`;
//# sourceMappingURL=ExplorerConstants.js.map