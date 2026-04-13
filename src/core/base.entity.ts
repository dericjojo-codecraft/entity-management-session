import { TABLE_METADATA_KEY } from './table.decorator.js';

export interface IBaseEntity<T> {
    id: T | undefined;

    createdAt: Date;
    createdBy: number;
    updatedAt: Date;
    updatedBy: number;
}

export abstract class BaseEntity implements IBaseEntity<number> {
    id: number | undefined;

    // TODO: 1. column decorator to make a basic whitelist of accepted column modifications
    createdAt: Date;
    createdBy: number;
    updatedAt: Date;
    updatedBy: number;

    constructor(entity: IBaseEntity<number>) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.createdBy = entity.createdBy;
        this.updatedAt = entity.updatedAt;
        this.updatedBy = entity.updatedBy;
    }
    
    static getTableName(): string {
        return Reflect.getMetadata(TABLE_METADATA_KEY, this);
    }

    // upsert
    async save(): Promise<string> {
        const keys   = Object.keys(this);
        const cols   = keys.join(', ');
        const marks  = "?, ".repeat(keys.length).slice(0, -2);
        const update = keys.map(k => `${k} = VALUES(${k})`).join(', ');
        // TODO: 2. make drivers from MySQL and PostgreSQL
        //const query = getInsertQuery()
        return `INSERT INTO ${BaseEntity.getTableName()} (${cols}) VALUES (${marks}) ON DUPLICATE KEY UPDATE ${update}`

        // await db.execute(
        //     `INSERT INTO ${BaseEntity.getTableName()} (${cols}) VALUES (${marks}) ON DUPLICATE KEY UPDATE ${update}`,
        //     Object.values(this)
        // );
    }

    // method to build the condition for the query and return an object with it
    private static conditionBuilder<I>(conditions: Partial<I>) {
        const keys = Object.keys(conditions);
        const queryCondition = keys.length ? `WHERE ${keys.map(k => `${k} = ?`).join(" AND ")}` : '';
        return { queryCondition, values: Object.values(conditions) }
    }

    // combine work done by findAll and findOne?
    static async find<T extends BaseEntity, I extends IBaseEntity<number>>(this: new (entity: I) => T, conditions: Partial<I> = {}, limit? : number, offset?: number): Promise<void> {
        const { queryCondition, values } = BaseEntity.conditionBuilder(conditions);
        let query = `SELECT * FROM ${BaseEntity.getTableName()} ${queryCondition}`;

        if(limit) { query = query + ` LIMIT ${limit}` };
        if(offset) { query = query + ` OFFSET ${offset}` };

        //const results = await db.execute(query.trim(), values);
        //return results.map((row: I) => new this(row));
        console.log(query);
    }

    static async findOne<T extends BaseEntity, I extends IBaseEntity<number>>(this: typeof BaseEntity, conditions: Partial<I>):Promise<void> {
        const results = await (this as any).find(conditions);
        //return results[0] ?? null;
    } 

    static async findAll<T extends BaseEntity, I extends IBaseEntity<number>>(
        this: BaseEntity
    ): Promise<T[]> {
        return (this as any).find();
    }

    // combined method for delete
    static async delete<I extends IBaseEntity<number>>(conditions: Partial<I> = {}):Promise<string> {
        const { queryCondition, values } = this.conditionBuilder(conditions);
        return `DELETE FROM ${this.getTableName()} WHERE ${queryCondition}`;
        //await db.execute(`DELETE FROM ${this.getTableName()} WHERE ${queryCondition}`.trim(), values);

    }
    
    static async deleteOne<I extends IBaseEntity<number>>(c: Partial<I>) { return this.delete(c) };
    static async deleteAll() { return this.delete() };
}