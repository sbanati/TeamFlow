-- Active: 1707272576598@@127.0.0.1@3306@employeetracker_db
DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;


CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(300) NOT NULL
);

CREATE TABLE roles (
    roles_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300),
    salary DECIMAL(10, 2), -- Stores 10 digitgs with 2 digits to the right of the decimal point 
    department_id INT, -- References department by 
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL
);

CREATE TABLE employees (
    employee_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL, 
    roles_id INT,
    manager_id INT,
    FOREIGN KEY (roles_id) REFERENCES roles(roles_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id) ON DELETE SET NULL -- Allows the foreign key to be set to NULL if employee doesn't have a manager
);




