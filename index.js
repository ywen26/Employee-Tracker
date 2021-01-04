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
      "View employees by departments",
      "View employees by roles",
      "View the employees",
      "view employees by managers",
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

      case "View employees by departments":
        viewDepartment();
        break;

      case "View employees by roles":
        viewRole();
        break;

      case "View the employees":
        viewEmployee();
        break;
      
      case "View employees by managers":
        viewManager();
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

function addDepartment() {
  inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "Please enter the name of new department:"
    }
  ]).then(function(answer) {
    connection.query("INSERT INTO department SET ?", 
      {
        name: answer.name
      }, 
      function(err, res) {
        if (err) throw err;
        // console.table(res);
        runSearch();
      }
    );
  });
}

function addRole() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;

    var deptArr = res;
    var allDept = [];
    for (var i = 0; i < deptArr.length; i++) {
      allDept.push(deptArr[i].name);
    }

    inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "Please enter the job title of new role:"
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter the salary of new role:"
      },
      {
        name: "deptID",
        type: "list",
        message: "Please select the department of this role:",
        choices: allDept
      }
    ]).then(function(answer) {
      var departmentID;
      for (var j = 0; j < res.length; j++) {
        if (res[j].name === answer.deptID) {
          departmentID = res[j].id;
        }
      }

      connection.query("INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: departmentID
        },
        function(err, res) {
          if (err) throw err;
          // console.table(res);
          runSearch();
        }
      );
    });
  });
}

function addEmployee() {
  connection.query("SELECT * FROM role", function(err, res1) {
    if (err) throw err;

    var roleArr = res1;
    var allRoles = [];
    for (var i = 0; i < roleArr.length; i++) {
      allRoles.push(roleArr[i].title);
    }

    connection.query("SELECT * FROM employee WHERE manager_id IS NULL", function(err, res2) {
      if (err) throw err;

      var managerArr = res2;
      var allManagers = [];
      for (var j = 0; j < managerArr.length; j++) {
        allManagers.push(managerArr[j].last_name);
      }

      inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "Please enter the first name of new employee:"
        },
        {
          name: "lastName",
          type: "input",
          message: "Please enter the last name of new employee:"
        },
        {
          name: "roleTitle",
          type: "list",
          message: "Please select the title of new employee:",
          choices: allRoles
        },
        {
          name: "managerName",
          type: "list",
          message: "Please select the last name of the manager of new employee:",
          choices: allManagers
        }
      ]).then(function(answer) {
        var roleID;
        for (var k = 0; k < res1.length; k++) {
          if (res1[k].title === answer.roleTitle) {
            roleID = res1[k].id;
          }
        }

        var managerID;
        for (var l = 0; l < res2.length; l++) {
          if (res2[l].last_name === answer.managerName) {
            managerID = res2[l].id;
          }
        }

        connection.query("INSERT INTO employee SET ?",
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: roleID,
            manager_id: managerID
          },
          function(err, res) {
            if (err) throw err;
            // console.table(res);
            runSearch();
          }
        );
      });
    });
  });
}

function viewDepartment() {
  var query = "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY employee.id"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("======================================");
    console.table(res);
    console.log("======================================");
    runSearch();
  });
}

function viewRole() {
  var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee INNER JOIN role ON employee.role_id = role.id ORDER BY employee.id"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("========================================================");
    console.table(res);
    console.log("========================================================");
    runSearch();
  });
}

function viewEmployee() {
  var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name, ' ', e.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee e ON employee.manager_id = e.id ORDER BY employee.id"
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.log("================================================================================");
    console.table(res);
    console.log("================================================================================");
    runSearch();
  })
}

function updateRole() {
  connection.query("SELECT * FROM role", function(err, res2) {
    if (err) throw err;

    var roleArr = res2;
    var allRoles = [];
    for (var j = 0; j < roleArr.length; j++) {
      allRoles.push(roleArr[j].title);
    }

    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;

      var employeeArr = res;
      var allEmployees = [];
      for (var i = 0; i < employeeArr.length; i++) {
        allEmployees.push(employeeArr[i].first_name + " " + employeeArr[i].last_name);
      }

      inquirer.prompt([
        {
          name: "employeeName",
          type: "list",
          message: "Please select the employee below:",
          choices: allEmployees
        },
        {
          name: "changeRole",
          type: "list",
          message: "Please select the new role of this employee:",
          choices: allRoles
        }
      ]).then(function(answer) {
        var roleID;
        for (var k = 0; k < res2.length; k++) {
          if (res2[k].title === answer.changeRole) {
            roleID = res2[k].id;
          }
        }

        var employeeID;
        for (var l = 0; l < res.length; l++) {
          if (res[l].first_name + " " + res[l].last_name === answer.employeeName) {
            employeeID = res[l].id;
          }
        }

        connection.query("UPDATE employee SET ? WHERE ?", [
          {
            role_id: roleID
          },
          {
            id: employeeID
          }
        ], function(err, res) {
          if (err) throw err;
          runSearch();
        });
      });
    });
  });
}