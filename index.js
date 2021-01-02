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
    type: "list",
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

// function addDepartment() {
//   inquirer.prompt([
//     {
//       name: "department",
//       type: "input",
//       message: "Please enter the name of new department:"
//     }
//   ]).then(function(answer) {
//     connection.query("INSERT INTO department SET ?", 
//       {
//         name: answer.name
//       }, 
//       function(err, res) {
//         if (err) throw err;
//         // console.table(res);
//         runSearch();
//       }
//     );
//   });
// }

// function addRole() {
//   connection.query("SELECT * FROM department", function(err, res) {
//     if (err) throw err;

//     var deptArr = res;
//     var allDept = [];
//     for (var i = 0; i < deptArr.length; i++) {
//       allDept.push(deptArr[i].name);
//     }

//     inquirer.prompt([
//       {
//         name: "title",
//         type: "input",
//         message: "Please enter the job title of new role:"
//       },
//       {
//         name: "salary",
//         type: "input",
//         message: "Please enter the salary of new role:"
//       },
//       {
//         name: "deptID",
//         type: "list",
//         message: "Please select the department of this role:",
//         choices: allDept
//       }
//     ]).then(function(answer) {
//       var departmentID;
//       for (var j = 0; j < res.length; j++) {
//         if (res[j].name === answer.deptID) {
//           departmentID = res[j].id;
//         }
//       }

//       connection.query("INSERT INTO role SET ?",
//         {
//           title: answer.title,
//           salary: answer.salary,
//           department_id: departmentID
//         },
//         function(err, res) {
//           if (err) throw err;
//           // console.table(res);
//           runSearch();
//         }
//       );
//     });
//   });
// }

// function addEmployee() {
//   connection.query("SELECT * FROM role", function(err, res1) {
//     if (err) throw err;

//     var roleArr = res1;
//     var allRoles = [];
//     for (var i = 0; i < roleArr.length; i++) {
//       allRoles.push(roleArr[i].title);
//     }

//     connection.query("SELECT * FROM employee WHERE manager_id IS NULL", function(err, res2) {
//       if (err) throw err;

//       var managerArr = res2;
//       var allManagers = [];
//       for (var j = 0; j < managerArr.length; j++) {
//         allManagers.push(managerArr[j].last_name);
//       }

//       inquirer.prompt([
//         {
//           name: "firstName",
//           type: "input",
//           message: "Please enter the first name of new employee:"
//         },
//         {
//           name: "lastName",
//           type: "input",
//           message: "Please enter the last name of new employee:"
//         },
//         {
//           name: "roleTitle",
//           type: "list",
//           message: "Please select the title of new employee:",
//           choices: allRoles
//         },
//         {
//           name: "managerName",
//           type: "list",
//           message: "Please select the last name of the manager of new employee:",
//           choices: allManagers
//         }
//       ]).then(function(answer) {
//         var roleID;
//         for (var k = 0; k < res1.length; k++) {
//           if (res1[k].title === answer.roleTitle) {
//             roleID = res1[k].id;
//           }
//         }

//         var managerID;
//         for (var l = 0; l < res2.length; l++) {
//           if (res2[l].last_name === answer.managerName) {
//             managerID = res2[l].id;
//           }
//         }

//         connection.query("INSERT INTO employee SET ?",
//           {
//             first_name: answer.first_name,
//             last_name: answer.last_name,
//             role_id: roleID,
//             manager_id: managerID
//           },
//           function(err, res) {
//             if (err) throw err;
//             // console.table(res);
//             runSearch();
//           }
//         );
//       });
//     });
//   });
// }

function viewDepartment() {
  var query = "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("======================================");
    console.table(res);
    runSearch();
  });
}

function viewRole() {
  var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("========================================================");
    console.table(res);
    runSearch();
  });
}

function viewEmployee() {
  var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name, ' ', e.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee e ON employee.manager_id = e.id"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("================================================================================");
    console.table(res);
    runSearch();
  })
}