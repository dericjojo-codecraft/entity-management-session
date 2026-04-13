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

    getPlaceholderPrefix(): Promise<void> {
        throw new Error("Method not implemented")
    }

    getInsertQuery(tablename: string, columns: string[]): string {
        const placeholder = columns.map(() => this.getPlaceholderPrefix()).join(', ');
        return `INSERT INTO ${tablename} (${columns.join(', ')}) VALUES (${placeholder})`;
    }

    getUpdateQuery(): Promise<void> {
        throw new Error("Method not implemented")
    }

    getDeleteQuery(): Promise<void> {
        throw new Error("Method not implemented")
    }
    
}