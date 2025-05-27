const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
	userId: { 
    	type: mongoose.Schema.Types.ObjectId,
     	ref: 'User'
 	},
  	rating: { 
    	type: Number,
     	min: 1,
     	max: 5
 	},
  	comment: {
    	type: String,
    	required: true
  	},
	createdAt: { 
		type: Date,
		default: Date.now
	}
});

const ProductSchema = new mongoose.Schema({
	name: { 
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
		},
	stock: { 
		type: Number,
		default: 0 
	},
	category: {
		type: String,
		required: true
	},
	reviews: [ReviewSchema], // Embedded ReviewSchema in ProductSchema
	createdAt: { 
		type: Date,
		default: Date.now
	},
	regions: {
		type: [{
			type: String,
			enum: ['Europe', 'Asia', 'US']
		}],
		required: true
	}
});
const Product = mongoose.model('Product', ProductSchema);
module.exports = {Product};
