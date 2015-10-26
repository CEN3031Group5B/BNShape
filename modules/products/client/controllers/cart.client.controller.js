'use strict';

// Articles controller
angular.module('products').controller('CartController', ['$scope', '$rootScope','$stateParams', '$location', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope,$stateParams, $location, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.cart_items = []; //all the ids of the products in cart
    $scope.cart_total = 0.00;
    $scope.display_items = []; //the actual products with attributes
    $scope.cart_products = [];
    $scope.quantity_dict = {};

    $scope.getItems = function () {
      var current_items = String($cookieStore.get('cart'));
      if(current_items !== "undefined"){
        $scope.cart_items = current_items.split('&');
        $scope.filter();
      } 
    };

    $scope.filter = function() {
        //"562bc2f8b82bbbf8f91f72ba"
        var i = 0;
        for(i = 0; i < $scope.cart_items.length; i++){
            var product = $scope.findOne($scope.cart_items[i],$scope.found_one_cb);
        }
    };
    $scope.found_one_cb = function(data){
        var priceString = data.price;
        var price = parseFloat(priceString.split('$')[1]);
        $scope.cart_total += price;

        if($scope.quantity_dict[data._id] !== undefined){
            var current_quantity = $scope.quantity_dict[data._id];
            $scope.quantity_dict[data._id] = current_quantity + 1;
        } else {
            $scope.quantity_dict[data._id] = 1;
            $scope.display_items.push(data);
        }
    };

    $scope.parse_price = function(priceString) {
        return parseFloat(priceString.split('$')[1]);
    };
        // Find a list of Articles
    $scope.find = function () {
      $scope.cart_products = Products.query();
    };

    // Find existing Article
    $scope.findOne = function (_product_id,cb) {
      return Products.get({productId: _product_id},cb);
    };

    $scope.quick_delete_cart = function(productId, quantity, index_to_delete){
        var num_to_delete = quantity;
        $scope.cart_items.sort(); //organize so we can easily splice
        for(var index = 0; index < $scope.cart_items.length; index++){
              if($scope.cart_items[index] === productId){
                    $scope.cart_items.splice(index, quantity); //delete all with this id
                    break; //no need to run 
              }
        }
        /**update total**/
        var deleted_product = $scope.display_items[index_to_delete];
        var deleted_price = quantity * parseFloat(deleted_product.price.split('$')[1]);
        $scope.cart_total -= deleted_price;

        /***update cart**/
        $scope.display_items.splice(index_to_delete,1); //don't display it anymore
        $cookieStore.remove('cart');
        if($scope.display_items.length!==0){
          $cookieStore.put('cart', $scope.cart_items.join("&"));
          $rootScope.$broadcast('cart_update', { newCookie: $scope.cart_items.join("&")});
        } else {
          $rootScope.$broadcast('cart_update', { newCookie: ''});
        }

    };
  }
]);