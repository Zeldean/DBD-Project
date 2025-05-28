const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Order } = require('../models/Order');
const { Product } = require('../models/Product');

// Region check
router.use((req, res, next) => {
  const region = req.header('x-region');
  if (!region || !['Europe', 'Asia', 'US'].includes(region)) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }
  req.region = region;
  next();
});

// Simple admin token check
router.use((req, res, next) => {
  const token = req.header('x-admin-token');
  if (token !== 'admin123') return res.status(403).json({ error: 'Forbidden' });
  next();
});

// View all users in region
router.get('/users', async (req, res) => {
  const users = await User.find({ region: req.region });
  res.json(users);
});

// View all orders in region
router.get('/orders', async (req, res) => {
  const orders = await Order.find({ region: req.region }).populate('userId');
  res.json(orders);
});

// View product stock
router.get('/products', async (req, res) => {
  const products = await Product.find({ regions: req.region });
  res.json(products);
});

// Delete product
router.delete('/product/:id', async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.json({ success: result.deletedCount > 0 });
});

// Region sales stats
router.get('/stats/sales', async (req, res) => {
  const orders = await Order.find({ region: req.region });
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  res.json({ totalRevenue, ordersCount: orders.length });
});

module.exports = router;
