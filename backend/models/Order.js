const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    expectedDeliveryDate: { type: Date, required: true },
    maxPrice: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };
