const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { addUser, getUserByUsername, getUserByEmail } = require('../models/userModel');  // Ensure correct path to your model file
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password, role = 'user' } = req.body;  // Default role is 'user'

    try {
        // Check if username already exists
        const userExists = await getUserByUsername(username);
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Check if email already exists
        const emailExists = await getUserByEmail(email);
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Add the user to the database, including the role
        const userId = await addUser(username, email, hashedPassword, role);
        return res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check if the password is valid
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token, including role in payload
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

module.exports = router;
