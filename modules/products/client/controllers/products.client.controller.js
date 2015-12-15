'use strict';

// Articles controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope','$stateParams', '$state', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope, $stateParams, $state, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.success_add = false;
    $scope.products = [];
    $scope.display_products = [];

    $scope.init_product = function(){
      console.log("hi");
      $scope.products = Products.query();
      $scope.display_products = $scope.products;
      //console.log($scope.products);
    };

    $scope.add_cart = function(_id, price){
        var prevCookie = "";
        prevCookie = $cookieStore.get('cart');
        var updatedCookie = _id;
        if(prevCookie !== undefined){
          $cookieStore.remove('cart');
          updatedCookie = prevCookie + "&" + _id;
        }
        $cookieStore.put('cart',updatedCookie);
        $rootScope.$broadcast('cart_update', { newCookie: updatedCookie, price: parseFloat(price.split('$')[1])});
        $state.go('cart');
    };

    $scope.create = function () {
      //fill with actual data
      var product = new Products({
        name: 'New Product',
        code: 'NOCODE',
        reviews: [],
        price: '$20.00',
        reward_price: '0',
        reward_points: '0',
        description: 'No description.',
        availability: 'Out of stock',
        sizes: ['S', 'M', 'L'],
        category: ['Men'],
        subcategory: 'Shirts',
        discount: 0
      });

      // Redirect after save
      product.$save(function (response) {
        console.log("saved");

      }, function (errorResponse) {
        console.log("errored");
      });
    };

    $scope.filter_category = function (category, subcategory) {
      // initialize to original array containing all products
      $scope.display_products = $scope.products.slice(0);
      for (var i = $scope.display_products.length-1; i >= 0; i--) {
        if (subcategory !== '') {
          if (((category !== $scope.display_products[i].category[0]) && (category !== $scope.display_products[i].category[1])) || (subcategory !== $scope.display_products[i].subcategory)) {
            // if there isn't a subcategory, filter only by category
            $scope.display_products.splice(i, 1);
          }
        }
        else {
          if (((category !== $scope.display_products[i].category[0]) && (category !== $scope.display_products[i].category[1]))) {
            // filter by category and subcategory
            $scope.display_products.splice(i, 1);
          }  
        }
      }
    };

    $scope.filter_new_arrivals = function () {
      // initialize to original array containing all products
      $scope.display_products = $scope.products.slice(0);
      for (var i = $scope.display_products.length-1; i >= 0; i--) {
        if ($scope.display_products[i].new_arrival === false) {
          // remove products that aren't new arrivals
          $scope.display_products.splice(i, 1);
        }
      }
    };

    $scope.filter_best_sellers = function () {
      // initialize to original array containing all products
      $scope.display_products = $scope.products.slice(0);
      for (var i = $scope.display_products.length-1; i >= 0; i--) {
        if ($scope.display_products[i].best_seller === false) {
          // remove products that aren't best sellers
          $scope.display_products.splice(i, 1);
        }
      }
    };

    $scope.filter_reviews = function (rating) {
      // initialize to original array containing all products
      $scope.display_products = $scope.products.slice(0);
      for (var i = $scope.display_products.length-1; i >= 0; i--) {
        if ($scope.display_products[i].rating < rating) {
          // remove products that less than the desired rating
          $scope.display_products.splice(i, 1);
        }
      }
    };  

    $scope.filter_price = function (str) {
      // initialize to original array containing all products
      $scope.display_products = $scope.products.slice(0);
      console.log($scope.display_products);
      // user wants to see products sorted high to low
      if (str === "high") {
        // define function to sort price field of product Objects in array accordingly
        $scope.display_products.sort(function(a, b) {
          return b.price-a.price;
        });
      }
      // user wants to see products sorted low to high
      else if (str === "low") {
        $scope.display_products.sort(function(a, b) {
          // define function to sort price field of product Objects in array accordingly
          return a.price-b.price;
        });
      }
    };

    $scope.filter_discounts = function () {
      // initialize to original array containing all products
      $scope.display_products = $scope.products.slice(0);
      for (var i = $scope.display_products.length-1; i >= 0; i--) {
        if ($scope.display_products[i].discount === '') {
          // remove products that don't have a discount
          $scope.display_products.splice(i, 1);
        }
      }  
      // define function to sort dicount field of product Objects array from biggest to smallest
      $scope.display_products.sort(function(a, b) {
        return parseFloat(a.discount) - parseFloat(b.discount);
      }); 
    };

    $scope.display_all = function () {
      // reset to original array containing all products
      $scope.display_products = $scope.products;
    };
  }
]);
