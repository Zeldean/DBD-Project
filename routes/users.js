const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

// GET all users in the request region
router.get('/', async (req, res) => {
  const region = req.region;

  if (!region) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }

  try {
    const users = await User.find({ region });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// POST create new user in request region
router.post('/', async (req, res) => {
  const region = req.region;

  if (!region) {
    return res.status(400).json({ error: 'Missing or invalid x-region header' });
  }

  const { name, email, password, address } = req.body;

  try {
    const user = new User({
      name,
      email,
      password,
      address,
      region
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Validation error: ' + err.message });
  }
});

module.exports = router;
