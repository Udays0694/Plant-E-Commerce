const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Optional: to handle CORS if your frontend and backend are running on different ports
const path = require('path'); // Required to work with file paths

const userRoutes = require('./routes/userRoutes');  // Import the user routes

dotenv.config(); // To load environment variables from the .env file

const app = express();
const port = process.env.PORT || 5000; // Default to port 5000 if not specified

// Middleware to parse incoming JSON data
app.use(express.json()); 

// Optional CORS middleware for handling cross-origin requests (if frontend and backend are on different ports)
app.use(cors());

// Serve static files from the 'uploads' folder (make sure this is the correct path to your images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route to test if the server is running
app.get('/', (req, res) => {
    res.send('Welcome to the Plant E-commerce API!');
});

// Routes for handling different requests
app.use('/auth', require('./routes/authRoutes')); // Ensure 'authRoutes' is set up correctly
app.use('/products', require('./routes/productRoutes')); // Ensure 'productRoutes' is set up correctly
app.use('/orders', require('./routes/orderRoutes')); // Ensure 'orderRoutes' is set up correctly
app.use('/users', require('./routes/userRoutes'));  // Ensure 'userRoutes' is set up correctly

// Handle 404 - route not found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
