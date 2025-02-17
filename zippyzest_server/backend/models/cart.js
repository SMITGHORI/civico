const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    cartitems: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'CartItem',
        required : true
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

cartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Cart', cartSchema);
/*
  {
    "userId" : "66d7e35cb98ae81efed5b6d7",
    "cartitems" : [
       {
          "productId" : "66d80995de38d106956cc358",
          "quantity" : 2,
          "price" : 200000,
       }
        {
          "productId" : "66d80ada625153f2f54c1fe0",
          "quantity" : 2,
          "price" : 20,
       }
    ]
    "totalPrice" : 2020
  }*/