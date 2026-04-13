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

    getPlaceholderPrefix(i: number): number {
        return i;
    }

    getNumberedPlaceholder(i: number): number {
        return this.getPlaceholderPrefix(i);
    }

    getInsertQuery(tablename: string, columns: string[]): string {
        const placeholder = columns.map((_, i) => this.getNumberedPlaceholder(i+1)).join(', ');
        return `INSERT INTO ${tablename} (${columns.join(', ')}) VALUES (${placeholder})`;
    }

    getUpdateQuery(): Promise<void> {
        throw new Error("Method not implemented")
    }

    getDeleteQuery(): Promise<void> {
        throw new Error("Method not implemented")
    }
    
}