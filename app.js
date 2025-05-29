const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const publicRoute = require('./routes/public')
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:30000/ecommerce';

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Optional: Middleware to auto-attach region from headers
app.use((req, res, next) => {
  const region = req.headers['x-region'];
  if (region && ['Europe', 'Asia', 'US'].includes(region)) {
    req.region = region;
  }
  next();
});

// MongoDB connection via mongos router
mongoose.connect(MONGO_URI)
.then(() => {
  console.log('Connected to sharded MongoDB cluster');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

// Routes
app.get('/', (req, res) => {
  res.send('MongoDB Sharded API Running');
});

app.use('/api/public', publicRoute);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
// app.use('/users', userRoutes);
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
