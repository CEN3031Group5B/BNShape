'use strict';

// Articles controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope','$stateParams', '$state', 'Authentication', 'Products', '$cookieStore', '$window',
  function ($scope, $rootScope, $stateParams, $state, Authentication, Products, $cookieStore, $window) {
    $scope.authentication = Authentication;
    $scope.success_add = false;
    $scope.products = [];
    $scope.display_products = [];
    $scope.adding = false;
    $scope.adding_id = "";

    $scope.user = $scope.authentication.user;
    if ($scope.user.roles !== undefined) {
      $scope.admin = ($scope.user.roles.indexOf("admin") > -1);
    } else {
      $scope.admin = false;
    }

    $scope.init_product = function(){
      $scope.products = Products.query();
      $scope.display_products = $scope.products;
      //console.log($scope.products);
    };

    $scope.add_cart = function(_id, price, sizes, discount){
      //cookie in format: _id-size&_id-size&etc....
        if(sizes.length === 0){
          $scope.adding = true;
          $scope.selected_size = "N/A";
        }
        if($scope.adding === true){
            if($scope.selected_size !== undefined) {
            var prevCookie = "";
            prevCookie = $cookieStore.get('cart');
            var updatedCookie = _id + "-" + $scope.selected_size;
            if(prevCookie !== undefined){
              $cookieStore.remove('cart');
              updatedCookie = prevCookie + "&" + _id + "-" + $scope.selected_size;
            }
            var updatePrice = parseFloat(price.split('$')[1]);
            if(discount !== ""){
              updatePrice = updatePrice * (1+$scope.parse_discount(discount));
            }
            $cookieStore.put('cart',updatedCookie);
            $rootScope.$broadcast('cart_update', { newCookie: updatedCookie, price: updatePrice});
            $state.go('cart');
          } else {
            alert("select size please");
          }
        } else {
          $scope.adding = true;
          $scope.adding_id = _id;
        }


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

    $scope.parse_price = function(priceString) {
        return parseFloat(priceString.split('$')[1]);
    };

    $scope.parse_discount = function(discountString) {
        var discNum =  discountString.split("%")[0];
        var discFloat = parseFloat(discNum);
        var lessThanOne = discFloat / 100;
        return lessThanOne;
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
          return $scope.parse_price(b.price)-$scope.parse_price(a.price);
        });
      }
      // user wants to see products sorted low to high
      else if (str === "low") {
        $scope.display_products.sort(function(a, b) {
          // define function to sort price field of product Objects in array accordingly
          return $scope.parse_price(a.price)-$scope.parse_price(b.price);
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

    $scope.un_add = function () {
      $scope.adding = false;
      $scope.adding_id = "";
      $scope.selected_size = undefined;
    };

    $scope.delete_product = function(product) {
      var a = confirm("Are you sure you want to delete?");
      if(a){
        product.$remove(function () {
          $window.location.reload();
        });
      }
    };
  }
]);
