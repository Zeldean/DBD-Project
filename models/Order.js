const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'Product'
   },
  quantity: { 
    type: Number,
     required: true
   }
});

const OrderSchema = new mongoose.Schema({
  userId: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
   },
  items: [OrderItemSchema],
  
  totalPrice: { 
     type: Number,
     required: true
   },
  status: { 
     type: String,
     enum: ['Pending', 'Shipped', 'Delivered'],
     default: 'Pending'
   },
  orderDate: { 
    type: Date,
     default: Date.now
   }
});
const Order = mongoose.model('Order', OrderSchema);
module.exports = {Order};
