"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nouns = exports.DEFAULT_SORT_ORDER = exports.TESTS_DATA_URL = exports.JHU_DATA_URL = void 0;
const CoreTableConstants_1 = require("../../coreTable/CoreTableConstants");
const CovidUtils_1 = require("./CovidUtils");
exports.JHU_DATA_URL = "https://covid.ourworldindata.org/data/jhu/full_data.csv";
exports.TESTS_DATA_URL = "http://localhost:8080/data/tests/latest/data.csv";
exports.DEFAULT_SORT_ORDER = CoreTableConstants_1.SortOrder.asc;
exports.nouns = {
    cases: CovidUtils_1.createNoun("case", "cases"),
    deaths: CovidUtils_1.createNoun("death", "deaths"),
    tests: CovidUtils_1.createNoun("test", "tests"),
    days: CovidUtils_1.createNoun("day", "days"),
};
//# sourceMappingURL=CovidConstants.js.map