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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Chart_1 = require("./Chart");
const Dataset_1 = require("./Dataset");
const ChartRevision_1 = require("./ChartRevision");
const hashers_1 = require("../hashers");
let User = class User extends typeorm_1.BaseEntity {
    setPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const h = new hashers_1.BCryptHasher();
            this.password = yield h.encode(password);
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ length: 128 }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isSuperuser", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], User.prototype, "lastSeen", void 0);
__decorate([
    typeorm_1.OneToMany(() => Chart_1.Chart, (chart) => chart.lastEditedByUser),
    __metadata("design:type", Array)
], User.prototype, "lastEditedCharts", void 0);
__decorate([
    typeorm_1.OneToMany(() => Chart_1.Chart, (chart) => chart.publishedByUser),
    __metadata("design:type", Array)
], User.prototype, "publishedCharts", void 0);
__decorate([
    typeorm_1.OneToMany(() => ChartRevision_1.ChartRevision, (rev) => rev.user),
    __metadata("design:type", Array)
], User.prototype, "editedCharts", void 0);
__decorate([
    typeorm_1.OneToMany(() => Dataset_1.Dataset, (dataset) => dataset.createdByUser),
    __metadata("design:type", Array)
], User.prototype, "createdDatasets", void 0);
User = __decorate([
    typeorm_1.Entity("users")
], User);
exports.User = User;
//# sourceMappingURL=User.js.map