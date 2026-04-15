import type { ConnectionOptions } from "mysql2";
import type { IDatabaseDriver } from "../core/db.js";
import { createConnection, type Connection } from "mysql2/promise";

export class MySQLDriver implements IDatabaseDriver {
    private connection: Connection | null = null;
    private connectionConfig: string | ConnectionOptions;

    constructor(connectionConfig: string | ConnectionOptions) {
        this.connectionConfig = connectionConfig;
    }

    async connect(): Promise<void> {
        if(this.connection) {
            return;
        }
        this.connection = await (typeof this.connectionConfig === "string"
        ? createConnection(this.connectionConfig)
        : createConnection(this.connectionConfig));
        await this.connection.query("SELECT 1");
    }

    async disconnect(): Promise<void> {
        if(!this.connection) {
            return ;
        }
        await this.connection.end();
        this.connection = null;
    }
    
    async execute(query: string, params?: any[]): Promise<any> {
        if(!this.connection) {
            throw new Error("Method not implemented");
        }
        const [result] = await this.connection.execute(query, params);
        return result;
    }

    getPlaceholderPrefix(): string {
        return '?';
    }

    getInsertQuery(tablename: string, columns: string[]): string {
        const placeholder = columns.length ? "?, ".repeat(columns.length).slice(0, -2) : '';
        const update = columns.map(col => `${col} => VALUES(${col})}`).join(', ');
        return `INSERT INTO ${tablename} (${columns.join(', ')}) VALUES (${placeholder}) ON DUPLICATE KEY UPDATE ${update}`;
    }

    getUpdateQuery(tablename: string, columns: string[], conditions: Record<string, unknown>): string {
        const setClause = columns.map(col => `${col} = ?`).join(", ");
        const whereClause = Object.keys(conditions).map(k => `${k} = ?`).join(" AND ");

        return `UPDATE ${tablename} SET (${setClause}) WHERE (${whereClause})`;
    }

    getDeleteQuery(tableName: string, conditions: Record<string, unknown>, limit?: number, offset?: number): string {
        const whereClause = conditions && Object.keys(conditions) ? 'WHERE '+Object.keys(conditions).map(col => `${col} = ?`).join(" AND ") : '';
        let query = `DELETE FROM ${tableName} ${whereClause}` ;
        if(limit) { query += ` LIMIT ${limit}` };
        if(offset) { query += ` OFFSET ${offset}` };
        return query;
    }
    
    getSelectQuery(tableName: string, columns: string[], conditions?: Record<string, unknown>, limit?: number, offset?: number): string {
        const whereClause = conditions ? 'WHERE '+Object.keys(conditions).map(col => `${col} = ?`).join(" AND ") : '';
        let query = `SELECT ${columns.join(', ')} FROM ${tableName} ${whereClause}`;
        if(limit) { query += ` LIMIT ${limit}` };
        if(offset) { query += ` OFFSET ${offset}` };
        return query;
    }

    getCountQuery(tableName: string, conditions?: Record<string, unknown>): string {
        const whereClause = conditions ? 'WHERE '+Object.keys(conditions).map(col => `${col} = ?`).join(" AND ") : '';
        return `SELECT COUNT(*) FROM ${tableName} ${whereClause}`;
    }
}