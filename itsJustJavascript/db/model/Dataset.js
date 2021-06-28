"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var Dataset_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dataset = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Source_1 = require("./Source");
const Variable_1 = require("./Variable");
const db = __importStar(require("../db"));
const Util_1 = require("../../clientUtils/Util");
const filenamify_1 = __importDefault(require("filenamify"));
let Dataset = Dataset_1 = class Dataset extends typeorm_1.BaseEntity {
    // Export dataset variables to CSV (not including metadata)
    static writeCSV(datasetId, stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const csvHeader = ["Entity", "Year"];
            const variables = yield db.queryMysql(`SELECT name, id FROM variables v WHERE v.datasetId=? ORDER BY v.columnOrder ASC, v.id ASC`, [datasetId]);
            for (const variable of variables) {
                csvHeader.push(variable.name);
            }
            const columnIndexByVariableId = {};
            for (const variable of variables) {
                columnIndexByVariableId[variable.id] = csvHeader.indexOf(variable.name);
            }
            stream.write(Util_1.arrToCsvRow(csvHeader));
            const data = yield db.queryMysql(`
            SELECT e.name AS entity, dv.year, dv.value, dv.variableId FROM data_values dv
            JOIN variables v ON v.id=dv.variableId
            JOIN datasets d ON v.datasetId=d.id
            JOIN entities e ON dv.entityId=e.id
            WHERE d.id=?
            ORDER BY e.name ASC, dv.year ASC, v.columnOrder ASC, dv.variableId ASC`, [datasetId]);
            let row = [];
            for (const datum of data) {
                if (datum.entity !== row[0] || datum.year !== row[1]) {
                    // New row
                    if (row.length) {
                        stream.write(Util_1.arrToCsvRow(row));
                    }
                    row = [datum.entity, datum.year];
                    for (const variable of variables) {
                        row.push("");
                    }
                }
                row[columnIndexByVariableId[datum.variableId]] = datum.value;
            }
            // Final row
            stream.write(Util_1.arrToCsvRow(row));
            stream.end();
        });
    }
    static setTags(datasetId, tagIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const tagRows = tagIds.map((tagId) => [tagId, datasetId]);
                yield t.execute(`DELETE FROM dataset_tags WHERE datasetId=?`, [
                    datasetId,
                ]);
                if (tagRows.length)
                    yield t.execute(`INSERT INTO dataset_tags (tagId, datasetId) VALUES ?`, [tagRows]);
            }));
        });
    }
    toCSV() {
        return __awaiter(this, void 0, void 0, function* () {
            let csv = "";
            yield Dataset_1.writeCSV(this.id, {
                write: (s) => (csv += s),
                end: () => null,
            });
            return csv;
        });
    }
    get filename() {
        return filenamify_1.default(this.name);
    }
    get slug() {
        return Util_1.slugify(this.name);
    }
    // Return object representing datapackage.json for this dataset
    toDatapackage() {
        return __awaiter(this, void 0, void 0, function* () {
            // XXX
            const sources = yield Source_1.Source.find({ datasetId: this.id });
            const variables = (yield db
                .knexTable(Variable_1.Variable.table)
                .where({ datasetId: this.id }));
            const tags = yield db.queryMysql(`SELECT t.id, t.name FROM dataset_tags dt JOIN tags t ON t.id=dt.tagId WHERE dt.datasetId=?`, [this.id]);
            const initialFields = [
                { name: "Entity", type: "string" },
                { name: "Year", type: "year" },
            ];
            const dataPackage = {
                name: this.name,
                title: this.name,
                id: this.id,
                description: (sources[0] &&
                    sources[0].description &&
                    sources[0].description.additionalInfo) ||
                    "",
                sources: sources.map((s) => s.toDatapackage()),
                owidTags: tags.map((t) => t.name),
                resources: [
                    {
                        path: `${this.name}.csv`,
                        schema: {
                            fields: initialFields.concat(variables.map((v) => ({
                                name: v.name,
                                type: "any",
                                description: v.description,
                                owidDisplaySettings: v.display,
                            }))),
                        },
                    },
                ],
            };
            return dataPackage;
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Dataset.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Dataset.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: "owid" }),
    __metadata("design:type", String)
], Dataset.prototype, "namespace", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Dataset.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Dataset.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Dataset.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Dataset.prototype, "metadataEditedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Dataset.prototype, "metadataEditedByUserId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Dataset.prototype, "dataEditedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Dataset.prototype, "dataEditedByUserId", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Dataset.prototype, "isPrivate", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.createdDatasets),
    __metadata("design:type", User_1.User
    // Export dataset variables to CSV (not including metadata)
    )
], Dataset.prototype, "createdByUser", void 0);
Dataset = Dataset_1 = __decorate([
    typeorm_1.Entity("datasets"),
    typeorm_1.Unique(["name", "namespace"])
], Dataset);
exports.Dataset = Dataset;
//# sourceMappingURL=Dataset.js.map