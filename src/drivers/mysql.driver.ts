export class MySQLDriver {
    connect(): Promise<void> {
        throw new Error("Method not implemented")
    }

    disconnect(): Promise<void> {
        throw new Error("Method not implemented")
    }

    execute(): Promise<void> {
        throw new Error("Method not implemented")
    }

    getPlaceholderPrefix(): string {
        return '?';
    }

    getInsertQuery(tablename: string, columns: string[]): string {
        const placeholder = columns.length ? "?, ".repeat(columns.length).slice(0, -2) : '';
        const update = columns.map(col => `${col} => VALUES(${col})}`).join(', ');
        return `INSERT INTO ${tablename} (${columns}) VALUES (${placeholder}) ON DUPLICATE KEY UPDATE ${update}`;
    }

    getUpdateQuery(tablename: string, columns: string[], conditions: Record<string, unknown>): string {
        const setClause = columns.map(col => `${col} = ?`).join(", ");
        const whereClause = Object.keys(conditions).map(k => `${k} = ?`).join(" AND ");

        return `UPDATE ${tablename} SET (${setClause}) WHERE (${whereClause})`;
    }

    getDeleteQuery(tableName: string, conditions: Record<string, unknown>, limit?: number, offset?: number): string {
        //const queryCondition = Object.keys(conditions).map(col => ); 
        return `DELETE FROM ${tableName} WHERE ${queryCondition} LIMIT ${limit} OFFSET ${offset}`;
    }
    
}