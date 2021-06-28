"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkParagraphs = exports.chunkSentences = exports.chunkWords = exports.htmlToPlaintext = void 0;
const Util_1 = require("./Util");
const chunk_text_1 = __importDefault(require("chunk-text"));
const html_to_text_1 = require("html-to-text");
const htmlToPlaintext = (html) => html_to_text_1.fromString(html, {
    tables: true,
    ignoreHref: true,
    wordwrap: false,
    uppercaseHeadings: false,
    ignoreImage: true,
});
exports.htmlToPlaintext = htmlToPlaintext;
const chunkWords = (text, maxChunkLength) => chunk_text_1.default(text, maxChunkLength);
exports.chunkWords = chunkWords;
const chunkSentences = (text, maxChunkLength) => {
    // See https://stackoverflow.com/a/25736082/1983739
    // Not perfect, just works in most cases
    const sentenceRegex = /(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\n)\s/g;
    const sentences = Util_1.flatten(text
        .split(sentenceRegex)
        .map((s) => s.length > maxChunkLength ? exports.chunkWords(s, maxChunkLength) : s))
        .map((s) => s.trim())
        .filter((s) => s)
        .reverse();
    const chunks = [];
    let chunk = sentences.pop();
    if (!chunk)
        return [];
    while (true) {
        const sentence = sentences.pop();
        if (!sentence) {
            chunks.push(chunk);
            break;
        }
        else {
            const nextChunk = chunk + " " + sentence;
            if (nextChunk.length > maxChunkLength) {
                chunks.push(chunk);
                chunk = sentence;
            }
            else
                chunk = nextChunk;
        }
    }
    return chunks;
};
exports.chunkSentences = chunkSentences;
// Chunks a given bit of text into an array of fragments less than or equal to maxChunkLength in size
// These chunks will honor sentence boundaries where possible
const chunkParagraphs = (text, maxChunkLength) => {
    const paragraphs = Util_1.flatten(text
        .split("\n\n")
        .map((p) => p.length > maxChunkLength
        ? exports.chunkSentences(p, maxChunkLength)
        : p))
        .map((p) => p.trim())
        .filter((p) => p)
        .reverse();
    const chunks = [];
    let chunk = paragraphs.pop();
    if (!chunk)
        return [];
    while (true) {
        const p = paragraphs.pop();
        if (!p) {
            chunks.push(chunk);
            break;
        }
        else {
            const nextChunk = chunk + "\n\n" + p;
            if (nextChunk.length > maxChunkLength) {
                chunks.push(chunk);
                chunk = p;
            }
            else
                chunk = nextChunk;
        }
    }
    return chunks;
};
exports.chunkParagraphs = chunkParagraphs;
//# sourceMappingURL=search.js.map