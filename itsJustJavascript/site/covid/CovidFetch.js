"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTestsData = exports.fetchJHUData = void 0;
const d3_dsv_1 = require("d3-dsv");
const moment_1 = __importDefault(require("moment"));
const Util_1 = require("../../clientUtils/Util");
const CovidConstants_1 = require("./CovidConstants");
function _fetchJHUData() {
    return __awaiter(this, void 0, void 0, function* () {
        const responseText = yield Util_1.retryPromise(() => Util_1.fetchText(CovidConstants_1.JHU_DATA_URL));
        const rows = d3_dsv_1.csvParse(responseText).map((row) => {
            return {
                date: new Date(row.date),
                location: row.location,
                totalCases: Util_1.parseIntOrUndefined(row.total_cases),
                totalDeaths: Util_1.parseIntOrUndefined(row.total_deaths),
                newCases: Util_1.parseIntOrUndefined(row.new_cases),
                newDeaths: Util_1.parseIntOrUndefined(row.new_deaths),
            };
        });
        return rows;
    });
}
// We want to memoize (cache) the return value of that fetch, so we don't need to load
// the file multiple times if we request the data more than once
exports.fetchJHUData = Util_1.memoize(_fetchJHUData);
function fetchTestsData() {
    return __awaiter(this, void 0, void 0, function* () {
        const responseText = yield Util_1.retryPromise(() => Util_1.fetchText(CovidConstants_1.TESTS_DATA_URL));
        const rows = d3_dsv_1.csvParse(responseText).map((row) => {
            return {
                date: moment_1.default(row["Date to which estimate refers (dd mmm yyyy)"], "DD MMMM YYYY").toDate(),
                location: row["Entity string"],
                tests: {
                    totalTests: Util_1.parseIntOrUndefined(row["Total tests/ individuals tested"]),
                    totalPositiveTests: Util_1.parseIntOrUndefined(row["Positive tests/ confirmed cases (refer to 'Remarks')"]),
                    sourceURL: row["Source URL"],
                    sourceLabel: row["Source label"],
                    publicationDate: moment_1.default(`${row["Date of source publication (dd mmm yyyy)"]} ${row["Time of source publication (hh:mm)"]}`, "DD MMMM YYYY HH:mm").toDate(),
                    remarks: row["Remarks"],
                    population: Util_1.parseIntOrUndefined(row["Population"]),
                    nonOfficial: Util_1.parseIntOrUndefined(row["Non-official / Non-verifiable (=1)"]) === 1,
                },
            };
        });
        return rows;
    });
}
exports.fetchTestsData = fetchTestsData;
//# sourceMappingURL=CovidFetch.js.map