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
exports.flushCache = exports.getTables = exports.getBlogIndex = exports.getFullPost = exports.getBlockContent = exports.getRelatedArticles = exports.getRelatedCharts = exports.getLatestPostRevision = exports.getPostBySlug = exports.getPostType = exports.getPosts = exports.getFeaturedImages = exports.getPermalinks = exports.getPageType = exports.getEntriesByCategory = exports.getDocumentsInfo = exports.getTagsByPostId = exports.getAuthorship = exports.ENTRIES_CATEGORY_ID = exports.singleton = exports.isWordpressDBEnabled = exports.isWordpressAPIEnabled = void 0;
const entities_1 = require("entities");
const DatabaseConnection_1 = require("./DatabaseConnection");
const serverSettings_1 = require("../settings/serverSettings");
const serverSettings_2 = require("../settings/serverSettings");
const db = __importStar(require("./db"));
const knex_1 = __importDefault(require("knex"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const js_base64_1 = require("js-base64");
const cleanup_1 = require("./cleanup");
const owidTypes_1 = require("../clientUtils/owidTypes");
const contentGraph_1 = require("./contentGraph");
const Util_1 = require("../clientUtils/Util");
let knexInstance;
exports.isWordpressAPIEnabled = serverSettings_2.WORDPRESS_URL.length > 0;
exports.isWordpressDBEnabled = serverSettings_1.WORDPRESS_DB_NAME.length > 0;
class WPDB {
    knex(tableName) {
        if (!knexInstance) {
            knexInstance = knex_1.default({
                client: "mysql",
                connection: {
                    host: serverSettings_1.WORDPRESS_DB_HOST,
                    port: serverSettings_1.WORDPRESS_DB_PORT,
                    user: serverSettings_1.WORDPRESS_DB_USER,
                    password: serverSettings_1.WORDPRESS_DB_PASS,
                    database: serverSettings_1.WORDPRESS_DB_NAME,
                },
            });
            cleanup_1.registerExitHandler(() => __awaiter(this, void 0, void 0, function* () { return this.destroyKnex(); }));
        }
        return knexInstance(tableName);
    }
    destroyKnex() {
        return __awaiter(this, void 0, void 0, function* () {
            if (knexInstance)
                yield knexInstance.destroy();
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.conn = new DatabaseConnection_1.DatabaseConnection({
                host: serverSettings_1.WORDPRESS_DB_HOST,
                port: serverSettings_1.WORDPRESS_DB_PORT,
                user: serverSettings_1.WORDPRESS_DB_USER,
                password: serverSettings_1.WORDPRESS_DB_PASS,
                database: serverSettings_1.WORDPRESS_DB_NAME,
            });
            yield this.conn.connect();
            cleanup_1.registerExitHandler(() => __awaiter(this, void 0, void 0, function* () {
                if (this.conn)
                    this.conn.end();
            }));
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.conn)
                this.conn.end();
            this.destroyKnex();
        });
    }
    query(queryStr, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conn)
                yield this.connect();
            return this.conn.query(queryStr, params);
        });
    }
    get(queryStr, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.conn)
                yield this.connect();
            return this.conn.get(queryStr, params);
        });
    }
}
exports.singleton = new WPDB();
const WP_API_ENDPOINT = `${serverSettings_2.WORDPRESS_URL}/wp-json/wp/v2`;
const OWID_API_ENDPOINT = `${serverSettings_2.WORDPRESS_URL}/wp-json/owid/v1`;
const WP_GRAPHQL_ENDPOINT = `${serverSettings_2.WORDPRESS_URL}/wp/graphql`;
exports.ENTRIES_CATEGORY_ID = 44;
/* Wordpress GraphQL API query
 *
 * Note: in contrast to the REST API query, the GQL query does not throw when a
 * resource is not found, as GQL returns a 200, with a shape that is different between
 * every query. So it is the caller's responsibility to throw (if necessary) on
 * "faux 404".
 */
const graphqlQuery = (query, variables = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(WP_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${js_base64_1.Base64.encode(serverSettings_1.WORDPRESS_API_USER + ":" + serverSettings_1.WORDPRESS_API_PASS)}`,
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });
    return response.json();
});
/* Wordpress REST API query
 *
 * Note: throws on response.status >= 200 && response.status < 300.
 */
const apiQuery = (endpoint, params) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(endpoint);
    if (params && params.searchParams) {
        params.searchParams.forEach((param) => {
            url.searchParams.append(param[0], String(param[1]));
        });
    }
    const response = yield node_fetch_1.default(url.toString(), {
        headers: {
            Authorization: `Basic ${js_base64_1.Base64.encode(serverSettings_1.WORDPRESS_API_USER + ":" + serverSettings_1.WORDPRESS_API_PASS)}`,
            Accept: "application/json",
        },
    });
    if (!response.ok)
        throw new owidTypes_1.JsonError(`HTTP Error Response: ${response.status} ${response.statusText}`);
    return params && params.returnResponseHeadersOnly
        ? response.headers
        : response.json();
});
// Retrieve a map of post ids to authors
let cachedAuthorship;
const getAuthorship = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedAuthorship)
        return cachedAuthorship;
    const authorRows = yield exports.singleton.query(`
        SELECT object_id, terms.description FROM wp_term_relationships AS rels
        LEFT JOIN wp_term_taxonomy AS terms ON terms.term_taxonomy_id=rels.term_taxonomy_id
        WHERE terms.taxonomy='author'
        ORDER BY rels.term_order ASC
    `);
    const authorship = new Map();
    for (const row of authorRows) {
        let authors = authorship.get(row.object_id);
        if (!authors) {
            authors = [];
            authorship.set(row.object_id, authors);
        }
        authors.push(row.description.split(" ").slice(0, 2).join(" "));
    }
    cachedAuthorship = authorship;
    return authorship;
});
exports.getAuthorship = getAuthorship;
const getTagsByPostId = () => __awaiter(void 0, void 0, void 0, function* () {
    const tagsByPostId = new Map();
    const rows = yield exports.singleton.query(`
        SELECT p.id, t.name
        FROM wp_posts p
        JOIN wp_term_relationships tr
            on (p.id=tr.object_id)
        JOIN wp_term_taxonomy tt
            on (tt.term_taxonomy_id=tr.term_taxonomy_id
            and tt.taxonomy='post_tag')
        JOIN wp_terms t
            on (tt.term_id=t.term_id)
    `);
    for (const row of rows) {
        let cats = tagsByPostId.get(row.id);
        if (!cats) {
            cats = [];
            tagsByPostId.set(row.id, cats);
        }
        cats.push(row.name);
    }
    return tagsByPostId;
});
exports.getTagsByPostId = getTagsByPostId;
const getDocumentsInfo = (type, cursor = "", where = "") => __awaiter(void 0, void 0, void 0, function* () {
    const typePlural = `${type}s`;
    const query = `
    query($cursor: String){
        ${typePlural}(first:50, after: $cursor, where:{${where}}) {
            pageInfo {
                hasNextPage
                endCursor
            }
            nodes {
                id: databaseId
                title
                slug
                content
            }
        }
    }
    `;
    const documents = yield graphqlQuery(query, { cursor });
    const pageInfo = documents === null || documents === void 0 ? void 0 : documents.data[typePlural].pageInfo;
    const nodes = documents === null || documents === void 0 ? void 0 : documents.data[typePlural].nodes;
    if (pageInfo.hasNextPage) {
        return nodes.concat(yield exports.getDocumentsInfo(type, pageInfo.endCursor, where));
    }
    else {
        return nodes;
    }
});
exports.getDocumentsInfo = getDocumentsInfo;
const getEntryNode = ({ slug, title, excerpt, kpi, }) => ({
    slug,
    title: entities_1.decodeHTML(title),
    excerpt: excerpt === null ? "" : entities_1.decodeHTML(excerpt),
    kpi,
});
const isEntryInSubcategories = (entry, subcategories) => {
    return subcategories.some((subcategory) => {
        return subcategory.pages.nodes.some((node) => entry.slug === node.slug);
    });
};
// Retrieve a list of categories and their associated entries
let cachedEntries = [];
const getEntriesByCategory = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.isWordpressAPIEnabled)
        return [];
    if (cachedEntries.length)
        return cachedEntries;
    const first = 100;
    // The filtering of cached entries below makes the $first argument
    // less accurate, as it does not represent the exact number of entries
    // returned per subcategories but rather their maximum number of entries.
    const orderby = "TERM_ORDER";
    const query = `
    query getEntriesByCategory($first: Int, $orderby: TermObjectsConnectionOrderbyEnum!) {
        categories(first: $first, where: {termTaxonomId: ${exports.ENTRIES_CATEGORY_ID}, orderby: $orderby}) {
          nodes {
            name
            children(first: $first, where: {orderby: $orderby}) {
              nodes {
                ...categoryWithEntries
                children(first: $first, where: {orderby: $orderby}) {
                  nodes {
                    ...categoryWithEntries
                  }
                }
              }
            }
          }
        }
      }

      fragment categoryWithEntries on Category {
        name
        slug
        pages(first: $first, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
          nodes {
            slug
            title
            excerpt
            kpi
          }
        }
      }
      `;
    const categories = yield graphqlQuery(query, { first, orderby });
    cachedEntries = categories.data.categories.nodes[0].children.nodes.map(({ name, slug, pages, children }) => ({
        name: entities_1.decodeHTML(name),
        slug,
        entries: pages.nodes
            .filter((node) => 
        /* As entries are sometimes listed at all levels of the category hierarchy
        (e.g. "Entries" > "Demographic Change" > "Life and Death" for "Child and
        Infant Mortality"), it is necessary to filter out duplicates, by giving precedent to
        the deepest level. In other words, if an entry is present in category 1 and category
        1.1, it will only show in category 1.1.

        N.B. Pre wp-graphql 0.6.0, entries would be returned at all levels of the category
        hierarchy, no matter what categories were effectively selected. 0.6.0 fixes that
        (cf. https://github.com/wp-graphql/wp-graphql/issues/1100). Even though this behaviour
        has been fixed, we still have potential duplicates, from the multiple hierarchical
        selection as noted above. The only difference is the nature of the duplicate, which can
        now be considered more intentional as it is coming from the data / CMS.
        Ultimately, this discrepency in the data should be addressed to make the system
        less permissive. */
        !isEntryInSubcategories(node, children.nodes))
            .map((node) => getEntryNode(node)),
        subcategories: children.nodes
            .filter((subcategory) => subcategory.pages.nodes.length !== 0)
            .map(({ name, slug, pages }) => ({
            name: entities_1.decodeHTML(name),
            slug,
            entries: pages.nodes.map((node) => getEntryNode(node)),
        })),
    }));
    return cachedEntries;
});
exports.getEntriesByCategory = getEntriesByCategory;
const getPageType = (post) => __awaiter(void 0, void 0, void 0, function* () {
    const entries = yield exports.getEntriesByCategory();
    const isEntry = entries.some((category) => {
        return (category.entries.some((entry) => entry.slug === post.slug) ||
            category.subcategories.some((subcategory) => {
                return subcategory.entries.some((subCategoryEntry) => subCategoryEntry.slug === post.slug);
            }));
    });
    // TODO Add subEntry detection
    return isEntry ? owidTypes_1.PageType.Entry : owidTypes_1.PageType.Standard;
});
exports.getPageType = getPageType;
const getPermalinks = () => __awaiter(void 0, void 0, void 0, function* () {
    return ({
        // Strip trailing slashes, and convert __ into / to allow custom subdirs like /about/media-coverage
        get: (ID, postName) => postName.replace(/\/+$/g, "").replace(/--/g, "/").replace(/__/g, "/"),
    });
});
exports.getPermalinks = getPermalinks;
let cachedFeaturedImages;
const getFeaturedImages = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedFeaturedImages)
        return cachedFeaturedImages;
    const rows = yield exports.singleton.query(`SELECT wp_postmeta.post_id, wp_posts.guid FROM wp_postmeta INNER JOIN wp_posts ON wp_posts.ID=wp_postmeta.meta_value WHERE wp_postmeta.meta_key='_thumbnail_id'`);
    const featuredImages = new Map();
    for (const row of rows) {
        featuredImages.set(row.post_id, row.guid);
    }
    cachedFeaturedImages = featuredImages;
    return featuredImages;
});
exports.getFeaturedImages = getFeaturedImages;
// page => pages, post => posts
const getEndpointSlugFromType = (type) => `${type}s`;
// Limit not supported with multiple post types:
// When passing multiple post types, the limit is applied to the resulting array
// of sequentially sorted posts (all blog posts, then all pages, ...), so there
// will be a predominance of a certain post type.
const getPosts = (postTypes = [owidTypes_1.WP_PostType.Post, owidTypes_1.WP_PostType.Page], limit) => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.isWordpressAPIEnabled)
        return [];
    const perPage = 50;
    let posts = [];
    for (const postType of postTypes) {
        const endpoint = `${WP_API_ENDPOINT}/${getEndpointSlugFromType(postType)}`;
        // Get number of items to retrieve
        const headers = yield apiQuery(endpoint, {
            searchParams: [["per_page", 1]],
            returnResponseHeadersOnly: true,
        });
        const maxAvailable = headers.get("X-WP-TotalPages");
        const count = limit && limit < maxAvailable ? limit : maxAvailable;
        for (let page = 1; page <= Math.ceil(count / perPage); page++) {
            const postsCurrentPage = yield apiQuery(endpoint, {
                searchParams: [
                    ["per_page", perPage],
                    ["page", page],
                ],
            });
            posts.push(...postsCurrentPage);
        }
    }
    // Published pages excluded from public views
    const excludedSlugs = [serverSettings_2.BLOG_SLUG];
    posts = posts.filter((post) => !excludedSlugs.includes(post.slug) &&
        !post.slug.endsWith("-country-profile"));
    return limit ? posts.slice(0, limit) : posts;
});
exports.getPosts = getPosts;
const getPostType = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const paramName = typeof search === "number" ? "id" : "slug";
    return apiQuery(`${OWID_API_ENDPOINT}/type`, {
        searchParams: [[paramName, search]],
    });
});
exports.getPostType = getPostType;
const getPostBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.isWordpressAPIEnabled) {
        throw new owidTypes_1.JsonError(`Need wordpress API to match slug ${slug}`, 404);
    }
    try {
        const type = yield exports.getPostType(slug);
        const postArr = yield apiQuery(`${WP_API_ENDPOINT}/${getEndpointSlugFromType(type)}`, {
            searchParams: [["slug", slug]],
        });
        return postArr[0];
    }
    catch (err) {
        throw new owidTypes_1.JsonError(`No page found by slug ${slug}`, 404);
    }
});
exports.getPostBySlug = getPostBySlug;
// the /revisions endpoint does not send back all the metadata required for
// the proper rendering of the post (e.g. authors), hence the double request.
const getLatestPostRevision = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const type = yield exports.getPostType(id);
    const endpointSlug = getEndpointSlugFromType(type);
    const postApi = yield apiQuery(`${WP_API_ENDPOINT}/${endpointSlug}/${id}`);
    const revision = (yield apiQuery(`${WP_API_ENDPOINT}/${endpointSlug}/${id}/revisions?per_page=1`))[0];
    return Object.assign(Object.assign({}, postApi), { content: revision.content, title: revision.title });
});
exports.getLatestPostRevision = getLatestPostRevision;
const getRelatedCharts = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return db.queryMysql(`
        SELECT DISTINCT
            charts.config->>"$.slug" AS slug,
            charts.config->>"$.title" AS title,
            charts.config->>"$.variantName" AS variantName
        FROM charts
        INNER JOIN chart_tags ON charts.id=chart_tags.chartId
        INNER JOIN post_tags ON chart_tags.tagId=post_tags.tag_id
        WHERE post_tags.post_id=${postId}
        AND charts.config->>"$.isPublished" = "true"
        ORDER BY title ASC
    `);
});
exports.getRelatedCharts = getRelatedCharts;
const getRelatedArticles = (chartSlug) => __awaiter(void 0, void 0, void 0, function* () {
    const graph = yield contentGraph_1.getContentGraph();
    const chartRecord = yield graph.find(contentGraph_1.GraphType.Chart, chartSlug);
    if (!chartRecord.payload.count)
        return;
    const chart = chartRecord.payload.records[0];
    const relatedArticles = yield Promise.all(chart.research.map((postId) => __awaiter(void 0, void 0, void 0, function* () {
        const postRecord = yield graph.find(contentGraph_1.GraphType.Document, postId);
        const post = postRecord.payload.records[0];
        return {
            id: postId,
            title: post.title,
            slug: post.slug,
        };
    })));
    return relatedArticles;
});
exports.getRelatedArticles = getRelatedArticles;
const getBlockContent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!exports.isWordpressAPIEnabled)
        return undefined;
    const query = `
    query getBlock($id: ID!) {
        wp_block(id: $id, idType: DATABASE_ID) {
          content
        }
      }
    `;
    const post = yield graphqlQuery(query, { id });
    return (_c = (_b = (_a = post.data) === null || _a === void 0 ? void 0 : _a.wp_block) === null || _b === void 0 ? void 0 : _b.content) !== null && _c !== void 0 ? _c : undefined;
});
exports.getBlockContent = getBlockContent;
const getFullPost = (postApi, excludeContent) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    return ({
        id: postApi.id,
        type: postApi.type,
        slug: postApi.slug,
        path: postApi.slug,
        title: entities_1.decodeHTML(postApi.title.rendered),
        subtitle: postApi.meta.owid_subtitle_meta_field,
        date: new Date(postApi.date_gmt),
        modifiedDate: new Date(postApi.modified_gmt),
        authors: postApi.authors_name || [],
        content: excludeContent ? "" : postApi.content.rendered,
        excerpt: entities_1.decodeHTML(postApi.excerpt.rendered),
        imageUrl: `${serverSettings_2.BAKED_BASE_URL}${(_d = postApi.featured_media_path) !== null && _d !== void 0 ? _d : "/default-thumbnail.jpg"}`,
        relatedCharts: postApi.type === "page"
            ? yield exports.getRelatedCharts(postApi.id)
            : undefined,
        glossary: postApi.meta.owid_glossary_meta_field,
    });
});
exports.getFullPost = getFullPost;
exports.getBlogIndex = Util_1.memoize(() => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: do not get post content in the first place
    const posts = yield exports.getPosts(["post"]);
    return Promise.all(posts.map((post) => exports.getFullPost(post, true)));
}));
let cachedTables;
const getTables = () => __awaiter(void 0, void 0, void 0, function* () {
    if (cachedTables)
        return cachedTables;
    const optRows = yield exports.singleton.query(`
        SELECT option_value AS json FROM wp_options WHERE option_name='tablepress_tables'
    `);
    const tableToPostIds = JSON.parse(optRows[0].json).table_post;
    const rows = yield exports.singleton.query(`
        SELECT ID, post_content FROM wp_posts WHERE post_type='tablepress_table'
    `);
    const tableContents = new Map();
    for (const row of rows) {
        tableContents.set(row.ID, row.post_content);
    }
    cachedTables = new Map();
    for (const tableId in tableToPostIds) {
        const data = JSON.parse(tableContents.get(tableToPostIds[tableId]) || "[]");
        cachedTables.set(tableId, {
            tableId: tableId,
            data: data,
        });
    }
    return cachedTables;
});
exports.getTables = getTables;
const flushCache = () => {
    var _a, _b;
    cachedAuthorship = undefined;
    cachedEntries = [];
    cachedFeaturedImages = undefined;
    (_b = (_a = exports.getBlogIndex.cache).clear) === null || _b === void 0 ? void 0 : _b.call(_a);
    cachedTables = undefined;
};
exports.flushCache = flushCache;
//# sourceMappingURL=wpdb.js.map