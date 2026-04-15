import "reflect-metadata";
import type { BaseEntity } from "./base.entity.js";

export const COLUMN_METADATA_KEY = Symbol('column');
export const COLUMNS_LIST_KEY = Symbol('columns_list');

export function Column<TARGET extends BaseEntity>(columnName: string) {
    return function(target: TARGET, propertyKey: string) {
        Reflect.defineMetadata(COLUMN_METADATA_KEY, columnName, target, propertyKey);

        let columns:string[];

        if(Reflect.hasOwnMetadata(COLUMNS_LIST_KEY, target)) {
            columns = Reflect.getMetadata(COLUMNS_LIST_KEY, target);
        } else {
            const parentColumns = Reflect.getMetadata(COLUMNS_LIST_KEY, target) || [];
            columns = [...parentColumns];
        }

        columns.push(propertyKey);
        Reflect.defineMetadata(COLUMNS_LIST_KEY, columns, target);
    };
}