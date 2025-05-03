const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
    // Get token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Check if no token is provided
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Log the decoded userId for debugging purposes
        console.log('Decoded userId:', decoded.userId);  // Add this for debugging
        
        // Attach the decoded user data to the request object
        req.user = decoded;
        
        // Pass control to the next middleware or route handler
        next();
    } catch (error) {
        // Return an error response if the token is invalid
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticate;

