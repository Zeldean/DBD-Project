const express = require('express');
const router = express.Router();
const { Product } = require('../models/Product');

// GET all products available in the request region
router.get('/', async (req, res) => {
  const region = req.region;

  if (!region) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }

  try {
    const products = await Product.find({ regions: region });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// POST create new product available in specific regions
router.post('/', async (req, res) => {
  const { name, description, price, stock, category, regions } = req.body;

  if (!Array.isArray(regions) || regions.length === 0) {
    return res.status(400).json({ error: 'regions array is required and must have at least one value' });
  }

  try {
    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      regions
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Validation error: ' + err.message });
  }
});

module.exports = router;
