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
exports.Source = void 0;
const typeorm_1 = require("typeorm");
let Source = class Source extends typeorm_1.BaseEntity {
    // To datapackage json format
    toDatapackage() {
        return Object.assign({}, { name: this.name }, this.description);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Source.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Source.prototype, "datasetId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Source.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: "{}", type: "json" }),
    __metadata("design:type", Object)
], Source.prototype, "description", void 0);
Source = __decorate([
    typeorm_1.Entity("sources")
], Source);
exports.Source = Source;
//# sourceMappingURL=Source.js.map