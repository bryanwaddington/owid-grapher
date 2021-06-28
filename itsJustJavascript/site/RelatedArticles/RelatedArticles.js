"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatedArticles = void 0;
const react_1 = __importDefault(require("react"));
const serverSettings_1 = require("../../settings/serverSettings");
const RelatedArticles = ({ articles, }) => {
    return (react_1.default.createElement("ul", { className: "research" }, articles.map((article) => (react_1.default.createElement("li", { key: article.slug },
        react_1.default.createElement("a", { href: `${serverSettings_1.BAKED_BASE_URL}/${article.slug}` }, article.title))))));
};
exports.RelatedArticles = RelatedArticles;
//# sourceMappingURL=RelatedArticles.js.map