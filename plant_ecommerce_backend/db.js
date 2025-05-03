const mysql = require('mysql9');
const dotenv = require('dotenv');
dotenv.config();

// Create a connection pool to MySQL database using Railway's env variables
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error connecting to the database:', err);
    } else {
        console.log('✅ Successfully connected to the Railway MySQL database');
        connection.release();
    }
});

// Export the pool with promise support
module.exports = pool.promise();

