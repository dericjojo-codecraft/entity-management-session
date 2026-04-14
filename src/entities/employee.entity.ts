import { BaseEntity, type IBaseEntity } from "../core/base.entity.js";
import { Column } from "../core/column.decorator.js";
import { Table } from "../core/table.decorator.js";

export interface IEmployee extends IBaseEntity<number> {

    name: string;
    position: string;
    department: string;
    salary: number;
}

@Table('employees')
export class Employee extends BaseEntity implements IEmployee {

    @Column('name')        name: string;
    @Column('position')    position: string;
    @Column('department')  department: string;
    @Column('salary')      salary: number;

    constructor(employee: IEmployee) {
        super(employee);
        this.name = employee.name;
        this.position = employee.position;
        this.department = employee.department;
        this.salary = employee.salary;
    }

}