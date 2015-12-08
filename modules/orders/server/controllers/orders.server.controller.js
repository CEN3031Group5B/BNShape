'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create 
 */
exports.create = function (req, res) {

};

exports.list = function(req,res){

};
/**
 * Show the current 
 */
exports.read = function (req, res) {
  res.json(req.order);
};

exports.update = function (req, res) {

};

/**
 * Delete 
 */
exports.delete = function (req, res) {

};

exports.orderByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Order.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};
