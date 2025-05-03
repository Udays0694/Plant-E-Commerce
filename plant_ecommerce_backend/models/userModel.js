const db = require('../db'); // Import the database connection

// Function to add a new user
const addUser = async (username, email, password, role = 'user') => {
    try {
        // Insert user into the database, including username, email, password, and role
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role] // Default role is 'user'
        );
        return result.insertId;  // Return the ID of the newly added user
    } catch (error) {
        console.error("Error adding user: ", error);
        throw new Error('Error adding user to the database: ' + error.message);  // Enhanced error message
    }
};

// Function to get a user by username
const getUserByUsername = async (username) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows.length > 0 ? rows[0] : null;  // If no user found, return null
    } catch (error) {
        console.error("Error fetching user by username: ", error);
        throw new Error('Error fetching user from the database: ' + error.message);
    }
};

// Function to check if an email already exists in the database
const getUserByEmail = async (email) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows.length > 0 ? rows[0] : null;  // If no user found with this email, return null
    } catch (error) {
        console.error("Error fetching user by email: ", error);
        throw new Error('Error fetching user by email from the database: ' + error.message);
    }
};

module.exports = { addUser, getUserByUsername, getUserByEmail };
