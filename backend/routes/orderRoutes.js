const express = require('express');
const { createOrder, getOrders, getOrderHistory, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/history', getOrderHistory);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
