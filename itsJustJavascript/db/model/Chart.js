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
var Chart_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrapherById = exports.OldChart = exports.Chart = void 0;
const typeorm_1 = require("typeorm");
const lodash = __importStar(require("lodash"));
const db = __importStar(require("../db"));
const Variable_1 = require("./Variable");
const User_1 = require("./User");
const ChartRevision_1 = require("./ChartRevision");
// XXX hardcoded filtering to public parent tags
const PUBLIC_TAG_PARENT_IDS = [
    1515,
    1507,
    1513,
    1504,
    1502,
    1509,
    1506,
    1501,
    1514,
    1511,
    1500,
    1503,
    1505,
    1508,
    1512,
    1510,
];
let Chart = Chart_1 = class Chart extends typeorm_1.BaseEntity {
    // Only considers published charts, because only in that case the mapping slug -> id is unique
    static mapSlugsToIds() {
        return __awaiter(this, void 0, void 0, function* () {
            const redirects = yield db.queryMysql(`SELECT chart_id, slug FROM chart_slug_redirects`);
            const rows = yield db.queryMysql(`
            SELECT
                id,
                JSON_UNQUOTE(JSON_EXTRACT(config, "$.slug")) AS slug
            FROM charts
            WHERE JSON_EXTRACT(config, "$.isPublished") IS TRUE
        `);
            const slugToId = {};
            for (const row of redirects) {
                slugToId[row.slug] = row.chart_id;
            }
            for (const row of rows) {
                slugToId[row.slug] = row.id;
            }
            return slugToId;
        });
    }
    static getBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const slugsById = yield this.mapSlugsToIds();
            return yield Chart_1.findOne({ id: slugsById[slug] });
        });
    }
    static setTags(chartId, tagIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const tagRows = tagIds.map((tagId) => [tagId, chartId]);
                yield t.execute(`DELETE FROM chart_tags WHERE chartId=?`, [chartId]);
                if (tagRows.length)
                    yield t.execute(`INSERT INTO chart_tags (tagId, chartId) VALUES ?`, [tagRows]);
                const tags = tagIds.length
                    ? (yield t.query("select parentId from tags where id in (?)", [
                        tagIds,
                    ]))
                    : [];
                const isIndexable = tags.some((t) => PUBLIC_TAG_PARENT_IDS.includes(t.parentId));
                yield t.execute("update charts set is_indexable = ? where id = ?", [
                    isIndexable,
                    chartId,
                ]);
            }));
        });
    }
    static assignTagsForCharts(charts) {
        return __awaiter(this, void 0, void 0, function* () {
            const chartTags = yield db.queryMysql(`
            SELECT ct.chartId, ct.tagId, t.name as tagName FROM chart_tags ct
            JOIN charts c ON c.id=ct.chartId
            JOIN tags t ON t.id=ct.tagId
        `);
            for (const chart of charts) {
                chart.tags = [];
            }
            const chartsById = lodash.keyBy(charts, (c) => c.id);
            for (const ct of chartTags) {
                const chart = chartsById[ct.chartId];
                if (chart)
                    chart.tags.push({ id: ct.tagId, name: ct.tagName });
            }
        });
    }
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield db.knexTable(Chart_1.table);
            for (const row of rows) {
                row.config = JSON.parse(row.config);
            }
            return rows; // This cast might be a lie?
        });
    }
};
Chart.table = "charts";
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Chart.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: "json" }),
    __metadata("design:type", Object)
], Chart.prototype, "config", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Chart.prototype, "lastEditedAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Chart.prototype, "lastEditedByUserId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Chart.prototype, "publishedAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Chart.prototype, "publishedByUserId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Chart.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Chart.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Chart.prototype, "starred", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Chart.prototype, "isExplorable", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.lastEditedCharts),
    __metadata("design:type", User_1.User)
], Chart.prototype, "lastEditedByUser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.publishedCharts),
    __metadata("design:type", User_1.User)
], Chart.prototype, "publishedByUser", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChartRevision_1.ChartRevision, (rev) => rev.chart),
    __metadata("design:type", Array)
], Chart.prototype, "logs", void 0);
Chart = Chart_1 = __decorate([
    typeorm_1.Entity("charts")
], Chart);
exports.Chart = Chart;
// TODO integrate this old logic with typeorm
class OldChart {
    constructor(id, config) {
        this.id = id;
        this.config = config;
        // XXX todo make the relationship between chart models and chart configuration more defined
        this.config.id = id;
    }
    static getBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield db.mysqlFirst(`SELECT id, config FROM charts WHERE JSON_EXTRACT(config, "$.slug") = ?`, [slug]);
            return new OldChart(row.id, JSON.parse(row.config));
        });
    }
    getVariableData() {
        return __awaiter(this, void 0, void 0, function* () {
            const variableIds = lodash.uniq(this.config.dimensions.map((d) => d.variableId));
            return Variable_1.getVariableData(variableIds);
        });
    }
}
exports.OldChart = OldChart;
OldChart.listFields = `
        charts.id,
        charts.config->>"$.title" AS title,
        charts.config->>"$.slug" AS slug,
        charts.config->>"$.type" AS type,
        charts.config->>"$.internalNotes" AS internalNotes,
        charts.config->>"$.variantName" AS variantName,
        charts.config->>"$.isPublished" AS isPublished,
        charts.config->>"$.tab" AS tab,
        JSON_EXTRACT(charts.config, "$.hasChartTab") = true AS hasChartTab,
        JSON_EXTRACT(charts.config, "$.hasMapTab") = true AS hasMapTab,
        charts.starred AS isStarred,
        charts.lastEditedAt,
        charts.lastEditedByUserId,
        lastEditedByUser.fullName AS lastEditedBy,
        charts.publishedAt,
        charts.publishedByUserId,
        publishedByUser.fullName AS publishedBy,
        charts.isExplorable AS isExplorable
    `;
const getGrapherById = (grapherId) => __awaiter(void 0, void 0, void 0, function* () {
    const grapher = (yield db.queryMysql(`SELECT id, config FROM charts WHERE id=?`, [
        grapherId,
    ]))[0];
    if (!grapher)
        return undefined;
    const config = JSON.parse(grapher.config);
    config.id = grapher.id;
    return config;
});
exports.getGrapherById = getGrapherById;
//# sourceMappingURL=Chart.js.map