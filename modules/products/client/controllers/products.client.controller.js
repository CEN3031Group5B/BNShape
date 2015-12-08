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
      console.log(category, subcategory);
      console.log($scope.products);
      for (var i = $scope.products.length-1; i >= 0; i--) {
        if (((category !== $scope.products[i].category[0]) && (category !== $scope.products[i].category[1])) || (subcategory !== $scope.products[i].subcategory)) {
          console.log($scope.products[i].category[0], $scope.products[i].category[1], $scope.products[i].subcategory);
          $scope.products.splice(i, 1);
        }
      }
      console.log($scope.products);
    };
  }
]);
