// models/cartItemSchema.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('CartItem', cartItemSchema);
