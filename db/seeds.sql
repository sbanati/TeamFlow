INSERT INTO departments (department_name)
VALUES
('Engineering'),
('Sales'),
('Finance'),
('Legal')




INSERT INTO roles (title, salary, department_id)
VALUES
('Lead Engineer', 150000.00, 1 ),
('Software Engineer', 120000.00, 1),
('Lead Sales', 130000.00, 2),
('Salesperson', 110000.00, 2),
('Account Manager', 140000.00, 3),
('Accountant', 110000.00, 3),
('Legal Team Lead', 150000.00, 4),
('Lawyer', 120000.00, 4)


INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES
('Jay', 'Son', 1, NULL),
('Java', 'Script', 2, 1),
('Pascal', 'Case', 3, NULL),
('Mark', 'Up', 4, 3),
('Elsa', 'Statements', 5, NULL),
('Django', 'Python', 6, 5),
('Asyn', 'Chronus', 7, NULL),
('Rest', 'API', 8, 7)
