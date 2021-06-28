"use strict";
// This is used by owid-wordpress
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
const minimist_1 = __importDefault(require("minimist"));
const serverSettings_1 = require("../settings/serverSettings");
const DeployQueueServer_1 = require("./DeployQueueServer");
const cleanup_1 = require("../db/cleanup");
const Post_1 = require("../db/model/Post");
const wpdb = __importStar(require("../db/wpdb"));
const db = __importStar(require("../db/db"));
const argv = minimist_1.default(process.argv.slice(2));
const zeroDateString = "0000-00-00 00:00:00";
// Sync post from the wordpress database to OWID database
const syncPostToGrapher = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield wpdb.singleton.query("SELECT * FROM wp_posts WHERE ID = ? AND post_status != 'trash'", [postId]);
    const matchingRows = yield db.knexTable(Post_1.Post.table).where({ id: postId });
    const existsInGrapher = !!matchingRows.length;
    const wpPost = rows[0];
    const postRow = wpPost
        ? {
            id: wpPost.ID,
            title: wpPost.post_title,
            slug: wpPost.post_name.replace(/__/g, "/"),
            type: wpPost.post_type,
            status: wpPost.post_status,
            content: wpPost.post_content,
            published_at: wpPost.post_date_gmt === zeroDateString
                ? null
                : wpPost.post_date_gmt,
            updated_at: wpPost.post_modified_gmt === zeroDateString
                ? "1970-01-01 00:00:00"
                : wpPost.post_modified_gmt,
        }
        : undefined;
    yield db.knex().transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!postRow && existsInGrapher)
            // Delete from grapher
            yield transaction.table(Post_1.Post.table).where({ id: postId }).delete();
        else if (postRow && !existsInGrapher)
            yield transaction.table(Post_1.Post.table).insert(postRow);
        else if (postRow && existsInGrapher)
            yield transaction
                .table(Post_1.Post.table)
                .where("id", "=", postRow.id)
                .update(postRow);
    }));
    const newPost = (yield Post_1.Post.select("slug").from(db.knexTable(Post_1.Post.table).where({ id: postId })))[0];
    return newPost ? newPost.slug : undefined;
});
const main = (email, name, postId, postSlug) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email, name, postId);
    const slug = yield syncPostToGrapher(postId);
    if (serverSettings_1.BAKE_ON_CHANGE)
        yield new DeployQueueServer_1.DeployQueueServer().enqueueChange({
            timeISOString: new Date().toISOString(),
            authorName: name,
            authorEmail: email,
            message: slug ? `Updating ${slug}` : `Deleting ${postSlug}`,
        });
    cleanup_1.exit();
});
main(argv._[0], argv._[1], parseInt(argv._[2]), argv._[3]);
//# sourceMappingURL=postUpdatedHook.js.map