'use strict';

// Articles controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope','$stateParams', '$state', 'Authentication', 'Products', '$cookieStore',
  function ($scope, $rootScope, $stateParams, $state, Authentication, Products, $cookieStore) {
    $scope.authentication = Authentication;
    $scope.success_add = false;

    $scope.init_product = function(){
      //$scope.create();
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
        name: 'juhis scarf',
        code: 'LBJ788',
        rating: '5',
        price: '$15.00',
        description: 'probably creepy',
        availability: 'in stock',
        sizes: ['s','m']
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
