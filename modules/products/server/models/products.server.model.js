'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
 * Product Schema
 */
var ProductSchema = new Schema({
  created: { // date created
    type: Date,
    default: Date.now
  },
  name: { // product name
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  code: { // product code
    type: String,
    default: '',
    required: 'Code cannot be blank'
  },
  price: { // product price
    type: String,
    default: '',
    required: 'Price cannot be blank'
  },
  reward_price: { 
    type: Number,
    default: 10.00,
  },
  reward_points: {
    type: String,
    default: '',
  },
  reviews: {
    type: Array,
    default: [],
  },
  description: { // product description
    type: String,
    default: '',
  }, availability: { // in stock?
    type: String,
    default: '',
    required: 'Availability can not be blank'
  }, sizes: { // product sizes
    type: Array,
    default: [],
    required: 'Must have at least one size'
  }, category: { // Men, Women, Kids, Accessories
    type: Array,
    default: [],
  }, subcategory: { // Shirts, Hoodies, Pants, etc.
    type: String,
    default: ''
  }, discount: { 
    type: String,
    default: ''
  },
    new_arrival: {
    type: Boolean,
    default: false
  },
    best_seller: {
    type: Boolean,
    default: false
  },
    rating: {
    type: Number,
    default: 5
  }
  //,
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User'
  // }
});

mongoose.model('Product', ProductSchema);
