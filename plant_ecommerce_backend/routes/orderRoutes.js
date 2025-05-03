const express = require('express');
const { placeOrder, getUserOrders, updateOrderStatus } = require('../models/orderModel'); // Ensure updateOrderStatus is added to your orderModel
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

// Place an order
router.post('/place', authenticate, async (req, res) => {
    const { userId, productIdsWithQuantity, totalAmount } = req.body;

    // Validate request body
    if (!userId || !productIdsWithQuantity || !Array.isArray(productIdsWithQuantity) || !totalAmount) {
        return res.status(400).json({ errorMessage: 'Missing or invalid parameters' });
    }

    // Check if user is authorized (ensure that the logged-in user matches the userId in the request)
    if (req.user.userId !== userId) {
        return res.status(403).json({ errorMessage: 'You are not authorized to place an order for this user.' });
    }

    // Ensure all products have both productId and quantity, and that quantity is a positive integer
    if (!productIdsWithQuantity.every(item =>
        item.productId && Number.isInteger(item.productId) &&
        item.quantity && Number.isInteger(item.quantity) && item.quantity > 0
    )) {
        return res.status(400).json({ errorMessage: 'Invalid or non-positive product quantity' });
    }

    try {
        // Place the order and get the orderId
        const orderId = await placeOrder(userId, productIdsWithQuantity, totalAmount);
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
        console.error('Error placing order:', err.message);
        res.status(500).json({ errorMessage: 'Error placing order', error: err.message });
    }
});

// Get all orders for a user
router.get('/:userId', authenticate, async (req, res) => {
    const userId = parseInt(req.params.userId, 10);  // Ensure the userId is an integer

    // Validate userId parameter
    if (!userId || Number.isNaN(userId)) {
        return res.status(400).json({ errorMessage: 'Invalid User ID' });
    }

    // Check if user is authorized (ensure that the logged-in user matches the userId in the URL)
    if (req.user.userId !== userId) {
        return res.status(403).json({ errorMessage: 'You are not authorized to view this user\'s orders.' });
    }

    try {
        // Fetch orders for the given userId
        const orders = await getUserOrders(userId);

        // If no orders are found, return a 404 response
        if (orders.length === 0) {
            return res.status(404).json({ errorMessage: 'No orders found for this user' });
        }

        // Format and return orders
        const formattedOrders = orders.map(order => ({
            orderId: order.id,
            totalAmount: order.total_amount,
            status: order.status,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            items: orders.filter(item => item.order_id === order.id).map(item => ({
                productId: item.product_id,
                quantity: item.quantity
            }))
        }));

        res.json(formattedOrders); // Return the formatted orders
    } catch (err) {
        console.error('Error fetching user orders:', err.message);
        res.status(500).json({ errorMessage: 'Error fetching orders', error: err.message });
    }
});

// Update order status
router.put('/:userId/orders/:orderId/status', authenticate, async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const orderId = parseInt(req.params.orderId, 10);  // Extract orderId from the URL
    const { status } = req.body;

    // Validate userId and orderId parameters
    if (!userId || Number.isNaN(userId)) {
        return res.status(400).json({ errorMessage: 'Invalid User ID' });
    }

    if (!orderId || Number.isNaN(orderId)) {
        return res.status(400).json({ errorMessage: 'Invalid Order ID' });
    }

    // Check if user is authorized (ensure that the logged-in user matches the userId in the URL)
    if (req.user.userId !== userId) {
        return res.status(403).json({ errorMessage: 'You are not authorized to update this user\'s order status.' });
    }

    // Check if status is valid
    const validStatuses = ['pending', 'completed', 'canceled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ errorMessage: 'Invalid status. Valid statuses are: pending, completed, canceled' });
    }

    try {
        // Update order status
        const success = await updateOrderStatus(userId, orderId, status);  // Pass the orderId to the update function
        if (success) {
            res.status(200).json({ message: 'Order status updated successfully' });
        } else {
            res.status(404).json({ errorMessage: 'Order not found or status is already set to the desired value' });
        }
    } catch (err) {
        console.error('Error updating order status:', err.message);
        res.status(500).json({ errorMessage: 'Error updating order status', error: err.message });
    }
});

module.exports = router;
