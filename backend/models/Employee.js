const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeNo: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Add index for faster queries
employeeSchema.index({ employeeNo: 1 });

module.exports = mongoose.model('Employee', employeeSchema); 