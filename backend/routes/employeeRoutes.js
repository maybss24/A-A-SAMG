const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.addEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router; 