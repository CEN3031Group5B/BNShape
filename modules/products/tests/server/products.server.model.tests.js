'use strict';

/**
 * Module dependencies.
 */
  var User = require('C:/Users/Juhi/Documents/GitHub/School/BNShape/modules/users/server/models/user.server.model.js');
  var Product = require('C:/Users/Juhi/Documents/GitHub/School/BNShape/modules/products/server/models/products.server.model.js');
  var should = require('should');
  var mongoose = require('mongoose');
  User = mongoose.model('User');
  Product = mongoose.model('Product');
  
/**
 * Globals
 */
var user, product, article;
/**
 * Unit tests
 */
 
describe('Product Model Unit Tests:', function () {
	var originalTimeout;
  beforeEach(function (done) {
	  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
	  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	  
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3',
	  telephone: '5618591256',
	  address1: '123 Newberry Lane',
	  country: 'United States',
	  region: 'Arizona',
	  provider: 'Test',
	  roles:'admin'
    });

    user.save(function () {
      product = new Product({
        name: 'Test Scarf',
        code: 'TESTCODE',
        reviews: [],
        price: '$20.00',
        reward_price: '0',
        reward_points: '0',
        description: 'This is a test product.',
        availability: 'Out of stock',
        sizes: ['S', 'M', 'L'],
        category: ['Men'],
        subcategory: 'Shirts',
        discount: 0,
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return product.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      product.name = '';

      return product.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Product.remove().exec(function () {
     User.remove().exec(done);
    });
  });
  
});



/*
describe('Article Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      article = new Article({
        title: 'Article Title',
        content: 'Article Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      return article.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      article.title = '';

      return article.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Article.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});*/

