const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeNo: {
        type: String,
        required: true
   },
    date: {
        type: Date,
        required: true
    },
    timeIn: {
        type: Date
    },
    timeOut: {
        type: Date
    },
    status: {
        type: String,
        enum: ['PRESENT', 'LATE', 'ABSENT'],
        default: 'PRESENT'
    }
}, {
    timestamps: true
});

// Add index for faster queries
attendanceSchema.index({ employeeNo: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);