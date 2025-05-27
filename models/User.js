const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: props => `${props.value} is not a valid email address`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      validate: {
        validator: function (value) {
          return /^[A-Z0-9\- ]{3,10}$/i.test(value);
        },
        message: props => `${props.value} is not a valid postal code`
      }
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  region: {
    type: String,
    required: true,
    enum: {
      values: ['Europe', 'Asia', 'US'],
      message: 'Region must be either Europe, Asia, or US'
    }
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };
