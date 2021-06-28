"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartRevision = void 0;
const typeorm_1 = require("typeorm");
const Chart_1 = require("./Chart");
const User_1 = require("./User");
let ChartRevision = class ChartRevision extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ChartRevision.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ChartRevision.prototype, "chartId", void 0);
__decorate([
    typeorm_1.Column({ type: "json" }),
    __metadata("design:type", Object)
], ChartRevision.prototype, "config", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ChartRevision.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], ChartRevision.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], ChartRevision.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.editedCharts),
    __metadata("design:type", User_1.User)
], ChartRevision.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Chart_1.Chart, (chart) => chart.logs),
    __metadata("design:type", Chart_1.Chart)
], ChartRevision.prototype, "chart", void 0);
ChartRevision = __decorate([
    typeorm_1.Entity("chart_revisions")
], ChartRevision);
exports.ChartRevision = ChartRevision;
//# sourceMappingURL=ChartRevision.js.map