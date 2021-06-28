"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const formatting_1 = require("../formatting");
const PostCard = ({ post }) => {
    return (react_1.default.createElement("article", { className: "post-card" },
        react_1.default.createElement("a", { href: `/${post.path}` },
            post.imageUrl && (react_1.default.createElement("div", { className: "cover-image", style: {
                    backgroundImage: `url(${post.imageUrl})`,
                } })),
            react_1.default.createElement("div", { className: "content" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h3", null, post.title),
                    post.excerpt && (react_1.default.createElement("div", { className: "excerpt" }, post.excerpt))),
                react_1.default.createElement("div", { className: "entry-meta" },
                    react_1.default.createElement("span", { className: "authors" }, `By ${formatting_1.formatAuthors(post.authors)}`),
                    " ",
                    "\u2014 ",
                    react_1.default.createElement("time", null, formatting_1.formatDate(post.date)))))));
};
exports.default = PostCard;
//# sourceMappingURL=PostCard.js.map