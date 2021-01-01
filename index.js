var inquirer = require('inquirer');
var mysql = require('mysql');
var cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  
  // Your port; if not 3306
  port: 3306,
  
  // Your username
  user: "root",
  
  // Your password
  password: "0226wind",
  database: "employee_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
})

function runSearch() {
  inquirer.prompt({
    name: "action",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
      "Add new departments",
      "Add new roles",
      "Add new employees",
      "View the departments",
      "View the roles",
      "View the employees",
      "Update employee roles",
      "Exit"
    ]
  }).then(function(answer) {
    switch(answer.action) {
      case "Add new departments":
        addDepartment();
        break;
      
      case "Add new roles":
        addRole();
        break;

      case "Add new employees":
        addEmployee();
        break;

      case "View the departments":
        viewDepartment();
        break;

      case "View the roles":
        viewRole();
        break;

      case "View the employees":
        viewEmployee();
        break;
      
      case "Update employee roles":
        updateRole();
        break;

      case "Exit":
        connection.end();
        break;
    }
  });
}