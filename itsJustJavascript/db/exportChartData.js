"use strict";
// Script to export the data_values for all variables attached to charts
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
const lodash = __importStar(require("lodash"));
const minimist_1 = __importDefault(require("minimist"));
const serverSettings_1 = require("../settings/serverSettings");
const execWrapper_1 = require("./execWrapper");
const argv = minimist_1.default(process.argv.slice(2));
const filePath = argv._[0] || "/tmp/owid_chartdata.sql";
const dataExport = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.getConnection();
    const variablesToExportQuery = `
        SELECT DISTINCT cd.variableId FROM chart_dimensions cd
        WHERE NOT EXISTS (select * from tags t join chart_tags ct on ct.tagId = t.id where ct.chartId=cd.chartId and t.name='Private')
    `;
    const variableIds = (yield db.queryMysql(variablesToExportQuery)).map((row) => row.variableId);
    console.log(`Exporting data for ${variableIds.length} variables to ${filePath}`);
    yield execWrapper_1.execWrapper(`rm -f ${filePath}`);
    // Expose password to mysqldump
    // Safer than passing as an argument because it's not shown in 'ps aux'
    process.env.MYSQL_PWD = serverSettings_1.DB_PASS;
    let count = 0;
    for (const chunk of lodash.chunk(variableIds, 100)) {
        yield execWrapper_1.execWrapper(`mysqldump --default-character-set=utf8mb4 --no-tablespaces --no-create-info -u '${serverSettings_1.DB_USER}' -h '${serverSettings_1.DB_HOST}' -P ${serverSettings_1.DB_PORT} ${serverSettings_1.DB_NAME} data_values --where="variableId IN (${chunk.join(",")})" >> ${filePath}`);
        count += chunk.length;
        console.log(count);
    }
    yield db.closeTypeOrmAndKnexConnections();
});
dataExport();
//# sourceMappingURL=exportChartData.js.map