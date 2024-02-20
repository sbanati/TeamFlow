// Import and require dependencies
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cfonts = require('cfonts');
const cTable = require('console.table');


// Establish a MYSQL connection
const db = mysql2.createConnection(
    {
        host:'localhost',
        user: 'root', // MYSQL username
        port: '3306', //Default MySQL port
        password: 'silver11', // MYSQL password, dont worry this is not an important :)
        database: 'employeeTracker_db',
    },
    console.log(`Connected to the employeeTracker_db.`)
    
);

// Connection callback function 
db.connect((err) => {
    if (err) throw err;
    console.log('Successfully connected to the employeeTracker_db!');
    
    start();
})

// Starts the cfont title 
cfonts.say('FullStack Employee Manager ', {
	font: 'block',              // define the font face
	align: 'left',              // define text alignment
	colors: ['candy'],         // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: false,            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment cfonts is being executed in
});


// Function to Start Application
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add A Department",
                "Add A Role",
                "Add An Employee",
                "Update An Employee Role",
                'Update An Employees Manager',
                'Delete a Department',
                'Delete a Role',
                'Delete an Employee',
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case 'Add A Department':
                    addDepartment();
                    break;
                case 'Add A Role':
                    addRole();
                    break;
                case 'Add An Employee':
                    addEmployee();
                    break;
                case 'Update An Employee Role':
                    updateEmployeeRole();
                    break;
                case 'Update An Employees Manager':
                    updateEmployeeManager();
                    break;
                case 'Delete a Department':
                    deleteDepartment();
                    break;
                case 'Delete a Role':
                    deleteRole();
                    break;
                case 'Delete an Employee':
                    deleteEmployee();
                    break;
                case 'Exit':
                    db.end();
                    console.log('See ya, bozo!');
                    break;
            }
        });
    };


  // Function to View All Departments
function viewAllDepartments() {
    // SQL query to select all records from the departments table
    const query = 'SELECT * FROM departments';

    // Execute the query using the database connection
    db.query(query, (err, res) => {
        if (err) {
            console.error("Error retrieving department information:", err);
        } else {
            // Display table
            console.table(res);
        }

        // Return to the main menu after displaying the information
        start();
    });
}


   // Function to View All Roles
function viewAllRoles() {
    // SQL query to select specific columns from 'roles' and 'departments' tables
    const query = 'SELECT roles_id, title, salary, roles.department_id, department_name FROM roles JOIN departments ON roles.department_id = departments.department_id';

    // Execute the query using the database connection
    db.query(query, (err, res) => {
        if (err) {
            console.error("Error retrieving role information:", err);
        } else {
            // Display table
            console.table(res);
        }

        // Return to the main menu after displaying the information 
        start();
    });
}

    
// Function to View All Employees 
function viewAllEmployees() {
        // SQL query to select specific columns from 'employee', 'roles', 'departments', and 'employee' tables
        const query = `
        SELECT e.employee_id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, '', m.last_name) AS manager_name
        FROM employees e
        LEFT JOIN roles r ON e.roles_id = r.roles_id
        LEFT JOIN departments d ON r.department_id = d.department_id
        LEFT JOIN employees m ON e.manager_id = m.employee_id;
        `;

        //Use db.query method to execute the SQL query and call back will handle the error || response 
        db.query(query, (err, res) => {
            if (err) {
                console.error('Error retrieving employee information:', err);
            } else {
                // Display table
                console.table(res);
            }
            
            
            // Return to the main menu after the display of the information 
            start();
        })
}


//Function to add a department 
function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department: ',
        })
        .then((answer) => {
            console.log(answer.name);

            const query = 'INSERT INTO departments (department_name) VALUES (?)';

            db.query(query, [answer.name], (err, res) => {
                if (err) {
                    console.error('Error creating department: ', err);
                } else {
                    console.log(`Added department ${answer.department_name} to the database`);
                }

                start();
            });
        });
}


// function to Add A Role 
function addRole() {

    // Query to retrieve all the departments 
    const query = 'SELECT * FROM departments';
    
    // Executing the query to get the actual departments
    db.query(query, (err, res) => {
        if (err) {
            console.error('Error retrieving departments information:', err);
        } else {
            // Display table 
            console.table(res);
        }

        // Prompt the user for information about the new role 
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter the title of the new role',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter the salary of the new role',
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Choose the department for the new role',
                    choices: res.map((department) => department.department_name),
                },
            ])
            .then((answers) => {
                // Find the department object based on the user's choice 
                const department = res.find((dept) => dept.department_name === answers.department);
                
                // Insert the new role into the roles table 
                const insertQuery = 'INSERT INTO roles SET ?';
                db.query(insertQuery, {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: department.department_id,

                }, (err, res) => {
                    if (err) {
                        console.error('Error adding new role:', err);
                    } else {
                        console.log(`Role ${answers.title} successfully added!`);
                    }
                    // Restart the application
                    start();
                });
            });
    });
}



// Function to Add An Employee
function addEmployee() {
    // Retrieve list of roles from the database
    db.query('SELECT roles_id, title FROM roles', (err, res) => {
        if (err) {
            console.error('Error retrieving id and title from roles table', err);
        } else {
            // Display roles table
            console.table(res);
        }

        // Map roles data for inquirer choices
        const roles = res.map(({ roles_id, title }) => ({
            name: title,
            value: roles_id,
        }));

        // Retrieve list of managers from the database assuming managers are also employees
        db.query('SELECT employee_id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, managersRes) => {
            if (err) {
                console.error('Error retrieving employees names from employees table', err);
            } else {
                // Display managers table
                console.table(managersRes);

                // Map managers data for inquirer choices
                const managers = managersRes.map(({ employee_id, name }) => ({
                    name,
                    value: employee_id,
                }));

                // Prompt the user for information
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter the employee\'s first name:',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter the employee\'s last name:',
                    },
                    {
                        type: 'list',
                        name: 'roles_id',
                        message: 'Select the employee\'s role:',
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'manager_id',
                        message: 'Select the employee\'s manager:',
                        choices: [
                            { name: 'None', value: null },
                            ...managers,
                        ],
                    },
                ]).then((answers) => {
                    // Insert the employee into the database
                    const insertQuery = 'INSERT INTO employees (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)';
                    const values = [
                        answers.firstName,
                        answers.lastName,
                        answers.roles_id,
                        answers.manager_id,
                    ];

                    db.query(insertQuery, values, (err) => {
                        if (err) {
                            console.error('Failed to Insert The New Employee Into Database', err);
                        } else {
                            console.log('Employee was successfully added to the database');
                        }

                        // Restart the application
                        start();
                    });
                });
            }
        });
    });
}



// Function to update an employee role
function updateEmployeeRole() {
    // Query to fetch employee information with their current roles
    const queryEmployees = "SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, roles.roles_id FROM employees LEFT JOIN roles ON employees.roles_id = roles.roles_id";

    // Query to fetch all available roles
    const queryRoles = "SELECT * FROM roles";

    // Execute the query to fetch employees
    db.query(queryEmployees, (err, resEmployees) => {
        if (err) {
            console.error('Error fetching employees:', err);
            start();
            return;
        }

        // Execute the query to fetch roles
        db.query(queryRoles, (err, resRoles) => {
            if (err) {
                console.error('Error fetching roles:', err);
                start();
                return;
            }

            // Prompt user to select an employee and a new role
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to update:",
                    choices: resEmployees.map(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}`
                    ),
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the new role:",
                    choices: resRoles.map((role) => role.title),
                },
            ])
            .then((answers) => {
                // Find the selected employee and role
                const employee = resEmployees.find(
                    (employee) =>
                        `${employee.first_name} ${employee.last_name}` ===
                        answers.employee
                );

                const role = resRoles.find(
                    (role) => role.title === answers.role
                );

                // Query to update the employee's role
                const updateQuery = "UPDATE employees SET roles_id = ? WHERE employee_id = ?";
                
                // Execute the update query
                db.query(
                    updateQuery,
                    [role.roles_id, employee.employee_id],
                    (err, res) => {
                        if (err) {
                            console.error('Error updating employee role:', err);
                        } else {
                            // Display success message
                            console.log(
                                `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                            );
                        }

                        // Restart the application
                        start();
                    }
                );
            });
        });
    });
}

// Function to update Employee Managers
function updateEmployeeManager() {
    // Query to fetch all departments
    const queryDepartments = "SELECT * FROM departments";

    // Query to fetch all employees
    const queryEmployees = "SELECT * FROM employees";

    // Fetch all departments from the database
    db.query(queryDepartments, (err, resDepartments) => {
        if (err) {
            console.error("Error fetching departments:", err);
            // Restart 
            start();
            return;
        }

        // Fetch all employees from the database
        db.query(queryEmployees, (err, resEmployees) => {
            if (err) {
                console.error("Error fetching employees:", err);
                // Restart 
                start();
                return;
            }

            // Prompt user to select department, employee, and manager
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "department",
                        message: "Select the department:",
                        choices: resDepartments.map(
                            (department) => department.department_name
                        ),
                    },
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to add a manager to:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "manager",
                        message: "Select the employee's manager:",
                        choices: resEmployees.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                ])
                .then((answers) => {
                    // Find the selected department, employee, and manager
                    const department = resDepartments.find(
                        (department) =>
                            department.department_name === answers.department
                    );

                    const employee = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );

                    const manager = resEmployees.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.manager
                    );

                    // Check if department, employee, and manager are valid selections
                    if (!department || !employee || !manager) {
                        console.error("Invalid department, employee, or manager selection.");
                        // Restart 
                        start();
                        return;
                    }

                    // Query to update the employee's manager in the database
                    const updateQuery =
                        "UPDATE employees SET manager_id = ? WHERE employee_id = ? AND roles_id IN (SELECT roles_id FROM roles WHERE department_id = ?)";

                    // Check if the selected manager is the same as the employee being updated
                    const managerId =
                        manager.employee_id === employee.employee_id ? null : manager.employee_id;

                    // Execute the update query
                    db.query(
                        updateQuery,
                        [managerId, employee.employee_id, department.department_id],
                        (err, res) => {
                            if (err) {
                                console.error("Error updating manager:", err);
                                // Handle error here
                                // Display an error message or take appropriate action
                            } else {
                                // Display success message
                                console.log(
                                    `Added manager ${
                                        managerId
                                            ? `${manager.first_name} ${manager.last_name}`
                                            : 'null'
                                    } to employee ${employee.first_name} ${employee.last_name} in department ${
                                        department.department_name
                                    }!`
                                );
                            }

                            // Restart the application
                            start();
                        }
                    );
                });
        });
    });
}


// Function to delete an Employee
function deleteEmployee() {
    // SQL query to select all employees
    const query = "SELECT * FROM employees";

    // Execute the query using the database connection
    db.query(query, (err, res) => {
        if (err) {
            console.error("Error fetching employee information:", err);
            start(); // Restart the application
            return;
        }

        // Map employees for inquirer choices
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.employee_id,
        }));

        // Add a "Go Back" option to the choices
        employeeList.push({ name: "Go Back", value: "back" });

        // Prompt user to select an employee for deletion
        inquirer
            .prompt({
                type: "list",
                name: "employeeId",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.employeeId === "back") {
                    // Go back to the main menu 
                    start();
                    return;
                }

                // SQL query to delete the selected employee
                const deleteQuery = "DELETE FROM employees WHERE employee_id = ?";

                // Execute the delete query
                db.query(deleteQuery, [answer.employeeId], (err) => {
                    if (err) {
                        console.error(`Error deleting employee with ID ${answer.employeeId}:`, err);
                    } else {
                        console.log(`Deleted employee with ID ${answer.employeeId} from the database!`);
                    }

                    // Restart the application
                    start();
                });
            });
    });
}

// Function to delete a Role
function deleteRole() {
    // Retrieve all available roles from the database
    const query = "SELECT * FROM roles";
    
    // Execute the query to fetch roles
    db.query(query, (err, res) => {
        if (err) {
            // Handle error fetching roles
            console.error("Error fetching roles:", err);
            
            // Restart the application
            start();
            return;
        }
        // Call the map method on the retrieved roles from the response to create an array of choices
        const roleChoices = res.map((role) => ({
            name: `${role.title} (${role.roles_id}) - ${role.salary}`,
            value: role.roles_id,
        }));

        // Add a "Go Back" option to the list of choices
        roleChoices.push({ name: "Go Back", value: null });

        // Prompt user to select a role for deletion
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Select the role you want to delete:",
                choices: roleChoices,
            })
            .then((answer) => {
                // Check if the user chose the "Go Back" option
                if (answer.roleId === null) {
                    // Go back to the main menu 
                    start();
                    return;
                }

                // SQL query to delete the selected role
                const deleteQuery = "DELETE FROM roles WHERE roles_id = ?";
                
                // Execute the delete query
                db.query(deleteQuery, [answer.roleId], (err, res) => {
                    if (err) {
                        // Handle error deleting role
                        console.error(`Error deleting role with ID ${answer.roleId}:`, err);
                    } else {
                        // Display success message
                        console.log(`Deleted role with ID ${answer.roleId} from the database!`);
                    }

                    // Restart the application
                    start();
                });
            });
    });
}

// Function to delete a Department
function deleteDepartment() {
    // SQL query to retrieve the list of departments from the database
    const query = "SELECT * FROM departments";

    // Execute the query to fetch departments
    db.query(query, (err, res) => {
        // Check for errors while fetching departments
        if (err) {
            console.error("Error fetching departments:", err);

            // Restart the application
            start();
            return;
        }

        // Map through the retrieved departments to create an array of choices
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department.department_id,
        }));

        // Prompt the user to select a department for deletion
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "Which department do you want to delete?",
                choices: [
                    ...departmentChoices,
                    { name: "Go Back", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.departmentId === "back") {
                    // Go back to the main menu
                    start();
                } else {
                    // SQL query to delete the selected department
                    const deleteQuery = "DELETE FROM departments WHERE department_id = ?";

                    // Execute the delete query
                    db.query(
                        deleteQuery,
                        [answer.departmentId],
                        (err, res) => {
                            // Check for errors while deleting the department
                            if (err) {
                                console.error(`Error deleting department with ID ${answer.departmentId}:`, err);
                            } else {
                                // Display success message
                                console.log(
                                    `Deleted department with ID ${answer.departmentId} from the database!`
                                );
                            }

                            // Restart the application
                            start();
                        }
                    );
                }
            });
    });
}


// Closes the connection when the app is closed 
process.on("exit", () => {
    db.end();
});