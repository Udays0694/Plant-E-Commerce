const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection pool to MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST,       // The host for your MySQL server (usually localhost)
    user: process.env.DB_USER,       // Your MySQL username
    password: process.env.DB_PASSWORD, // Your MySQL password
    database: process.env.DB_NAME,    // The name of your database
    port: 3310, // MySQL custom port
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to the database');
        connection.release();  // Release the connection when done
    }
});

// Export the pool with promises to handle async queries more easily
module.exports = pool.promise();

