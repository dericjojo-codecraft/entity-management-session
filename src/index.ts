import 'reflect-metadata';
import { User } from "./entities/user.entity.js";
import { Employee } from "./entities/employee.entity.js";
import { DB } from './core/db.js'
import { MySQLDriver } from './drivers/mysql.driver.js';
import { PostgreSQLDriver } from './drivers/postgresql.driver.js';

const config = {
    host: "host",
    user: "user",
    password: "password",
    database: "database"
}

const mySQLDriver = new MySQLDriver("mysql://root:password@localhost:3306/my_database");
const postgreSQLDriver = new PostgreSQLDriver(config);

DB.setDriver(mySQLDriver);
const newUser = new User({
    id: 1,
    name: 'John Doe',
    address: '123 Main St',
    dob: new Date('1990-01-01'),
    email: 'john.doe@example.com',
    createdAt: new Date(),
    createdBy: 1,
    updatedAt: new Date(),
    updatedBy: 1
});
await newUser.save();

const foundUser = await User.find({id: 1});


const newEmployee = new Employee({
    id: 1,
    name: 'Jane Smith',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 90000,
    createdAt: new Date(),
    createdBy: 1,
    updatedAt: new Date(),
    updatedBy: 1
});
await newEmployee.save();

const foundEmployee = await Employee.find({id: 10}, 10);