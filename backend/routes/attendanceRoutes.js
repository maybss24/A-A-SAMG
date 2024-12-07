const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAttendance);
router.post('/time-in', attendanceController.timeIn);
router.post('/time-out', attendanceController.timeOut);
router.get('/date-range', attendanceController.getAttendanceByDateRange);

router.get('/employee/:employeeNo', attendanceController.getEmployeeAttendance);
router.get('/employee/:employeeNo/today', attendanceController.getEmployeeTodayAttendance);
router.post('/mark-absent', attendanceController.markAbsent);

module.exports = router; 