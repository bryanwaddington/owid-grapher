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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameCountries1607505305417 = void 0;
const renameMap = {
    Swaziland: "Eswatini",
    Macedonia: "North Macedonia",
    "Czech Republic": "Czechia",
};
class RenameCountries1607505305417 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [oldName, newName] of Object.entries(renameMap)) {
                const duplicateEntity = yield queryRunner.query(`
                SELECT id
                FROM entities
                WHERE name = ?
            `, [newName]);
                if (duplicateEntity[0]) {
                    const duplicateEntityId = duplicateEntity[0].id;
                    const existingEntity = yield queryRunner.query(`
                    SELECT id
                    FROM entities
                    WHERE name = ?
                `, [oldName]);
                    const existingEntityId = existingEntity[0].id;
                    yield queryRunner.query(`
                    UPDATE data_values
                    SET entityId = ?
                    WHERE entityId = ?
                `, [existingEntityId, duplicateEntityId]);
                    yield queryRunner.query(`
                    DELETE FROM entities
                    WHERE id = ?
                `, [duplicateEntityId]);
                }
                yield queryRunner.query(`
                UPDATE entities
                SET name = ?
                WHERE name = ?
            `, [newName, oldName]);
                yield queryRunner.query(`
                UPDATE country_name_tool_countrydata
                SET owid_name = ?
                WHERE owid_name = ?
            `, [newName, oldName]);
            }
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.RenameCountries1607505305417 = RenameCountries1607505305417;
//# sourceMappingURL=1607505305417-RenameCountries.js.map