'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  code: {
    type: String,
    default: '',
    required: 'Code cannot be blank'
  },
  price: {
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
  description: {
    type: String,
    default: '',
  }, availability: {
    type: String,
    default: '',
    required: 'Availability can not be blank'
  }, sizes: {
    type: Array,
    default: [],
    required: 'Must have at least one size'
  }, category: {
    type: Array,
    default: [],
  }, subcategory: {
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
