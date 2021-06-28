"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceIframesWithExplorerRedirectsInWordPressPost = void 0;
const ExplorerUrlMigrations_1 = require("../explorer/urlMigrations/ExplorerUrlMigrations");
const ExplorerRedirects_1 = require("../explorerAdmin/ExplorerRedirects");
const Url_1 = require("../clientUtils/urls/Url");
const replaceIframesWithExplorerRedirectsInWordPressPost = (cheerio) => cheerio("iframe")
    .toArray()
    .forEach((el) => {
    let url = Url_1.Url.fromURL(el.attribs["src"].trim());
    if (!url.pathname)
        return;
    const explorerRedirect = ExplorerRedirects_1.getExplorerRedirectForPath(url.pathname);
    if (explorerRedirect) {
        const { migrationId, baseQueryStr } = explorerRedirect;
        const { migrateUrl } = ExplorerUrlMigrations_1.explorerUrlMigrationsById[migrationId];
        url = migrateUrl(url, baseQueryStr);
    }
    url = ExplorerUrlMigrations_1.migrateExplorerUrl(url);
    el.attribs["src"] = url.fullUrl;
});
exports.replaceIframesWithExplorerRedirectsInWordPressPost = replaceIframesWithExplorerRedirectsInWordPressPost;
//# sourceMappingURL=replaceExplorerRedirects.js.map