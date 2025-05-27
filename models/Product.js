const mongoose = require('mongoose');

// Embedded Review Schema
const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required for a review']
  },

  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be no more than 5']
  },

  comment: {
    type: String,
    required: [true, 'Comment is required'],
    minlength: [5, 'Comment must be at least 5 characters']
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [2, 'Product name must be at least 2 characters']
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },

  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },

  category: {
    type: String,
    required: [true, 'Category is required']
  },

  reviews: [ReviewSchema], // Embedded

  createdAt: {
    type: Date,
    default: Date.now
  },

  regions: {
    type: [{
      type: String,
      enum: {
        values: ['Europe', 'Asia', 'US'],
        message: 'Region must be Europe, Asia, or US'
      }
    }],
    required: [true, 'At least one region must be specified'],
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'Product must be available in at least one region'
    }
  }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = { Product };
