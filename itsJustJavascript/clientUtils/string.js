"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCaseProperties = exports.findUrlsInText = void 0;
const URL_REGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
const findUrlsInText = (str) => str.match(URL_REGEX) || [];
exports.findUrlsInText = findUrlsInText;
const snakeToCamel = (str) => str.replace(/(\_\w)/g, (char) => char[1].toUpperCase());
const camelCaseProperties = (obj) => {
    const newObj = {};
    for (const key in obj) {
        newObj[snakeToCamel(key)] = obj[key];
    }
    return newObj;
};
exports.camelCaseProperties = camelCaseProperties;
//# sourceMappingURL=string.js.map