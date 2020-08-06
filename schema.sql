DROP DATABASE IF EXISTS employment_trackerDB;
CREATE database employment_trackerDB;

USE employment_trackerDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    depName VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (depName) VALUES ('Engineering');
INSERT INTO department (depName) VALUES ('Legal');

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title  VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    department_id  INT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO role (title, salary, department_id) VALUES ('Lead Engineer', 150000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 50000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Lawyer', 250000, 2);


CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,    
    name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    role_title  VARCHAR(30) NOT NULL,
    department_id  INT NOT NULL,
    depName VARCHAR(30) NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO employee (name, role_id, role_title, department_id, depName) VALUES ('Sarah Nance', 1, 'Lead Engineer', 1, 'Engineering');
INSERT INTO employee (name, role_id, role_title, department_id, depName, manager_id) VALUES ('Peter Knot', 2, 'Software Engineer', 1, 'Engineering', 1);
INSERT INTO employee (name, role_id, role_title, department_id, depName) VALUES ('Matt Hughs', 3, 'Lawyer', 2, 'Legal');
INSERT INTO employee (name, role_id, role_title, department_id, depName, manager_id) VALUES ('Tom Wright', 3, 'Lawyer', 2, 'Legal', 3);