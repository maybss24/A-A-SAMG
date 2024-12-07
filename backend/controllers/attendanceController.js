const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Get attendance list
exports.getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find().sort({ date: -1 });
        
        // Get employee details for each attendance record
        const attendanceWithNames = await Promise.all(
            attendance.map(async (record) => {
                const employee = await Employee.findOne({ employeeNo: record.employeeNo });
                return {
                    ...record.toObject(),
                    firstName: employee ? employee.firstName : 'Unknown',
                    lastName: employee ? employee.lastName : 'Employee'
                };
            })
        );

        res.json(attendanceWithNames);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: error.message });
    }
};

// Record time in
exports.timeIn = async (req, res) => {
    try {
        const { employeeNo } = req.body;

        // Find employee
        const employee = await Employee.findOne({ employeeNo });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if already timed in today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const existingAttendance = await Attendance.findOne({
            employeeNo,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ 
                message: 'Employee has already timed in today'
            });
        }

        // Get current time
        const currentTime = new Date();
        const cutoffTime = new Date(today.setHours(10, 0, 0)); // 9:00 AM cutoff

        // Create new attendance record with status
        const attendance = new Attendance({
            employeeNo,
            date: new Date(),
            timeIn: currentTime,
            status: currentTime > cutoffTime ? 'LATE' : 'PRESENT'
        });

        const newAttendance = await attendance.save();
        
        // Include employee name in response
        const attendanceWithName = {
            ...newAttendance.toObject(),
            firstName: employee.firstName,
            lastName: employee.lastName
        };

        res.status(201).json({
            message: 'Time in recorded successfully',
            attendance: attendanceWithName
        });

    } catch (error) {
        console.error('Error recording time in:', error);
        res.status(400).json({ message: error.message });
    }
};

// Record time out
exports.timeOut = async (req, res) => {
    try {
        const { employeeNo } = req.body;

        // Find employee
        const employee = await Employee.findOne({ employeeNo });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Find today's attendance record
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            employeeNo,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            timeOut: null // Only find records without timeout
        });

        if (!attendance) {
            return res.status(404).json({ 
                message: 'No active time in record found for today' 
            });
        }

        attendance.timeOut = new Date();
        const updatedAttendance = await attendance.save();

        // Include employee name in response
        const attendanceWithName = {
            ...updatedAttendance.toObject(),
            firstName: employee.firstName,
            lastName: employee.lastName
        };

        res.json({
            message: 'Time out recorded successfully',
            attendance: attendanceWithName
        });

    } catch (error) {
        console.error('Error recording time out:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get attendance by date range
exports.getAttendanceByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        const query = {
            date: {}
        };

        if (startDate) {
            query.date.$gte = new Date(startDate);
        }
        if (endDate) {
            query.date.$lte = new Date(endDate);
        }

        const attendance = await Attendance.find(query)
            .sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        console.error('Error fetching attendance by date range:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get attendance by employee number
exports.getEmployeeAttendance = async (req, res) => {
    try {
        const { employeeNo } = req.params;
        console.log('Fetching attendance for employee:', employeeNo);

        // Find employee first to verify they exist
        const employee = await Employee.findOne({ employeeNo });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Get all attendance records for this employee
        const attendance = await Attendance.find({ employeeNo })
            .sort({ date: -1 }); // Most recent first

        res.json({
            employeeNo,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            attendance: attendance
        });

    } catch (error) {
        console.error('Error fetching employee attendance:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get today's attendance for an employee
exports.getEmployeeTodayAttendance = async (req, res) => {
    try {
        const { employeeNo } = req.params;
        
        // Set up today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const attendance = await Attendance.findOne({
            employeeNo,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        if (!attendance) {
            return res.status(404).json({ 
                message: 'No attendance record found for today' 
            });
        }

        res.json(attendance);

    } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
        res.status(500).json({ message: error.message });
    }
};

// Mark employee as absent
exports.markAbsent = async (req, res) => {
    try {
        const { employeeNo } = req.body;

        // Find employee
        const employee = await Employee.findOne({ employeeNo });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if attendance already exists for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingAttendance = await Attendance.findOne({
            employeeNo,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ 
                message: 'Attendance record already exists for today' 
            });
        }

        // Create absent record
        const attendance = new Attendance({
            employeeNo,
            date: new Date(),
            status: 'ABSENT'
        });

        const newAttendance = await attendance.save();

        res.status(201).json({
            message: 'Employee marked as absent',
            attendance: {
                ...newAttendance.toObject(),
                firstName: employee.firstName,
                lastName: employee.lastName
            }
        });

    } catch (error) {
        console.error('Error marking absent:', error);
        res.status(400).json({ message: error.message });
    }
}; 