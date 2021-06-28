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
exports.DatabaseConnection = void 0;
const mysql = __importStar(require("mysql"));
class TransactionContext {
    constructor(conn) {
        this.conn = conn;
    }
    execute(queryStr, params) {
        return new Promise((resolve, reject) => {
            this.conn.query(queryStr, params, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    query(queryStr, params) {
        return new Promise((resolve, reject) => {
            this.conn.query(queryStr, params, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
}
// Promise wrapper for node-mysql with transaction support and some shorthands
class DatabaseConnection {
    constructor(config) {
        this.config = config;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pool = mysql.createPool(this.config);
            yield this.getConnection();
        });
    }
    getConnection() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((poolerr, conn) => {
                if (poolerr) {
                    reject(poolerr);
                }
                else {
                    resolve(conn);
                }
            });
        });
    }
    transaction(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const conn = yield this.getConnection();
            const transactionContext = new TransactionContext(conn);
            try {
                yield transactionContext.execute("START TRANSACTION");
                const result = yield callback(transactionContext);
                yield transactionContext.execute("COMMIT");
                return result;
            }
            catch (err) {
                yield transactionContext.execute("ROLLBACK");
                throw err;
            }
            finally {
                transactionContext.conn.release();
            }
        });
    }
    query(queryStr, params) {
        return new Promise((resolve, reject) => {
            this.pool.query(queryStr, params, (err, rows) => {
                if (err) {
                    console.log(`ERROR with query::\n${queryStr}\n::ERROR`);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }
    get(queryStr, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.query(queryStr, params))[0];
        });
    }
    end() {
        this.pool.end();
    }
}
exports.DatabaseConnection = DatabaseConnection;
//# sourceMappingURL=DatabaseConnection.js.map