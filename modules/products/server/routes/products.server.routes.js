'use strict';

/**
 * Module dependencies.
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/products').all(productsPolicy.isAllowed)
    .get(products.list)
    .post(products.create);

  //upload new product picture
  app.route('/api/products/picture/:productId').post(products.uploadPhoto);

  // // Single article routes
   app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  // Finish by binding the  middleware
  app.param('productId', products.productByID);
};
