const db = require('../db'); // Import the database connection

// Function to get all products
const getAllProducts = async () => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `);
        return rows;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Unable to fetch products');
    }
};

// Function to get products by category
const getProductsByCategory = async (categoryId) => {
    try {
        const [rows] = await db.execute(`
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.category_id = ?
        `, [categoryId]);
        
        return rows;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw new Error('Unable to fetch products by category');
    }
};

// Function to add a new product
const addProduct = async (
    general_name,
    scientific_name,
    brief_description,
    uses,
    cost,
    category_id,
    image_path
) => {
    // Validate required fields
    if (
        !general_name ||
        !scientific_name ||
        !brief_description ||
        !uses ||
        cost === undefined ||
        !category_id ||
        !image_path
    ) {
        throw new Error('Missing required fields');
    }

    try {
        const [result] = await db.execute(
            `
            INSERT INTO products 
                (general_name, scientific_name, brief_description, uses, cost, category_id, image_path)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                general_name,
                scientific_name,
                brief_description,
                uses,
                cost,
                category_id,
                image_path
            ]
        );
        return result.insertId;
    } catch (error) {
        console.error('Error adding product:', error);
        throw new Error('Unable to add product');
    }
};

// Function to delete a product by its ID
const deleteProductById = async (productId) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM products WHERE id = ?',
            [productId]
        );
        return result; // Contains affectedRows to check if the deletion was successful
    } catch (error) {
        console.error('Error deleting product:', error);
        throw new Error('Unable to delete product');
    }
};

module.exports = { getAllProducts, getProductsByCategory, addProduct, deleteProductById };
