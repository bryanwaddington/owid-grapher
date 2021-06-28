"use strict";
// Comes in handy when the post update hook fails for some reason, and we need
// to batch update the grapher posts metadata without manually triggering individual WP updates.
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
const wpdb = __importStar(require("./wpdb"));
const db = __importStar(require("./db"));
const Post_1 = require("./model/Post");
const Util_1 = require("../clientUtils/Util");
const zeroDateString = "0000-00-00 00:00:00";
const syncPostsToGrapher = () => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield wpdb.singleton.query("select * from wp_posts where (post_type='page' or post_type='post') AND post_status != 'trash'");
    const doesExistInWordpress = Util_1.keyBy(rows, "ID");
    const existsInGrapher = yield Post_1.Post.select("id").from(db.knex().from(Post_1.Post.table));
    const doesExistInGrapher = Util_1.keyBy(existsInGrapher, "id");
    const toDelete = existsInGrapher
        .filter((p) => !doesExistInWordpress[p.id])
        .map((p) => p.id);
    const toInsert = rows.map((post) => {
        return {
            id: post.ID,
            title: post.post_title,
            slug: post.post_name.replace(/__/g, "/"),
            type: post.post_type,
            status: post.post_status,
            content: post.post_content,
            published_at: post.post_date_gmt === zeroDateString
                ? null
                : post.post_date_gmt,
            updated_at: post.post_modified_gmt === zeroDateString
                ? "1970-01-01 00:00:00"
                : post.post_modified_gmt,
        };
    });
    yield db.knex().transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        if (toDelete.length)
            yield t.whereIn("id", toDelete).delete().from(Post_1.Post.table);
        for (const row of toInsert) {
            if (doesExistInGrapher[row.id])
                yield t.update(row).where("id", "=", row.id).into(Post_1.Post.table);
            else
                yield t.insert(row).into(Post_1.Post.table);
        }
    }));
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield syncPostsToGrapher();
    }
    finally {
        yield wpdb.singleton.end();
        yield db.closeTypeOrmAndKnexConnections();
    }
});
main();
//# sourceMappingURL=syncPostsToGrapher.js.map