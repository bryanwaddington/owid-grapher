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
const algoliasearch_1 = __importDefault(require("algoliasearch"));
const db = __importStar(require("../../db/db"));
const wpdb = __importStar(require("../../db/wpdb"));
const clientSettings_1 = require("../../settings/clientSettings");
const serverSettings_1 = require("../../settings/serverSettings");
const search_1 = require("../../clientUtils/search");
const countries_1 = require("../../clientUtils/countries");
const formatWordpressPost_1 = require("../../baker/formatWordpressPost");
const getPostTags = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield db
        .knexTable("post_tags")
        .select("tags.id", "tags.name")
        .where({ post_id: postId })
        .join("tags", "tags.id", "=", "post_tags.tag_id"));
});
const getPostType = (post, tags) => {
    if (post.slug.startsWith("about/"))
        return "about";
    if (post.type === "post") {
        if (tags.some((t) => t.name === "Explainers"))
            return "explainer";
        if (tags.some((t) => t.name === "Short updates and facts"))
            return "fact";
        return "post";
    }
    if (tags.some((t) => t.name === "Entries"))
        return "entry";
    return "page";
};
const indexToAlgolia = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = algoliasearch_1.default(clientSettings_1.ALGOLIA_ID, serverSettings_1.ALGOLIA_SECRET_KEY);
    const index = client.initIndex("pages");
    const postsApi = yield wpdb.getPosts();
    const records = [];
    for (const country of countries_1.countries) {
        records.push({
            objectID: country.slug,
            type: "country",
            slug: country.slug,
            title: country.name,
            content: `All available indicators for ${country.name}.`,
        });
    }
    for (const postApi of postsApi) {
        const rawPost = yield wpdb.getFullPost(postApi);
        const post = yield formatWordpressPost_1.formatPost(rawPost, { footnotes: false });
        const postText = search_1.htmlToPlaintext(post.html);
        const chunks = search_1.chunkParagraphs(postText, 1000);
        const tags = yield getPostTags(post.id);
        const postType = getPostType(post, tags);
        let importance = 0;
        if (postType === "entry")
            importance = 3;
        else if (postType === "explainer")
            importance = 2;
        else if (postType === "fact")
            importance = 1;
        let i = 0;
        for (const c of chunks) {
            records.push({
                objectID: `${rawPost.id}-c${i}`,
                postId: post.id,
                type: postType,
                slug: post.path,
                title: post.title,
                excerpt: post.excerpt,
                authors: post.authors,
                date: post.date,
                modifiedDate: post.modifiedDate,
                content: c,
                _tags: tags.map((t) => t.name),
                importance: importance,
            });
            i += 1;
        }
    }
    index.replaceAllObjects(records);
    yield wpdb.singleton.end();
    yield db.closeTypeOrmAndKnexConnections();
});
indexToAlgolia();
//# sourceMappingURL=indexToAlgolia.js.map