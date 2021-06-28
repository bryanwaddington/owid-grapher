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
exports.flushCache = exports.countryProfileCountryPage = exports.renderCountryProfile = exports.feedbackPage = exports.pagePerVariable = exports.entriesByYearPage = exports.makeAtomFeed = exports.renderNotFoundPage = exports.renderSearchPage = exports.renderBlogByPageNum = exports.renderSubscribePage = exports.renderDonatePage = exports.renderFrontPage = exports.renderMenuJson = exports.renderPreview = exports.renderPageBySlug = exports.renderCovidPage = exports.renderChartsPage = exports.renderToHtmlPage = void 0;
const LongFormPage_1 = require("../site/LongFormPage");
const BlogIndexPage_1 = require("../site/BlogIndexPage");
const FrontPage_1 = require("../site/FrontPage");
const ChartsIndexPage_1 = require("../site/ChartsIndexPage");
const CovidPage_1 = require("../site/CovidPage");
const SearchPage_1 = require("../site/SearchPage");
const NotFoundPage_1 = require("../site/NotFoundPage");
const DonatePage_1 = require("../site/DonatePage");
const SubscribePage_1 = require("../site/SubscribePage");
const React = __importStar(require("react"));
const ReactDOMServer = __importStar(require("react-dom/server"));
const lodash = __importStar(require("lodash"));
const formatting_1 = require("./formatting");
const GrapherBakingUtils_1 = require("../baker/GrapherBakingUtils");
const cheerio = __importStar(require("cheerio"));
const Post_1 = require("../db/model/Post");
const serverSettings_1 = require("../settings/serverSettings");
const clientSettings_1 = require("../settings/clientSettings");
const EntriesByYearPage_1 = require("../site/EntriesByYearPage");
const VariableCountryPage_1 = require("../site/VariableCountryPage");
const FeedbackPage_1 = require("../site/FeedbackPage");
const countries_1 = require("../clientUtils/countries");
const Util_1 = require("../clientUtils/Util");
const owidTypes_1 = require("../clientUtils/owidTypes");
const formatWordpressPost_1 = require("./formatWordpressPost");
const wpdb_1 = require("../db/wpdb");
const db_1 = require("../db/db");
const renderToHtmlPage = (element) => `<!doctype html>${ReactDOMServer.renderToStaticMarkup(element)}`;
exports.renderToHtmlPage = renderToHtmlPage;
const renderChartsPage = () => __awaiter(void 0, void 0, void 0, function* () {
    const chartItems = (yield db_1.queryMysql(`
        SELECT
            id,
            config->>"$.slug" AS slug,
            config->>"$.title" AS title,
            config->>"$.variantName" AS variantName
        FROM charts
        WHERE
            is_indexable IS TRUE
            AND publishedAt IS NOT NULL
            AND config->"$.isPublished" IS TRUE
    `));
    const chartTags = yield db_1.queryMysql(`
        SELECT ct.chartId, ct.tagId, t.name as tagName, t.parentId as tagParentId FROM chart_tags ct
        JOIN charts c ON c.id=ct.chartId
        JOIN tags t ON t.id=ct.tagId
    `);
    for (const c of chartItems) {
        c.tags = [];
    }
    const chartsById = lodash.keyBy(chartItems, (c) => c.id);
    for (const ct of chartTags) {
        const c = chartsById[ct.chartId];
        if (c)
            c.tags.push({ id: ct.tagId, name: ct.tagName });
    }
    return exports.renderToHtmlPage(React.createElement(ChartsIndexPage_1.ChartsIndexPage, { chartItems: chartItems, baseUrl: serverSettings_1.BAKED_BASE_URL }));
});
exports.renderChartsPage = renderChartsPage;
// Only used in the dev server
const renderCovidPage = () => exports.renderToHtmlPage(React.createElement(CovidPage_1.CovidPage, { baseUrl: serverSettings_1.BAKED_BASE_URL }));
exports.renderCovidPage = renderCovidPage;
const renderPageBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const postApi = yield wpdb_1.getPostBySlug(slug);
    return renderPage(postApi);
});
exports.renderPageBySlug = renderPageBySlug;
const renderPreview = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const postApi = yield wpdb_1.getLatestPostRevision(postId);
    return renderPage(postApi);
});
exports.renderPreview = renderPreview;
const renderMenuJson = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield wpdb_1.getEntriesByCategory();
    return JSON.stringify({ categories: categories });
});
exports.renderMenuJson = renderMenuJson;
const renderPage = (postApi) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield wpdb_1.getFullPost(postApi);
    const pageType = yield wpdb_1.getPageType(post);
    const $ = cheerio.load(post.content);
    const grapherUrls = $("iframe")
        .toArray()
        .filter((el) => (el.attribs["src"] || "").match(/\/grapher\//))
        .map((el) => el.attribs["src"].trim());
    // This can be slow if uncached!
    yield GrapherBakingUtils_1.bakeGrapherUrls(grapherUrls);
    const exportsByUrl = yield GrapherBakingUtils_1.getGrapherExportsByUrl();
    // Extract formatting options from post HTML comment (if any)
    const formattingOptions = formatting_1.extractFormattingOptions(post.content);
    const formatted = yield formatWordpressPost_1.formatPost(post, formattingOptions, exportsByUrl);
    return exports.renderToHtmlPage(React.createElement(LongFormPage_1.LongFormPage, { pageType: pageType, post: formatted, formattingOptions: formattingOptions, baseUrl: serverSettings_1.BAKED_BASE_URL }));
});
const renderFrontPage = () => __awaiter(void 0, void 0, void 0, function* () {
    const entries = yield wpdb_1.getEntriesByCategory();
    const posts = yield wpdb_1.getBlogIndex();
    const totalCharts = (yield db_1.queryMysql(`SELECT COUNT(*) AS count
            FROM charts
            WHERE
                is_indexable IS TRUE
                AND publishedAt IS NOT NULL
                AND config -> "$.isPublished" IS TRUE`))[0].count;
    return exports.renderToHtmlPage(React.createElement(FrontPage_1.FrontPage, { entries: entries, posts: posts, totalCharts: totalCharts, baseUrl: serverSettings_1.BAKED_BASE_URL }));
});
exports.renderFrontPage = renderFrontPage;
const renderDonatePage = () => exports.renderToHtmlPage(React.createElement(DonatePage_1.DonatePage, { baseUrl: serverSettings_1.BAKED_BASE_URL, recaptchaKey: clientSettings_1.RECAPTCHA_SITE_KEY }));
exports.renderDonatePage = renderDonatePage;
const renderSubscribePage = () => exports.renderToHtmlPage(React.createElement(SubscribePage_1.SubscribePage, { baseUrl: serverSettings_1.BAKED_BASE_URL }));
exports.renderSubscribePage = renderSubscribePage;
const renderBlogByPageNum = (pageNum) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield wpdb_1.getBlogIndex();
    const numPages = Math.ceil(allPosts.length / serverSettings_1.BLOG_POSTS_PER_PAGE);
    const posts = allPosts.slice((pageNum - 1) * serverSettings_1.BLOG_POSTS_PER_PAGE, pageNum * serverSettings_1.BLOG_POSTS_PER_PAGE);
    return exports.renderToHtmlPage(React.createElement(BlogIndexPage_1.BlogIndexPage, { posts: posts, pageNum: pageNum, numPages: numPages, baseUrl: serverSettings_1.BAKED_BASE_URL }));
});
exports.renderBlogByPageNum = renderBlogByPageNum;
const renderSearchPage = () => exports.renderToHtmlPage(React.createElement(SearchPage_1.SearchPage, { baseUrl: serverSettings_1.BAKED_BASE_URL }));
exports.renderSearchPage = renderSearchPage;
const renderNotFoundPage = () => exports.renderToHtmlPage(React.createElement(NotFoundPage_1.NotFoundPage, { baseUrl: serverSettings_1.BAKED_BASE_URL }));
exports.renderNotFoundPage = renderNotFoundPage;
function makeAtomFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        const postsApi = yield wpdb_1.getPosts(["post"], 10);
        const posts = yield Promise.all(postsApi.map((postApi) => wpdb_1.getFullPost(postApi, true)));
        const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<title>Our World in Data</title>
<subtitle>Research and data to make progress against the world’s largest problems</subtitle>
<id>${serverSettings_1.BAKED_BASE_URL}/</id>
<link type="text/html" rel="alternate" href="${serverSettings_1.BAKED_BASE_URL}"/>
<link type="application/atom+xml" rel="self" href="${serverSettings_1.BAKED_BASE_URL}/atom.xml"/>
<updated>${posts[0].date.toISOString()}</updated>
${posts
            .map((post) => {
            const postUrl = `${serverSettings_1.BAKED_BASE_URL}/${post.path}`;
            const image = post.imageUrl
                ? `<br><br><a href="${postUrl}" target="_blank"><img src="${post.imageUrl}"/></a>`
                : "";
            return `<entry>
            <title><![CDATA[${post.title}]]></title>
            <id>${postUrl}</id>
            <link rel="alternate" href="${postUrl}"/>
            <published>${post.date.toISOString()}</published>
            <updated>${post.modifiedDate.toISOString()}</updated>
            ${post.authors
                .map((author) => `<author><name>${author}</name></author>`)
                .join("")}
            <summary><![CDATA[${post.excerpt}${image}]]></summary>
            </entry>`;
        })
            .join("\n")}
</feed>
`;
        return feed;
    });
}
exports.makeAtomFeed = makeAtomFeed;
// These pages exist largely just for Google Scholar
const entriesByYearPage = (year) => __awaiter(void 0, void 0, void 0, function* () {
    const entries = (yield db_1.knexTable(Post_1.Post.table)
        .where({ status: "publish" })
        .join("post_tags", { "post_tags.post_id": "posts.id" })
        .join("tags", { "tags.id": "post_tags.tag_id" })
        .where({ "tags.name": "Entries" })
        .select("title", "slug", "published_at"));
    if (year !== undefined)
        return exports.renderToHtmlPage(React.createElement(EntriesByYearPage_1.EntriesForYearPage, { entries: entries, year: year, baseUrl: serverSettings_1.BAKED_BASE_URL }));
    return exports.renderToHtmlPage(React.createElement(EntriesByYearPage_1.EntriesByYearPage, { entries: entries, baseUrl: serverSettings_1.BAKED_BASE_URL }));
});
exports.entriesByYearPage = entriesByYearPage;
const pagePerVariable = (variableId, countryName) => __awaiter(void 0, void 0, void 0, function* () {
    const variable = yield db_1.mysqlFirst(`
        SELECT v.id, v.name, v.unit, v.shortUnit, v.description, v.sourceId, u.fullName AS uploadedBy,
               v.display, d.id AS datasetId, d.name AS datasetName, d.namespace AS datasetNamespace
        FROM variables v
        JOIN datasets d ON d.id=v.datasetId
        JOIN users u ON u.id=d.dataEditedByUserId
        WHERE v.id = ?
    `, [variableId]);
    if (!variable)
        throw new owidTypes_1.JsonError(`No variable by id '${variableId}'`, 404);
    variable.display = JSON.parse(variable.display);
    variable.source = yield db_1.mysqlFirst(`SELECT id, name FROM sources AS s WHERE id = ?`, variable.sourceId);
    const country = yield db_1.knexTable("entities")
        .select("id", "name")
        .whereRaw("lower(name) = ?", [countryName])
        .first();
    return exports.renderToHtmlPage(React.createElement(VariableCountryPage_1.VariableCountryPage, { variable: variable, country: country, baseUrl: serverSettings_1.BAKED_BASE_URL }));
});
exports.pagePerVariable = pagePerVariable;
const feedbackPage = () => exports.renderToHtmlPage(React.createElement(FeedbackPage_1.FeedbackPage, { baseUrl: serverSettings_1.BAKED_BASE_URL }));
exports.feedbackPage = feedbackPage;
const getCountryProfilePost = Util_1.memoize((profileSpec, grapherExports) => __awaiter(void 0, void 0, void 0, function* () {
    // Get formatted content from generic covid country profile page.
    const genericCountryProfilePostApi = yield wpdb_1.getPostBySlug(profileSpec.genericProfileSlug);
    const genericCountryProfilePost = yield wpdb_1.getFullPost(genericCountryProfilePostApi);
    const profileFormattingOptions = formatting_1.extractFormattingOptions(genericCountryProfilePost.content);
    const formattedPost = yield formatWordpressPost_1.formatPost(genericCountryProfilePost, profileFormattingOptions, grapherExports);
    return [formattedPost, profileFormattingOptions];
}));
// todo: we used to flush cache of this thing.
const getCountryProfileLandingPost = Util_1.memoize((profileSpec) => __awaiter(void 0, void 0, void 0, function* () {
    const landingPagePostApi = yield wpdb_1.getPostBySlug(profileSpec.landingPageSlug);
    const landingPost = wpdb_1.getFullPost(landingPagePostApi);
    return landingPost;
}));
const renderCountryProfile = (profileSpec, country, grapherExports) => __awaiter(void 0, void 0, void 0, function* () {
    const [formatted, formattingOptions] = yield getCountryProfilePost(profileSpec, grapherExports);
    const formattedCountryProfile = formatting_1.formatCountryProfile(formatted, country);
    const landing = yield getCountryProfileLandingPost(profileSpec);
    const overrides = {
        pageTitle: `${country.name}: ${profileSpec.pageTitle} Country Profile`,
        citationTitle: landing.title,
        citationSlug: landing.slug,
        citationCanonicalUrl: `${serverSettings_1.BAKED_BASE_URL}/${landing.slug}`,
        citationAuthors: landing.authors,
        publicationDate: landing.date,
        canonicalUrl: `${serverSettings_1.BAKED_BASE_URL}/${profileSpec.rootPath}/${country.slug}`,
        excerpt: `${country.name}: ${formattedCountryProfile.excerpt}`,
    };
    return exports.renderToHtmlPage(React.createElement(LongFormPage_1.LongFormPage, { pageType: owidTypes_1.PageType.SubEntry, post: formattedCountryProfile, overrides: overrides, formattingOptions: formattingOptions, baseUrl: serverSettings_1.BAKED_BASE_URL }));
});
exports.renderCountryProfile = renderCountryProfile;
const countryProfileCountryPage = (profileSpec, countrySlug) => __awaiter(void 0, void 0, void 0, function* () {
    const country = countries_1.getCountry(countrySlug);
    if (!country)
        throw new owidTypes_1.JsonError(`No such country ${countrySlug}`, 404);
    // Voluntarily not dealing with grapherExports on devServer for simplicity
    return exports.renderCountryProfile(profileSpec, country);
});
exports.countryProfileCountryPage = countryProfileCountryPage;
const flushCache = () => { var _a, _b; return (_b = (_a = getCountryProfilePost.cache).clear) === null || _b === void 0 ? void 0 : _b.call(_a); };
exports.flushCache = flushCache;
//# sourceMappingURL=siteRenderers.js.map