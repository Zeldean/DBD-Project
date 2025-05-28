const express = require('express');
const router = express.Router();
const { Order } = require('../models/Order');

// GET all orders from the region
router.get('/', async (req, res) => {
  const region = req.region;

  if (!region) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }

  try {
    const orders = await Order.find({ region }).populate('userId').populate('items.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// POST create new order (region taken from request header)
router.post('/', async (req, res) => {
  const region = req.region;

  if (!region) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }

  const { userId, items, totalPrice } = req.body;

  try {
    const order = new Order({
      userId,
      items,
      totalPrice,
      region
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: 'Validation error: ' + err.message });
  }
});

module.exports = router;
