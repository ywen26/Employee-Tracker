USE employee_DB;

INSERT INTO department (name)
VALUES ("Cantonese"), ("Mandarin"), ("IP"), ("Nursing");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Cantonese Supervisor", 82000, 1),
    ("Cantonese Worker", 45000, 1),
    ("Mandarin Supervisor", 82000, 2),
    ("Mandarin Worker", 45000, 2),
    ("IP Specialist", 56000, 3),
    ("Program Assistant", 38000, 3),
    ("Nursing consultant", 61000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Kevin", "Li", 1, null),
    ("Johnson", "Ho", 2, 1),
    ("Stephanie", "Suen", 2, 1),
    ("Ida", "Ng", 2, 1),
    ("Ida", "Tse", 2, 1),
    ("Queenie", "Wong", 2, 1),
    ("Nora", "Yung", 2, 1),
    ("Clara", "Yu", 2, 1),
    ("Yuwen", "Yu", 2, 1),
    ("Yu-An", "Wang", 3, null),
    ("Kathy", "Wu", 4, 10),
    ("Wenyi", "Ren", 4, 10),
    ("Cindy", "Tran", 5, null),
    ("Lily", "Wong", 6, 13),
    ("Michelle", "Yip", 7, null);
