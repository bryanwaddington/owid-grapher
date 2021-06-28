"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeJSONFromHTML = exports.serializeJSONForHTML = void 0;
const jsonCommentDelimiter = "\n//EMBEDDED_JSON\n";
// Stringifies JSON for placing into an arbitrary doc, for later extraction without parsing the whole doc
const serializeJSONForHTML = (obj, delimiter = jsonCommentDelimiter) => `${delimiter}${obj === undefined ? "" : JSON.stringify(obj, null, 2)}${delimiter}`;
exports.serializeJSONForHTML = serializeJSONForHTML;
const deserializeJSONFromHTML = (html, delimiter = jsonCommentDelimiter) => {
    const json = html.split(delimiter)[1];
    return json === undefined || json === "" ? undefined : JSON.parse(json);
};
exports.deserializeJSONFromHTML = deserializeJSONFromHTML;
//# sourceMappingURL=serializers.js.map