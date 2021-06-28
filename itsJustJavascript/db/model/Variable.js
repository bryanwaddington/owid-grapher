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
exports.getDataValue = exports.writeVariableCSV = exports.getVariableData = exports.Variable = void 0;
const lodash = __importStar(require("lodash"));
const db = __importStar(require("../db"));
const Util_1 = require("../../clientUtils/Util");
var Variable;
(function (Variable) {
    Variable.table = "variables";
    function rows(plainRows) {
        for (const row of plainRows) {
            row.display = row.display ? JSON.parse(row.display) : undefined;
        }
        return plainRows;
    }
    Variable.rows = rows;
})(Variable = exports.Variable || (exports.Variable = {}));
function getVariableData(variableIds) {
    return __awaiter(this, void 0, void 0, function* () {
        variableIds = lodash.uniq(variableIds);
        const data = { variables: {}, entityKey: {} };
        const variableQuery = db.queryMysql(`
        SELECT v.*, v.shortUnit, d.name as datasetName, d.id as datasetId, s.id as s_id, s.name as s_name, s.description as s_description FROM variables as v
            JOIN datasets as d ON v.datasetId = d.id
            JOIN sources as s on v.sourceId = s.id
            WHERE v.id IN (?)
    `, [variableIds]);
        const dataQuery = db.queryMysql(`
            SELECT value, year, variableId as variableId, entities.id as entityId,
            entities.name as entityName, entities.code as entityCode
            FROM data_values
            LEFT JOIN entities ON data_values.entityId = entities.id
            WHERE data_values.variableId IN (?)
            ORDER BY variableId ASC, year ASC
    `, [variableIds]);
        const variables = yield variableQuery;
        for (const row of variables) {
            row.display = JSON.parse(row.display);
            const sourceDescription = JSON.parse(row.s_description);
            delete row.s_description;
            row.source = {
                id: row.s_id,
                name: row.s_name,
                dataPublishedBy: sourceDescription.dataPublishedBy || "",
                dataPublisherSource: sourceDescription.dataPublisherSource || "",
                link: sourceDescription.link || "",
                retrievedData: sourceDescription.retrievedData || "",
                additionalInfo: sourceDescription.additionalInfo || "",
            };
            data.variables[row.id] = lodash.extend({
                years: [],
                entities: [],
                values: [],
            }, row);
        }
        const results = yield dataQuery;
        for (const row of results) {
            const variable = data.variables[row.variableId];
            variable.years.push(row.year);
            variable.entities.push(row.entityId);
            const asNumber = parseFloat(row.value);
            if (!isNaN(asNumber))
                variable.values.push(asNumber);
            else
                variable.values.push(row.value);
            if (data.entityKey[row.entityId] === undefined) {
                data.entityKey[row.entityId] = {
                    name: row.entityName,
                    code: row.entityCode,
                };
            }
        }
        return data;
    });
}
exports.getVariableData = getVariableData;
// TODO use this in Dataset.writeCSV() maybe?
function writeVariableCSV(variableIds, stream) {
    return __awaiter(this, void 0, void 0, function* () {
        const variableQuery = db.queryMysql(`
        SELECT id, name
        FROM variables
        WHERE id IN (?)
    `, [variableIds]);
        const dataQuery = db.queryMysql(`
        SELECT
            data_values.variableId AS variableId,
            entities.name AS entity,
            data_values.year AS year,
            data_values.value AS value
        FROM
            data_values
            JOIN entities ON entities.id = data_values.entityId
            JOIN variables ON variables.id = data_values.variableId
        WHERE
            data_values.variableId IN (?)
        ORDER BY
            data_values.entityId ASC,
            data_values.year ASC
    `, [variableIds]);
        let variables = yield variableQuery;
        const variablesById = lodash.keyBy(variables, "id");
        // Throw an error if not all variables exist
        if (variables.length !== variableIds.length) {
            const fetchedVariableIds = variables.map((v) => v.id);
            const missingVariables = lodash.difference(variableIds, fetchedVariableIds);
            throw Error(`Variable IDs do not exist: ${missingVariables.join(", ")}`);
        }
        variables = variableIds.map((variableId) => variablesById[variableId]);
        const columns = ["Entity", "Year"].concat(variables.map((v) => v.name));
        stream.write(Util_1.arrToCsvRow(columns));
        const variableColumnIndex = {};
        for (const variable of variables) {
            variableColumnIndex[variable.id] = columns.indexOf(variable.name);
        }
        const data = yield dataQuery;
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
            row[variableColumnIndex[datum.variableId]] = datum.value;
        }
    });
}
exports.writeVariableCSV = writeVariableCSV;
const getDataValue = ({ variableId, entityId, year, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!variableId || !entityId)
        return;
    const queryStart = `
        SELECT value, year, variables.unit as unit, entities.name as entityName FROM data_values
        JOIN entities on entities.id = data_values.entityId
        JOIN variables on variables.id = data_values.variableId
        WHERE entities.id = ?
        AND variables.id= ?`;
    const queryStartVariables = [entityId, variableId];
    let row;
    if (year) {
        row = yield db.mysqlFirst(`${queryStart}
            AND data_values.year = ?`, [...queryStartVariables, year]);
    }
    else {
        row = yield db.mysqlFirst(`${queryStart}
            ORDER BY data_values.year DESC
            LIMIT 1`, queryStartVariables);
    }
    return {
        value: Number(row.value),
        year: Number(row.year),
        unit: row.unit,
        entityName: row.entityName,
    };
});
exports.getDataValue = getDataValue;
//# sourceMappingURL=Variable.js.map