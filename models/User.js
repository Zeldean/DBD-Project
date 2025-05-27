const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
    },
  email: { 
    type: String, unique: true, 
    required: true 
    },
  password: { 
    type: String, 
    required: true
 },
  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  },
  region: {
  type: String,
  required: true,
  enum: ['Europe', 'Asia', 'US']
  }  
});
const User = mongoose.model('User', UserSchema);
module.exports = {User};