'use strict';

// Articles controller
angular.module('articles').controller('CartController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.cart_items = [];

    $scope.getItems = function () {
      // var current_items = $cookieStore.get('cart');
      // if(current_items !== undefined){
      //   $scope.cart_items = current_items.split('&');
      // }
    };
  }
]);