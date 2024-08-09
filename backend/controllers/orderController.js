const { Order } = require('../models/Order');

exports.createOrder = async (req, res) => {
    const { name, quantity, expectedDeliveryDate, maxPrice, description, status } = req.body;

    if (!name || !quantity || !expectedDeliveryDate || !maxPrice || !description || !status) {
        return res.status(400).json({ message: 'Missing required fields: name, quantity, expectedDeliveryDate, maxPrice, description, status' });
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`; // Generate Order ID in required format
    const newOrder = new Order({ orderId, name, quantity, expectedDeliveryDate, maxPrice, description, status });

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Active' });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching active orders', error });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: 'Active' } });
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching order history', error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
        return res.status(400).json({ message: 'Missing required fields: orderId, status' });
    }

    try {
        const updatedOrder = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: `Order with ID ${orderId} not found` });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order status', error });
    }
};
