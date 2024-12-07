const Employee = require('../models/Employee');

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

// Add new employee
exports.addEmployee = async (req, res) => {
    const employee = new Employee({
        employeeNo: req.body.employeeNo,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        position: req.body.position
    });

    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update fields
        if (req.body.firstName) employee.firstName = req.body.firstName;
        if (req.body.middleName) employee.middleName = req.body.middleName;
        if (req.body.lastName) employee.lastName = req.body.lastName;
        if (req.body.position) employee.position = req.body.position;

        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(500).json({ message: error.message });
    }
};