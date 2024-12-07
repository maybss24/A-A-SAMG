const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get admin from token
        req.admin = await Admin.findById(decoded.id).select('-password');
        next();

    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Not authorized', error: error.message });
    }
};

module.exports = { protect }; 