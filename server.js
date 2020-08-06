var mysql = require("mysql");
var inquirer = require("inquirer");
const ctable = require('console.table')
// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "The$p1r1tR00m",
  database: "employment_trackerDB"
});


connection.connect(function(err) {
    if (err) throw err;
    start();
  });
  
  function start() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all employees", 
            "View all employees by Department", 
            "Add an employee", 
            "Update an employee's role", 
            "View all roles", 
            "Add a role", 
            "View all departments", 
            "Add a department", 
            "EXIT"
        ]
      })
      .then(function(answer) {
        switch (answer.action) {
        case "View all employees":
          viewEmployee();
          break;
  
        case "View all employees by Department":
          viewByDeparment();
          break;
  
        case "Add an employee":
          addEmployee();
          break;
  
        case "Update an employee's role":
          updateEmployee();
          break;

        case "View all roles":
          viewRoles();
          break;
        case "Add a role":
          addRole();
          break;

        case "View all departments":
          viewAllDeparment();
          break;

        case "Add a department":
            addDepartment();
          break;
    
        case "EXIT":
          connection.end();
          break;
        }
      });
  }

  function viewEmployee() {
    var values = [];
    var query = "SELECT name, depName, role_title FROM employee";
    connection.query(query,function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
        
        var employeeData = [res[i].name, res[i].depName, res[i].role_title]
        values.push(employeeData)
      }
      console.table(['Employee Name', 'Department', 'Role'], values)
      start();
    });
    
  }
  

  function viewByDeparment() {

    connection.query("SELECT * FROM department", function(err, results) {
      if (err) throw err;

      inquirer
        .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].depName);
                }
                return choiceArray;
              },
              message: "Which Department?"
            },
        ])
        .then(function(answer) {

          var chosenDep;
            for (var i = 0; i < results.length; i++) {
              if (results[i].depName === answer.choice) {
                chosenDep = results[i];
              }
            }
            var values = [];
            var query = "SELECT name, role_title FROM employee WHERE ?";
            connection.query(query,[{depName: chosenDep.depName}],function(err, res) {
              if (err) throw err;
              for (var i = 0; i < res.length; i++) {
                
                var employeeData = [res[i].name, res[i].role_title]
                values.push(employeeData)
              };
              console.table(['Employee Name', 'Role'], values)
              start();
            });
        });
    });
  }

  function addEmployee(){
    connection.query("SELECT * FROM department", function(err, results) {
      if (err) throw err;
      inquirer
          .prompt([
              {
                name: "name",
                type: "input",
                message: "What is the name of the employee?"
              },
              {
                name: "depChoice",
                type: "rawlist",
                choices: function() {
                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].depName);
                  }
                  return choiceArray;
                },
                message: "Which Department are they in?"
              },
          ])
          .then(function(answer) {
            var empName = answer.name
            var chosenDep;
            for (var i = 0; i < results.length; i++) {
              if (results[i].depName === answer.depChoice) {
                chosenDep = results[i];
              }
            }
            connection.query("SELECT * FROM role WHERE ? ", [{department_id: chosenDep.id}], function(err, results) {
              if (err) throw err;
              inquirer
                  .prompt([
                      {
                        name: "roleChoice",
                        type: "rawlist",
                        choices: function() {
                          var choiceArray = [];
                          for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                          }
                          return choiceArray;
                        },
                        message: "What is their role?"
                      },
                  ])
                  .then(function(answer) {
                    var chosenRole;
                    for (var i = 0; i < results.length; i++) {
                      if (results[i].title === answer.roleChoice) {
                        chosenRole = results[i];
                      }
                    }
                    var query = "INSERT INTO employee SET ?";
                    connection.query(query,[{
                      name: empName,
                      role_id: chosenRole.id,
                      role_title: chosenRole.title,
                      department_id: chosenDep.id,
                      depName: chosenDep.depName
                    }],function(err) {
                      if (err) throw err;
                      console.log("Employee Added!")
                      start();
                    });
                  });
            });
          });
    });
  };

  function updateEmployee(){
    var query = "SELECT * FROM employee";
    connection.query(query,function(err, res) {
      if (err) throw err;
      inquirer
        .prompt([
            {
              name: "empChoice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                  choiceArray.push(res[i].name);
                }
                return choiceArray;
              },
              message: "Which employee do you want to update?"
            },
        ])
        .then(function(answer) {
          var chosenEmp;
          for (var i = 0; i < res.length; i++) {
            if (res[i].name === answer.empChoice) {
              chosenEmp = res[i];
            }
          }
          connection.query("SELECT * FROM role WHERE ? ", [{department_id: chosenEmp.department_id}], function(err, results) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                      name: "roleChoice",
                      type: "rawlist",
                      choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                          choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                      },
                      message: "What role would you like to change this employee to?"
                    },
                ])
                .then(function(answer) {
                  var chosenRole;
                  for (var i = 0; i < results.length; i++) {
                    if (results[i].title === answer.roleChoice) {
                      chosenRole = results[i];
                    }
                  }
                  var query = "UPDATE employee SET ? WHERE ?";
                  connection.query(query,[
                    {
                      role_id: chosenRole.id,
                      role_title: chosenRole.title
                    },
                    {
                      id: chosenEmp.id
                    }
                  ],function(err) {
                    if (err) throw err;
                    console.log("Employee Updated!")
                    start();
                  });
                });
          });
      
        });
    });
  };

  function viewRoles(){
    var values = [];
    var query = "SELECT title FROM role";
    connection.query(query,function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
        
        var roleData = [res[i].title]
        values.push(roleData)
      }
      console.table(['Role'], values)
      start();
    });
  };

  function addRole(){
    connection.query("SELECT * FROM department", function(err, results) {
      if (err) throw err;
      inquirer
          .prompt([
              {
                name: "depChoice",
                type: "rawlist",
                choices: function() {
                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].depName);
                  }
                  return choiceArray;
                },
                message: "Which Department?"
              },
              {
                name: "title",
                type: "input",
                message: "What is the name of the role?"
              },
              {
                name: "salary",
                type: "input",
                message: "What is the salary?"
              },
          ])
          .then(function(answer) {

            var chosenDep;
            for (var i = 0; i < results.length; i++) {
              if (results[i].depName === answer.depChoice) {
                chosenDep = results[i];
              }
            }
            var query = "INSERT INTO role SET ?";
              connection.query(query,[{
                title: answer.title,
                salary: answer.salary,
                department_id: chosenDep.id 
              }],function(err) {
                if (err) throw err;
                console.log("Role Added!")
                start();
              });
          });
    });
  };

  function viewAllDeparment(){
    var values = [];
    var query = "SELECT depName FROM department";
    connection.query(query,function(err, res) {
      if (err) throw err;

      for (var i = 0; i < res.length; i++) {
        
        var depData = [res[i].depName]
        values.push(depData)
      }
      console.table(['Departments'], values)
      start();
    });
  };

  function addDepartment(){
    inquirer
      .prompt([
          {
            name: "depName",
            type: "input",
            message: "What is the name of the Department?"
          },
      ])
      .then(function(answer) {
        var query = "INSERT INTO department SET ?";
        connection.query(query,[{depName: answer.depName}],function(err) {
           if (err) throw err;
          console.log("Department Added!")
          start();
        });
      });
    
  };
  