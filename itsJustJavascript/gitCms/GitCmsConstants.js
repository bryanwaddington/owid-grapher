"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GIT_CMS_BASE_ROUTE = exports.GIT_CMS_REPO_URL = exports.GIT_CMS_DIR = exports.GIT_CMS_GLOB_ROUTE = exports.GIT_CMS_PULL_ROUTE = exports.GIT_CMS_DELETE_ROUTE = exports.GIT_CMS_WRITE_ROUTE = exports.GIT_CMS_READ_ROUTE = exports.GIT_CMS_DEFAULT_BRANCH = void 0;
exports.GIT_CMS_DEFAULT_BRANCH = "master";
exports.GIT_CMS_READ_ROUTE = "/git-cms-read";
exports.GIT_CMS_WRITE_ROUTE = "/git-cms-write";
exports.GIT_CMS_DELETE_ROUTE = "/git-cms-delete";
exports.GIT_CMS_PULL_ROUTE = "/git-cms-pull";
exports.GIT_CMS_GLOB_ROUTE = "/git-cms-glob";
// todo: refactor GitCmsServer to be a class, and pass this in as a top level param
exports.GIT_CMS_DIR = __dirname + "/../../../owid-content";
exports.GIT_CMS_REPO_URL = `https://github.com/owid/owid-content`;
exports.GIT_CMS_BASE_ROUTE = "/admin/";
//# sourceMappingURL=GitCmsConstants.js.map