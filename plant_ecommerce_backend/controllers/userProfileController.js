const db = require('../db');  // Import the db connection

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;  // User ID is available from the token after authentication

        // SQL query to get the user profile based on the userId
        const [rows] = await db.execute('SELECT id, username, email, phone, address, profile_picture, role FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        // Respond with the user profile data
        const profileData = rows[0];  // The query returns an array of rows, we want the first one
        return res.status(200).json(profileData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { username, email, phone, address, profile_picture } = req.body;

        // Validation for required fields
        if (!username || !email || !phone || !address || !profile_picture) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // SQL query to update the user profile in the users table
        const [result] = await db.execute(
            `UPDATE users SET username = ?, email = ?, phone = ?, address = ?, profile_picture = ? WHERE id = ?`,
            [username, email, phone, address, profile_picture, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User profile not found.' });
        }

        return res.status(200).json({ message: 'Profile updated successfully.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};
