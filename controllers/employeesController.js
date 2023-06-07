const data = {
    employees: require("../model/data.json"),
    setEmployees: function (data) {
        this.employees = data;
    },
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createEmployee = (req, res) => {
    console.log(req.body);
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    };

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ message: "First and last name are required." });
    }

    data.setEmployees([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
    const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));

    if (!employee) {
        return res.status(400).json({ message: "Does not find employee with that ID!" });
    }

    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    const filterdArray = data.employees.filter((emp) => emp.id !== parseInt(req.params.id));
    const unsortedArray = [...filterdArray, employee];

    data.setEmployees(unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0)));
    res.json(data.employees);
};

const deleteEmployee = (req, res) => {
    const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));

    if (!employee) {
        return res.status(400).json({ message: `Can not find employee with ID: ${req.params.id}!` });
    }

    const filterdArray = data.employees.filter((emp) => emp.id !== parseInt(req.params.id));

    data.setEmployees([...filterdArray]);
    res.status(200).json(data.employees);
};

const getEmployee = (req, res) => {
    const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));

    if (!employee) {
        return res.status(400).json({ message: `Can not find employee with ID: ${req.params.id}!` });
    }

    res.status(200).json(employee);
};

module.exports = { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee };
