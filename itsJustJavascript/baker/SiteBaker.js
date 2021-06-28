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
exports.SiteBaker = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const lodash_1 = require("lodash");
const lodash = __importStar(require("lodash"));
const cheerio = __importStar(require("cheerio"));
const ProgressBar = require("progress");
const wpdb = __importStar(require("../db/wpdb"));
const db = __importStar(require("../db/db"));
const serverSettings_1 = require("../settings/serverSettings");
const formatting_1 = require("./formatting");
const LongFormPage_1 = require("../site/LongFormPage");
const siteRenderers_1 = require("../baker/siteRenderers");
const GrapherBakingUtils_1 = require("../baker/GrapherBakingUtils");
const sitemap_1 = require("../baker/sitemap");
const React = __importStar(require("react"));
const Post_1 = require("../db/model/Post");
const countryProfiles_1 = require("../baker/countryProfiles");
const countries_1 = require("../clientUtils/countries");
const execWrapper_1 = require("../db/execWrapper");
const slackLog_1 = require("./slackLog");
const countryProfileProjects_1 = require("../site/countryProfileProjects");
const ExplorerAdminServer_1 = require("../explorerAdmin/ExplorerAdminServer");
const redirects_1 = require("./redirects");
const GrapherBaker_1 = require("./GrapherBaker");
const ExplorerConstants_1 = require("../explorer/ExplorerConstants");
const webpackUtils_1 = require("../site/webpackUtils");
const formatWordpressPost_1 = require("./formatWordpressPost");
const GitCmsConstants_1 = require("../gitCms/GitCmsConstants");
class SiteBaker {
    constructor(bakedSiteDir, baseUrl) {
        this.bakedSiteDir = bakedSiteDir;
        this.baseUrl = baseUrl;
        this.progressBar = new ProgressBar("BakeAll [:bar] :current/:total :elapseds :name\n", {
            total: 15,
        });
    }
    bakeEmbeds() {
        return __awaiter(this, void 0, void 0, function* () {
            // Find all grapher urls used as embeds in all posts on the site
            const rows = yield wpdb.singleton.query(`SELECT post_content FROM wp_posts WHERE (post_type='page' OR post_type='post' OR post_type='wp_block') AND post_status='publish'`);
            let grapherUrls = [];
            for (const row of rows) {
                const $ = cheerio.load(row.post_content);
                grapherUrls.push(...$("iframe")
                    .toArray()
                    .filter((el) => (el.attribs["src"] || "").match(/\/grapher\//))
                    .map((el) => el.attribs["src"].trim()));
            }
            grapherUrls = lodash.uniq(grapherUrls);
            yield GrapherBakingUtils_1.bakeGrapherUrls(grapherUrls);
            this.grapherExports = yield GrapherBakingUtils_1.getGrapherExportsByUrl();
            this.progressBar.tick({ name: "✅ baked embeds" });
        });
    }
    bakeCountryProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            countryProfileProjects_1.countryProfileSpecs.forEach((spec) => __awaiter(this, void 0, void 0, function* () {
                // Delete all country profiles before regenerating them
                yield fs.remove(`${this.bakedSiteDir}/${spec.rootPath}`);
                // Not necessary, as this is done by stageWrite already
                // await this.ensureDir(profile.rootPath)
                for (const country of countries_1.countries) {
                    const html = yield siteRenderers_1.renderCountryProfile(spec, country, this.grapherExports).catch(() => console.error(`${country.name} country profile not baked for project "${spec.project}". Check that both pages "${spec.landingPageSlug}" and "${spec.genericProfileSlug}" exist and are published.`));
                    if (html) {
                        const outPath = path.join(this.bakedSiteDir, `${spec.rootPath}/${country.slug}.html`);
                        yield this.stageWrite(outPath, html);
                    }
                }
            }));
            this.progressBar.tick({ name: "✅ baked country profiles" });
        });
    }
    // Bake an individual post/page
    bakePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageType = yield wpdb.getPageType(post);
            const formattingOptions = formatting_1.extractFormattingOptions(post.content);
            const formatted = yield formatWordpressPost_1.formatPost(post, formattingOptions, this.grapherExports);
            const html = siteRenderers_1.renderToHtmlPage(React.createElement(LongFormPage_1.LongFormPage, { pageType: pageType, post: formatted, formattingOptions: formattingOptions, baseUrl: this.baseUrl }));
            const outPath = path.join(this.bakedSiteDir, `${post.slug}.html`);
            yield fs.mkdirp(path.dirname(outPath));
            yield this.stageWrite(outPath, html);
        });
    }
    // Returns the slugs of posts which exist on the filesystem but are not in the DB anymore.
    // This happens when posts have been saved in previous bakes but have been since then deleted, unpublished or renamed.
    // Among all existing slugs on the filesystem, some are not coming from WP. They are baked independently and should not
    // be deleted if WP does not list them (e.g. grapher/*).
    getPostSlugsToRemove(postSlugsFromDb) {
        const existingSlugs = glob
            .sync(`${this.bakedSiteDir}/**/*.html`)
            .map((path) => path.replace(`${this.bakedSiteDir}/`, "").replace(".html", ""))
            .filter((path) => !path.startsWith("uploads") &&
            !path.startsWith("grapher") &&
            !path.startsWith("countries") &&
            !path.startsWith("country") &&
            !path.startsWith("subscribe") &&
            !path.startsWith("blog") &&
            !path.startsWith("entries-by-year") &&
            !path.startsWith("explore") &&
            !countryProfileProjects_1.countryProfileSpecs.some((spec) => path.startsWith(spec.rootPath)) &&
            path !== "donate" &&
            path !== "feedback" &&
            path !== "charts" &&
            path !== "search" &&
            path !== "index" &&
            path !== "identifyadmin" &&
            path !== "404" &&
            path !== "google8272294305985984");
        return lodash_1.without(existingSlugs, ...postSlugsFromDb);
    }
    // Bake all Wordpress posts, both blog posts and entry pages
    bakePosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const postsApi = yield wpdb.getPosts();
            const postSlugs = [];
            for (const postApi of postsApi) {
                const post = yield wpdb.getFullPost(postApi);
                postSlugs.push(post.slug);
                yield this.bakePost(post);
            }
            // Maxes out resources (TODO: RCA)
            // await Promise.all(bakingPosts.map(post => this.bakePost(post)))
            // Delete any previously rendered posts that aren't in the database
            for (const slug of this.getPostSlugsToRemove(postSlugs)) {
                const outPath = `${this.bakedSiteDir}/${slug}.html`;
                yield fs.unlink(outPath);
                this.stage(outPath, `DELETING ${outPath}`);
            }
            this.progressBar.tick({ name: "✅ baked posts" });
        });
    }
    // Bake unique individual pages
    bakeSpecialPages() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stageWrite(`${this.bakedSiteDir}/index.html`, yield siteRenderers_1.renderFrontPage());
            yield this.stageWrite(`${this.bakedSiteDir}/subscribe.html`, yield siteRenderers_1.renderSubscribePage());
            yield this.stageWrite(`${this.bakedSiteDir}/donate.html`, yield siteRenderers_1.renderDonatePage());
            yield this.stageWrite(`${this.bakedSiteDir}/feedback.html`, yield siteRenderers_1.feedbackPage());
            yield this.stageWrite(`${this.bakedSiteDir}/charts.html`, yield siteRenderers_1.renderChartsPage());
            yield this.stageWrite(`${this.bakedSiteDir}/search.html`, yield siteRenderers_1.renderSearchPage());
            yield this.stageWrite(`${this.bakedSiteDir}/404.html`, yield siteRenderers_1.renderNotFoundPage());
            yield this.stageWrite(`${this.bakedSiteDir}/headerMenu.json`, yield siteRenderers_1.renderMenuJson());
            yield this.stageWrite(`${this.bakedSiteDir}/sitemap.xml`, yield sitemap_1.makeSitemap());
            const explorerAdminServer = new ExplorerAdminServer_1.ExplorerAdminServer(GitCmsConstants_1.GIT_CMS_DIR, this.baseUrl);
            yield explorerAdminServer.bakeAllExplorerRedirects(this.bakedSiteDir);
            yield explorerAdminServer.bakeAllPublishedExplorers(`${this.bakedSiteDir}/${ExplorerConstants_1.EXPLORERS_ROUTE_FOLDER}/`);
            this.progressBar.tick({ name: "✅ baked special pages" });
        });
    }
    // Pages that are expected by google scholar for indexing
    bakeGoogleScholar() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stageWrite(`${this.bakedSiteDir}/entries-by-year/index.html`, yield siteRenderers_1.entriesByYearPage());
            const rows = (yield db
                .knexTable(Post_1.Post.table)
                .where({ status: "publish" })
                .join("post_tags", { "post_tags.post_id": "posts.id" })
                .join("tags", { "tags.id": "post_tags.tag_id" })
                .where({ "tags.name": "Entries" })
                .select(db.knexRaw("distinct year(published_at) as year"))
                .orderBy("year", "DESC"));
            const years = rows.map((r) => r.year);
            for (const year of years) {
                yield this.stageWrite(`${this.bakedSiteDir}/entries-by-year/${year}.html`, yield siteRenderers_1.entriesByYearPage(year));
            }
            this.progressBar.tick({ name: "✅ baked google scholar" });
        });
    }
    // Bake the blog index
    bakeBlogIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield wpdb.getBlogIndex();
            const numPages = Math.ceil(allPosts.length / serverSettings_1.BLOG_POSTS_PER_PAGE);
            for (let i = 1; i <= numPages; i++) {
                const slug = i === 1 ? "blog" : `blog/page/${i}`;
                const html = yield siteRenderers_1.renderBlogByPageNum(i);
                yield this.stageWrite(`${this.bakedSiteDir}/${slug}.html`, html);
            }
            this.progressBar.tick({ name: "✅ baked blog index" });
        });
    }
    // Bake the RSS feed
    bakeRSS() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stageWrite(`${this.bakedSiteDir}/atom.xml`, yield siteRenderers_1.makeAtomFeed());
            this.progressBar.tick({ name: "✅ baked rss" });
        });
    }
    // Bake the static assets
    bakeAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            yield execWrapper_1.execWrapper(`rsync -havL --delete ${serverSettings_1.WORDPRESS_DIR}/web/app/uploads ${this.bakedSiteDir}/`);
            yield execWrapper_1.execWrapper(`rm -rf ${this.bakedSiteDir}/assets && cp -r ${serverSettings_1.BASE_DIR}/itsJustJavascript/webpack ${this.bakedSiteDir}/assets`);
            yield execWrapper_1.execWrapper(`rsync -hav --delete ${serverSettings_1.BASE_DIR}/public/* ${this.bakedSiteDir}/`);
            yield fs.writeFile(`${this.bakedSiteDir}/grapher/embedCharts.js`, webpackUtils_1.bakeEmbedSnippet(this.baseUrl));
            this.stage(`${this.bakedSiteDir}/grapher/embedCharts.js`);
            this.progressBar.tick({ name: "✅ baked assets" });
        });
    }
    bakeRedirects() {
        return __awaiter(this, void 0, void 0, function* () {
            const redirects = yield redirects_1.getRedirects();
            this.progressBar.tick({ name: "✅ got redirects" });
            yield this.stageWrite(path.join(this.bakedSiteDir, `_redirects`), redirects.join("\n"));
            this.progressBar.tick({ name: "✅ baked redirects" });
        });
    }
    bakeWordpressPages() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.bakeRedirects();
            yield this.bakeEmbeds();
            yield this.bakeBlogIndex();
            yield this.bakeRSS();
            yield this.bakeAssets();
            yield this.bakeGoogleScholar();
            yield this.bakePosts();
        });
    }
    _bakeNonWordpressPages() {
        return __awaiter(this, void 0, void 0, function* () {
            yield countryProfiles_1.bakeCountries(this);
            yield this.bakeSpecialPages();
            yield this.bakeCountryProfiles();
            yield GrapherBaker_1.bakeAllChangedGrapherPagesVariablesPngSvgAndDeleteRemovedGraphers(this.bakedSiteDir);
            this.progressBar.tick({
                name: "✅ bakeAllChangedGrapherPagesVariablesPngSvgAndDeleteRemovedGraphers",
            });
        });
    }
    bakeNonWordpressPages() {
        return __awaiter(this, void 0, void 0, function* () {
            this.progressBar = new ProgressBar("BakeAll [:bar] :current/:total :elapseds :name\n", {
                total: 5,
            });
            yield this._bakeNonWordpressPages();
        });
    }
    bakeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure caches are correctly initialized
            this.flushCache();
            yield this.bakeWordpressPages();
            yield this._bakeNonWordpressPages();
            this.flushCache();
        });
    }
    ensureDir(relPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outPath = path.join(this.bakedSiteDir, relPath);
            yield fs.mkdirp(outPath);
        });
    }
    writeFile(relPath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const outPath = path.join(this.bakedSiteDir, relPath);
            yield fs.writeFile(outPath, content);
            this.stage(outPath);
        });
    }
    stageWrite(outPath, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs.mkdirp(path.dirname(outPath));
            yield fs.writeFile(outPath, content);
            this.stage(outPath);
        });
    }
    stage(outPath, msg) {
        console.log(msg || outPath);
    }
    execAndLogAnyErrorsToSlack(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(cmd);
            try {
                return yield execWrapper_1.execWrapper(cmd);
            }
            catch (error) {
                // Log error to Slack, but do not throw error
                return slackLog_1.log.logErrorAndMaybeSendToSlack(error);
            }
        });
    }
    deployToNetlifyAndPushToGitPush(commitMsg, authorEmail, authorName) {
        return __awaiter(this, void 0, void 0, function* () {
            const deployDirectlyToNetlix = fs.existsSync(path.join(this.bakedSiteDir, ".netlify/state.json"));
            const progressBar = new ProgressBar("DeployToNetlify [:bar] :current/:total :elapseds :name\n", {
                total: 3 + (deployDirectlyToNetlix ? 1 : 0),
            });
            progressBar.tick({ name: "✅ ready to deploy" });
            // Deploy directly to Netlify (faster than using the github hook)
            if (deployDirectlyToNetlix) {
                yield this.execAndLogAnyErrorsToSlack(`cd ${this.bakedSiteDir} && ${serverSettings_1.BASE_DIR}/node_modules/.bin/netlify deploy -d . --prodIfUnlocked --timeout 6000`);
                progressBar.tick({ name: "✅ deployed directly to netlify" });
            }
            // Ensure there is a git repo in there
            yield this.execAndLogAnyErrorsToSlack(`cd ${this.bakedSiteDir} && git init`);
            progressBar.tick({ name: "✅ ensured git repo" });
            // Prettify HTML source for easier debugging
            // Target root level HTML files only (entries and posts) for performance
            // reasons.
            // TODO: check again --only-changed
            // await this.execWrapper(`cd ${BAKED_SITE_DIR} && ${BASE_DIR}/node_modules/.bin/prettier --write "./*.html"`)
            if (authorEmail && authorName && commitMsg)
                yield this.execAndLogAnyErrorsToSlack(`cd ${this.bakedSiteDir} && git add -A . && git commit --allow-empty --author='${authorName} <${authorEmail}>' -a -m '${commitMsg}' && git push origin master`);
            else
                yield this.execAndLogAnyErrorsToSlack(`cd ${this.bakedSiteDir} && git add -A . && git commit --allow-empty -a -m '${commitMsg}' && git push origin master`);
            progressBar.tick({ name: "✅ committed and pushed to github" });
        });
    }
    endDbConnections() {
        wpdb.singleton.end();
        db.closeTypeOrmAndKnexConnections();
    }
    flushCache() {
        // Clear caches to allow garbage collection while waiting for next run
        wpdb.flushCache();
        siteRenderers_1.flushCache();
        this.progressBar.tick({ name: "✅ cache flushed" });
    }
}
exports.SiteBaker = SiteBaker;
//# sourceMappingURL=SiteBaker.js.map