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