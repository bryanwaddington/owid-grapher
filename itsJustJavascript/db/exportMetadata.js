"use strict";
// Script to export everything in the database except sensitive info and data_values (which is big)
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("./db"));
const fs = __importStar(require("fs-extra"));
const minimist_1 = __importDefault(require("minimist"));
const serverSettings_1 = require("../settings/serverSettings");
const execWrapper_1 = require("./execWrapper");
const argv = minimist_1.default(process.argv.slice(2));
const withPasswords = argv["with-passwords"];
const filePath = argv._[0] ||
    (!withPasswords
        ? "/tmp/owid_metadata.sql"
        : "/tmp/owid_metadata_with_passwords.sql");
const excludeTables = [
    "sessions",
    "user_invitations",
    "dataset_files",
    "data_values",
];
function dataExport() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.getConnection();
        console.log(`Exporting database structure and metadata to ${filePath}...`);
        // Expose password to mysqldump
        // Safer than passing as an argument because it's not shown in 'ps aux'
        process.env.MYSQL_PWD = serverSettings_1.DB_PASS;
        // Dump all tables including schema but exclude the rows of data_values
        yield execWrapper_1.execWrapper(`mysqldump --default-character-set=utf8mb4 --no-tablespaces -u '${serverSettings_1.DB_USER}' -h '${serverSettings_1.DB_HOST}' -P ${serverSettings_1.DB_PORT} ${serverSettings_1.DB_NAME} ${excludeTables
            .map((tableName) => `--ignore-table=${serverSettings_1.DB_NAME}.${tableName}`)
            .join(" ")} -r ${filePath}`);
        yield execWrapper_1.execWrapper(`mysqldump --default-character-set=utf8mb4 --no-tablespaces -u '${serverSettings_1.DB_USER}' -h '${serverSettings_1.DB_HOST}' -P ${serverSettings_1.DB_PORT} --no-data ${serverSettings_1.DB_NAME} ${excludeTables.join(" ")} >> ${filePath}`);
        if (!withPasswords) {
            // Strip passwords
            yield execWrapper_1.execWrapper(`sed -i -e "s/bcrypt[^']*//g" ${filePath}`);
            // Add default admin user
            yield fs.appendFile(filePath, "INSERT INTO users (`password`, `isSuperuser`, `email`, `fullName`, `createdAt`, `updatedAt`, `isActive`) VALUES ('bcrypt$$2b$12$EXfM7cWsjlNchpinv.j6KuOwK92hihg5r3fNssty8tLCUpOubST9u', 1, 'admin@example.com', 'Admin User', '2016-01-01 00:00:00', '2016-01-01 00:00:00', 1);\n");
        }
        yield db.closeTypeOrmAndKnexConnections();
    });
}
dataExport();
//# sourceMappingURL=exportMetadata.js.map