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
        password: 'silver11', // MYSQL password
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


// Function to Start Thomas SQL Employee Tracker Application
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
                'View Employees By Manager',
                'View Employees By Department',
                'Update Employee Managers',
                'Delete Departments, roles, and employees',
                "Quit",
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
                case 'View Employees By Manager':
                    viewEmployeesByManager();
                    break;
                case 'View Employees By Department':
                    viewEmployeesByDepartment();
                    break;
                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;
                case 'Delete Departments | Roles | Employees':
                    deleteDepartmentsRolesEmployees();
                    break;
                case 'Exit':
                    Connection.end();
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