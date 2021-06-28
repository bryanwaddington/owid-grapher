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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knexRaw = exports.knexTable = exports.knex = exports.closeTypeOrmAndKnexConnections = exports.mysqlFirst = exports.execute = exports.queryMysql = exports.transaction = exports.TransactionContext = exports.getConnection = void 0;
const mysql = __importStar(require("mysql"));
const typeorm = __importStar(require("typeorm"));
const knex_1 = __importDefault(require("knex"));
const serverSettings_1 = require("../settings/serverSettings");
const cleanup_1 = require("./cleanup");
let typeormConnection;
const getConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (typeormConnection)
        return typeormConnection;
    try {
        typeormConnection = typeorm.getConnection();
    }
    catch (err) {
        if (err.name === "ConnectionNotFoundError")
            typeormConnection = yield typeorm.createConnection();
        else
            throw err;
    }
    cleanup_1.registerExitHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        if (typeormConnection)
            yield typeormConnection.close();
    }));
    return typeormConnection;
});
exports.getConnection = getConnection;
class TransactionContext {
    constructor(manager) {
        this.manager = manager;
    }
    execute(queryStr, params) {
        return this.manager.query(params ? mysql.format(queryStr, params) : queryStr);
    }
    query(queryStr, params) {
        return this.manager.query(params ? mysql.format(queryStr, params) : queryStr);
    }
}
exports.TransactionContext = TransactionContext;
const transaction = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield exports.getConnection()).transaction((manager) => __awaiter(void 0, void 0, void 0, function* () { return callback(new TransactionContext(manager)); }));
});
exports.transaction = transaction;
const queryMysql = (queryStr, params) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield exports.getConnection();
    return conn.query(params ? mysql.format(queryStr, params) : queryStr);
});
exports.queryMysql = queryMysql;
// For operations that modify data (TODO: handling to check query isn't used for this)
exports.execute = exports.queryMysql;
// Return the first match from a mysql query
const mysqlFirst = (queryStr, params) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield exports.queryMysql(queryStr, params))[0];
});
exports.mysqlFirst = mysqlFirst;
const closeTypeOrmAndKnexConnections = () => __awaiter(void 0, void 0, void 0, function* () {
    if (typeormConnection)
        yield typeormConnection.close();
    if (knexInstance)
        yield knexInstance.destroy();
});
exports.closeTypeOrmAndKnexConnections = closeTypeOrmAndKnexConnections;
let knexInstance;
const knex = () => {
    if (knexInstance)
        return knexInstance;
    knexInstance = knex_1.default({
        client: "mysql",
        connection: {
            host: serverSettings_1.DB_HOST,
            user: serverSettings_1.DB_USER,
            password: serverSettings_1.DB_PASS,
            database: serverSettings_1.DB_NAME,
            port: serverSettings_1.DB_PORT,
            typeCast: (field, next) => {
                if (field.type === "TINY" && field.length === 1) {
                    return field.string() === "1"; // 1 = true, 0 = false
                }
                return next();
            },
        },
    });
    cleanup_1.registerExitHandler(() => __awaiter(void 0, void 0, void 0, function* () {
        if (knexInstance)
            yield knexInstance.destroy();
    }));
    return knexInstance;
};
exports.knex = knex;
const knexTable = (table) => exports.knex().table(table);
exports.knexTable = knexTable;
const knexRaw = (str) => exports.knex().raw(str);
exports.knexRaw = knexRaw;
//# sourceMappingURL=db.js.map