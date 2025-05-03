const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection pool to MySQL database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,  // Read port from environment variables
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Successfully connected to the database');
        connection.release();  // Release the connection
    }
});

// Export the pool with promise support
module.exports = pool.promise();

