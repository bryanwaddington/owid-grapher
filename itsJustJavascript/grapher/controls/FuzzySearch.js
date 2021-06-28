"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlight = exports.FuzzySearch = void 0;
const Util_1 = require("../../clientUtils/Util");
const fuzzysort_1 = __importDefault(require("fuzzysort"));
class FuzzySearch {
    constructor(data, key) {
        this.datamap = Util_1.keyBy(data, key);
        this.strings = data.map((d) => fuzzysort_1.default.prepare(d[key]));
    }
    search(input) {
        return fuzzysort_1.default
            .go(input, this.strings)
            .map((result) => this.datamap[result.target]);
    }
    single(input, target) {
        return fuzzysort_1.default.single(input, target);
    }
    highlight(input, target) {
        var _a;
        const result = fuzzysort_1.default.single(input, target);
        return (_a = highlight(result)) !== null && _a !== void 0 ? _a : target;
    }
}
exports.FuzzySearch = FuzzySearch;
function highlight(result) {
    // The type definition of fuzzysort.highlight is wrong: It won't accept `undefined` as input,
    // but will happily accept `null`. That's why we use this wrapper here so we can actually call it.
    // Don't call fuzzysort.highlight directly if the value can be null or undefined, since one will
    // result in a type error and the other in a runtime error!
    return fuzzysort_1.default.highlight(result);
}
exports.highlight = highlight;
//# sourceMappingURL=FuzzySearch.js.map