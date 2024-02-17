// Import and require dependencies
const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const cfonts = require('cfonts');


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
            

        })
    };