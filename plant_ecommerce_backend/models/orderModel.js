const db = require('../db'); // Import the database connection

// Function to place an order
const placeOrder = async (userId, productIdsWithQuantity, totalAmount) => {
    const connection = await db.getConnection(); // Get a connection for the transaction
    try {
        await connection.beginTransaction(); // Start the transaction

        // Set default order status to 'pending'
        const status = 'pending';

        // Insert the new order into the database
        const [result] = await connection.execute(
            'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
            [userId, totalAmount, status]
        );

        const orderId = result.insertId;

        // Now, handle the order items (product details) in a related table
        const orderItems = productIdsWithQuantity.map(item => [
            orderId,
            item.productId,
            item.quantity // Each item now contains a quantity
        ]);

        // Log the order items for debugging
        console.log('Order items:', orderItems);

        // Insert products into the 'order_items' table using a bulk insert
        await connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?',
            [orderItems] // Bulk insert the products and quantities for this order
        );

        await connection.commit(); // Commit the transaction

        return orderId;  // Return the order ID after placing the order
    } catch (err) {
        await connection.rollback(); // Rollback if any error occurs
        console.error('Error placing order:', err.message);
        throw new Error(`Error placing order: ${err.message}`);  // Include the error message for better debugging
    } finally {
        connection.release(); // Release the connection back to the pool
    }
};

// Function to get all orders for a specific user
const getUserOrders = async (userId) => {
    try {
        // Fetch all orders for the specific user, including their order items
        const [rows] = await db.execute(
            `SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at, o.updated_at, 
                    oi.product_id, oi.quantity 
             FROM orders o 
             LEFT JOIN order_items oi ON o.id = oi.order_id 
             WHERE o.user_id = ?`,
            [userId]
        );

        return rows.length ? rows : []; // If no orders are found, return an empty array
    } catch (err) {
        console.error('Error fetching user orders:', err.message);
        throw new Error(`Error fetching user orders: ${err.message}`);
    }
};

// Function to update the status of an order with a strong ownership check
const updateOrderStatus = async (userId, orderId, status) => {
    try {
        console.log(`Attempting to update order status for Order ID: ${orderId}, User ID: ${userId}, New Status: ${status}`);

        const validStatuses = ['pending', 'completed', 'canceled'];

        // Validate the provided status
        if (!validStatuses.includes(status)) {
            console.error(`Invalid status provided: ${status}`);
            throw new Error('Invalid status');
        }

        // Check if the order exists and belongs to the user
        const [existingOrder] = await db.execute(
            'SELECT status FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );

        if (!existingOrder.length) {
            console.error(`Order not found or does not belong to user: ${userId}`);
            throw new Error('Order not found or unauthorized access');
        }

        // Extract the current status of the order
        const currentStatus = existingOrder[0].status;

        // Prevent unnecessary updates if the status is already the same
        if (currentStatus === status) {
            console.log(`Order ID: ${orderId} is already in the desired status: ${status}`);
            return false; // No update needed
        }

        // Update the order status
        const [result] = await db.execute(
            'UPDATE orders SET status = ? WHERE id = ? AND user_id = ?',
            [status, orderId, userId]
        );

        if (result.affectedRows === 0) {
            throw new Error('Order status update failed');
        }

        console.log(`Order ID: ${orderId} status updated to ${status}`);
        return true; // Return true if the update was successful
    } catch (err) {
        console.error('Error updating order status:', err.message);
        throw new Error(`Error updating order status: ${err.message}`);
    }
};

module.exports = { placeOrder, getUserOrders, updateOrderStatus };

