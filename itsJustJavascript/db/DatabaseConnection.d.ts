import * as mysql from "mysql";
declare class TransactionContext {
    conn: mysql.PoolConnection;
    constructor(conn: mysql.PoolConnection);
    execute(queryStr: string, params?: any[]): Promise<any>;
    query(queryStr: string, params?: any[]): Promise<any>;
}
export declare class DatabaseConnection {
    config: mysql.PoolConfig;
    pool: mysql.Pool;
    constructor(config: mysql.PoolConfig);
    connect(): Promise<void>;
    getConnection(): Promise<mysql.PoolConnection>;
    transaction<T>(callback: (t: TransactionContext) => Promise<T>): Promise<T>;
    query(queryStr: string, params?: any[]): Promise<any>;
    get(queryStr: string, params?: any[]): Promise<any>;
    end(): void;
}
export {};
//# sourceMappingURL=DatabaseConnection.d.ts.map