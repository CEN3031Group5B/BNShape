'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs');


/**
 * Create 
 */
exports.create = function (req, res) {
  var product = new Product(req.body);
  product.user = req.user;

  product.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Show the current 
 */
exports.read = function (req, res) {
  res.json(req.product);
};

exports.update = function (req, res) {
  var product = req.product;

  product.name = req.body.name;
  product.code = req.body.code;
  product.reviews = req.body.reviews;
  product.price = req.body.price;
  product.reward_price = req.body.reward_price;
  product.reward_points = req.body.reward_points;
  product.description = req.body.description;
  product.availability = req.body.availability;
  product.sizes = req.body.sizes;

  product.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete 
 */
exports.delete = function (req, res) {
  console.log("delete");
  var product = req.product;

  product.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * List 
 */
exports.list = function (req, res) {
  Product.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

exports.uploadPhoto = function(req, res){
  console.log(req.product);
  var filePath = './modules/products/client/img/products/' + req.product.name + ".jpg";
  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath);
  }
  fs.writeFile(filePath, req.files.file.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while picture'
        });
      }  else {
          return res.status(200).send();
      }
    });
};

/**
 * Article middleware
 */
exports.productByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
