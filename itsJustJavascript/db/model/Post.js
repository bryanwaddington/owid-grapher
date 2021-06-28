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
exports.Post = void 0;
const db = __importStar(require("../db"));
var Post;
(function (Post) {
    Post.table = "posts";
    Post.select = (...args) => ({
        from: (query) => query.select(...args),
    });
    Post.tagsByPostId = () => __awaiter(this, void 0, void 0, function* () {
        const postTags = yield db.queryMysql(`
            SELECT pt.post_id AS postId, pt.tag_id AS tagId, t.name as tagName FROM post_tags pt
            JOIN posts p ON p.id=pt.post_id
            JOIN tags t ON t.id=pt.tag_id
        `);
        const tagsByPostId = new Map();
        for (const pt of postTags) {
            const tags = tagsByPostId.get(pt.postId) || [];
            tags.push({ id: pt.tagId, name: pt.tagName });
            tagsByPostId.set(pt.postId, tags);
        }
        return tagsByPostId;
    });
    Post.setTags = (postId, tagIds) => __awaiter(this, void 0, void 0, function* () {
        return yield db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
            const tagRows = tagIds.map((tagId) => [tagId, postId]);
            yield t.execute(`DELETE FROM post_tags WHERE post_id=?`, [postId]);
            if (tagRows.length)
                yield t.execute(`INSERT INTO post_tags (tag_id, post_id) VALUES ?`, [tagRows]);
        }));
    });
    Post.bySlug = (slug) => __awaiter(this, void 0, void 0, function* () { return (yield db.knexTable("posts").where({ slug: slug }))[0]; });
})(Post = exports.Post || (exports.Post = {}));
//# sourceMappingURL=Post.js.map