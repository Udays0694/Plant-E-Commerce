const express = require('express');
const multer = require('multer');
const { getAllProducts, addProduct, getProductsByCategory, deleteProductById } = require('../models/productModel');
const authenticate = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const router = express.Router();

// Set up multer storage and file filter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the destination folder for the images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Set a unique filename for each image
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }); // Set multer for handling image uploads

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Unable to fetch products', error: error.message });
    }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await getProductsByCategory(categoryId);
        if (products.length === 0) {
            return res.status(404).json({ message: `No products found for category ${categoryId}` });
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Unable to fetch products by category', error: error.message });
    }
});

// Add a new product (open route, no authentication)
router.post('/add', upload.single('image'), async (req, res) => {
    const { general_name, scientific_name, brief_description, uses, cost, category_id } = req.body;

    // Check if image file is uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required.' });
    }

    // Validate required fields
    if (!general_name || !scientific_name || !brief_description || !uses || cost === undefined || !category_id) {
        return res.status(400).json({
            message: 'Missing required fields: general_name, scientific_name, brief_description, uses, cost, and category_id are required.'
        });
    }

    // Validate cost and category_id
    if (isNaN(cost) || isNaN(category_id)) {
        return res.status(400).json({ message: 'Cost and category_id must be valid numbers.' });
    }

    try {
        // Pass the image file path and other product data to the addProduct function
        const imagePath = `uploads/${req.file.filename}`;  // Corrected imagePath with backticks
        const productId = await addProduct(
            general_name,
            scientific_name,
            brief_description,
            uses,
            cost,
            category_id,
            imagePath // Include the image path
        );
        res.status(201).json({
            message: 'Product added successfully',
            productId
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
});

// Add a new product (admin-only route)
router.post('/add/admin', authenticate, isAdmin, upload.single('image'), async (req, res) => {
    const { general_name, scientific_name, brief_description, uses, cost, category_id } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required.' });
    }

    if (!general_name || !scientific_name || !brief_description || !uses || cost === undefined || !category_id) {
        return res.status(400).json({
            message: 'Missing required fields: general_name, scientific_name, brief_description, uses, cost, and category_id are required.'
        });
    }

    if (isNaN(cost) || isNaN(category_id)) {
        return res.status(400).json({ message: 'Cost and category_id must be valid numbers.' });
    }

    try {
        const imagePath = `uploads/${req.file.filename}`;  // Corrected imagePath with backticks
        const productId = await addProduct(
            general_name,
            scientific_name,
            brief_description,
            uses,
            cost,
            category_id,
            imagePath // Include the image path
        );
        res.status(201).json({ message: 'Product added successfully', productId });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    }
});

// Delete a product by ID (admin-only route)
router.delete('/delete/:id', authenticate, isAdmin, async (req, res) => {
    const productId = req.params.id;

    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
        // Call the deleteProductById function from productModel
        const result = await deleteProductById(productId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});

module.exports = router;
