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
exports.CSVStreamParser = exports.parseCSV = void 0;
const csv_parse_1 = __importDefault(require("csv-parse"));
const parseCSV = (csv) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        csv_parse_1.default(csv, { relax_column_count: true, skip_empty_lines: true, trim: true }, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
});
exports.parseCSV = parseCSV;
class CSVStreamParser {
    constructor(input) {
        this.isEnded = false;
        this.isReadable = false;
        const parser = csv_parse_1.default({
            relax_column_count: true,
            skip_empty_lines: true,
            trim: true,
        });
        parser.on("readable", () => {
            this.isReadable = true;
            this.update();
        });
        parser.on("error", (err) => {
            this.error = err;
            this.update();
        });
        parser.on("end", () => {
            this.isEnded = true;
            this.update();
        });
        input.pipe(parser);
        this.parser = parser;
    }
    update() {
        if (!this.rowResolve || !this.rowReject)
            return;
        if (this.error) {
            this.rowReject(this.error);
            this.rowResolve = undefined;
            this.rowReject = undefined;
        }
        else if (this.isEnded) {
            this.rowResolve(undefined);
            this.rowResolve = undefined;
            this.rowReject = undefined;
        }
        else if (this.isReadable) {
            const row = this.parser.read();
            if (row) {
                this.rowResolve(row);
                this.rowResolve = undefined;
                this.rowReject = undefined;
            }
            else {
                this.isReadable = false;
            }
        }
    }
    nextRow() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.rowResolve = resolve;
                this.rowReject = reject;
                this.update();
            });
        });
    }
}
exports.CSVStreamParser = CSVStreamParser;
//# sourceMappingURL=csv.js.map