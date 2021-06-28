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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const db = __importStar(require("./db"));
const lodash = __importStar(require("lodash"));
const serverSettings_1 = require("../settings/serverSettings");
const execWrapper_1 = require("./execWrapper");
const namespacesArg = process.argv[2];
if (!namespacesArg) {
    const programName = path.basename(process.argv[1]);
    console.log(`Usage:\n${programName} [namespaces]`);
    process.exit(1);
}
const namespaces = namespacesArg.split(",");
function dataExport() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.getConnection();
        const tmpFilename = `/tmp/owid_chartdata_${namespaces.join(",")}.sql`;
        // This will also retrieve variables that are not in the specified namespace
        // but are used in a chart that has at least one variable from the specified
        // namespace.
        // This is necessary in order to reproduce the charts from the live grapher
        // accurately.
        const rows = yield db.queryMysql(`
        SELECT DISTINCT chart_dimensions.variableId
        FROM chart_dimensions
        WHERE chart_dimensions.chartId IN (
            SELECT DISTINCT charts.id
            FROM charts
            JOIN chart_dimensions ON chart_dimensions.chartId = charts.id
            JOIN variables ON variables.id = chart_dimensions.variableId
            JOIN datasets ON datasets.id = variables.datasetId
            WHERE datasets.namespace IN (?)
        )
    `, [namespaces]);
        const variableIds = rows.map((row) => row.variableId);
        console.log(`Exporting data for ${variableIds.length} variables to ${tmpFilename}`);
        yield execWrapper_1.execWrapper(`rm -f ${tmpFilename}`);
        // Expose password to mysqldump
        // Safer than passing as an argument because it's not shown in 'ps aux'
        process.env.MYSQL_PWD = serverSettings_1.DB_PASS;
        let count = 0;
        for (const chunk of lodash.chunk(variableIds, 100)) {
            yield execWrapper_1.execWrapper(`mysqldump --default-character-set=utf8mb4 --no-tablespaces --no-create-info -u '${serverSettings_1.DB_USER}' -h '${serverSettings_1.DB_HOST}' -P ${serverSettings_1.DB_PORT} ${serverSettings_1.DB_NAME} data_values --where="variableId IN (${chunk.join(",")})" >> ${tmpFilename}`);
            count += chunk.length;
            console.log(count);
        }
        yield db.closeTypeOrmAndKnexConnections();
    });
}
dataExport();
//# sourceMappingURL=exportChartDataNamespace.js.map