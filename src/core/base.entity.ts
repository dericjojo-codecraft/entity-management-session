import 'reflect-metadata';
import { Column, COLUMN_METADATA_KEY, COLUMNS_LIST_KEY } from './column.decorator.js';
import { DB } from './db.js';
import { TABLE_METADATA_KEY } from './table.decorator.js';

export interface IBaseEntity<T> {
    id: T | undefined;

    createdAt: Date;
    createdBy: number;
    updatedAt: Date;
    updatedBy: number;
}

export abstract class BaseEntity implements IBaseEntity<number> {
    @Column('id')
    id: number | undefined;

    @Column('createdAt')
    createdAt: Date;
    @Column('createdBy')
    createdBy: number;
    @Column('updatedAt')
    updatedAt: Date;
    @Column('updatedBy')
    updatedBy: number;

    constructor(entity: IBaseEntity<number>) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.createdBy = entity.createdBy;
        this.updatedAt = entity.updatedAt;
        this.updatedBy = entity.updatedBy;
    }
    
    private static getTableName(): string {
        return Reflect.getMetadata(TABLE_METADATA_KEY, this);
    }

    private static getColumns(): string[] {
        const propertyKeys: string[] = Reflect.getMetadata(COLUMNS_LIST_KEY, this.prototype) || []; 
        return propertyKeys.map(key => Reflect.getMetadata(COLUMN_METADATA_KEY, this.prototype, key));
    }

    // upsert
    async save(): Promise<string> {
        const tableName = (this.constructor as typeof BaseEntity).getTableName();
        const keys = Object.keys(this).filter(key => Reflect.getMetadata(COLUMN_METADATA_KEY, Object.getPrototypeOf(this), key));
        const query = DB.driver.getInsertQuery(tableName, keys);
        return query;

        // await db.execute(query, Object.values(this));
    }

    static async find<I extends IBaseEntity<number>>(conditions: Partial<I> = {}, limit? : number, offset: number=0): Promise<void> {
        const query = DB.driver.getSelectQuery(this.getTableName(), this.getColumns(), conditions, limit, offset)
        console.log(query);
    }

    static async delete<I extends IBaseEntity<number>>(conditions: Partial<I> = {}):Promise<void> {
        const query = DB.driver.getDeleteQuery(this.getTableName(), conditions);
        console.log(query);
        //await db.execute(`DELETE FROM ${this.getTableName()} WHERE ${queryCondition}`.trim(), values);
    }
}