import * as typeorm from "typeorm";
import Knex from "knex";
export declare const getConnection: () => Promise<typeorm.Connection>;
export declare class TransactionContext {
    manager: typeorm.EntityManager;
    constructor(manager: typeorm.EntityManager);
    execute(queryStr: string, params?: any[]): Promise<any>;
    query(queryStr: string, params?: any[]): Promise<any>;
}
export declare const transaction: <T>(callback: (t: TransactionContext) => Promise<T>) => Promise<T>;
export declare const queryMysql: (queryStr: string, params?: any[] | undefined) => Promise<any>;
export declare const execute: (queryStr: string, params?: any[] | undefined) => Promise<any>;
export declare const mysqlFirst: (queryStr: string, params?: any[] | undefined) => Promise<any>;
export declare const closeTypeOrmAndKnexConnections: () => Promise<void>;
export declare const knex: () => Knex<any, any[]>;
export declare const knexTable: (table: string) => Knex.QueryBuilder<Record<string, unknown>, {
    _base: unknown;
    _hasSelection: false;
    _keys: never;
    _aliases: Record<string, unknown>;
    _single: false;
    _intersectProps: Record<string, unknown>;
    _unionProps: never;
}[] | ({
    _base: unknown;
    _hasSelection: boolean;
    _keys: string;
    _aliases: Record<string, unknown>;
    _single: boolean;
    _intersectProps: Record<string, unknown>;
    _unionProps: unknown;
} | {
    _base: unknown;
    _hasSelection: false;
    _keys: never;
    _aliases: Record<string, unknown>;
    _single: false;
    _intersectProps: Record<string, unknown>;
    _unionProps: never;
})[]>;
export declare const knexRaw: (str: string) => Knex.Raw<any>;
//# sourceMappingURL=db.d.ts.map