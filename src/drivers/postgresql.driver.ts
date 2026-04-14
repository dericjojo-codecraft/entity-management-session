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
        return '$';
    }

    getNumberedPlaceholder(i: number): string {
        return this.getPlaceholderPrefix()+i;
    }

    getInsertQuery(tablename: string, columns: string[]): string {
        const placeholder = columns.map((_, i) => this.getNumberedPlaceholder(i+1)).join(', ');
        const update = columns.map((col, i) => `${col} => ${this.getNumberedPlaceholder(i+1)}`).join(', ');
        return `INSERT INTO ${tablename} (${columns.join(', ')}) VALUES (${placeholder}) ON CONFLICT (id) DO UPDATE SET ${update}`;
    }

    getUpdateQuery(tableName: string, columns: string[], conditions: Record<string, unknown>): string {
        const setClause = columns.map((col, i) => `${col} = ${this.getNumberedPlaceholder(i+1)}`).join(", ");
        const whereClause = Object.keys(conditions).map((k, i) => `${k} = ${this.getNumberedPlaceholder(i+1)}`).join(" AND ");

        return `UPDATE ${tableName} SET (${setClause}) WHERE (${whereClause})`;
    }

    getDeleteQuery(tableName: string, conditions: Record<string, unknown>, limit?: number, offset?: number): string {
        const whereClause = conditions && Object.keys(conditions) ? 'WHERE '+Object.keys(conditions).map((col, i) => `${col} = ${this.getNumberedPlaceholder(i+1)}`).join(" AND ") : '';
        let query = `DELETE FROM ${tableName} ${whereClause}` ;
        if(limit) { query += ` LIMIT ${limit}` };
        if(offset) { query += ` OFFSET ${offset}` };
        return query;
    }

    getSelectQuery(tableName: string, columns: string[], conditions?: Record<string, unknown>, limit?: number, offset?: number): string {
        const whereClause = conditions ? 'WHERE '+Object.keys(conditions).map((col, i) => `${col} = ${this.getNumberedPlaceholder(i+1)}`).join(" AND ") : '';
        let query = `SELECT ${columns.join(', ')} FROM ${tableName} ${whereClause}`;
        if(limit) { query += ` LIMIT ${limit}` };
        if(offset) { query += ` OFFSET ${offset}` };
        return query;
    }

    getCountQuery(tableName: string, conditions?: Record<string, unknown>): string {
        const whereClause = conditions ? 'WHERE '+Object.keys(conditions).map((col, i) => `${col} = ${this.getNumberedPlaceholder(i+1)}`).join(" AND ") : '';
        return `SELECT COUNT(*) FROM ${tableName} ${whereClause}`;
    }   
}