'use strict';

// Articles controller
angular.module('articles').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', '$cookieStore',
  function ($scope, $stateParams, $location, Authentication, Articles, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.cart_items = [];
    $scope.success_add = false;
    $scope.cart_popup = "cart_popup.html";

    $scope.add_cart = function(_id){
        var prevCookie = $cookieStore.get('cart');
        var updatedCookie = _id;
        console.log($scope.cart_items.length);
        if($scope.cart_items.length !== 0){
          $cookieStore.remove('cart');
          updatedCookie = prevCookie + "&" + _id;
        }
        $cookieStore.put('cart',updatedCookie);
        $scope.cart_items.push(_id);
        $scope.success_add = true;
        setTimeout(function(){
          $scope.success_add = false;
          $scope.$apply();
        },3000);
        // //ToDo: success message
    };

    $scope.quick_delete_cart = function(index_to_delete){
        $scope.cart_items.splice(index_to_delete,1);
        $cookieStore.remove('cart');
        if($scope.cart_items.length!==0){
          $cookieStore.put('cart', $scope.cart_items.join("&"));
        }
    };

    $scope.init_product = function(){
      var current_items = $cookieStore.get('cart');
      if(current_items !== undefined){
        $scope.cart_items = current_items.split('&');
      }
    };

  }
]);
