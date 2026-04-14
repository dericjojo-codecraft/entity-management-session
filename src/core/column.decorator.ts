import "reflect-metadata";
import type { BaseEntity } from "./base.entity.js";

export const COLUMN_METADATA_KEY = Symbol('column');
    
export function Column<TARGET extends BaseEntity>(columnName: string) {
    return function(target: TARGET, propertyKey: string) {
        Reflect.defineMetadata(COLUMN_METADATA_KEY, columnName, target, propertyKey);
    };
}