"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.formatAuthors = exports.formatReusableBlock = void 0;
const Util_1 = require("../clientUtils/Util");
const serverSettings_1 = require("../settings/serverSettings");
// Standardize urls
const formatLinks = (html) => html
    .replace(new RegExp(serverSettings_1.WORDPRESS_URL, "g"), serverSettings_1.BAKED_BASE_URL)
    .replace(new RegExp("https?://owid.cloud", "g"), serverSettings_1.BAKED_BASE_URL)
    .replace(new RegExp("https?://ourworldindata.org", "g"), serverSettings_1.BAKED_BASE_URL);
const formatReusableBlock = (html) => formatLinks(html);
exports.formatReusableBlock = formatReusableBlock;
const formatAuthors = (authors, requireMax) => {
    if (requireMax && authors.indexOf("Max Roser") === -1)
        authors.push("Max Roser");
    let authorsText = authors.slice(0, -1).join(", ");
    if (authorsText.length === 0)
        authorsText = authors[0];
    else
        authorsText += ` and ${Util_1.last(authors)}`;
    return authorsText;
};
exports.formatAuthors = formatAuthors;
const formatDate = (date) => date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
});
exports.formatDate = formatDate;
//# sourceMappingURL=formatting.js.map