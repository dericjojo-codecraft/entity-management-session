import "reflect-metadata";
import type { BaseEntity } from './base.entity.js';

export const TABLE_METADATA_KEY = Symbol('table');
    
export function Table< TARGET extends typeof BaseEntity>(tableName: string) {
    return function(target: TARGET) {
        Reflect.defineMetadata(TABLE_METADATA_KEY, tableName, target);
    };
}