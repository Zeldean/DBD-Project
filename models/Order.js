const mongoose = require('mongoose');

// Schema for individual items in an order
const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required for each order item']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  }
});

// Main order schema
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required for an order']
  },

  items: {
    type: [OrderItemSchema],
    required: [true, 'At least one item is required in an order'],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },

  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price must be a positive number']
  },

  status: {
    type: String,
    enum: {
      values: ['Pending', 'Shipped', 'Delivered'],
      message: 'Status must be Pending, Shipped, or Delivered'
    },
    default: 'Pending'
  },

  orderDate: {
    type: Date,
    default: Date.now
  },

  region: {
    type: String,
    required: [true, 'Region is required'],
    enum: {
      values: ['Europe', 'Asia', 'US'],
      message: 'Region must be Europe, Asia, or US'
    }
  }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = { Order };
