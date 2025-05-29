const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { User } = require('../models/User');
const { Order } = require('../models/Order');
const { Product } = require('../models/Product');

// Region middleware
router.use((req, res, next) => {
  const region = req.header('x-region');
  if (!region || !['Europe', 'Asia', 'US'].includes(region)) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }
  req.region = region;
  next();
});

// Simulated auth middleware
router.use(async (req, res, next) => {
  const email = req.header('x-user-email');
  const pass = req.header('x-user-password');
  if (!email || !pass) return res.status(401).json({ error: 'Missing x-user-email or x-user-password header' });

  const user = await User.findOne({ email: email.toLowerCase(), region: req.region, password: pass});
  if (!user) return res.status(404).json({ error: 'User not found' });
  

  req.user = user;
  next();
});

// GET user profile
router.get('/profile', (req, res) => {
  res.json(req.user);
});

// GET all user's orders
router.get('/orders', async (req, res) => {
  const orders = await Order.find({ userId: req.user._id, region: req.region }).populate('items.productId');
  res.json(orders);
});

// POST create new order
router.post('/orders', async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (!items || !Array.isArray(items) || typeof totalPrice !== 'number') {
      return res.status(400).json({ error: 'Invalid order structure' });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      totalPrice,
      region: req.region
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Order creation failed: ' + err.message });
  }
});

// DELETE a pending order
router.delete('/orders/:id', async (req, res) => {
  try {
    const result = await Order.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
      region: req.region,
      status: 'Pending'
    });

    if (!result) {
      return res.status(404).json({ error: 'Pending order not found or not allowed to delete' });
    }

    res.json({ message: 'Order deleted successfully', deletedOrderId: result._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete order: ' + err.message });
  }
});


// GET user total spending
router.get('/spending', async (req, res) => {
  const orders = await Order.find({ userId: req.user._id, region: req.region });
  const total = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  res.json({ totalSpending: total });
});

// GET user's reviews
router.get('/reviews', async (req, res) => {
  const userId = req.user._id;
  const region = req.region;

  try {
    const reviews = await Product.aggregate([
      {
        $match: {
          regions: region,
          'reviews.userId': userId
        }
      },
      {
        $project: {
          name: 1,
          matchedReviews: {
            $filter: {
              input: '$reviews',
              as: 'rev',
              cond: { $eq: ['$$rev.userId', userId] }
            }
          }
        }
      },
      { $unwind: '$matchedReviews' },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$matchedReviews',
              {
                productId: '$_id',
                productName: '$name'
              }
            ]
          }
        }
      }
    ]);

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate reviews' });
  }
});

// PUT update a review for a product
router.put('/reviews/:productId', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (typeof rating !== 'number' || rating < 1 || rating > 5 || typeof comment !== 'string') {
      return res.status(400).json({ error: 'Invalid review format' });
    }

    const product = await Product.findOne({
      _id: productId,
      regions: req.region
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found in this region' });
    }

    const review = product.reviews.find(r => r.userId.equals(req.user._id));
    if (!review) {
      return res.status(404).json({ error: 'Review not found for this user' });
    }

    review.rating = rating;
    review.comment = comment;
    review.createdAt = new Date();

    await product.save();

    res.json({ message: 'Review updated successfully', review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review: ' + err.message });
  }
});


// POST add a new review to a product
router.post('/reviews', async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findOne({ _id: productId, regions: req.region });
    if (!product) return res.status(404).json({ error: 'Product not found or unavailable in region' });

    product.reviews.push({
      userId: req.user._id,
      rating,
      comment
    });

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to submit review: ' + err.message });
  }
});



module.exports = router;
