'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProductSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  }, user: {
     type: Schema.ObjectId,
     ref: 'User'
  }
});

mongoose.model('Order', ProductSchema);
