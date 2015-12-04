'use strict';

// Articles controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope','$stateParams', '$state', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope, $stateParams, $state, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.success_add = false;
    $scope.products = [];

    $scope.init_product = function(){
      console.log("hi");
      $scope.products = Products.query();
      console.log($scope.products);
    };

    $scope.add_cart = function(_id){
        var prevCookie = "";
        prevCookie = $cookieStore.get('cart');
        var updatedCookie = _id;
        if(prevCookie !== undefined){
          $cookieStore.remove('cart');
          updatedCookie = prevCookie + "&" + _id;
        }
        $cookieStore.put('cart',updatedCookie);
        $rootScope.$broadcast('cart_update', { newCookie: updatedCookie});
        $state.go('cart');
    };

    $scope.create = function () {
      //fill with actual data
      var product = new Products({
        name: 'New Product',
        code: 'NOCODE',
        reviews: [],
        price: '$0.00',
        reward_price: '0',
        reward_points: '0',
        description: 'No description.',
        availability: 'Out of stock',
        sizes: ['S', 'M', 'L']
      });

      // Redirect after save
      product.$save(function (response) {
        console.log("saved");

      }, function (errorResponse) {
        console.log("errored");
      });
    };
  }
]);
