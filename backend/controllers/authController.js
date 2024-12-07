const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Register new admin
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create new admin
        const admin = new Admin({
            username,
            password
        });

        await admin.save();

        // Create token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: 'Admin registered successfully',
            token,
            admin: {
                username: admin.username
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
};

// Login admin
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            admin: {
                username: admin.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Get admin profile
exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id).select('-password');
        res.json(admin);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
}; 