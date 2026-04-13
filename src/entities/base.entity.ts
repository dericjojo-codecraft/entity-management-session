
import { TABLE_METADATA_KEY } from './table.decorator.js';

export interface IBaseEntity {
    id: number;

    createdAt: Date;
    createdBy: number;
    updatedAt: Date;
    updatedBy: number;
}

export abstract class BaseEntity implements IBaseEntity {
    id: number;

    createdAt: Date;
    createdBy: number;
    updatedAt: Date;
    updatedBy: number;

    constructor(entity: IBaseEntity) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.createdBy = entity.createdBy;
        this.updatedAt = entity.updatedAt;
        this.updatedBy = entity.updatedBy;
    }
    
    static getTableName(): string {
        return Reflect.getMetadata(TABLE_METADATA_KEY, this);
    }

    // TASK: update this to insert / update
    // insert, if conflict, update
    async save(): Promise<void> {
        const keys   = Object.keys(this);
        const cols   = keys.join(', ');
        const marks  = "?, ".repeat(Object.keys.length).slice(0, -2);
        // using upsert
        const update = keys.map(k => `${k} = VALUES(${k})`).join(', ');

        await db.execute(
            `INSERT INTO ${BaseEntity.getTableName()} (${cols}) VALUES (${marks}) ON CONFLICT(id) DO UPDATE SET ${update}`,
            Object.values(this)
        );
    }

    // method to build the condition for the query and return an object with it
    private static conditionBuilder<I>(conditions: Partial<I>) {
        const keys = Object.keys(conditions);
        const queryCondition = keys.length ? `WHERE ${keys.map(k => `${k} = ?`).join(" AND ")}` : '';
        return { queryCondition, values: Object.values(conditions) }
    }

    // TODO: findAll, findOne, ?findById
    // combine work done by findAll and findOne?
    private static async find<T extends BaseEntity, I extends IBaseEntity>(this: new (entity: I) => T, conditions: Partial<I> = {}): Promise<T[]> {
        const { queryCondition, values } = BaseEntity.conditionBuilder(conditions);
        const results = await db.execute(
            `SELECT * FROM ${BaseEntity.getTableName()} ${queryCondition}`.trim(),
            values
        );
        return results.map((row: I) => new this(row));
    }

    static async findOne<T extends BaseEntity, I extends IBaseEntity>(this: { new(entity: I): T; find(conditions: Partial<I>): Promise<T[]> }, conditions: Partial<I>):Promise<T | null> {
        const results = await this.find(conditions);
        return results[0] ?? null;
    } 

    static async findAll<T extends BaseEntity, I extends IBaseEntity>(
        this: {new (entity: I) : T; find(conditions?: Partial<I>): Promise<T[]>}
    ): Promise<T[]> {
        return this.find();
    }

    // combined method for delete
    // TODO: deleteById, deleteAll, deleteOne
    private static async delete<I extends IBaseEntity>(conditions: Partial<I> = {}):Promise<void> {
        const { queryCondition, values } = this.conditionBuilder(conditions);
        await db.execute(`DELETE FROM ${this.getTableName} WHERE ${queryCondition}`.trim(), values);
    }
    
    static async deleteOne<I extends IBaseEntity>(c: Partial<I>) { return this.delete(c) };
    static async deleteAll() { return this.delete() };
}