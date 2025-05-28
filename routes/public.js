const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Product } = require('../models/Product');

// Region extraction (optional for public)
router.use((req, res, next) => {
  const region = req.header('x-region');
  if (!region || !['Europe', 'Asia', 'US'].includes(region)) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }
  req.region = region;
  next();
});

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const user = new User({
      name,
      email,
      password,
      address,
      region: req.region
    });

    await user.save();
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (err) {
    res.status(400).json({ error: 'Validation failed: ' + err.message });
  }
});

// View available products (public)
router.get('/products', async (req, res) => {
  const products = await Product.find({ regions: req.region });
  res.json(products);
});

module.exports = router;
